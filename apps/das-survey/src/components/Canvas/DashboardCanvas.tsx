import {
  Box,
  Chip,
  FormControl,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  SurveyCard,
  SurveyCardModel,
  toSurveyCardModel,
} from "@digitalaidseattle/surveys";
import { deleteSurvey, surveyDraftStore } from "../../surveyModule";

type StatusFilter = "all" | "active" | "draft";
type SortOrder = "recent" | "oldest";

export default function Content() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("recent");
  const [surveys, setSurveys] = useState<SurveyCardModel[]>([]);

  async function refreshSurveys() {
    const drafts = await surveyDraftStore.list();
    setSurveys(drafts.map(toSurveyCardModel));
  }

  useEffect(() => {
    void refreshSurveys();
  }, []);

  const filteredSurveys = surveys
    .filter((survey) =>
      statusFilter === "all" ? true : survey.status === statusFilter
    )
    .sort((left, right) =>
      sortOrder === "recent"
        ? right.lastOpened.getTime() - left.lastOpened.getTime()
        : left.lastOpened.getTime() - right.lastOpened.getTime()
    );

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          My Surveys
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage reusable survey drafts and published versions from one module dashboard.
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          backgroundColor: "background.paper",
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
          flexWrap="wrap"
        >
          <Stack direction="row" spacing={1}>
            <Chip
              label="All"
              clickable
              color={statusFilter === "all" ? "primary" : "default"}
              variant={statusFilter === "all" ? "filled" : "outlined"}
              onClick={() => setStatusFilter("all")}
            />
            <Chip
              label="Published"
              clickable
              color={statusFilter === "active" ? "primary" : "default"}
              variant={statusFilter === "active" ? "filled" : "outlined"}
              onClick={() => setStatusFilter("active")}
            />
            <Chip
              label="Drafts"
              clickable
              color={statusFilter === "draft" ? "primary" : "default"}
              variant={statusFilter === "draft" ? "filled" : "outlined"}
              onClick={() => setStatusFilter("draft")}
            />
          </Stack>

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <Select
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value as SortOrder)}
            >
              <MenuItem value="recent">Most recent</MenuItem>
              <MenuItem value="oldest">Oldest first</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      {filteredSurveys.length > 0 ? (
        <Box
          display="grid"
          gridTemplateColumns={{
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          }}
          gap={2}
        >
          {filteredSurveys.map((survey) => (
            <SurveyCard
              key={survey.id}
              survey={survey}
              onOpen={() =>
                navigate(
                  survey.status === "draft"
                    ? `/surveys/edit/${survey.id}`
                    : `/surveys/${survey.id}`
                )
              }
              onDelete={async () => {
                if (
                  survey.status === "active" &&
                  !window.confirm(
                    `Delete the published survey "${survey.title}"? This removes both the published survey and its draft.`
                  )
                ) {
                  return;
                }
                await deleteSurvey(survey.id, survey.status);
                await refreshSurveys();
              }}
            />
          ))}
        </Box>
      ) : (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: "center",
            backgroundColor: "background.paper",
            border: `1px dashed ${theme.palette.divider}`,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No surveys found
          </Typography>
          <Typography variant="body2" color="text.disabled">
            {statusFilter === "all"
              ? "Create a new survey to get started"
              : `No ${statusFilter} surveys yet`}
          </Typography>
        </Paper>
      )}
    </Box>
  );
}
