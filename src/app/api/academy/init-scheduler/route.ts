import { NextResponse } from "next/server";
import { AcademyJobScheduler } from "@/lib/academy/academy-job-scheduler.service";

export async function POST() {
  const scheduler = AcademyJobScheduler.getInstance();
  scheduler.start();
  return NextResponse.json({ status: "success", message: "Academy Background Scheduler Initialized." });
}