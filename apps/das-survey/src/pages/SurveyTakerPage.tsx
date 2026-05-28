import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { saveSurveyResponse } from "@digitalaidseattle/resend";
import { SurveyForm } from "@digitalaidseattle/surveys";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { loadPublicSurvey, PublicSurveyRecord } from "../services/publicSurveyAccess";

export default function SurveyTakerPage() {
  const { surveyId, contactId } = useParams<{
    surveyId: string;
    contactId?: string;
  }>();
  const [survey, setSurvey] = useState<PublicSurveyRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!surveyId) {
      setLoading(false);
      return;
    }

    void loadPublicSurvey(surveyId)
      .then(setSurvey)
      .catch((error) => {
        setErrorMessage(error instanceof Error ? error.message : "Unable to load survey.");
      })
      .finally(() => setLoading(false));
  }, [surveyId]);

  async function handleSubmit(answers: Record<string, unknown>) {
    if (!surveyId) {
      return;
    }

    await saveSurveyResponse({
      ownerKey: survey?.ownerKey,
      surveyId,
      contactId,
      answers,
    });
    setSubmitted(true);
  }

  if (loading) {
    return (
      <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 6 } }}>
      <Stack gap={2}>
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

        {!survey && (
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Typography variant="h5" fontWeight={700} gutterBottom>
              Survey not found
            </Typography>
            <Typography color="text.secondary">
              This survey is not available from the configured public survey store.
            </Typography>
            {surveyId && (
              <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                Survey ID: {surveyId}
              </Typography>
            )}
          </Paper>
        )}

        {survey && submitted && (
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Typography variant="h5" fontWeight={700} gutterBottom>
              Response submitted
            </Typography>
            <Typography color="text.secondary">
              Thank you for taking the survey.
            </Typography>
          </Paper>
        )}

        {survey && !submitted && (
          <SurveyForm
            definition={{
              surveyTitle: survey.title,
              surveyDescription: survey.description,
              questions: survey.questions,
            }}
            onSubmit={handleSubmit}
          />
        )}
      </Stack>
    </Container>
  );
}
