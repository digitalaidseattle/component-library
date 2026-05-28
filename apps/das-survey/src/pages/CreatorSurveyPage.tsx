import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  SurveyBuilder,
  SurveyDraft,
  createDraft,
  getSurveyTemplate,
  mergeSurveyTemplates,
  useSurveySession,
} from "@digitalaidseattle/surveys";
import AppLayout from "../layouts/AppLayout";
import Sidebar from "../components/sidebars/Sidebar";

const DRAFT_AUTOSAVE_DELAY_MS = 700;

export default function CreateSurveyPage() {
  const navigate = useNavigate();
  const { draftId, templateId } = useParams<{
    draftId?: string;
    templateId?: string;
  }>();

  const [draft, setDraft] = useState<SurveyDraft | null>(null);
  const { drafts, templates, saveDraft, publishDraft } = useSurveySession();
  const initializedRouteKey = useRef<string | null>(null);
  const autosaveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingAutosaveDraft = useRef<SurveyDraft | null>(null);
  const saveDraftRef = useRef(saveDraft);

  useEffect(() => {
    saveDraftRef.current = saveDraft;
  }, [saveDraft]);

  const clearAutosaveTimeout = useCallback(() => {
    if (!autosaveTimeout.current) {
      return;
    }

    clearTimeout(autosaveTimeout.current);
    autosaveTimeout.current = null;
  }, []);

  useEffect(() => {
    const availableTemplates = mergeSurveyTemplates(templates);
    const selectedTemplate = getSurveyTemplate(availableTemplates, templateId);
    const routeKey = draftId ? `draft:${draftId}` : `template:${templateId ?? "blank"}`;

    if (draftId) {
      const existing = drafts.find((entry) => entry.id === draftId);
      if (initializedRouteKey.current === routeKey && draft?.id === existing?.id) {
        return;
      }

      setDraft(
        existing ??
          createDraft(
            selectedTemplate.id,
            structuredClone(selectedTemplate.definition)
          )
      );
      initializedRouteKey.current = routeKey;
      return;
    }

    if (initializedRouteKey.current === routeKey && draft) {
      return;
    }

    setDraft(
      createDraft(
        selectedTemplate.id,
        structuredClone(selectedTemplate.definition)
      )
    );
    initializedRouteKey.current = routeKey;
  }, [draft, draftId, drafts, templateId, templates]);

  useEffect(() => {
    if (!draft) {
      return;
    }

    pendingAutosaveDraft.current = draft;
    clearAutosaveTimeout();
    autosaveTimeout.current = setTimeout(() => {
      const draftToSave = pendingAutosaveDraft.current;
      pendingAutosaveDraft.current = null;
      autosaveTimeout.current = null;

      if (draftToSave) {
        void saveDraftRef.current(draftToSave);
      }
    }, DRAFT_AUTOSAVE_DELAY_MS);
  }, [clearAutosaveTimeout, draft]);

  useEffect(() => {
    return () => {
      clearAutosaveTimeout();

      if (pendingAutosaveDraft.current) {
        void saveDraftRef.current(pendingAutosaveDraft.current);
        pendingAutosaveDraft.current = null;
      }
    };
  }, [clearAutosaveTimeout]);

  if (!draft) {
    return null;
  }

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Dashboard", path: "/" },
        { label: draftId ? "Edit Survey" : "Create Survey" },
      ]}
      sidebarContent={
        <Sidebar
          primaryAction={{
            label: "Dashboard",
            icon: <ArrowBackIcon />,
            onClick: () => navigate("/"),
          }}
          onNavigate={navigate}
        />
      }
    >
      <SurveyBuilder
        draft={draft}
        onChange={setDraft}
        onPublish={async (currentDraft) => {
          clearAutosaveTimeout();
          pendingAutosaveDraft.current = null;
          const published = await publishDraft(currentDraft);
          navigate(`/surveys/${published.id}/contacts`);
        }}
      />
    </AppLayout>
  );
}
