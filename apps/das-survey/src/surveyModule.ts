import { supabaseConfigured } from "@digitalaidseattle/supabase";
import {
    FallbackPublishedSurveyStore,
    FallbackSurveyDraftStore,
    LocalPublishedSurveyStore,
    LocalSurveyDraftStore,
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

const remoteDraftStore: SurveyDraftStore | undefined = supabaseConfigured
    ? new SupabaseSurveyDraftStore()
    : undefined;

const remotePublishedStore: PublishedSurveyStore | undefined = supabaseConfigured
    ? new SupabasePublishedSurveyStore()
    : undefined;

export const surveyDraftStore = new FallbackSurveyDraftStore(remoteDraftStore, localDraftStore);
export const publishedSurveyStore = new FallbackPublishedSurveyStore(remotePublishedStore, localPublishedStore);

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
