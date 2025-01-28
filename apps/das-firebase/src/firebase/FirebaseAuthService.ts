
import { AuthError, AuthService, OAuthResponse } from '@digitalaidseattle/core';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import firebaseClient from './firebaseClient';

class FirebaseAuthService implements AuthService {

    currentUser: any = null;
    auth = getAuth(firebaseClient);

    constructor() {
        this.auth.onAuthStateChanged((user) => {
            this.currentUser = user;
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
            this.currentUser = resp.user;
            return {
                data: {
                    url: ''
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

const authService = new FirebaseAuthService()
export { authService };

