/**
 *  SupabaseAuthService.ts
 *
 *  @copyright 2026 Digital Aid Seattle
 *
 */
import { AuthService, OAuthResponse, User } from "@digitalaidseattle/core";
import { AuthError, SupabaseClient, UserResponse } from '@supabase/supabase-js';
import { getConfiguration } from "./Configuration";

export class SupabaseAuthService implements AuthService {

  private static instance: SupabaseAuthService;

  static getInstance(): SupabaseAuthService {
    if (!SupabaseAuthService.instance) {
      SupabaseAuthService.instance = new SupabaseAuthService();
    }
    return SupabaseAuthService.instance
  }

  client: SupabaseClient;

  constructor(aSupabaseClient?: SupabaseClient) {
    this.client = aSupabaseClient ?? getConfiguration().supabaseClient;
  }

  isAuthorized(user: User, authorizedRoles: string[]): boolean {
    const metadata: any = user.user_metadata;
    if (metadata.roles) {
      return (metadata.roles as string[]).some(role => authorizedRoles.includes(role));
    }
    return false;
  }

  getProviders(): string[] {
    return ["google", "microsoft"];
  }

  signOut = async (): Promise<{ error: AuthError | null }> => {
    return this.client.auth.signOut()
  }

  hasUser = async (): Promise<boolean> => {
    return this.getUser().
      then(user => user != null)
  }

  getUser = async (): Promise<User | null> => {
    return this.client.auth.getUser()
      .then((response: UserResponse) => {
        if (response.data.user) {
          return {
            email: response.data.user?.user_metadata.email,
            user_metadata: response.data.user?.user_metadata
          } as unknown as User
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
    return this.client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    })
  }

  signInWithAzure = async (): Promise<any> => {
    return this.client.auth.signInWithOAuth({
      provider: 'azure',
      options: {
        scopes: 'email',
        redirectTo: window.location.origin,
      },
    })
  }
}
