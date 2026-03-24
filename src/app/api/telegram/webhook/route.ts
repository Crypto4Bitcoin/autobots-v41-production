import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/services/supabase-service";
import { sendMessage } from "@/lib/telegram";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-telegram-bot-api-secret-token");
  if (secret !== process.env.TELEGRAM_WEBHOOK_SECRET) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const payload = await req.json();

  if (payload.message) {
    const chatId = payload.message.chat.id;
    const text = payload.message.text;
    const from = payload.message.from;

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

    if (userError) console.error("User Sync Error:", userError);

    // 2. Sync Session
    const { data: session } = await supabase
      .from("telegram_sessions")
      .upsert({
        user_id: user?.id,
        current_state: "active",
        updated_at: new Date().toISOString()
      }, { onConflict: "user_id" })
      .select()
      .single();

    // 3. Log Event
    await supabase.from("telegram_events").insert({
      user_id: user?.id,
      session_id: session?.id,
      event_type: "message",
      raw_payload: payload
    });

    // 4. Handle Commands
    if (text === "/start" || text === "/menu") {
      await sendMessage(chatId, "<b>AutoBots v41.0 Production Menu</b>\n\nSystem: LEVEL 5.5 LIVE\nStatus: Heartbeat Active", {
        inline_keyboard: [[{ text: "🚀 Start Automation", callback_data: "start_job" }]]
      });
    }
  }

  if (payload.callback_query) {
    const callbackData = payload.callback_query.data;
    const chatId = payload.callback_query.message.chat.id;

    if (callbackData === "start_job") {
      await supabase.from("job_runs").insert({
        job_type: "reality_pulse",
        status: "queued",
        metadata: { source: "telegram_remote" }
      });
      
      await sendMessage(chatId, "✅ <b>Job Queued.</b> Reality Pulse initialized in production.");
    }
  }

  return NextResponse.json({ ok: true });
}
