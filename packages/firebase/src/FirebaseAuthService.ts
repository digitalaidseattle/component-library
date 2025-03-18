
import { AuthError, AuthService, OAuthResponse, User } from '@digitalaidseattle/core';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { firebaseClient } from "./firebaseClient";

class FirebaseAuthService implements AuthService {

    currentUser: User | undefined = undefined;
    auth = getAuth(firebaseClient);

    constructor() {
        this.auth.onAuthStateChanged((user) => {
            if (user) {
                this.currentUser = {
                    email: user.email,
                    user_metadata: {
                        name: user.displayName,
                        avatar_url: user.photoURL,
                        email: user.email
                    }
                } as User;

            }
        })
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
        return Promise.resolve(this.currentUser !== null);
    }

    getUser = async (): Promise<any | null> => {
        return this.currentUser;
    }

    signOut = async (): Promise<{ error: AuthError | null }> => {
        this.currentUser = undefined;
        this.auth.signOut();
        return { error: null };
    }

    signInWithGoogle = async (): Promise<any> => {
        try {
            const provider = new GoogleAuthProvider();
            const resp = await signInWithPopup(this.auth, provider);
            this.currentUser = {
                email: resp.user.email,
                user_metadata: {
                    name: resp.user.displayName,
                    avatar_url: resp.user.photoURL,
                    email: resp.user.email
                }
            } as User;

            return {
                data: {
                    url: import.meta.env.VITE_AUTH_DOMAIN
                }
            };
        } catch (error) {
            console.error(error);
        }
    }
}

export { FirebaseAuthService };

