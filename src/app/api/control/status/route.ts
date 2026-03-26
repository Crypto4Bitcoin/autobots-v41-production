import { NextResponse } from "next/server";
import { adminSupabase as supabase } from "@/lib/services/supabase-service";

export async function GET() {
  try {
    const { count: divCount } = await supabase.from('divisions').select('*', { count: 'exact', head: true });
    const { data: events } = await supabase.from('telegram_events').select('*').order('created_at', { ascending: false }).limit(1);
    const { data: jobs } = await supabase.from('job_runs').select('*').order('created_at', { ascending: false }).limit(1);

    return NextResponse.json({
      divCount: divCount || 0,
      latestEvent: events && events.length > 0 ? events[0] : null,
      latestJob: jobs && jobs.length > 0 ? jobs[0] : null
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
