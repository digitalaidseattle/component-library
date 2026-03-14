import { SupabaseAuthService, supabaseConfigured } from "@digitalaidseattle/supabase";
import {
    FallbackPublishedSurveyStore,
    FallbackSurveyDraftStore,
    LocalPublishedSurveyStore,
    LocalSurveyDraftStore,
    LocalSurveyTemplateStore,
    PublishedSurvey,
    SupabasePublishedSurveyStore,
    SupabaseSurveyDraftStore,
    SurveyDraft,
    SurveyDraftStore,
    PublishedSurveyStore,
    publishDraft
} from "@digitalaidseattle/surveys";

const localDraftStore = new LocalSurveyDraftStore();
const localPublishedStore = new LocalPublishedSurveyStore();
const localTemplateStore = new LocalSurveyTemplateStore();
const TEMPLATE_OWNER_STORAGE_KEY = "survey-module:template-owner";

const remoteDraftStore: SurveyDraftStore | undefined = supabaseConfigured
    ? new SupabaseSurveyDraftStore()
    : undefined;

const remotePublishedStore: PublishedSurveyStore | undefined = supabaseConfigured
    ? new SupabasePublishedSurveyStore()
    : undefined;

export const surveyDraftStore = new FallbackSurveyDraftStore(remoteDraftStore, localDraftStore);
export const publishedSurveyStore = new FallbackPublishedSurveyStore(remotePublishedStore, localPublishedStore);
export const surveyTemplateStore = localTemplateStore;

export async function getTemplateOwnerKey(): Promise<string> {
    if (supabaseConfigured) {
        try {
            const authService = new SupabaseAuthService();
            const user = await authService.getUser();
            if (user?.email) {
                return user.email;
            }
        } catch (error) {
            console.error("Unable to resolve authenticated template owner", error);
        }
    }

    const existingOwnerKey = localStorage.getItem(TEMPLATE_OWNER_STORAGE_KEY);
    if (existingOwnerKey) {
        return existingOwnerKey;
    }

    const nextOwnerKey = `local:${crypto.randomUUID()}`;
    localStorage.setItem(TEMPLATE_OWNER_STORAGE_KEY, nextOwnerKey);
    return nextOwnerKey;
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
