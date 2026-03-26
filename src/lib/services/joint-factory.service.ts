import { adminSupabase as supabase } from "./supabase-service";

/**
 * ??? JOINT FACTORY (THE GRIPPER / HAND)
 * 
 * This service is the final execution point for the body.
 * No bot can act "quietly"—all world effects require a proof link
 * and an authority token issued by the spine.
 */
export class JointFactoryService {
  /**
   * Performs an approved DB write.
   * Locked inside an Infinity Ball: No action without Authority Token.
   */
  static async safeWrite(token: string, table: string, data: any) {
    // 1. Validate Authority Token (The Spine Pulse)
    const { data: auth, error: authError } = await supabase
      .from("authority_tokens")
      .select("*")
      .eq("id", token)
      .eq("status", "active")
      .single();

    if (authError || !auth) {
       console.error(`[JointFactory] DENIED: Invalid or missing token. Action: ${table}.write`);
       throw new Error("Sovereign joint error: No authority to act.");
    }

    // 2. Perform Execution (The Hand Acts)
    console.log(`[JointFactory] EXECUTE: ${table} write under token ${token}`);
    const { data: record, error } = await supabase.from(table).insert([data]).select().single();
    
    if (error) throw error;

    // 3. Mark Token Used (The Net Completes)
    await supabase.from("authority_tokens").update({ status: "consumed" }).eq("id", token);

    return record;
  }
}
