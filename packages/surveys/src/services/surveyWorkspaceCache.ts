import {
    PublishedSurvey,
    SurveyDraft,
    SurveyTemplate,
} from "./surveyModels";

type WorkspaceCache = {
    drafts: SurveyDraft[];
    publishedSurveys: PublishedSurvey[];
    templates: SurveyTemplate[];
};

const workspaceCache = new Map<string, WorkspaceCache>();

function getWorkspaceCache(ownerKey: string): WorkspaceCache {
    const existing = workspaceCache.get(ownerKey);
    if (existing) {
        return existing;
    }

    const next: WorkspaceCache = {
        drafts: [],
        publishedSurveys: [],
        templates: [],
    };
    workspaceCache.set(ownerKey, next);
    return next;
}

function upsertById<T extends { id: string }>(items: T[], item: T): T[] {
    return [...items.filter((existing) => existing.id !== item.id), item];
}

function resolveConfiguredOwnerKey(): string | undefined {
    const env = import.meta.env as Record<string, string | undefined>;
    const configuredOwnerKey =
        env.VITE_SURVEY_OWNER_KEY ??
        env.VITE_SURVEY_LOCAL_OWNER_KEY ??
        env.VITE_LOCAL_OWNER_KEY;

    return configuredOwnerKey?.trim() || undefined;
}

export function getLocalWorkspaceOwnerKey(): string {
    return resolveConfiguredOwnerKey() ?? "local-dev";
}

export function resolveSurveyOwnerKey(email?: string): string {
    return email?.trim() || getLocalWorkspaceOwnerKey();
}

export function loadCachedDrafts(ownerKey: string): SurveyDraft[] {
    return getWorkspaceCache(ownerKey).drafts;
}

export function saveCachedDrafts(ownerKey: string, drafts: SurveyDraft[]): void {
    getWorkspaceCache(ownerKey).drafts = drafts;
}

export function upsertCachedDraft(ownerKey: string, draft: SurveyDraft): SurveyDraft[] {
    const next = upsertById(loadCachedDrafts(ownerKey), draft);
    saveCachedDrafts(ownerKey, next);
    return next;
}

export function deleteCachedDraft(ownerKey: string, id: string): SurveyDraft[] {
    const next = loadCachedDrafts(ownerKey).filter((draft) => draft.id !== id);
    saveCachedDrafts(ownerKey, next);
    return next;
}

export function loadCachedPublishedSurveys(ownerKey: string): PublishedSurvey[] {
    return getWorkspaceCache(ownerKey).publishedSurveys;
}

export function saveCachedPublishedSurveys(
    ownerKey: string,
    surveys: PublishedSurvey[]
): void {
    getWorkspaceCache(ownerKey).publishedSurveys = surveys;
}

export function upsertCachedPublishedSurvey(
    ownerKey: string,
    survey: PublishedSurvey
): PublishedSurvey[] {
    const next = upsertById(loadCachedPublishedSurveys(ownerKey), survey);
    saveCachedPublishedSurveys(ownerKey, next);
    return next;
}

export function deleteCachedPublishedSurvey(
    ownerKey: string,
    id: string
): PublishedSurvey[] {
    const next = loadCachedPublishedSurveys(ownerKey).filter(
        (survey) => survey.id !== id
    );
    saveCachedPublishedSurveys(ownerKey, next);
    return next;
}

export function loadCachedTemplates(ownerKey: string): SurveyTemplate[] {
    return getWorkspaceCache(ownerKey).templates;
}

export function saveCachedTemplates(ownerKey: string, templates: SurveyTemplate[]): void {
    getWorkspaceCache(ownerKey).templates = templates;
}

export function upsertCachedTemplate(
    ownerKey: string,
    template: SurveyTemplate
): SurveyTemplate[] {
    const next = upsertById(loadCachedTemplates(ownerKey), template);
    saveCachedTemplates(ownerKey, next);
    return next;
}

export function deleteCachedTemplate(ownerKey: string, id: string): SurveyTemplate[] {
    const next = loadCachedTemplates(ownerKey).filter(
        (template) => template.id !== id
    );
    saveCachedTemplates(ownerKey, next);
    return next;
}
