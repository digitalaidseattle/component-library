import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import {
  SurveyBuilder,
  createDefinition,
  createDraft,
  createUserSurveyTemplate,
  getCurrentDefinition,
} from "@digitalaidseattle/surveys";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebars/Sidebar";
import AppLayout from "../layouts/AppLayout";
import { getTemplateOwnerKey, surveyTemplateStore } from "../surveyModule";

export default function CreateTemplatePage() {
  const navigate = useNavigate();
  const [draft, setDraft] = useState(() => createDraft("blank", createDefinition()));

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
          const ownerKey = await getTemplateOwnerKey();
          const definition = getCurrentDefinition(currentDraft);
          const template = createUserSurveyTemplate(
            definition.surveyTitle?.trim() || "Untitled template",
            definition.surveyDescription?.trim() || "Custom template",
            "Custom",
            definition,
            ownerKey
          );

          await surveyTemplateStore.upsert(template);
          navigate("/surveys/new");
        }}
      />
    </AppLayout>
  );
}
