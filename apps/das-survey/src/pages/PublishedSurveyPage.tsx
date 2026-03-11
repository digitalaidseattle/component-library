import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PublishedSurvey, SurveyForm } from "@digitalaidseattle/surveys";
import AppLayout from "../layouts/AppLayout";
import Sidebar from "../components/sidebars/Sidebar";
import { publishedSurveyStore } from "../surveyModule";

export default function PublishedSurveyPage() {
  const navigate = useNavigate();
  const { surveyId } = useParams<{ surveyId: string }>();
  const [survey, setSurvey] = useState<PublishedSurvey | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadPublishedSurvey() {
      if (!surveyId) {
        return;
      }
      const record = await publishedSurveyStore.get(surveyId);
      if (!cancelled && record) {
        setSurvey(record);
      }
    }

    void loadPublishedSurvey();

    return () => {
      cancelled = true;
    };
  }, [surveyId]);

  if (!survey) {
    return null;
  }

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Dashboard", path: "/" },
        { label: survey.title },
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
      <SurveyForm
        definition={{
          surveyTitle: survey.title,
          surveyDescription: survey.description,
          questions: survey.questions,
        }}
      />
    </AppLayout>
  );
}
