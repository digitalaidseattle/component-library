import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Box,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  listSurveyEmailRecipients,
  listSurveyResponses,
  SurveyEmailRecipient,
  SurveyResponse,
} from "@digitalaidseattle/resend";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSurveySession } from "@digitalaidseattle/surveys";
import AppLayout from "../layouts/AppLayout";
import Sidebar from "../components/sidebars/Sidebar";

export default function ResponsesPage() {
  const navigate = useNavigate();
  const { surveyId } = useParams<{ surveyId?: string }>();
  const { ownerKey, publishedSurveys } = useSurveySession();
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [recipients, setRecipients] = useState<SurveyEmailRecipient[]>([]);
  const survey = publishedSurveys.find((entry) => entry.id === surveyId);

  useEffect(() => {
    if (!ownerKey) {
      return;
    }

    void Promise.all([
      listSurveyResponses(ownerKey, surveyId),
      listSurveyEmailRecipients(ownerKey, surveyId),
    ]).then(([nextResponses, nextRecipients]) => {
      setResponses(nextResponses);
      setRecipients(nextRecipients);
    });
  }, [ownerKey, surveyId]);

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Dashboard", path: "/" },
        { label: survey ? `${survey.title} Responses` : "Responses" },
      ]}
      sidebarContent={
        <Sidebar
          primaryAction={{
            label: "Dashboard",
            icon: <ArrowBackIcon />,
            onClick: () => navigate("/"),
          }}
          onNavigate={navigate}
        />
      }
    >
      <Stack gap={2}>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Responses
          </Typography>
          <Typography color="text.secondary">
            Review submissions and delivery state for survey invitations.
          </Typography>
        </Box>

        <Stack direction={{ xs: "column", md: "row" }} gap={2}>
          <Paper variant="outlined" sx={{ p: 2, flex: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Responses
            </Typography>
            <Typography variant="h4" fontWeight={700}>
              {responses.length}
            </Typography>
          </Paper>
          <Paper variant="outlined" sx={{ p: 2, flex: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Invitations
            </Typography>
            <Typography variant="h4" fontWeight={700}>
              {recipients.length}
            </Typography>
          </Paper>
          <Paper variant="outlined" sx={{ p: 2, flex: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Submitted recipients
            </Typography>
            <Typography variant="h4" fontWeight={700}>
              {recipients.filter((recipient) => recipient.status === "submitted").length}
            </Typography>
          </Paper>
        </Stack>

        <Paper variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Submitted</TableCell>
                <TableCell>Respondent</TableCell>
                <TableCell>Answers</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {responses.map((response) => (
                <TableRow key={response.id} hover>
                  <TableCell>{new Date(response.submittedAt).toLocaleString()}</TableCell>
                  <TableCell>
                    {response.respondentName ||
                      response.respondentEmail ||
                      response.contactId ||
                      "Anonymous"}
                  </TableCell>
                  <TableCell>
                    <Typography
                      component="pre"
                      variant="caption"
                      sx={{ whiteSpace: "pre-wrap", m: 0, fontFamily: "monospace" }}
                    >
                      {JSON.stringify(response.answers, null, 2)}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
              {responses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3}>
                    <Typography color="text.secondary" py={2}>
                      No responses have been submitted yet.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>

        <Paper variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Email</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Survey link</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recipients.map((recipient) => (
                <TableRow key={recipient.id} hover>
                  <TableCell>{recipient.email}</TableCell>
                  <TableCell>
                    <Chip label={recipient.status} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>{recipient.surveyUrl}</TableCell>
                </TableRow>
              ))}
              {recipients.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3}>
                    <Typography color="text.secondary" py={2}>
                      No invitations have been prepared for this view.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      </Stack>
    </AppLayout>
  );
}
