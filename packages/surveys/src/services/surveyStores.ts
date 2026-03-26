import { Entity } from "@digitalaidseattle/core";
import {
    supabaseClient,
    SupabaseEntityService,
    supabaseConfigured,
} from "@digitalaidseattle/supabase";
import {
    PublishedSurvey,
    SurveyDraft,
    SurveyDefinition,
    SurveyTemplate
} from "./surveyModels";

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

export interface SurveyDraftStore {
    list(): Promise<SurveyDraft[]>;
    get(id: string): Promise<SurveyDraft | undefined>;
    upsert(draft: SurveyDraft): Promise<void>;
    delete(id: string): Promise<void>;
    isConfigured(): boolean;
}

export interface PublishedSurveyStore {
    list(): Promise<PublishedSurvey[]>;
    get(id: string): Promise<PublishedSurvey | undefined>;
    upsert(survey: PublishedSurvey): Promise<void>;
    delete(id: string): Promise<void>;
    isConfigured(): boolean;
}

export interface SurveyTemplateStore {
    list(ownerEmail: string): Promise<SurveyTemplate[]>;
    get(id: string, ownerEmail: string): Promise<SurveyTemplate | undefined>;
    upsert(template: SurveyTemplate): Promise<void>;
    delete(id: string, ownerEmail: string): Promise<void>;
    isConfigured(): boolean;
}

class SurveyDraftEntityService extends SupabaseEntityService<SurveyDraftRow> {
    constructor() {
        super("survey_drafts");
    }
}

class PublishedSurveyEntityService extends SupabaseEntityService<PublishedSurveyRow> {
    constructor() {
        super("published_surveys");
    }
}

const memoryDrafts = new Map<string, SurveyDraft>();
const memoryPublishedSurveys = new Map<string, PublishedSurvey>();
const memoryTemplates = new Map<string, SurveyTemplate[]>();

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
        historyIndex: row.history_index
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
        history_index: draft.historyIndex
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
        updatedAt: new Date(row.updated_at).getTime()
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
        published_at: new Date(survey.publishedAt)
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

export class LocalSurveyDraftStore implements SurveyDraftStore {
    list(): Promise<SurveyDraft[]> {
        return Promise.resolve([...memoryDrafts.values()]);
    }

    get(id: string): Promise<SurveyDraft | undefined> {
        return Promise.resolve(memoryDrafts.get(id));
    }

    upsert(draft: SurveyDraft): Promise<void> {
        memoryDrafts.set(draft.id, draft);
        return Promise.resolve();
    }

    delete(id: string): Promise<void> {
        memoryDrafts.delete(id);
        return Promise.resolve();
    }

    isConfigured(): boolean {
        return true;
    }
}

export class LocalPublishedSurveyStore implements PublishedSurveyStore {
    list(): Promise<PublishedSurvey[]> {
        return Promise.resolve([...memoryPublishedSurveys.values()]);
    }

    get(id: string): Promise<PublishedSurvey | undefined> {
        return Promise.resolve(memoryPublishedSurveys.get(id));
    }

    upsert(survey: PublishedSurvey): Promise<void> {
        memoryPublishedSurveys.set(survey.id, survey);
        return Promise.resolve();
    }

    delete(id: string): Promise<void> {
        memoryPublishedSurveys.delete(id);
        return Promise.resolve();
    }

    isConfigured(): boolean {
        return true;
    }
}

export class LocalSurveyTemplateStore implements SurveyTemplateStore {
    list(ownerEmail: string): Promise<SurveyTemplate[]> {
        return Promise.resolve(
            [...(memoryTemplates.get(ownerEmail) ?? [])].sort(
                (left, right) => (right.updatedAt ?? 0) - (left.updatedAt ?? 0)
            )
        );
    }

    get(id: string, ownerEmail: string): Promise<SurveyTemplate | undefined> {
        return this.list(ownerEmail).then((templates) =>
            templates.find((template) => template.id === id)
        );
    }

    upsert(template: SurveyTemplate): Promise<void> {
        if (!template.ownerEmail) {
            return Promise.reject(new Error("User templates must include an ownerEmail."));
        }

        const existing = memoryTemplates.get(template.ownerEmail) ?? [];
        const next = [
            ...existing.filter((entry) => entry.id !== template.id),
            template,
        ];
        memoryTemplates.set(template.ownerEmail, next);
        return Promise.resolve();
    }

    delete(id: string, ownerEmail: string): Promise<void> {
        const existing = memoryTemplates.get(ownerEmail) ?? [];
        memoryTemplates.set(
            ownerEmail,
            existing.filter((template) => template.id !== id)
        );
        return Promise.resolve();
    }

    isConfigured(): boolean {
        return true;
    }
}

export class SupabaseSurveyDraftStore implements SurveyDraftStore {
    private readonly service = new SurveyDraftEntityService();

    async list(): Promise<SurveyDraft[]> {
        const rows = await this.service.getAll();
        return rows.map(rowToDraft).sort((left, right) => right.updatedAt - left.updatedAt);
    }

    async get(id: string): Promise<SurveyDraft | undefined> {
        const row = await this.service.getById(id);
        return row ? rowToDraft(row) : undefined;
    }

    async upsert(draft: SurveyDraft): Promise<void> {
        await this.service.upsert(draftToRow(draft));
    }

    async delete(id: string): Promise<void> {
        await this.service.delete(id);
    }

    isConfigured(): boolean {
        return supabaseConfigured;
    }
}

export class SupabasePublishedSurveyStore implements PublishedSurveyStore {
    private readonly service = new PublishedSurveyEntityService();

    async list(): Promise<PublishedSurvey[]> {
        const rows = await this.service.getAll();
        return rows.map(rowToPublished).sort((left, right) => right.updatedAt - left.updatedAt);
    }

    async get(id: string): Promise<PublishedSurvey | undefined> {
        const row = await this.service.getById(id);
        return row ? rowToPublished(row) : undefined;
    }

    async upsert(survey: PublishedSurvey): Promise<void> {
        await this.service.upsert(publishedToRow(survey));
    }

    async delete(id: string): Promise<void> {
        await this.service.delete(id);
    }

    isConfigured(): boolean {
        return supabaseConfigured;
    }
}

export class SupabaseSurveyTemplateStore implements SurveyTemplateStore {
    async list(ownerEmail: string): Promise<SurveyTemplate[]> {
        const { data, error } = await supabaseClient
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
        const { data, error } = await supabaseClient
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
        const { error } = await supabaseClient
            .from("survey_templates")
            .upsert([templateToRow(template)]);

        if (error) {
            console.error("Failed to upsert survey template", error);
            throw error;
        }
    }

    async delete(id: string, ownerEmail: string): Promise<void> {
        const { error } = await supabaseClient
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
        return supabaseConfigured;
    }
}

export class FallbackSurveyDraftStore implements SurveyDraftStore {
    constructor(
        private readonly primary: SurveyDraftStore | undefined,
        private readonly fallback: SurveyDraftStore
    ) { }

    async list(): Promise<SurveyDraft[]> {
        if (!this.primary || !this.primary.isConfigured()) {
            return this.fallback.list();
        }
        try {
            const drafts = await this.primary.list();
            if (drafts.length > 0) {
                return drafts;
            }

            const fallbackDrafts = await this.fallback.list();
            if (fallbackDrafts.length > 0) {
                console.warn("Primary draft store returned no rows; using in-memory fallback list.");
            }
            return fallbackDrafts;
        } catch (error) {
            console.error("Falling back to in-memory draft storage", error);
            return this.fallback.list();
        }
    }

    async get(id: string): Promise<SurveyDraft | undefined> {
        if (!this.primary || !this.primary.isConfigured()) {
            return this.fallback.get(id);
        }
        try {
            const draft = await this.primary.get(id);
            return draft ?? this.fallback.get(id);
        } catch (error) {
            console.error("Falling back to in-memory draft storage", error);
            return this.fallback.get(id);
        }
    }

    async upsert(draft: SurveyDraft): Promise<void> {
        await this.fallback.upsert(draft);
        if (!this.primary || !this.primary.isConfigured()) {
            return;
        }
        try {
            await this.primary.upsert(draft);
        } catch (error) {
            console.error("Primary draft store failed during upsert", error);
        }
    }

    async delete(id: string): Promise<void> {
        await this.fallback.delete(id);
        if (!this.primary || !this.primary.isConfigured()) {
            return;
        }
        try {
            await this.primary.delete(id);
        } catch (error) {
            console.error("Primary draft store failed during delete", error);
        }
    }

    isConfigured(): boolean {
        return true;
    }
}

export class FallbackPublishedSurveyStore implements PublishedSurveyStore {
    constructor(
        private readonly primary: PublishedSurveyStore | undefined,
        private readonly fallback: PublishedSurveyStore
    ) { }

    async list(): Promise<PublishedSurvey[]> {
        if (!this.primary || !this.primary.isConfigured()) {
            return this.fallback.list();
        }
        try {
            const surveys = await this.primary.list();
            if (surveys.length > 0) {
                return surveys;
            }

            const fallbackSurveys = await this.fallback.list();
            if (fallbackSurveys.length > 0) {
                console.warn("Primary published store returned no rows; using in-memory fallback list.");
            }
            return fallbackSurveys;
        } catch (error) {
            console.error("Falling back to in-memory published storage", error);
            return this.fallback.list();
        }
    }

    async get(id: string): Promise<PublishedSurvey | undefined> {
        if (!this.primary || !this.primary.isConfigured()) {
            return this.fallback.get(id);
        }
        try {
            const survey = await this.primary.get(id);
            return survey ?? this.fallback.get(id);
        } catch (error) {
            console.error("Falling back to in-memory published storage", error);
            return this.fallback.get(id);
        }
    }

    async upsert(survey: PublishedSurvey): Promise<void> {
        await this.fallback.upsert(survey);
        if (!this.primary || !this.primary.isConfigured()) {
            return;
        }
        try {
            await this.primary.upsert(survey);
        } catch (error) {
            console.error("Primary published store failed during upsert", error);
        }
    }

    async delete(id: string): Promise<void> {
        await this.fallback.delete(id);
        if (!this.primary || !this.primary.isConfigured()) {
            return;
        }
        try {
            await this.primary.delete(id);
        } catch (error) {
            console.error("Primary published store failed during delete", error);
        }
    }

    isConfigured(): boolean {
        return true;
    }
}
