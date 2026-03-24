import { supabase } from "./supabase-service";

export interface Skill {
  name: string;
  enabled: boolean;
  autoRun: boolean;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: Record<string, any>;
}

export class SkillsService {
  /**
   * Checks if a skill (agent/feature) is enabled and allowed to run automatically.
   */
  static async canAutoRun(skillName: string): Promise<boolean> {
    const { data, error } = await supabase
      .from("skill_toggles")
      .select("*")
      .eq("name", skillName)
      .single();

    if (error || !data) {
      // DEFAULT: If not found, assume enabled but no auto-run for safety
      return false;
    }

    return data.enabled && (data.config?.auto_run === true);
  }

  static async isSkillEnabled(skillName: string): Promise<boolean> {
    const { data, error } = await supabase
      .from("skill_toggles")
      .select("*")
      .eq("name", skillName)
      .single();

    if (error || !data) return true; // Default to enabled
    return data.enabled;
  }

  static async updateSkill(name: string, enabled: boolean, config: unknown = {}) {
    const { error } = await supabase
      .from("skill_toggles")
      .upsert({ name, enabled, config, updated_at: new Date().toISOString() });
    
    if (error) throw error;
  }
}
