import { Entity } from "@digitalaidseattle/core";
import { SupabaseEntityService } from "@digitalaidseattle/supabase";
import { supabaseConfigured } from "@digitalaidseattle/supabase";
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

const DRAFT_STORAGE_KEY = "survey-module:drafts";
const PUBLISHED_STORAGE_KEY = "survey-module:published";
const TEMPLATE_STORAGE_KEY = "survey-module:templates";

function loadLocal<T>(key: string): T[] {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T[] : [];
}

function saveLocal<T>(key: string, items: T[]) {
    localStorage.setItem(key, JSON.stringify(items));
}

function rowToDraft(row: SurveyDraftRow): SurveyDraft {
    return {
        id: row.id,
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
        status: draft.status,
        updated_at: new Date(draft.updatedAt),
        template_id: draft.templateId,
        history: draft.history,
        history_index: draft.historyIndex
    };
}

function rowToPublished(row: PublishedSurveyRow): PublishedSurvey {
    return {
        id: row.id,
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
        draft_id: survey.draftId,
        template_id: survey.templateId,
        title: survey.title,
        description: survey.description,
        questions: survey.questions,
        published_at: new Date(survey.publishedAt),
        updated_at: new Date(survey.updatedAt)
    };
}

export class LocalSurveyDraftStore implements SurveyDraftStore {
    list(): Promise<SurveyDraft[]> {
        return Promise.resolve(loadLocal<SurveyDraft>(DRAFT_STORAGE_KEY));
    }

    get(id: string): Promise<SurveyDraft | undefined> {
        return this.list().then((drafts) => drafts.find((draft) => draft.id === id));
    }

    upsert(draft: SurveyDraft): Promise<void> {
        const drafts = loadLocal<SurveyDraft>(DRAFT_STORAGE_KEY);
        const next = drafts.filter((existing) => existing.id !== draft.id);
        next.push(draft);
        saveLocal(DRAFT_STORAGE_KEY, next);
        return Promise.resolve();
    }

    delete(id: string): Promise<void> {
        saveLocal(DRAFT_STORAGE_KEY, loadLocal<SurveyDraft>(DRAFT_STORAGE_KEY).filter((draft) => draft.id !== id));
        return Promise.resolve();
    }

    isConfigured(): boolean {
        return true;
    }
}

export class LocalPublishedSurveyStore implements PublishedSurveyStore {
    list(): Promise<PublishedSurvey[]> {
        return Promise.resolve(loadLocal<PublishedSurvey>(PUBLISHED_STORAGE_KEY));
    }

    get(id: string): Promise<PublishedSurvey | undefined> {
        return this.list().then((items) => items.find((item) => item.id === id));
    }

    upsert(survey: PublishedSurvey): Promise<void> {
        const surveys = loadLocal<PublishedSurvey>(PUBLISHED_STORAGE_KEY);
        const next = surveys.filter((existing) => existing.id !== survey.id);
        next.push(survey);
        saveLocal(PUBLISHED_STORAGE_KEY, next);
        return Promise.resolve();
    }

    delete(id: string): Promise<void> {
        saveLocal(PUBLISHED_STORAGE_KEY, loadLocal<PublishedSurvey>(PUBLISHED_STORAGE_KEY).filter((survey) => survey.id !== id));
        return Promise.resolve();
    }

    isConfigured(): boolean {
        return true;
    }
}

export class LocalSurveyTemplateStore implements SurveyTemplateStore {
    list(ownerEmail: string): Promise<SurveyTemplate[]> {
        return Promise.resolve(
            loadLocal<SurveyTemplate>(TEMPLATE_STORAGE_KEY)
                .filter((template) => template.ownerEmail === ownerEmail)
                .sort((left, right) => (right.updatedAt ?? 0) - (left.updatedAt ?? 0))
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

        const templates = loadLocal<SurveyTemplate>(TEMPLATE_STORAGE_KEY);
        const next = templates.filter(
            (existing) =>
                existing.id !== template.id || existing.ownerEmail !== template.ownerEmail
        );

        next.push(template);
        saveLocal(TEMPLATE_STORAGE_KEY, next);
        return Promise.resolve();
    }


    delete(id: string, ownerEmail: string): Promise<void> {
        saveLocal(
            TEMPLATE_STORAGE_KEY,
            loadLocal<SurveyTemplate>(TEMPLATE_STORAGE_KEY).filter(
                (template) => template.id !== id || template.ownerEmail !== ownerEmail
            )
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
                console.warn("Primary draft store returned no rows; using local fallback list.");
            }
            return fallbackDrafts;
        } catch (error) {
            console.error("Falling back to local draft storage", error);
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
            console.error("Falling back to local draft storage", error);
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
                console.warn("Primary published store returned no rows; using local fallback list.");
            }
            return fallbackSurveys;
        } catch (error) {
            console.error("Falling back to local published storage", error);
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
            console.error("Falling back to local published storage", error);
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
