/**
 *  authService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import { AuthService, User } from "@digitalaidseattle/core";
import { AuthError, UserResponse } from '@supabase/supabase-js';
import { supabaseClient } from './supabaseClient'

export class SupabaseAuthService implements AuthService {

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
        return {
          email: response.data.user?.user_metadata.email,
          user_metadata: response.data.user?.user_metadata
        } as unknown as User
      });
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
