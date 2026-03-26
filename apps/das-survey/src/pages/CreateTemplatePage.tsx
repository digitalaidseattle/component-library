import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import {
  SurveyBuilder,
  createDefinition,
  createDraft,
  createUserSurveyTemplate,
  getCurrentDefinition,
  useSurveySession,
} from "@digitalaidseattle/surveys";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebars/Sidebar";
import AppLayout from "../layouts/AppLayout";

export default function CreateTemplatePage() {
  const navigate = useNavigate();
  const [draft, setDraft] = useState(() => createDraft("blank", createDefinition()));
  const { ownerKey, saveTemplate } = useSurveySession();

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Dashboard", path: "/" },
        { label: "Templates", path: "/surveys/new" },
        { label: "Create Template" },
      ]}
      sidebarContent={
        <Sidebar
          primaryAction={{
            label: "Templates",
            icon: <ArrowBackIcon />,
            onClick: () => navigate("/surveys/new"),
          }}
        />
      }
    >
      <SurveyBuilder
        draft={draft}
        onChange={setDraft}
        title="Template Builder"
        description="Build a reusable template and save it to your account."
        introSectionTitle="Template Details"
        titleFieldLabel="Template name"
        descriptionFieldLabel="Template description"
        primaryActionLabel="Save Template"
        primaryActionIcon={<SaveIcon />}
        onPrimaryAction={async (currentDraft) => {
          const definition = getCurrentDefinition(currentDraft);
          const template = createUserSurveyTemplate(
            definition.surveyTitle?.trim() || "Untitled template",
            definition.surveyDescription?.trim() || "Custom template",
            "Custom",
            definition,
            ownerKey ?? "local-dev"
          );

          await saveTemplate(template);
          navigate("/surveys/new");
        }}
      />
    </AppLayout>
  );
}
