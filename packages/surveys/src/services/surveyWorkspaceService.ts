import {
    PublishedSurveyStore,
    SurveyDraftStore,
    SurveyTemplateStore,
} from "./surveyStores";
import {
    PublishedSurvey,
    SurveyDraft,
    SurveyTemplate,
    publishDraft,
} from "./surveyModels";
import {
    deleteCachedDraft,
    deleteCachedPublishedSurvey,
    deleteCachedTemplate,
    loadCachedDrafts,
    loadCachedPublishedSurveys,
    loadCachedTemplates,
    saveCachedDrafts,
    saveCachedPublishedSurveys,
    saveCachedTemplates,
    upsertCachedDraft,
    upsertCachedPublishedSurvey,
    upsertCachedTemplate,
} from "./surveyWorkspaceCache";
import { getSurveyWorkspacePersistence } from "./surveyWorkspaceConfig";

export type SurveyWorkspaceSnapshot = {
    ownerKey: string;
    drafts: SurveyDraft[];
    publishedSurveys: PublishedSurvey[];
    templates: SurveyTemplate[];
};

type SaveDraftOptions = {
    syncRemote?: boolean;
};
type OwnableEntity = {
    created_by?: string;
    created_at?: Date;
    updated_by?: string;
    updated_at?: Date;
};

function sortDrafts(drafts: SurveyDraft[]): SurveyDraft[] {
    return [...drafts].sort((left, right) => right.updatedAt - left.updatedAt);
}

function sortPublishedSurveys(surveys: PublishedSurvey[]): PublishedSurvey[] {
    return [...surveys].sort((left, right) => right.updatedAt - left.updatedAt);
}

function sortTemplates(templates: SurveyTemplate[]): SurveyTemplate[] {
    return [...templates].sort((left, right) => (right.updatedAt ?? 0) - (left.updatedAt ?? 0));
}

function resolveWorkspaceItems<T>(
    remoteItems: T[],
    cachedItems: T[],
    itemLabel: string
): T[] {
    if (remoteItems.length > 0 || cachedItems.length === 0) {
        return remoteItems;
    }

    console.warn(
        `The configured provider returned no owned ${itemLabel}; preserving cached workspace items instead.`
    );
    return cachedItems;
}

function ownsEntity(entity: OwnableEntity, ownerKey: string): boolean {
    return entity.created_by === ownerKey || entity.updated_by === ownerKey;
}

function stampOwnership<T extends OwnableEntity>(entity: T, ownerKey: string): T {
    return {
        ...entity,
        created_by: entity.created_by ?? ownerKey,
        created_at: entity.created_at ?? new Date(),
        updated_by: ownerKey,
        updated_at: new Date(),
    };
}

async function loadTemplates(
    templateStore: SurveyTemplateStore,
    ownerKey: string
): Promise<SurveyTemplate[]> {
    const templates = await templateStore.list(ownerKey);
    saveCachedTemplates(ownerKey, templates);
    return sortTemplates(templates);
}

export async function bootstrapSurveyWorkspace(
    ownerKey: string
): Promise<SurveyWorkspaceSnapshot> {
    const {
        draftStore,
        publishedSurveyStore,
        templateStore,
    } = getSurveyWorkspacePersistence();
    const cachedDrafts = sortDrafts(loadCachedDrafts(ownerKey));
    const cachedPublishedSurveys = sortPublishedSurveys(
        loadCachedPublishedSurveys(ownerKey)
    );
    const cachedTemplates = sortTemplates(loadCachedTemplates(ownerKey));

    if (!draftStore || !publishedSurveyStore) {
        const templates = await loadTemplates(templateStore, ownerKey).catch(() => cachedTemplates);
        return {
            ownerKey,
            drafts: cachedDrafts,
            publishedSurveys: cachedPublishedSurveys,
            templates,
        };
    }

    try {
        const [remoteDrafts, remotePublishedSurveys, templates] = await Promise.all([
            draftStore.list(),
            publishedSurveyStore.list(),
            loadTemplates(templateStore, ownerKey),
        ]);

        const ownedDrafts = sortDrafts(
            remoteDrafts.filter((draft) => ownsEntity(draft, ownerKey))
        );
        const ownedPublishedSurveys = sortPublishedSurveys(
            remotePublishedSurveys.filter((survey) => ownsEntity(survey, ownerKey))
        );
        const resolvedDrafts = resolveWorkspaceItems(
            ownedDrafts,
            cachedDrafts,
            "drafts"
        );
        const resolvedPublishedSurveys = resolveWorkspaceItems(
            ownedPublishedSurveys,
            cachedPublishedSurveys,
            "published surveys"
        );

        saveCachedDrafts(ownerKey, resolvedDrafts);
        saveCachedPublishedSurveys(ownerKey, resolvedPublishedSurveys);

        return {
            ownerKey,
            drafts: resolvedDrafts,
            publishedSurveys: resolvedPublishedSurveys,
            templates,
        };
    } catch (error) {
        console.error("Unable to bootstrap survey workspace from the configured provider", error);
        return {
            ownerKey,
            drafts: cachedDrafts,
            publishedSurveys: cachedPublishedSurveys,
            templates: cachedTemplates,
        };
    }
}

export async function saveSurveyDraft(
    ownerKey: string,
    draft: SurveyDraft,
    options: SaveDraftOptions = {}
): Promise<SurveyDraft> {
    const { draftStore } = getSurveyWorkspacePersistence();
    const nextDraft = stampOwnership(draft, ownerKey);
    upsertCachedDraft(ownerKey, nextDraft);

    if (!draftStore || options.syncRemote === false) {
        return nextDraft;
    }

    try {
        await draftStore.upsert(nextDraft);
    } catch (error) {
        console.error("Unable to sync survey draft to the configured provider", error);
    }

    return nextDraft;
}

export async function publishSurveyDraft(
    ownerKey: string,
    draft: SurveyDraft
): Promise<PublishedSurvey> {
    const { draftStore, publishedSurveyStore } = getSurveyWorkspacePersistence();
    const stampedDraft = stampOwnership(draft, ownerKey);
    const result = publishDraft(stampedDraft);
    const publishedSurvey = stampOwnership(result.published, ownerKey);

    deleteCachedDraft(ownerKey, draft.id);
    upsertCachedPublishedSurvey(ownerKey, publishedSurvey);

    if (!draftStore || !publishedSurveyStore) {
        return publishedSurvey;
    }

    try {
        await Promise.all([
            publishedSurveyStore.upsert(publishedSurvey),
            draftStore.delete(draft.id),
        ]);
    } catch (error) {
        console.error("Unable to publish survey to the configured provider", error);
    }

    return publishedSurvey;
}

export async function deleteSurveyWorkspaceEntry(
    ownerKey: string,
    id: string,
    status: "draft" | "active"
): Promise<void> {
    const { draftStore, publishedSurveyStore } = getSurveyWorkspacePersistence();
    deleteCachedDraft(ownerKey, id);

    if (status === "active") {
        deleteCachedPublishedSurvey(ownerKey, id);
    }

    if (!draftStore) {
        return;
    }

    try {
        await draftStore.delete(id);
    } catch (error) {
        console.error("Unable to delete draft from the configured provider", error);
    }

    if (status !== "active" || !publishedSurveyStore) {
        return;
    }

    try {
        await publishedSurveyStore.delete(id);
    } catch (error) {
        console.error("Unable to delete published survey from the configured provider", error);
    }
}

export async function saveSurveyTemplate(
    ownerKey: string,
    template: SurveyTemplate
): Promise<SurveyTemplate> {
    const { templateStore } = getSurveyWorkspacePersistence();
    const nextTemplate = {
        ...template,
        ownerEmail: ownerKey,
        updatedAt: template.updatedAt ?? Date.now(),
    };

    upsertCachedTemplate(ownerKey, nextTemplate);
    await templateStore.upsert(nextTemplate);
    return nextTemplate;
}

export async function deleteSurveyTemplate(
    ownerKey: string,
    id: string
): Promise<void> {
    const { templateStore } = getSurveyWorkspacePersistence();
    deleteCachedTemplate(ownerKey, id);
    await templateStore.delete(id, ownerKey);
}
