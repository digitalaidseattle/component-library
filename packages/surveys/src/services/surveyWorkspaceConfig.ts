import {
    LocalSurveyTemplateStore,
    PublishedSurveyStore,
    SurveyDraftStore,
    SurveyTemplateStore,
} from "./surveyStores";

export type SurveyWorkspacePersistence = {
    draftStore?: SurveyDraftStore;
    publishedSurveyStore?: PublishedSurveyStore;
    templateStore?: SurveyTemplateStore;
};

export type ResolvedSurveyWorkspacePersistence = {
    draftStore?: SurveyDraftStore;
    publishedSurveyStore?: PublishedSurveyStore;
    templateStore: SurveyTemplateStore;
};

const defaultTemplateStore = new LocalSurveyTemplateStore();

let configuredSurveyWorkspacePersistence: SurveyWorkspacePersistence = {};

export function configureSurveyWorkspacePersistence(
    persistence: SurveyWorkspacePersistence
): ResolvedSurveyWorkspacePersistence {
    configuredSurveyWorkspacePersistence = { ...persistence };
    return getSurveyWorkspacePersistence();
}

export function resetSurveyWorkspacePersistence(): void {
    configuredSurveyWorkspacePersistence = {};
}

export function getSurveyWorkspacePersistence(): ResolvedSurveyWorkspacePersistence {
    return {
        draftStore: configuredSurveyWorkspacePersistence.draftStore,
        publishedSurveyStore: configuredSurveyWorkspacePersistence.publishedSurveyStore,
        templateStore:
            configuredSurveyWorkspacePersistence.templateStore ?? defaultTemplateStore,
    };
}
