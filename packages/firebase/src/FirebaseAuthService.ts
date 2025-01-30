
import { AuthError, AuthService, OAuthResponse, User } from '@digitalaidseattle/core';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import {  firebaseClient} from "./firebaseClient";

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
            console.log(resp)

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

    signInWithAzure(): Promise<OAuthResponse> {
        // Placeholder implementation, as Azure sign-in is not implemented
        return Promise.reject(new Error('Method not implemented.'));
    }
}

export { FirebaseAuthService };

