import { getCoreServices } from "@digitalaidseattle/core";
import { supabaseConfigured } from "@digitalaidseattle/supabase";
import {
    FallbackPublishedSurveyStore,
    FallbackSurveyDraftStore,
    LocalSurveyTemplateStore,
    PublishedSurvey,
    SupabasePublishedSurveyStore,
    SupabaseSurveyDraftStore,
    SurveyDraft,
    SurveyDraftStore,
    PublishedSurveyStore,
    publishDraft
} from "@digitalaidseattle/surveys";

const localTemplateStore = new LocalSurveyTemplateStore();
const OWNER_STORAGE_KEY = "survey-module:owner";
const DRAFT_STORAGE_KEY = "survey-module:drafts";
const PUBLISHED_STORAGE_KEY = "survey-module:published";

type SurveyDataProvider = "supabase" | "local";

function resolveSurveyDataProvider(): SurveyDataProvider {
    const configuredProvider = (
        import.meta.env.VITE_SURVEY_DATA_PROVIDER ??
        import.meta.env.VITE_DATA_PROVIDER ??
        "auto"
    ).toLowerCase();

    if (configuredProvider === "local") {
        return "local";
    }

    if (configuredProvider === "supabase") {
        return supabaseConfigured ? "supabase" : "local";
    }

    return supabaseConfigured ? "supabase" : "local";
}

function loadOwnerScoped<T>(storageKey: string, ownerKey: string): T[] {
    const raw = localStorage.getItem(`${storageKey}:${ownerKey}`);
    return raw ? (JSON.parse(raw) as T[]) : [];
}

function saveOwnerScoped<T>(storageKey: string, ownerKey: string, items: T[]): void {
    localStorage.setItem(`${storageKey}:${ownerKey}`, JSON.stringify(items));
}

async function getAuthenticatedOwnerKey(): Promise<string | undefined> {
    const authService = getCoreServices().authService;
    if (!authService || authService.getProviders().length === 0) {
        return undefined;
    }

    try {
        const user = await authService.getUser();
        return user?.email || undefined;
    } catch (error) {
        console.error("Unable to resolve authenticated owner", error);
        return undefined;
    }
}

function getLocalOwnerKey(): string {
    const existingOwnerKey = localStorage.getItem(OWNER_STORAGE_KEY);
    if (existingOwnerKey) {
        return existingOwnerKey;
    }

    const nextOwnerKey = `local:${crypto.randomUUID()}`;
    localStorage.setItem(OWNER_STORAGE_KEY, nextOwnerKey);
    return nextOwnerKey;
}

export async function getSurveyOwnerKey(): Promise<string> {
    return (await getAuthenticatedOwnerKey()) ?? getLocalOwnerKey();
}

class OwnerScopedLocalSurveyDraftStore implements SurveyDraftStore {
    async list(): Promise<SurveyDraft[]> {
        const ownerKey = await getSurveyOwnerKey();
        return loadOwnerScoped<SurveyDraft>(DRAFT_STORAGE_KEY, ownerKey)
            .sort((left, right) => right.updatedAt - left.updatedAt);
    }

    async get(id: string): Promise<SurveyDraft | undefined> {
        const drafts = await this.list();
        return drafts.find((draft) => draft.id === id);
    }

    async upsert(draft: SurveyDraft): Promise<void> {
        const ownerKey = await getSurveyOwnerKey();
        const drafts = loadOwnerScoped<SurveyDraft>(DRAFT_STORAGE_KEY, ownerKey);
        const next = drafts.filter((existing) => existing.id !== draft.id);
        next.push(draft);
        saveOwnerScoped(DRAFT_STORAGE_KEY, ownerKey, next);
    }

    async delete(id: string): Promise<void> {
        const ownerKey = await getSurveyOwnerKey();
        const drafts = loadOwnerScoped<SurveyDraft>(DRAFT_STORAGE_KEY, ownerKey);
        saveOwnerScoped(
            DRAFT_STORAGE_KEY,
            ownerKey,
            drafts.filter((draft) => draft.id !== id)
        );
    }

    isConfigured(): boolean {
        return true;
    }
}

class OwnerScopedLocalPublishedSurveyStore implements PublishedSurveyStore {
    async list(): Promise<PublishedSurvey[]> {
        const ownerKey = await getSurveyOwnerKey();
        return loadOwnerScoped<PublishedSurvey>(PUBLISHED_STORAGE_KEY, ownerKey)
            .sort((left, right) => right.updatedAt - left.updatedAt);
    }

    async get(id: string): Promise<PublishedSurvey | undefined> {
        const surveys = await this.list();
        return surveys.find((survey) => survey.id === id);
    }

    async upsert(survey: PublishedSurvey): Promise<void> {
        const ownerKey = await getSurveyOwnerKey();
        const surveys = loadOwnerScoped<PublishedSurvey>(PUBLISHED_STORAGE_KEY, ownerKey);
        const next = surveys.filter((existing) => existing.id !== survey.id);
        next.push(survey);
        saveOwnerScoped(PUBLISHED_STORAGE_KEY, ownerKey, next);
    }

    async delete(id: string): Promise<void> {
        const ownerKey = await getSurveyOwnerKey();
        const surveys = loadOwnerScoped<PublishedSurvey>(PUBLISHED_STORAGE_KEY, ownerKey);
        saveOwnerScoped(
            PUBLISHED_STORAGE_KEY,
            ownerKey,
            surveys.filter((survey) => survey.id !== id)
        );
    }

    isConfigured(): boolean {
        return true;
    }
}

const surveyDataProvider = resolveSurveyDataProvider();
const localDraftStore = new OwnerScopedLocalSurveyDraftStore();
const localPublishedStore = new OwnerScopedLocalPublishedSurveyStore();

const remoteDraftStore: SurveyDraftStore | undefined = surveyDataProvider === "supabase"
    ? new SupabaseSurveyDraftStore()
    : undefined;

const remotePublishedStore: PublishedSurveyStore | undefined = surveyDataProvider === "supabase"
    ? new SupabasePublishedSurveyStore()
    : undefined;

export const surveyDraftStore = new FallbackSurveyDraftStore(remoteDraftStore, localDraftStore);
export const publishedSurveyStore = new FallbackPublishedSurveyStore(remotePublishedStore, localPublishedStore);
export const surveyTemplateStore = localTemplateStore;

export async function getTemplateOwnerKey(): Promise<string> {
    return getSurveyOwnerKey();
}

export async function publishSurvey(draft: SurveyDraft): Promise<PublishedSurvey> {
    const result = publishDraft(draft);
    await publishedSurveyStore.upsert(result.published);
    await surveyDraftStore.upsert(result.draft);
    return result.published;
}

export async function deleteSurvey(id: string, status: "draft" | "active"): Promise<void> {
    await surveyDraftStore.delete(id);

    if (status === "active") {
        await publishedSurveyStore.delete(id);
    }
}
