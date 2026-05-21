import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useEffect, useRef, useState } from "react";
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

export default function CreateSurveyPage() {
  const navigate = useNavigate();
  const { draftId, templateId } = useParams<{
    draftId?: string;
    templateId?: string;
  }>();

  const [draft, setDraft] = useState<SurveyDraft | null>(null);
  const { drafts, templates, saveDraft, publishDraft } = useSurveySession();
  const initializedRouteKey = useRef<string | null>(null);

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
    void saveDraft(draft);
  }, [draft]);

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
          const published = await publishDraft(currentDraft);
          navigate(`/surveys/${published.id}/contacts`);
        }}
      />
    </AppLayout>
  );
}
