import { supabase } from "./supabase-service";

export interface UserSession {
  user: {
    id: string;
    email?: string;
    avatar_url?: string;
  };
  workspaceId: string;
  role: 'owner' | 'admin' | 'pilot' | 'viewer';
}

export class ProductionAuthService {
  /**
   * Returns the current active session with workspace context.
   */
  static async getSession(): Promise<UserSession | null> {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) return null;

    // In production, we'd fetch workspace membership here.
    // Mocking for Phase 68 foundation.
    return {
      user: {
        id: session.user.id,
        email: session.user.email,
        avatar_url: session.user.user_metadata?.avatar_url
      },
      workspaceId: 'ws_auto_001',
      role: 'pilot'
    };
  }

  /**
   * Signs in a user via Magic Link.
   */
  static async signInWithMagicLink(email: string) {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    });
    return { error };
  }

  /**
   * Signs out the current user.
   */
  static async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  }
}

export const UserSession = {} as any;
