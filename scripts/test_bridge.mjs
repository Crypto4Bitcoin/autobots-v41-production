#!/usr/bin/env node
// Local bridge simulator - tests the webhook handler without Telegram
// Run: node test_bridge.mjs

const WEBHOOK_URL = process.env.WEBHOOK_URL || "http://localhost:3000/api/telegram/webhook";
const SECRET = process.env.TELEGRAM_WEBHOOK_SECRET || "test-secret";

const mockMessage = {
  update_id: 100000001,
  message: {
    message_id: 1,
    from: {
      id: 123456789,
      is_bot: false,
      first_name: "Test",
      username: "testuser"
    },
    chat: { id: 123456789, type: "private", first_name: "Test" },
    date: Math.floor(Date.now() / 1000),
    text: "/menu"
  }
};

async function runTest() {
  console.log("=== AutoBots Bridge Simulator ===");
  console.log("Target:", WEBHOOK_URL);
  console.log("Payload:", JSON.stringify(mockMessage, null, 2));
  console.log("\nSending mock /menu message...");

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-telegram-bot-api-secret-token": SECRET
      },
      body: JSON.stringify(mockMessage)
    });

    const data = await res.json();
    console.log("\nResponse status:", res.status);
    console.log("Response body:", JSON.stringify(data, null, 2));

    if (res.status === 200 && data.ok) {
      console.log("\n✅ Handler responded OK. Check telegram_events in Supabase.");
      console.log("SQL: SELECT * FROM telegram_events WHERE created_at > NOW() - INTERVAL '10 seconds' ORDER BY created_at DESC;");
    } else {
      console.log("\n❌ Handler did not return ok:true. Check Vercel logs.");
    }
  } catch (e) {
    console.error("\n❌ Request failed:", e.message);
    console.log("Is the dev server running? npm run dev");
  }
}

runTest();