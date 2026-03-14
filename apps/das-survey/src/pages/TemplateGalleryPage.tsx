import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button, Stack, Typography } from "@mui/material";
import {
  SurveyTemplate,
  SurveyTemplateGallery,
  mergeSurveyTemplates,
  systemSurveyTemplates,
} from "@digitalaidseattle/surveys";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebars/Sidebar";
import AppLayout from "../layouts/AppLayout";
import { getTemplateOwnerKey, surveyTemplateStore } from "../surveyModule";

export default function TemplateGalleryPage() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<SurveyTemplate[]>(systemSurveyTemplates);

  async function refreshTemplates() {
    const ownerKey = await getTemplateOwnerKey();
    const userTemplates = await surveyTemplateStore.list(ownerKey);
    setTemplates(mergeSurveyTemplates(userTemplates));
  }

  useEffect(() => {
    let cancelled = false;

    void getTemplateOwnerKey()
      .then((ownerKey) => surveyTemplateStore.list(ownerKey))
      .then((userTemplates) => {
        if (!cancelled) {
          setTemplates(mergeSurveyTemplates(userTemplates));
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Dashboard", path: "/" },
        { label: "Templates" },
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
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography fontWeight={600}>
          Templates
        </Typography>
        <Button variant="contained" onClick={() => navigate("/templates/create")}>
          Create Template
        </Button>
      </Stack>

      <SurveyTemplateGallery
        templates={templates}
        onSelectTemplate={(templateId) => navigate(`/surveys/create/${templateId}`)}
        onDeleteTemplate={(templateId) => {
          void getTemplateOwnerKey()
            .then((ownerKey) => surveyTemplateStore.delete(templateId, ownerKey))
            .then(() => refreshTemplates());
        }}
      />
    </AppLayout>
  );
}
