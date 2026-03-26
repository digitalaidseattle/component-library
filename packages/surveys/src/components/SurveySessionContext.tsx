import { UserContext, UserContextType } from "@digitalaidseattle/core";
import { Box, CircularProgress } from "@mui/material";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import {
    PublishedSurvey,
    SurveyDraft,
    SurveyTemplate,
} from "../services";
import {
    SurveyWorkspaceSnapshot,
    bootstrapSurveyWorkspace,
    deleteSurveyTemplate,
    deleteSurveyWorkspaceEntry,
    publishSurveyDraft,
    saveSurveyDraft,
    saveSurveyTemplate,
} from "../services/surveyWorkspaceService";
import { resolveSurveyOwnerKey } from "../services/surveyWorkspaceCache";

type SurveySessionStatus = "loading" | "ready";

export type SurveySessionContextType = {
    status: SurveySessionStatus;
    ownerKey: string | null;
    drafts: SurveyDraft[];
    publishedSurveys: PublishedSurvey[];
    templates: SurveyTemplate[];
    refreshWorkspace: () => Promise<void>;
    saveDraft: (draft: SurveyDraft) => Promise<SurveyDraft>;
    publishDraft: (draft: SurveyDraft) => Promise<PublishedSurvey>;
    deleteSurvey: (id: string, status: "draft" | "active") => Promise<void>;
    saveTemplate: (template: SurveyTemplate) => Promise<SurveyTemplate>;
    deleteTemplate: (id: string) => Promise<void>;
};

const defaultContext: SurveySessionContextType = {
    status: "loading",
    ownerKey: null,
    drafts: [],
    publishedSurveys: [],
    templates: [],
    refreshWorkspace: async () => undefined,
    saveDraft: async (draft) => draft,
    publishDraft: async () => {
        throw new Error("Survey session is not ready.");
    },
    deleteSurvey: async () => undefined,
    saveTemplate: async (template) => template,
    deleteTemplate: async () => undefined,
};

export const SurveySessionContext =
    createContext<SurveySessionContextType>(defaultContext);

const DRAFT_SYNC_DELAY_MS = 1000;

function sortDrafts(drafts: SurveyDraft[]): SurveyDraft[] {
    return [...drafts].sort((left, right) => right.updatedAt - left.updatedAt);
}

function sortPublishedSurveys(surveys: PublishedSurvey[]): PublishedSurvey[] {
    return [...surveys].sort((left, right) => right.updatedAt - left.updatedAt);
}

function sortTemplates(templates: SurveyTemplate[]): SurveyTemplate[] {
    return [...templates].sort((left, right) => (right.updatedAt ?? 0) - (left.updatedAt ?? 0));
}

function upsertDraft(drafts: SurveyDraft[], draft: SurveyDraft): SurveyDraft[] {
    return sortDrafts([...drafts.filter((existing) => existing.id !== draft.id), draft]);
}

function upsertPublishedSurvey(
    surveys: PublishedSurvey[],
    survey: PublishedSurvey
): PublishedSurvey[] {
    return sortPublishedSurveys([
        ...surveys.filter((existing) => existing.id !== survey.id),
        survey,
    ]);
}

function upsertTemplate(
    templates: SurveyTemplate[],
    template: SurveyTemplate
): SurveyTemplate[] {
    return sortTemplates([
        ...templates.filter((existing) => existing.id !== template.id),
        template,
    ]);
}

export function SurveySessionProvider(props: { children: React.ReactNode }) {
    const { user } = useContext<UserContextType>(UserContext);
    const [status, setStatus] = useState<SurveySessionStatus>("loading");
    const [workspace, setWorkspace] = useState<SurveyWorkspaceSnapshot | null>(null);
    const draftSyncTimeouts = useRef<Map<string, ReturnType<typeof setTimeout>>>(
        new Map()
    );

    const ownerKey = resolveSurveyOwnerKey(user?.email);

    function clearDraftSyncTimer(draftId: string): void {
        const timeout = draftSyncTimeouts.current.get(draftId);
        if (!timeout) {
            return;
        }

        clearTimeout(timeout);
        draftSyncTimeouts.current.delete(draftId);
    }

    async function refreshWorkspace(): Promise<void> {
        setStatus("loading");
        const nextWorkspace = await bootstrapSurveyWorkspace(ownerKey);
        setWorkspace(nextWorkspace);
        setStatus("ready");
    }

    useEffect(() => {
        let cancelled = false;

        async function loadWorkspace() {
            setStatus("loading");
            const nextWorkspace = await bootstrapSurveyWorkspace(ownerKey);
            if (!cancelled) {
                setWorkspace(nextWorkspace);
                setStatus("ready");
            }
        }

        void loadWorkspace();

        return () => {
            cancelled = true;
        };
    }, [ownerKey]);

    useEffect(() => {
        return () => {
            draftSyncTimeouts.current.forEach((timeout) => clearTimeout(timeout));
            draftSyncTimeouts.current.clear();
        };
    }, [ownerKey]);

    async function persistDraft(draft: SurveyDraft): Promise<SurveyDraft> {
        const persistedDraft = await saveSurveyDraft(ownerKey, draft, {
            syncRemote: false,
        });
        setWorkspace((current) => {
            if (!current) {
                return current;
            }

            return {
                ...current,
                drafts: upsertDraft(current.drafts, persistedDraft),
            };
        });

        clearDraftSyncTimer(persistedDraft.id);
        draftSyncTimeouts.current.set(
            persistedDraft.id,
            setTimeout(() => {
                draftSyncTimeouts.current.delete(persistedDraft.id);
                void saveSurveyDraft(ownerKey, persistedDraft, { syncRemote: true });
            }, DRAFT_SYNC_DELAY_MS)
        );

        return persistedDraft;
    }

    async function handlePublishDraft(draft: SurveyDraft): Promise<PublishedSurvey> {
        clearDraftSyncTimer(draft.id);
        const publishedSurvey = await publishSurveyDraft(ownerKey, draft);

        setWorkspace((current) => {
            if (!current) {
                return current;
            }

            return {
                ...current,
                drafts: current.drafts.filter((existing) => existing.id !== draft.id),
                publishedSurveys: upsertPublishedSurvey(
                    current.publishedSurveys,
                    publishedSurvey
                ),
            };
        });

        return publishedSurvey;
    }

    async function handleDeleteSurvey(
        id: string,
        surveyStatus: "draft" | "active"
    ): Promise<void> {
        clearDraftSyncTimer(id);
        setWorkspace((current) => {
            if (!current) {
                return current;
            }

            return {
                ...current,
                drafts: current.drafts.filter((draft) => draft.id !== id),
                publishedSurveys:
                    surveyStatus === "active"
                        ? current.publishedSurveys.filter((survey) => survey.id !== id)
                        : current.publishedSurveys,
            };
        });

        await deleteSurveyWorkspaceEntry(ownerKey, id, surveyStatus);
    }

    async function persistTemplate(template: SurveyTemplate): Promise<SurveyTemplate> {
        const persistedTemplate = await saveSurveyTemplate(ownerKey, template);

        setWorkspace((current) => {
            if (!current) {
                return current;
            }

            return {
                ...current,
                templates: upsertTemplate(current.templates, persistedTemplate),
            };
        });

        return persistedTemplate;
    }

    async function handleDeleteTemplate(id: string): Promise<void> {
        setWorkspace((current) => {
            if (!current) {
                return current;
            }

            return {
                ...current,
                templates: current.templates.filter((template) => template.id !== id),
            };
        });

        await deleteSurveyTemplate(ownerKey, id);
    }

    return (
        <SurveySessionContext.Provider
            value={{
                status,
                ownerKey,
                drafts: workspace?.drafts ?? [],
                publishedSurveys: workspace?.publishedSurveys ?? [],
                templates: workspace?.templates ?? [],
                refreshWorkspace,
                saveDraft: persistDraft,
                publishDraft: handlePublishDraft,
                deleteSurvey: handleDeleteSurvey,
                saveTemplate: persistTemplate,
                deleteTemplate: handleDeleteTemplate,
            }}
        >
            {props.children}
        </SurveySessionContext.Provider>
    );
}

export function useSurveySession(): SurveySessionContextType {
    return useContext(SurveySessionContext);
}

function SurveySessionOutlet() {
    const { status } = useSurveySession();

    if (status === "loading") {
        return (
            <Box
                minHeight="100vh"
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <CircularProgress />
            </Box>
        );
    }

    return <Outlet />;
}

export function SurveySessionGate() {
    return (
        <SurveySessionProvider>
            <SurveySessionOutlet />
        </SurveySessionProvider>
    );
}
