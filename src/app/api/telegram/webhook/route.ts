import { NextRequest, NextResponse } from "next/server";
import { adminSupabase as supabase } from "@/lib/services/supabase-service";
import { sendMessage } from "@/lib/telegram";

const LOG = (tag: string, data: unknown) =>
  console.log(`[TG_WEBHOOK][${tag}]`, JSON.stringify(data, null, 2));

export async function POST(req: NextRequest) {
  LOG("RECEIVED", { headers: Object.fromEntries(req.headers.entries()) });

  const secret = req.headers.get("x-telegram-bot-api-secret-token");
  if (secret !== process.env.TELEGRAM_WEBHOOK_SECRET) {
    LOG("AUTH_FAILED", { provided: secret });
    return new NextResponse("Unauthorized", { status: 403 });
  }

  let payload: any;
  try {
    payload = await req.json();
    LOG("PAYLOAD", payload);
  } catch (e) {
    LOG("PARSE_ERROR", { error: String(e) });
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
  }

  if (payload.message) {
    const chatId = payload.message.chat.id;
    const text = payload.message.text;
    const from = payload.message.from;

    LOG("MESSAGE", { chatId, text, from });

    // 1. Sync User
    const { data: user, error: userError } = await supabase
      .from("telegram_users")
      .upsert({
        telegram_id: from.id,
        username: from.username,
        first_name: from.first_name,
        last_active: new Date().toISOString()
      }, { onConflict: "telegram_id" })
      .select()
      .single();

    if (userError) {
      LOG("USER_SYNC_ERROR", userError);
    } else {
      LOG("USER_SYNCED", { userId: user?.id });
    }

    // 2. Sync Session
    const { data: session, error: sessionError } = await supabase
      .from("telegram_sessions")
      .upsert({
        user_id: user?.id,
        current_state: "active",
        updated_at: new Date().toISOString()
      }, { onConflict: "user_id" })
      .select()
      .single();

    if (sessionError) {
      LOG("SESSION_SYNC_ERROR", sessionError);
    } else {
      LOG("SESSION_SYNCED", { sessionId: session?.id });
    }

    // 3. Log Event
    const { error: eventError } = await supabase.from("telegram_events").insert({
      user_id: user?.id,
      session_id: session?.id,
      event_type: "message",
      raw_payload: payload
    });

    if (eventError) {
      LOG("EVENT_INSERT_ERROR", eventError);
    } else {
      LOG("EVENT_INSERTED", { chatId, text });
    }

    // 4. Handle Commands
    if (text === "/start" || text === "/menu") {
      try {
        await sendMessage(chatId, "<b>AutoBots v41.0 Production Menu</b>\n\nSystem: LEVEL 5.5 LIVE\nStatus: Heartbeat Active", {
          inline_keyboard: [[{ text: "ðŸš€ Start Automation", callback_data: "start_job" }]]
        });
        LOG("MENU_SENT", { chatId });
      } catch (e) {
        LOG("MENU_SEND_ERROR", { error: String(e) });
      }
    }
  }

  if (payload.callback_query) {
    const callbackData = payload.callback_query.data;
    const chatId = payload.callback_query.message.chat.id;
    LOG("CALLBACK", { callbackData, chatId });

    if (callbackData === "start_job") {
      const { error: jobError } = await supabase.from("job_runs").insert({
        job_type: "reality_pulse",
        status: "queued",
        metadata: { source: "telegram_remote" }
      });

      if (jobError) {
        LOG("JOB_INSERT_ERROR", jobError);
      } else {
        LOG("JOB_QUEUED", { chatId });
      }

      try {
        await sendMessage(chatId, "âœ… <b>Job Queued.</b> Reality Pulse initialized in production.");
      } catch (e) {
        LOG("JOB_REPLY_ERROR", { error: String(e) });
      }
    }
  }

  LOG("DONE", { ok: true });
  return NextResponse.json({ ok: true });
}