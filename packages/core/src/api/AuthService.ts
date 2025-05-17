
export interface AuthError {
}

export interface User {
    email: string;
    name: string;
    avatar_url: string;
    // user_metadata is deprecated, the user object will be flattened
    user_metadata: {
        name: string;
        avatar_url: string;
        email: string;
    }
    roles: string[];
}

export type OAuthResponse = {
    data: {
        url: string
    }
}

export interface AuthService {

    getProviders(): string[];

    signOut(): Promise<{ error: AuthError | null }>;

    hasUser(): Promise<boolean>;

    getUser(): Promise<User | null>;

    signInWith(provider: string): Promise<OAuthResponse>;

    isRole(role: string): boolean;

}