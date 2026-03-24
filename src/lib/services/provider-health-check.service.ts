import { ProviderId } from './connected-account-oauth.service';
import { ConnectedAccountTokenService } from './connected-account-token.service';

export class ProviderHealthCheckService {
  /**
   * Performs a pre-flight health check on a connected provider.
   */
  static async validateConnection(workspaceId: string, provider: ProviderId): Promise<{ ok: boolean; error?: string }> {
    const tokens = await ConnectedAccountTokenService.getTokens(workspaceId, provider);
    
    if (!tokens) return { ok: false, error: 'Account not connected' };
    
    if (tokens.expiresAt < Date.now()) {
      return { ok: false, error: 'Token expired' };
    }

    // Optional: Call provider 'me' endpoint to verify scopes
    console.log(`[HealthCheck] ${provider} connection is healthy.`);
    return { ok: true };
  }
}
