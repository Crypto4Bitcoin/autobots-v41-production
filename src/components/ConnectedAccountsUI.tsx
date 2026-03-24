"use client";
import React, { useState, useEffect } from 'react';
import { ProviderId, ConnectedAccountOAuthService } from '@/lib/services/connected-account-oauth.service';
import { ProviderHealthCheckService } from '@/lib/services/provider-health-check.service';

export default function ConnectedAccountsUI() {
  const [accounts, setAccounts] = useState<unknown[]>([]);
  const [isConnecting, setIsConnecting] = useState<ProviderId | null>(null);

  const providers: { id: ProviderId, name: string, icon: string }[] = [
    { id: 'x', name: 'X / Twitter', icon: '✦' },
    { id: 'linkedin', name: 'LinkedIn', icon: 'in' },
    { id: 'youtube', name: 'YouTube', icon: '?' },
    { id: 'slack', name: 'Slack', icon: '#' },
    { id: 'telegram', name: 'Telegram', icon: '?' }
  ];

  // Mocked state for the demo
  useEffect(() => {
    setAccounts([
      { provider: 'slack', status: 'healthy', scopes: ['chat:write'] }
    ]);
  }, []);

  const handleConnect = async (provider: ProviderId) => {
    setIsConnecting(provider);
    try {
      const url = await ConnectedAccountOAuthService.getAuthorizationUrl(provider, 'ws_auto_001');
      window.open(url, '_blank');
    } catch (e) {
      alert(`Error connecting ${provider}: ${e}`);
    } finally {
      setIsConnecting(null);
    }
  };

  const handleTest = async (provider: ProviderId) => {
    const result = await ProviderHealthCheckService.validateConnection('ws_auto_001', provider);
    alert(result.ok ? `${provider} connection is healthy!` : `Health check failed: ${result.error}`);
  };

  const handleDisconnect = (provider: ProviderId) => {
    setAccounts(accounts.filter(a => a.provider !== provider));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {providers.map((p) => {
          const connected = accounts.find(a => a.provider === p.id);
          return (
            <div key={p.id} className="bg-gray-950 border border-gray-800 rounded-xl p-5 flex items-center justify-between hover:border-gray-700 transition">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center font-bold text-lg border border-gray-800">
                  {p.icon}
                </div>
                <div>
                  <h4 className="text-white font-medium">{p.name}</h4>
                  <p className="text-xs text-gray-500">
                    {connected ? `Connected (${connected.status})` : 'Not connected'}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                {connected ? (
                  <>
                    <button onClick={() => handleTest(p.id)} className="px-3 py-1.5 bg-gray-900 hover:bg-gray-800 text-gray-400 text-xs rounded-lg transition border border-gray-800">Test</button>
                    <button onClick={() => handleDisconnect(p.id)} className="px-3 py-1.5 bg-red-900/20 hover:bg-red-900/30 text-red-500 text-xs rounded-lg transition border border-red-900/30">Disconnect</button>
                  </>
                ) : (
                  <button 
                    onClick={() => handleConnect(p.id)}
                    disabled={isConnecting === p.id}
                    className="px-4 py-1.5 bg-white text-black font-bold text-xs rounded-lg hover:bg-gray-200 transition"
                  >
                    {isConnecting === p.id ? 'Connecting...' : 'Connect'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
