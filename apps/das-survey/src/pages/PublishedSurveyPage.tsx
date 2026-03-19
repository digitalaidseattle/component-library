import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, Typography } from "@mui/material";
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
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadPublishedSurvey() {
      if (!surveyId) {
        if (!cancelled) {
          setLoaded(true);
        }
        return;
      }
      const record = await publishedSurveyStore.get(surveyId);
      if (!cancelled) {
        setSurvey(record ?? null);
        setLoaded(true);
      }
    }

    void loadPublishedSurvey();

    return () => {
      cancelled = true;
    };
  }, [surveyId]);

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
