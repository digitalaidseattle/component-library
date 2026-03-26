import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PublishedSurvey, SurveyPage, useSurveySession } from "@digitalaidseattle/surveys";
import AppLayout from "../layouts/AppLayout";
import Sidebar from "../components/sidebars/Sidebar";

export default function PublishedSurveyPage() {
  const navigate = useNavigate();
  const { surveyId } = useParams<{ surveyId: string }>();
  const { publishedSurveys } = useSurveySession();
  const [survey, setSurvey] = useState<PublishedSurvey | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!surveyId) {
      setLoaded(true);
      return;
    }

    const record = publishedSurveys.find((entry) => entry.id === surveyId);
    setSurvey(record ?? null);
    setLoaded(true);
  }, [publishedSurveys, surveyId]);

  if (!loaded) {
    return null;
  }

  if (!survey) {
    return (
      <AppLayout
        breadcrumbs={[
          { label: "Dashboard", path: "/" },
          { label: "Survey not found" },
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
        <Box>
          <Typography variant="h5" gutterBottom>
            Published survey not found
          </Typography>
          <Typography color="text.secondary">
            The survey was not available from the configured data store.
          </Typography>
        </Box>
      </AppLayout>
    );
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
      <SurveyPage
        definition={{
          surveyTitle: survey.title,
          surveyDescription: survey.description,
          questions: survey.questions,
        }}
      />
    </AppLayout>
  );
}
