import { NextResponse } from "next/server";

export async function GET() {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_BASE_URL!;
  const SECRET = process.env.TELEGRAM_WEBHOOK_SECRET!;

  const webhookUrl = `${APP_URL}/api/telegram/webhook`;

  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: webhookUrl,
      secret_token: SECRET,
      allowed_updates: ["message", "callback_query"]
    })
  });

  const data = await res.json();
  return NextResponse.json(data);
}
