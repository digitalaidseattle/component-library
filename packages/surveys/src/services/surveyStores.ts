import {
    PublishedSurvey,
    SurveyDraft,
    SurveyTemplate,
} from "./surveyModels";

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

const memoryDrafts = new Map<string, SurveyDraft>();
const memoryPublishedSurveys = new Map<string, PublishedSurvey>();
const memoryTemplates = new Map<string, SurveyTemplate[]>();

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
