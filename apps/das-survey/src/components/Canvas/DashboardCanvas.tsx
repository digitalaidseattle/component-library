import {
  Box,
  Chip,
  Typography,
  FormControl,
  Select,
  MenuItem,
  useTheme,
  Paper,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";

import { loadDrafts } from "../../storage/DraftSurveyStorage";
import SurveyCard from "../utils/SurveyCard";

import { draftToCardModel } from "../../models/DraftToCardModel";
import type { SurveyCardModel } from "../../models/SurveyCardModel";

type StatusFilter = "all" | "active" | "draft";
type SortOrder = "recent" | "oldest";

export default function Content() {
  const theme = useTheme();
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all");
  const [sortOrder, setSortOrder] =
    useState<SortOrder>("recent");
  const [surveys, setSurveys] = useState<SurveyCardModel[]>([]);

  async function refreshSurveys() {
    const drafts = await loadDrafts();
    setSurveys(drafts.map(draftToCardModel));
  }

  useEffect(() => {
    void refreshSurveys();
  }, []);

  const filteredSurveys = surveys
    .filter((s) =>
      statusFilter === "all" ? true : s.status === statusFilter
    )
    .sort((a, b) =>
      sortOrder === "recent"
        ? b.lastOpened.getTime() - a.lastOpened.getTime()
        : a.lastOpened.getTime() - b.lastOpened.getTime()
    );

  return (
    <Box>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          My Surveys
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage and create your surveys
        </Typography>
      </Box>

      {/* Filters Section */}
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
          {/* Status Filters */}
          <Stack direction="row" spacing={1}>
            <Chip
              label="All"
              clickable
              color={statusFilter === "all" ? "primary" : "default"}
              variant={statusFilter === "all" ? "filled" : "outlined"}
              onClick={() => setStatusFilter("all")}
              sx={{ fontWeight: 600 }}
            />
            <Chip
              label="Active"
              clickable
              color={statusFilter === "active" ? "primary" : "default"}
              variant={statusFilter === "active" ? "filled" : "outlined"}
              onClick={() => setStatusFilter("active")}
              sx={{ fontWeight: 600 }}
            />
            <Chip
              label="Drafts"
              clickable
              color={statusFilter === "draft" ? "primary" : "default"}
              variant={statusFilter === "draft" ? "filled" : "outlined"}
              onClick={() => setStatusFilter("draft")}
              sx={{ fontWeight: 600 }}
            />
          </Stack>

          {/* Sort Control */}
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <Select
              value={sortOrder}
              onChange={(e) =>
                setSortOrder(e.target.value as SortOrder)
              }
              sx={{ fontWeight: 500 }}
            >
              <MenuItem value="recent">Most recent</MenuItem>
              <MenuItem value="oldest">Oldest first</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      {/* Surveys Grid */}
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
              onDeleted={refreshSurveys}
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
