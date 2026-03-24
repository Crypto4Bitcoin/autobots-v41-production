export type ProviderId = 'x' | 'linkedin' | 'youtube' | 'slack' | 'telegram';

export interface OAuthState {
  provider: ProviderId;
  workspaceId: string;
  userId: string;
}

export class ConnectedAccountOAuthService {
  /**
   * Generates a provider-specific authorization URL.
   */
  static async getAuthorizationUrl(provider: ProviderId, workspaceId: string): Promise<string> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
    const clientId = process.env[`${provider.toUpperCase()}_CLIENT_ID`];
    
    // Simple state encoding
    const state = btoa(JSON.stringify({ provider, workspaceId }));
    
    switch (provider) {
      case 'x':
        return `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${baseUrl}/api/auth/callback/x&scope=tweet.read%20tweet.write%20users.read&state=${state}&code_challenge=challenge&code_challenge_method=plain`;
      case 'slack':
        return `https://slack.com/oauth/v2/authorize?client_id=${clientId}&scope=chat:write,commands&redirect_uri=${baseUrl}/api/auth/callback/slack&state=${state}`;
      default:
        throw new Error(`Auth flow for ${provider} not yet implemented.`);
    }
  }

  /**
   * Handles the OAuth callback and exchanges the code for tokens.
   */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  static async handleCallback(provider: ProviderId, code: string, state: string) {
    console.log(`[OAuth] Handling ${provider} callback with code: ${code}`);
    // Mocking token exchange
    return {
      accessToken: 'at_mock_123',
      refreshToken: 'rt_mock_123',
      expiresIn: 3600,
      scope: 'all'
    };
  }
}

export const ProviderId = {} as any;
