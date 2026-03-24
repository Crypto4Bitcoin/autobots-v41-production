// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { NextResponse } from "next/server"

export interface UniversalCommand {
  command_id: string
  transcript: string
  normalized_text: string
  intent_type: string
  target?: string
  action?: string
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  entities?: Record<string, any>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  parameters?: Record<string, any>
  timestamp: string
}

export class VoiceActionRouterService {
  private static routeMap: Record<string, { type: 'route' | 'api', target: string }> = {
    'workers': { type: 'route', target: '/workforce' },
    'workforce': { type: 'route', target: '/workforce' },
    'mission graph': { type: 'route', target: '/dashboard/pipeline' },
    'missions': { type: 'route', target: '/dashboard/pipeline' },
    'governance': { type: 'route', target: '/insights' },
    'insights': { type: 'route', target: '/insights' },
    'memory': { type: 'route', target: '/autonomous' },
    'autonomous': { type: 'route', target: '/autonomous' },
    'start mission': { type: 'api', target: '/api/workflows/create' },
    'launch workflow': { type: 'api', target: '/api/workflows/create' },
    'save memory': { type: 'api', target: '/api/memory/save' },
    'approve': { type: 'api', target: '/api/approvals/action' },
    'health': { type: 'api', target: '/api/runtime/health' },
  };

  /**
   * Dispatches a normalized command to the correct platform target.
   */
  static async dispatch(command: UniversalCommand): Promise<{ success: boolean; message: string; target?: string; type?: string }> {
    console.log('[VoiceRouter] Dispatching intent: ' + command.intent_type + ' -> ' + (command.target || 'unknown'));

    const searchTarget = (command.target || command.normalized_text || '').toLowerCase();
    const mapping = this.routeMap[searchTarget];

    if (!mapping) {
      if (command.intent_type === 'navigation') {
        // Fallback for direct route targeting if not in map
        return { success: true, message: 'Navigating to ' + command.target, target: command.target, type: 'route' };
      }
      return { success: false, message: 'No mapping found for target: ' + command.target };
    }

    return {
      success: true,
      message: 'Action routed: ' + (command.action || 'default') + ' on ' + command.target,
      target: mapping.target,
      type: mapping.type
    };
  }
}
