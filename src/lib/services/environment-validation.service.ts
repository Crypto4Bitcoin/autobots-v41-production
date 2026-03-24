export class EnvironmentValidationService {
  private static requiredKeys = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'OPENAI_API_KEY',
    'ENCRYPTION_KEY',
    'NEXTAUTH_SECRET'
  ];

  static validate(): { ok: boolean; errors: string[] } {
    const errors: string[] = [];

    this.requiredKeys.forEach(key => {
      if (!process.env[key]) {
        errors.push(`Missing sensitive environment variable: ${key}`);
      }
    });

    // Check for development vs production callback logic
    if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_APP_URL?.startsWith('https')) {
      errors.push("Production environment requires HTTPS callback URLs.");
    }

    if (errors.length > 0) {
      console.error("[EnvValidation] FATAL CONFIG ERRORS:", errors);
    } else {
      console.log("[EnvValidation] Configuration validated successfully.");
    }

    return { ok: errors.length === 0, errors };
  }
}
