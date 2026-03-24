export class FeatureFlagService {
  private static flags: Record<string, boolean> = {
    'enable_production_auth': true,
    'enable_connected_accounts': true,
    'enable_real_publish': false, // Safety first
    'enable_voice_external_actions': false,
    'enable_draft_first': true
  };

  static isEnabled(flag: string): boolean {
    return this.flags[flag] ?? false;
  }

  static setFlag(flag: string, value: boolean): void {
    this.flags[flag] = value;
    console.log(`[FeatureFlag] ${flag} set to ${value}`);
  }
}
