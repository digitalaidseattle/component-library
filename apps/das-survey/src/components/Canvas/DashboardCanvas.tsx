import {
  Box,
  Chip,
  Typography,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { useMemo, useState } from "react";

import { loadDrafts } from "../../storage/DraftSurveyStorage";
import SurveyCard from "../utils/SurveyCard";

import { draftToCardModel } from "../../models/DraftToCardModel";
import type { SurveyCardModel } from "../../models/SurveyCardModel";


type StatusFilter = "all" | "active" | "draft";
type SortOrder = "recent" | "oldest";

export default function Content() {
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all");
  const [sortOrder, setSortOrder] =
    useState<SortOrder>("recent");

  const surveys: SurveyCardModel[] = useMemo(() => {
  return loadDrafts().map(draftToCardModel);
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
      <Typography variant="h5" fontWeight={600} gutterBottom>
        My Surveys
      </Typography>

      {/* Filters */}
      <Box display="flex" gap={1.5} mb={3} flexWrap="wrap">
        <Chip
          label="All"
          clickable
          color={statusFilter === "all" ? "primary" : "default"}
          onClick={() => setStatusFilter("all")}
        />
        <Chip
          label="Active"
          clickable
          color={statusFilter === "active" ? "primary" : "default"}
          onClick={() => setStatusFilter("active")}
        />
        <Chip
          label="Drafts"
          clickable
          color={statusFilter === "draft" ? "primary" : "default"}
          onClick={() => setStatusFilter("draft")}
        />

        <FormControl size="small" sx={{ ml: "auto", minWidth: 160 }}>
          <Select
            value={sortOrder}
            onChange={(e) =>
              setSortOrder(e.target.value as SortOrder)
            }
          >
            <MenuItem value="recent">Most recent</MenuItem>
            <MenuItem value="oldest">Oldest</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Grid */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(auto-fill, minmax(320px, 1fr))"
        gap={2}
      >
        {filteredSurveys.map((survey) => (
          <SurveyCard key={survey.id} survey={survey} />
        ))}
      </Box>
    </Box>
  );
}