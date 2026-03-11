import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  SurveyBuilder,
  SurveyDraft,
  createDraft,
  getSurveyTemplate,
} from "@digitalaidseattle/surveys";
import AppLayout from "../layouts/AppLayout";
import Sidebar from "../components/sidebars/Sidebar";
import { publishSurvey, surveyDraftStore } from "../surveyModule";

export default function CreateSurveyPage() {
  const navigate = useNavigate();
  const { draftId, templateId } = useParams<{
    draftId?: string;
    templateId?: string;
  }>();

  const selectedTemplate = useMemo(
    () => getSurveyTemplate(templateId),
    [templateId]
  );

  const [draft, setDraft] = useState<SurveyDraft | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadDraft() {
      if (draftId) {
        const existing = await surveyDraftStore.get(draftId);
        if (!cancelled) {
          setDraft(
            existing ??
              createDraft(
                selectedTemplate.id,
                structuredClone(selectedTemplate.definition)
              )
          );
        }
        return;
      }

      if (!cancelled) {
        setDraft(
          createDraft(
            selectedTemplate.id,
            structuredClone(selectedTemplate.definition)
          )
        );
      }
    }

    void loadDraft();

    return () => {
      cancelled = true;
    };
  }, [draftId, selectedTemplate]);

  useEffect(() => {
    if (!draft) {
      return;
    }
    void surveyDraftStore.upsert(draft);
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
        />
      }
    >
      <SurveyBuilder
        draft={draft}
        onChange={setDraft}
        onPublish={async (currentDraft) => {
          const published = await publishSurvey(currentDraft);
          navigate(`/surveys/${published.id}`);
        }}
      />
    </AppLayout>
  );
}
