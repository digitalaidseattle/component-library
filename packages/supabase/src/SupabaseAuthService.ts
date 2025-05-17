/**
 *  authService.ts
 *
 * <pre>
 update auth.users
 set raw_user_meta_data = jsonb_set(
  coalesce(raw_user_meta_data, '{}'),
  '{roles}',
  '["admin"]',
  true
)
where id = '<user-uuid>';
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import { AuthService, OAuthResponse, User } from "@digitalaidseattle/core";
import { AuthError, UserResponse } from '@supabase/supabase-js';
import { supabaseClient } from './supabaseClient'

export class SupabaseAuthService implements AuthService {

  getProviders(): string[] {
    return ["google", "microsoft"];
  }

  isRole(role: string): boolean {
    const user = this.getUser();
    if (!user) {
      return false;
    }
    // Check if the user has the specified role
    return user.roles.includes(role);
  }

  signOut = async (): Promise<{ error: AuthError | null }> => {
    return supabaseClient.auth.signOut()
  }

  hasUser = async (): Promise<boolean> => {
    return this.getUser().
      then(user => user != null)
  }


  getUser = async (): Promise<User | null> => {
    return supabaseClient.auth.getUser()
      .then((response: UserResponse) => {
        if (response.data.user) {
          return {
            email: response.data.user.user_metadata.email,
            name: response.data.user.user_metadata.name,
            avatar_url: response.data.user.user_metadata.avatar_url,
            roles: response.data.user.user_metadata.roles ?? [],
            user_metadata: response.data.user.user_metadata
          } as User
        }
        else {
          return null;
        }
      });
  }

  signInWith(provider: string): Promise<OAuthResponse> {
    switch (provider) {
      case 'google':
        return this.signInWithGoogle();
      case 'microsoft':
        return this.signInWithAzure();
      default:
        throw new Error('Unrecognized provider ' + provider);
    }
  }

  signInWithGoogle = async (): Promise<any> => {
    return supabaseClient.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    })
  }

  signInWithAzure = async (): Promise<any> => {
    return supabaseClient.auth.signInWithOAuth({
      provider: 'azure',
      options: {
        scopes: 'email',
        redirectTo: window.location.origin,
      },
    })
  }
}
