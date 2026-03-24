import { NextResponse } from "next/server"
import { BotFactoryStoreService } from "@/lib/academy-v8/bot-factory-store.service"

export async function GET() {
  try {
    const products = BotFactoryStoreService.list()
    return NextResponse.json({
      status: "success",
      result: {
        generatedAt: new Date().toISOString(),
        count: products.length,
        live: products.filter((x) => x.supportState === "live").length,
        ready: products.filter((x) => x.supportState === "ready").length,
        rows: products,
      },
    })
  } catch (error) {
    return NextResponse.json({ status: "error", message: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
