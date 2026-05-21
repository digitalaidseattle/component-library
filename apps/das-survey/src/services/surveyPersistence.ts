import { Entity } from "@digitalaidseattle/core";
import {
    configureSurveyWorkspacePersistence,
    PublishedSurvey,
    PublishedSurveyStore,
    SurveyDefinition,
    SurveyDraft,
    SurveyDraftStore,
    SurveyTemplate,
    SurveyTemplateStore,
} from "@digitalaidseattle/surveys";
import {
    surveySupabaseClient,
    surveySupabaseConfigured,
} from "./surveySupabase";

export type SurveyDataProvider = "supabase" | "local";

type SurveyDraftRow = Entity & {
    id: string;
    status: "draft" | "published";
    updated_at: Date;
    template_id: string;
    history: SurveyDefinition[];
    history_index: number;
};

type PublishedSurveyRow = Entity & {
    id: string;
    draft_id: string;
    template_id: string;
    title: string;
    description: string | null;
    questions: PublishedSurvey["questions"];
    published_at: Date;
    updated_at: Date;
};

type SurveyTemplateRow = Entity & {
    id: string;
    title: string;
    description: string;
    category: string;
    definition: SurveyDefinition;
    scope: "system" | "user";
    owner_email: string;
    updated_at: Date;
};

function rowToDraft(row: SurveyDraftRow): SurveyDraft {
    return {
        id: row.id,
        created_by: row.created_by,
        created_at: row.created_at,
        updated_by: row.updated_by,
        updated_at: row.updated_at,
        status: row.status,
        updatedAt: new Date(row.updated_at).getTime(),
        templateId: row.template_id as SurveyDraft["templateId"],
        history: row.history,
        historyIndex: row.history_index,
    };
}

function draftToRow(draft: SurveyDraft): SurveyDraftRow {
    return {
        id: draft.id,
        created_by: draft.created_by,
        created_at: draft.created_at,
        updated_by: draft.updated_by,
        updated_at: draft.updated_at ?? new Date(draft.updatedAt),
        status: draft.status,
        template_id: draft.templateId,
        history: draft.history,
        history_index: draft.historyIndex,
    };
}

function rowToPublished(row: PublishedSurveyRow): PublishedSurvey {
    return {
        id: row.id,
        created_by: row.created_by,
        created_at: row.created_at,
        updated_by: row.updated_by,
        updated_at: row.updated_at,
        draftId: row.draft_id,
        templateId: row.template_id as PublishedSurvey["templateId"],
        title: row.title,
        description: row.description,
        questions: row.questions,
        publishedAt: new Date(row.published_at).getTime(),
        updatedAt: new Date(row.updated_at).getTime(),
    };
}

function publishedToRow(survey: PublishedSurvey): PublishedSurveyRow {
    return {
        id: survey.id,
        created_by: survey.created_by,
        created_at: survey.created_at,
        updated_by: survey.updated_by,
        updated_at: survey.updated_at ?? new Date(survey.updatedAt),
        draft_id: survey.draftId,
        template_id: survey.templateId,
        title: survey.title,
        description: survey.description,
        questions: survey.questions,
        published_at: new Date(survey.publishedAt),
    };
}

function rowToTemplate(row: SurveyTemplateRow): SurveyTemplate {
    return {
        id: row.id,
        title: row.title,
        description: row.description,
        category: row.category,
        definition: row.definition,
        scope: row.scope,
        ownerEmail: row.owner_email,
        updatedAt: new Date(row.updated_at).getTime(),
    };
}

function templateToRow(template: SurveyTemplate): SurveyTemplateRow {
    const ownerEmail = template.ownerEmail ?? "local-dev";
    const updatedAt = new Date(template.updatedAt ?? Date.now());

    return {
        id: template.id,
        created_by: ownerEmail,
        created_at: updatedAt,
        updated_by: ownerEmail,
        updated_at: updatedAt,
        title: template.title,
        description: template.description,
        category: template.category,
        definition: template.definition,
        scope: template.scope ?? "user",
        owner_email: ownerEmail,
    };
}

class SupabaseSurveyDraftStore implements SurveyDraftStore {
    async list(): Promise<SurveyDraft[]> {
        const { data, error } = await surveySupabaseClient
            .from("survey_drafts")
            .select("*");

        if (error) {
            console.error("Failed to list survey drafts", error);
            throw error;
        }

        return (data ?? [])
            .map((row) => rowToDraft(row as SurveyDraftRow))
            .sort((left, right) => right.updatedAt - left.updatedAt);
    }

    async get(id: string): Promise<SurveyDraft | undefined> {
        const { data, error } = await surveySupabaseClient
            .from("survey_drafts")
            .select("*")
            .eq("id", id)
            .single();

        if (error) {
            console.error("Failed to fetch survey draft", error);
            throw error;
        }

        return data ? rowToDraft(data as SurveyDraftRow) : undefined;
    }

    async upsert(draft: SurveyDraft): Promise<void> {
        const { error } = await surveySupabaseClient
            .from("survey_drafts")
            .upsert([draftToRow(draft)]);

        if (error) {
            console.error("Failed to upsert survey draft", error);
            throw error;
        }
    }

    async delete(id: string): Promise<void> {
        const { error } = await surveySupabaseClient
            .from("survey_drafts")
            .delete()
            .eq("id", id);

        if (error) {
            console.error("Failed to delete survey draft", error);
            throw error;
        }
    }

    isConfigured(): boolean {
        return surveySupabaseConfigured;
    }
}

class SupabasePublishedSurveyStore implements PublishedSurveyStore {
    async list(): Promise<PublishedSurvey[]> {
        const { data, error } = await surveySupabaseClient
            .from("published_surveys")
            .select("*");

        if (error) {
            console.error("Failed to list published surveys", error);
            throw error;
        }

        return (data ?? [])
            .map((row) => rowToPublished(row as PublishedSurveyRow))
            .sort((left, right) => right.updatedAt - left.updatedAt);
    }

    async get(id: string): Promise<PublishedSurvey | undefined> {
        const { data, error } = await surveySupabaseClient
            .from("published_surveys")
            .select("*")
            .eq("id", id)
            .single();

        if (error) {
            console.error("Failed to fetch published survey", error);
            throw error;
        }

        return data ? rowToPublished(data as PublishedSurveyRow) : undefined;
    }

    async upsert(survey: PublishedSurvey): Promise<void> {
        const { error } = await surveySupabaseClient
            .from("published_surveys")
            .upsert([publishedToRow(survey)]);

        if (error) {
            console.error("Failed to upsert published survey", error);
            throw error;
        }
    }

    async delete(id: string): Promise<void> {
        const { error } = await surveySupabaseClient
            .from("published_surveys")
            .delete()
            .eq("id", id);

        if (error) {
            console.error("Failed to delete published survey", error);
            throw error;
        }
    }

    isConfigured(): boolean {
        return surveySupabaseConfigured;
    }
}

class SupabaseSurveyTemplateStore implements SurveyTemplateStore {
    async list(ownerEmail: string): Promise<SurveyTemplate[]> {
        const { data, error } = await surveySupabaseClient
            .from("survey_templates")
            .select("*")
            .eq("owner_email", ownerEmail)
            .order("updated_at", { ascending: false });

        if (error) {
            console.error("Failed to list survey templates", error);
            throw error;
        }

        return (data ?? []).map((row) => rowToTemplate(row as SurveyTemplateRow));
    }

    async get(id: string, ownerEmail: string): Promise<SurveyTemplate | undefined> {
        const { data, error } = await surveySupabaseClient
            .from("survey_templates")
            .select("*")
            .eq("id", id)
            .eq("owner_email", ownerEmail)
            .maybeSingle();

        if (error) {
            console.error("Failed to fetch survey template", error);
            throw error;
        }

        return data ? rowToTemplate(data as SurveyTemplateRow) : undefined;
    }

    async upsert(template: SurveyTemplate): Promise<void> {
        const { error } = await surveySupabaseClient
            .from("survey_templates")
            .upsert([templateToRow(template)]);

        if (error) {
            console.error("Failed to upsert survey template", error);
            throw error;
        }
    }

    async delete(id: string, ownerEmail: string): Promise<void> {
        const { error } = await surveySupabaseClient
            .from("survey_templates")
            .delete()
            .eq("id", id)
            .eq("owner_email", ownerEmail);

        if (error) {
            console.error("Failed to delete survey template", error);
            throw error;
        }
    }

    isConfigured(): boolean {
        return surveySupabaseConfigured;
    }
}

export function resolveSurveyDataProvider(): SurveyDataProvider {
    const configuredProvider = (
        import.meta.env.VITE_SURVEY_DATA_PROVIDER ??
        import.meta.env.VITE_DATA_PROVIDER ??
        "auto"
    ).toLowerCase();

    if (configuredProvider === "local") {
        return "local";
    }

    if (configuredProvider === "supabase") {
        return surveySupabaseConfigured ? "supabase" : "local";
    }

    return surveySupabaseConfigured ? "supabase" : "local";
}

export function configureSurveyPersistence(
    provider: SurveyDataProvider = resolveSurveyDataProvider()
): SurveyDataProvider {
    if (provider === "supabase") {
        configureSurveyWorkspacePersistence({
            draftStore: new SupabaseSurveyDraftStore(),
            publishedSurveyStore: new SupabasePublishedSurveyStore(),
            templateStore: new SupabaseSurveyTemplateStore(),
        });
        return provider;
    }

    configureSurveyWorkspacePersistence({});
    return "local";
}
