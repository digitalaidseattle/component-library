
export enum AUTH_PROVIDER {
    google, microsoft
}
export interface AuthError {
}

export interface User {
    email: string;
    user_metadata: {
        name: string;
        avatar_url: string;
        email: string;
    }
}

export type OAuthResponse = {
    data: {
        url: string
    }
}

export interface AuthService {

    signOut(): Promise<{ error: AuthError | null }>;

    hasUser(): Promise<boolean>;

    getUser(): Promise<User | null>;

    signInWithGoogle(): Promise<OAuthResponse>;

    signInWithAzure(): Promise<OAuthResponse>;
}