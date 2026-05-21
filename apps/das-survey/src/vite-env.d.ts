/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL?: string;
    readonly VITE_SUPABASE_ANON_KEY?: string;
    readonly VITE_SUPABASE_LOCAL_URL?: string;
    readonly VITE_SUPABASE_LOCAL_ANON_KEY?: string;
    readonly VITE_SUPABASE_TARGET?: string;
    readonly VITE_SUPABASE_ENV?: string;
    readonly VITE_SUPABASE_AUTH_PROVIDERS?: string;
    readonly VITE_SURVEY_DATA_PROVIDER?: string;
    readonly VITE_DATA_PROVIDER?: string;
    readonly VITE_SURVEY_AUTH_PROVIDER?: string;
    readonly VITE_AUTH_PROVIDER?: string;
    readonly VITE_SURVEY_AUTH_PROVIDERS?: string;
    readonly VITE_SURVEY_OWNER_KEY?: string;
    readonly VITE_SURVEY_LOCAL_OWNER_KEY?: string;
    readonly VITE_LOCAL_OWNER_KEY?: string;
    readonly NEXT_PUBLIC_SUPABASE_URL?: string;
    readonly NEXT_PUBLIC_SUPABASE_ANON_KEY?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
