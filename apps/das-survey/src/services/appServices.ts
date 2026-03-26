import {
  AuthError,
  AuthService,
  OAuthResponse,
  User,
  setCoreServices,
} from "@digitalaidseattle/core";
import { SupabaseAuthService, supabaseConfigured } from "@digitalaidseattle/supabase";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  type Auth,
} from "firebase/auth";

export type SurveyAuthProvider = "firebase" | "supabase" | "local";

function isFirebaseConfigured(): boolean {
  const env = import.meta.env as Record<string, string | undefined>;
  return [
    "VITE_FIREBASE_API_KEY",
    "VITE_FIREBASE_AUTH_DOMAIN",
    "VITE_FIREBASE_PROJECT_ID",
    "VITE_FIREBASE_APP_ID",
  ].every((key) => Boolean(env[key]));
}

class FirebaseBrowserAuthService implements AuthService {
  private readonly auth: Auth;

  constructor() {
    const env = import.meta.env as Record<string, string | undefined>;
    const firebaseClient = initializeApp({
      apiKey: env.VITE_FIREBASE_API_KEY,
      authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: env.VITE_FIREBASE_APP_ID,
      measurementId: env.VITE_FIREBASE_MEASUREMENT_ID,
    });

    this.auth = getAuth(firebaseClient);
  }

  getProviders(): string[] {
    return ["google"];
  }

  async signOut(): Promise<{ error: AuthError | null }> {
    await this.auth.signOut();
    return { error: null };
  }

  async hasUser(): Promise<boolean> {
    return this.getUser().then((user) => Boolean(user));
  }

  async getUser(): Promise<User | null> {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(this.auth, (firebaseUser) => {
        unsubscribe();
        resolve(
          firebaseUser
            ? {
                email: firebaseUser.email || "",
                user_metadata: {
                  name: firebaseUser.displayName || firebaseUser.email || "",
                  avatar_url: firebaseUser.photoURL || "",
                  email: firebaseUser.email || "",
                },
              }
            : null
        );
      });
    });
  }

  async signInWith(provider: string): Promise<OAuthResponse> {
    if (provider !== "google") {
      throw new Error(`Unrecognized provider ${provider}`);
    }

    await signInWithPopup(this.auth, new GoogleAuthProvider());
    return {
      data: {
        url: window.location.origin,
      },
    };
  }
}

class LocalAuthService implements AuthService {
  getProviders(): string[] {
    return [];
  }

  async signOut(): Promise<{ error: AuthError | null }> {
    return { error: null };
  }

  async hasUser(): Promise<boolean> {
    return false;
  }

  async getUser() {
    return null;
  }

  signInWith(provider: string): Promise<OAuthResponse> {
    throw new Error(`Local auth service cannot sign in with ${provider}.`);
  }
}

function resolveAuthProvider(): SurveyAuthProvider {
  const requestedProvider = (
    import.meta.env.VITE_SURVEY_AUTH_PROVIDER ??
    import.meta.env.VITE_AUTH_PROVIDER ??
    "auto"
  ).toLowerCase();

  if (requestedProvider === "firebase") {
    return isFirebaseConfigured() ? "firebase" : "local";
  }

  if (requestedProvider === "supabase") {
    return supabaseConfigured ? "supabase" : "local";
  }

  if (requestedProvider === "local" || requestedProvider === "none") {
    return "local";
  }

  if (isFirebaseConfigured()) {
    return "firebase";
  }

  if (supabaseConfigured) {
    return "supabase";
  }

  return "local";
}

function createAuthService(provider: SurveyAuthProvider): AuthService {
  switch (provider) {
    case "firebase":
      return new FirebaseBrowserAuthService();
    case "supabase":
      return new SupabaseAuthService();
    default:
      return new LocalAuthService();
  }
}

const authProvider = resolveAuthProvider();
const authService = createAuthService(authProvider);

export const surveyAppServices = {
  authProvider,
  authService,
};

export function configureCoreServices() {
  setCoreServices({
    authService,
  });

  return surveyAppServices;
}
