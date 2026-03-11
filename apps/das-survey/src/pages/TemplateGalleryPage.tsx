import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { SurveyTemplateGallery, surveyTemplates } from "@digitalaidseattle/surveys";
import AppLayout from "../layouts/AppLayout";
import Sidebar from "../components/sidebars/Sidebar";

export default function TemplateGalleryPage() {
  const navigate = useNavigate();

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
      <Typography fontWeight={600} gutterBottom>
        Templates
      </Typography>
      <SurveyTemplateGallery
        templates={surveyTemplates}
        onSelectTemplate={(templateId) => navigate(`/surveys/create/${templateId}`)}
      />
    </AppLayout>
  );
}
