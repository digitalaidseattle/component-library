import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button, Stack, Typography } from "@mui/material";
import {
  SurveyTemplate,
  SurveyTemplateGallery,
  mergeSurveyTemplates,
  useSurveySession,
} from "@digitalaidseattle/surveys";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebars/Sidebar";
import AppLayout from "../layouts/AppLayout";

export default function TemplateGalleryPage() {
  const navigate = useNavigate();
  const { templates, deleteTemplate } = useSurveySession();
  const availableTemplates: SurveyTemplate[] = mergeSurveyTemplates(templates);

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
        templates={availableTemplates}
        onSelectTemplate={(templateId) => navigate(`/surveys/create/${templateId}`)}
        onDeleteTemplate={(templateId) => {
          void deleteTemplate(templateId);
        }}
      />
    </AppLayout>
  );
}
