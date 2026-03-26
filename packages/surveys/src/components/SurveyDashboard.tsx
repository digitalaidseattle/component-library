import {
    Box,
    Chip,
    FormControl,
    MenuItem,
    Paper,
    Select,
    Stack,
    Typography,
} from "@mui/material";
import { useState } from "react";
import {
    PublishedSurvey,
    SurveyCardModel,
    SurveyDraft,
    toPublishedSurveyCardModel,
    toSurveyCardModel,
} from "../services";
import { SurveyCard } from "./SurveyCard";

type StatusFilter = "all" | "active" | "draft";
type SortOrder = "recent" | "oldest";

export function SurveyDashboard({
    drafts,
    publishedSurveys,
    ownerEmail,
    onOpenSurvey,
    onDeleteSurvey,
}: {
    drafts: SurveyDraft[];
    publishedSurveys: PublishedSurvey[];
    ownerEmail?: string;
    onOpenSurvey: (survey: SurveyCardModel) => void;
    onDeleteSurvey?: (survey: SurveyCardModel) => Promise<void> | void;
}) {
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
    const [sortOrder, setSortOrder] = useState<SortOrder>("recent");
    const surveys: SurveyCardModel[] = [
        ...drafts.map(toSurveyCardModel),
        ...publishedSurveys.map(toPublishedSurveyCardModel),
    ];

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
                    {ownerEmail
                        ? `Showing surveys and templates for ${ownerEmail}.`
                        : "Showing surveys and templates stored in this local workspace."}
                </Typography>
            </Box>

            <Paper
                elevation={0}
                sx={{
                    p: 2,
                    mb: 3,
                    backgroundColor: "background.paper",
                    border: (theme) => `1px solid ${theme.palette.divider}`,
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
                            onOpen={() => onOpenSurvey(survey)}
                            onDelete={
                                onDeleteSurvey
                                    ? async () => {
                                        await onDeleteSurvey(survey);
                                    }
                                    : undefined
                            }
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
                        border: (theme) => `1px dashed ${theme.palette.divider}`,
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
