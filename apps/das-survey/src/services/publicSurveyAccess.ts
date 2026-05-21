import { PublishedSurvey } from "@digitalaidseattle/surveys";
import { surveySupabaseClient, surveySupabaseConfigured } from "./surveySupabase";

type PublishedSurveyRow = {
    id: string;
    created_by: string | null;
    updated_by: string | null;
    draft_id: string;
    template_id: string;
    title: string;
    description: string | null;
    questions: PublishedSurvey["questions"];
    published_at: string;
    updated_at: string;
};

export type PublicSurveyRecord = PublishedSurvey & {
    ownerKey?: string;
};

function rowToPublished(row: PublishedSurveyRow): PublicSurveyRecord {
    return {
        id: row.id,
        created_by: row.created_by ?? undefined,
        updated_by: row.updated_by ?? undefined,
        draftId: row.draft_id,
        templateId: row.template_id as PublishedSurvey["templateId"],
        title: row.title,
        description: row.description,
        questions: row.questions,
        publishedAt: new Date(row.published_at).getTime(),
        updatedAt: new Date(row.updated_at).getTime(),
        ownerKey: row.created_by ?? row.updated_by ?? undefined,
    };
}

export async function loadPublicSurvey(
    surveyId: string
): Promise<PublicSurveyRecord | null> {
    if (!surveySupabaseConfigured) {
        return null;
    }

    const { data, error } = await surveySupabaseClient
        .from("published_surveys")
        .select("*")
        .eq("id", surveyId)
        .maybeSingle();

    if (error) {
        throw error;
    }

    return data ? rowToPublished(data as PublishedSurveyRow) : null;
}
