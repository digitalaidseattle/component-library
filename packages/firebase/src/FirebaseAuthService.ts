/**
 *  storageService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { FirebaseApp } from 'firebase/app';
import { Auth, getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import { Configuration } from './Configuration';
import { AuthError, AuthService, OAuthResponse, User } from '@digitalaidseattle/core';

export class FirebaseAuthService implements AuthService {

    private static instance: FirebaseAuthService;

    static getInstance(): FirebaseAuthService {
        if (!FirebaseAuthService.instance) {
            FirebaseAuthService.instance = new FirebaseAuthService(Configuration.getInstance().getClient());
        }
        return FirebaseAuthService.instance
    }

    auth: Auth;

    private constructor(firebaseClient: FirebaseApp) {
        this.auth = getAuth(firebaseClient);
    }

    getProviders(): string[] {
        return ["google"];
    }

    signInWith(provider: string): Promise<OAuthResponse> {
        switch (provider) {
            case 'google':
                return this.signInWithGoogle();
            default:
                throw new Error('Unrecognized provider ' + provider);
        }
    }

    hasUser(): Promise<boolean> {
        return new Promise((resolve) => {
            const unsubscribe = onAuthStateChanged(this.auth, (user) => {
                unsubscribe(); // stop listening after first call
                resolve(user ? true : false);
            });
        });
    }

    getUser = async (): Promise<any | null> => {
        return new Promise((resolve) => {
            const unsubscribe = onAuthStateChanged(this.auth, (gUser) => {
                unsubscribe(); // stop listening after first call
                const user = gUser ? {
                    email: gUser.email,
                    user_metadata: {
                        name: gUser.displayName,
                        avatar_url: gUser.photoURL,
                        email: gUser.email
                    }
                } : null;
                resolve(user);
            });
        });
    }

    signOut = async (): Promise<{ error: AuthError | null }> => {
        await this.auth.signOut();
        return { error: null };
    }

    signInWithGoogle = async (): Promise<any> => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(this.auth, provider);
            return {
                data: {
                    url: import.meta.env.VITE_AUTH_DOMAIN
                }
            };
        } catch (error) {
            console.error('signInWithGoogle', error);
            throw error;
        }
    }

    isAuthorized(_user: User, _authorizedRoles: string[]): unknown {
        throw new Error('Method not implemented.');
    }

}
