import { AuthService, OAuthResponse, User } from "@digitalaidseattle/core";
import {
    AuthError,
    UserResponse,
    createClient,
} from "@supabase/supabase-js";

const DEFAULT_PROVIDERS = ["google", "microsoft"] as const;

type SurveySupabaseTarget = "cloud" | "local";

type SurveySupabaseConfig = {
    target: SurveySupabaseTarget;
    url?: string;
    anonKey?: string;
};

function getCloudSupabaseConfig(
    env: Record<string, string | undefined>
): SurveySupabaseConfig {
    return {
        target: "cloud",
        url: env.VITE_SUPABASE_URL,
        anonKey: env.VITE_SUPABASE_ANON_KEY,
    };
}

function getLocalSupabaseConfig(
    env: Record<string, string | undefined>
): SurveySupabaseConfig {
    return {
        target: "local",
        url: env.VITE_SUPABASE_LOCAL_URL ?? env.NEXT_PUBLIC_SUPABASE_URL,
        anonKey:
            env.VITE_SUPABASE_LOCAL_ANON_KEY ??
            env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    };
}

function isConfigured(config: SurveySupabaseConfig): boolean {
    return Boolean(config.url && config.anonKey);
}

function resolveSurveySupabaseConfig(
    env: Record<string, string | undefined>
): SurveySupabaseConfig {
    const configuredTarget = (
        env.VITE_SUPABASE_TARGET ??
        env.VITE_SUPABASE_ENV ??
        "auto"
    ).toLowerCase();
    const cloudConfig = getCloudSupabaseConfig(env);
    const localConfig = getLocalSupabaseConfig(env);

    if (configuredTarget === "local") {
        return localConfig;
    }

    if (configuredTarget === "cloud") {
        return cloudConfig;
    }

    if (isConfigured(cloudConfig)) {
        return cloudConfig;
    }

    if (isConfigured(localConfig)) {
        return localConfig;
    }

    return cloudConfig;
}

const surveySupabaseConfig = resolveSurveySupabaseConfig(
    import.meta.env as Record<string, string | undefined>
);
const surveySupabaseConfigured = isConfigured(surveySupabaseConfig);

const surveySupabaseClient = createClient(
    surveySupabaseConfig.url || "https://placeholder.supabase.co",
    surveySupabaseConfig.anonKey || "placeholder-anon-key"
);

export class SurveySupabaseAuthService implements AuthService {
    private readonly providers: string[];

    constructor(providers: string[] = [...DEFAULT_PROVIDERS]) {
        this.providers = providers;
    }

    getProviders(): string[] {
        return this.providers;
    }

    signOut = async (): Promise<{ error: AuthError | null }> => {
        return surveySupabaseClient.auth.signOut();
    };

    hasUser = async (): Promise<boolean> => {
        return this.getUser().then((user) => user != null);
    };

    getUser = async (): Promise<User | null> => {
        return surveySupabaseClient.auth.getUser().then((response: UserResponse) => {
            if (response.data.user) {
                return {
                    email: response.data.user.user_metadata.email,
                    user_metadata: response.data.user.user_metadata,
                } as unknown as User;
            }

            return null;
        });
    };

    signInWith(provider: string): Promise<OAuthResponse> {
        switch (provider) {
            case "google":
                return this.signInWithGoogle();
            case "microsoft":
                return this.signInWithAzure();
            default:
                throw new Error("Unrecognized provider " + provider);
        }
    }

    signInWithGoogle = async (): Promise<any> => {
        return surveySupabaseClient.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: window.location.origin,
            },
        });
    };

    signInWithAzure = async (): Promise<any> => {
        return surveySupabaseClient.auth.signInWithOAuth({
            provider: "azure",
            options: {
                scopes: "email",
                redirectTo: window.location.origin,
            },
        });
    };
}

export {
    surveySupabaseClient,
    surveySupabaseConfig,
    surveySupabaseConfigured,
};
