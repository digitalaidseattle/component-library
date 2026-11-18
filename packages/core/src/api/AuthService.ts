
export interface AuthError {
}

export interface User {
    email: string;
    user_metadata: {
        name: string;
        avatar_url: string;
        email: string;
        roles: string[];
    }
}

export type OAuthResponse = {
    data: {
        url: string
    }
}

export interface AuthService {
    isAuthorized(user: User, authorizedRoles: string[]): unknown;

    getProviders(): string[];

    signOut(): Promise<{ error: AuthError | null }>;

    hasUser(): Promise<boolean>;

    getUser(): Promise<User | null>;

    signInWith(provider: string): Promise<OAuthResponse>;


}