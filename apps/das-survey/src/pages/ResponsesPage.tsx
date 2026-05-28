import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BarChartIcon from "@mui/icons-material/BarChart";
import CloseIcon from "@mui/icons-material/Close";
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";
import {
  listSurveyEmailRecipients,
  listSurveyResponses,
  SurveyEmailRecipient,
  SurveyResponse,
} from "@digitalaidseattle/resend";
import {
  PublishedSurvey,
  SurveyOption,
  SurveyQuestion,
  useSurveySession,
} from "@digitalaidseattle/surveys";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import Sidebar from "../components/sidebars/Sidebar";

type SortDirection = "asc" | "desc";
type OverviewSortKey =
  | "title"
  | "recipientCount"
  | "invitationCount"
  | "responseCount"
  | "responseRate"
  | "lastResponseAt";
type DetailSortKey =
  | "name"
  | "email"
  | "status"
  | "sentAt"
  | "submittedAt"
  | "responseCount";

type SurveySummary = {
  survey: PublishedSurvey;
  invitationCount: number;
  recipientCount: number;
  responseCount: number;
  responseRate: number;
  lastResponseAt?: number;
};

type RecipientSummary = {
  id: string;
  name?: string;
  email: string;
  status: SurveyEmailRecipient["status"] | "responded";
  sentAt?: number;
  submittedAt?: number;
  responseCount: number;
  responses: SurveyResponse[];
};

function formatDate(value?: number): string {
  return value ? new Date(value).toLocaleString() : "-";
}

function compareValues(left: string | number | undefined, right: string | number | undefined) {
  if (left === right) {
    return 0;
  }

  if (left === undefined || left === "") {
    return -1;
  }

  if (right === undefined || right === "") {
    return 1;
  }

  return left > right ? 1 : -1;
}

function getRecipientKey(recipient: SurveyEmailRecipient): string {
  return recipient.contactId || recipient.email;
}

function getResponseKey(response: SurveyResponse): string {
  return response.contactId || response.recipientId || response.respondentEmail || response.id;
}

function findOptionLabel(options: SurveyOption[], optionId: unknown): string {
  if (typeof optionId !== "string") {
    return optionId === undefined || optionId === null ? "-" : String(optionId);
  }

  return options.find((option) => option.id === optionId)?.label ?? optionId;
}

function formatAnswer(question: SurveyQuestion, answer: unknown): string {
  if (answer === undefined || answer === null || answer === "") {
    return "-";
  }

  switch (question.kind) {
    case "multipleChoice":
      return Array.isArray(answer)
        ? answer.map((value) => findOptionLabel(question.settings.options, value)).join(", ")
        : findOptionLabel(question.settings.options, answer);
    case "likert":
      return findOptionLabel(question.settings.options, answer);
    case "dropdown":
      return findOptionLabel(question.settings.options, answer);
    case "ranking":
      return Array.isArray(answer)
        ? answer
            .map((value, index) => `${index + 1}. ${findOptionLabel(question.settings.options, value)}`)
            .join("\n")
        : String(answer);
    case "matrix": {
      const matrixAnswer = answer as Record<string, string | string[]>;
      return question.settings.rows
        .map((row) => {
          const value = matrixAnswer?.[row.id];
          const formatted = Array.isArray(value)
            ? value.map((entry) => findOptionLabel(question.settings.columns, entry)).join(", ")
            : findOptionLabel(question.settings.columns, value);
          return `${row.label}: ${formatted}`;
        })
        .join("\n");
    }
    default:
      return String(answer);
  }
}

export default function ResponsesPage() {
  const navigate = useNavigate();
  const { surveyId } = useParams<{ surveyId?: string }>();
  const { ownerKey, publishedSurveys } = useSurveySession();
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [recipients, setRecipients] = useState<SurveyEmailRecipient[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [overviewSort, setOverviewSort] = useState<{
    key: OverviewSortKey;
    direction: SortDirection;
  }>({ key: "lastResponseAt", direction: "desc" });
  const [detailSort, setDetailSort] = useState<{
    key: DetailSortKey;
    direction: SortDirection;
  }>({ key: "submittedAt", direction: "desc" });
  const [selectedResponse, setSelectedResponse] = useState<SurveyResponse | null>(null);
  const survey = publishedSurveys.find((entry) => entry.id === surveyId);

  useEffect(() => {
    if (!ownerKey) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    void Promise.all([
      listSurveyResponses(ownerKey, surveyId),
      listSurveyEmailRecipients(ownerKey, surveyId),
    ])
      .then(([nextResponses, nextRecipients]) => {
        setResponses(nextResponses);
        setRecipients(nextRecipients);
      })
      .catch((error) => {
        setErrorMessage(
          error instanceof Error ? error.message : "Unable to load survey responses."
        );
      })
      .finally(() => setLoading(false));
  }, [ownerKey, surveyId]);

  const surveySummaries = useMemo(() => {
    const summaries = publishedSurveys.map((nextSurvey): SurveySummary => {
      const surveyRecipients = recipients.filter(
        (recipient) => recipient.surveyId === nextSurvey.id
      );
      const surveyResponses = responses.filter(
        (response) => response.surveyId === nextSurvey.id
      );
      const recipientKeys = new Set(surveyRecipients.map(getRecipientKey));
      const responseContactKeys = new Set(surveyResponses.map(getResponseKey));
      const recipientCount = new Set([...recipientKeys, ...responseContactKeys]).size;
      const lastResponseAt = surveyResponses.reduce<number | undefined>(
        (latest, response) =>
          latest === undefined || response.submittedAt > latest
            ? response.submittedAt
            : latest,
        undefined
      );

      return {
        survey: nextSurvey,
        invitationCount: surveyRecipients.length,
        recipientCount,
        responseCount: surveyResponses.length,
        responseRate: recipientCount > 0 ? surveyResponses.length / recipientCount : 0,
        lastResponseAt,
      };
    });

    return summaries.sort((left, right) => {
      const multiplier = overviewSort.direction === "asc" ? 1 : -1;
      const leftValue =
        overviewSort.key === "title" ? left.survey.title : left[overviewSort.key];
      const rightValue =
        overviewSort.key === "title" ? right.survey.title : right[overviewSort.key];

      return compareValues(leftValue, rightValue) * multiplier;
    });
  }, [overviewSort, publishedSurveys, recipients, responses]);

  const recipientSummaries = useMemo(() => {
    const summaries = new Map<string, RecipientSummary>();

    recipients.forEach((recipient) => {
      const key = getRecipientKey(recipient);
      const existing = summaries.get(key);
      const submittedAt = recipient.submittedAt ?? existing?.submittedAt;

      summaries.set(key, {
        id: key,
        name: recipient.name ?? existing?.name,
        email: recipient.email || existing?.email || "Unknown",
        status: recipient.status,
        sentAt: recipient.sentAt ?? existing?.sentAt,
        submittedAt,
        responseCount: existing?.responseCount ?? 0,
        responses: existing?.responses ?? [],
      });
    });

    responses.forEach((response) => {
      const key = getResponseKey(response);
      const existing = summaries.get(key);
      const nextResponses = [...(existing?.responses ?? []), response].sort(
        (left, right) => right.submittedAt - left.submittedAt
      );

      summaries.set(key, {
        id: key,
        name: response.respondentName ?? existing?.name,
        email: response.respondentEmail ?? existing?.email ?? "Unknown",
        status: existing?.status === "failed" ? "failed" : "responded",
        sentAt: existing?.sentAt,
        submittedAt: nextResponses[0]?.submittedAt,
        responseCount: nextResponses.length,
        responses: nextResponses,
      });
    });

    return [...summaries.values()].sort((left, right) => {
      const multiplier = detailSort.direction === "asc" ? 1 : -1;
      const leftValue = left[detailSort.key];
      const rightValue = right[detailSort.key];

      return compareValues(leftValue, rightValue) * multiplier;
    });
  }, [detailSort, recipients, responses]);

  function handleOverviewSort(key: OverviewSortKey) {
    setOverviewSort((current) => ({
      key,
      direction: current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  }

  function handleDetailSort(key: DetailSortKey) {
    setDetailSort((current) => ({
      key,
      direction: current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  }

  function overviewSortLabel(label: string, key: OverviewSortKey) {
    return (
      <TableSortLabel
        active={overviewSort.key === key}
        direction={overviewSort.key === key ? overviewSort.direction : "asc"}
        onClick={() => handleOverviewSort(key)}
      >
        {label}
      </TableSortLabel>
    );
  }

  function detailSortLabel(label: string, key: DetailSortKey) {
    return (
      <TableSortLabel
        active={detailSort.key === key}
        direction={detailSort.key === key ? detailSort.direction : "asc"}
        onClick={() => handleDetailSort(key)}
      >
        {label}
      </TableSortLabel>
    );
  }

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Dashboard", path: "/" },
        { label: survey ? `${survey.title} Responses` : "Responses" },
      ]}
      sidebarContent={
        <Sidebar
          primaryAction={{
            label: survey ? "All responses" : "Dashboard",
            icon: <ArrowBackIcon />,
            onClick: () => navigate(survey ? "/responses" : "/"),
          }}
          onNavigate={navigate}
        />
      }
    >
      <Stack gap={2}>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            {survey ? `${survey.title} Responses` : "Responses"}
          </Typography>
          <Typography color="text.secondary">
            {survey
              ? "Review who received this survey and who has responded."
              : "Track invitations and responses across your published surveys."}
          </Typography>
        </Box>

        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

        {loading ? (
          <Box display="flex" alignItems="center" justifyContent="center" py={8}>
            <CircularProgress />
          </Box>
        ) : survey ? (
          <Paper variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{detailSortLabel("Name", "name")}</TableCell>
                  <TableCell>{detailSortLabel("Email", "email")}</TableCell>
                  <TableCell>{detailSortLabel("Status", "status")}</TableCell>
                  <TableCell>{detailSortLabel("Sent", "sentAt")}</TableCell>
                  <TableCell>{detailSortLabel("Submitted", "submittedAt")}</TableCell>
                  <TableCell align="right">
                    {detailSortLabel("Responses", "responseCount")}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recipientSummaries.map((recipient) => (
                  <TableRow
                    key={recipient.id}
                    hover
                    onClick={() => {
                      if (recipient.responses[0]) {
                        setSelectedResponse(recipient.responses[0]);
                      }
                    }}
                    sx={{
                      cursor: recipient.responses[0] ? "pointer" : "default",
                    }}
                  >
                    <TableCell>{recipient.name || "Unnamed"}</TableCell>
                    <TableCell>{recipient.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={recipient.status}
                        size="small"
                        color={
                          recipient.status === "responded" ||
                          recipient.status === "submitted"
                            ? "success"
                            : recipient.status === "failed"
                              ? "error"
                              : "default"
                        }
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{formatDate(recipient.sentAt)}</TableCell>
                    <TableCell>{formatDate(recipient.submittedAt)}</TableCell>
                    <TableCell align="right">{recipient.responseCount}</TableCell>
                  </TableRow>
                ))}
                {recipientSummaries.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Typography color="text.secondary" py={2}>
                        No recipients or responses have been recorded for this survey yet.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Paper>
        ) : (
          <Paper variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{overviewSortLabel("Survey", "title")}</TableCell>
                  <TableCell align="right">
                    {overviewSortLabel("Receivers", "recipientCount")}
                  </TableCell>
                  <TableCell align="right">
                    {overviewSortLabel("Invitations", "invitationCount")}
                  </TableCell>
                  <TableCell align="right">
                    {overviewSortLabel("Responses", "responseCount")}
                  </TableCell>
                  <TableCell align="right">
                    {overviewSortLabel("Rate", "responseRate")}
                  </TableCell>
                  <TableCell>{overviewSortLabel("Last response", "lastResponseAt")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {surveySummaries.map((summary) => (
                  <TableRow
                    key={summary.survey.id}
                    hover
                    onClick={() => navigate(`/surveys/${summary.survey.id}/responses`)}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell>
                      <Stack direction="row" gap={1} alignItems="center">
                        <BarChartIcon fontSize="small" color="action" />
                        <Box>
                          <Typography fontWeight={700}>{summary.survey.title}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Published {formatDate(summary.survey.publishedAt)}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell align="right">{summary.recipientCount}</TableCell>
                    <TableCell align="right">{summary.invitationCount}</TableCell>
                    <TableCell align="right">{summary.responseCount}</TableCell>
                    <TableCell align="right">
                      {Math.round(summary.responseRate * 100)}%
                    </TableCell>
                    <TableCell>{formatDate(summary.lastResponseAt)}</TableCell>
                  </TableRow>
                ))}
                {surveySummaries.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Typography color="text.secondary" py={2}>
                        No published surveys are available yet.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Paper>
        )}

        <Dialog
          open={Boolean(selectedResponse && survey)}
          onClose={() => setSelectedResponse(null)}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle
            sx={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 2,
              pr: 1,
            }}
          >
            <Box>
              <Typography variant="h6" fontWeight={700}>
                {selectedResponse?.respondentName ||
                  selectedResponse?.respondentEmail ||
                  "Survey response"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Submitted {formatDate(selectedResponse?.submittedAt)}
              </Typography>
            </Box>
            <IconButton
              aria-label="Close response"
              onClick={() => setSelectedResponse(null)}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            {survey && selectedResponse && (
              <Stack gap={2} pb={1}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="h6" fontWeight={700}>
                    {survey.title}
                  </Typography>
                  {survey.description && (
                    <Typography color="text.secondary">{survey.description}</Typography>
                  )}
                </Paper>

                {survey.questions.map((question, index) => (
                  <Paper key={question.id} variant="outlined" sx={{ p: 2 }}>
                    <Stack gap={1}>
                      <Box>
                        <Typography fontWeight={700}>
                          {index + 1}. {question.title}
                        </Typography>
                        {question.description && (
                          <Typography variant="body2" color="text.secondary">
                            {question.description}
                          </Typography>
                        )}
                      </Box>
                      <Divider />
                      <Typography sx={{ whiteSpace: "pre-wrap" }}>
                        {formatAnswer(question, selectedResponse.answers[question.id])}
                      </Typography>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            )}
          </DialogContent>
        </Dialog>
      </Stack>
    </AppLayout>
  );
}
