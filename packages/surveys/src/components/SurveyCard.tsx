import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
    Avatar,
    AvatarGroup,
    Box,
    Card,
    CardActionArea,
    Chip,
    IconButton,
    Typography
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import React from "react";
import { SurveyCardModel } from "../services";

export const SurveyCard = ({
    survey,
    onOpen,
    onDelete
}: {
    survey: SurveyCardModel;
    onOpen?: () => void;
    onDelete?: () => Promise<void> | void;
}) => {
    const theme = useTheme();
    const isActive = survey.status === "active";

    return (
        <Card
            sx={{
                height: "100%",
                border: `1px solid ${theme.palette.divider}`,
                borderLeft: `4px solid ${isActive ? theme.palette.primary.main : theme.palette.divider}`,
                backgroundColor: isActive
                    ? alpha(theme.palette.primary.main, 0.06)
                    : theme.palette.background.paper,
                transition: "all 0.2s ease",
                "&:hover": {
                    backgroundColor: isActive
                        ? alpha(theme.palette.primary.main, 0.1)
                        : theme.palette.action.hover,
                    boxShadow: theme.shadows[3],
                    transform: "translateY(-2px)"
                }
            }}
        >
            <CardActionArea
                sx={{
                    height: "100%",
                    p: 3,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "stretch"
                }}
                onClick={onOpen}
            >
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Chip
                        label={isActive ? "Published" : "Draft"}
                        size="small"
                        color={isActive ? "primary" : "default"}
                        variant={isActive ? "filled" : "outlined"}
                        sx={{ fontWeight: 600 }}
                    />
                    <Chip label={`${survey.questionCount} questions`} size="small" variant="outlined" />
                </Box>

                <Box display="flex" alignItems="flex-start" gap={1} mb={1}>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        {survey.title}
                    </Typography>
                    <ArrowForwardIcon sx={{ color: "text.secondary", mt: 0.5, flexShrink: 0 }} />
                </Box>

                {survey.description ? (
                    <Typography
                        variant="body2"
                        sx={{
                            mb: 2,
                            color: "text.secondary",
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            lineHeight: 1.4
                        }}
                    >
                        {survey.description}
                    </Typography>
                ) : (
                    <Typography variant="body2" sx={{ mb: 2, fontStyle: "italic", color: "text.disabled" }}>
                        No description yet
                    </Typography>
                )}

                <Box mt="auto" display="flex" alignItems="center" justifyContent="space-between" gap={1}>
                    <Box display="flex" alignItems="center" gap={1} minWidth={0}>
                        {survey.collaborators && survey.collaborators.length > 0 && (
                            <>
                                <AvatarGroup max={3} sx={{ flexShrink: 0 }}>
                                    {survey.collaborators.map((collaborator, index) => (
                                        <Avatar
                                            key={`${collaborator.name}-${index}`}
                                            sx={{
                                                width: 24,
                                                height: 24,
                                                fontSize: "0.75rem",
                                                backgroundColor: theme.palette.primary.main
                                            }}
                                        >
                                            {collaborator.name[0].toUpperCase()}
                                        </Avatar>
                                    ))}
                                </AvatarGroup>
                                <Typography variant="caption" color="text.secondary" sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {survey.collaborators.map((collaborator) => collaborator.name).join(", ")}
                                </Typography>
                            </>
                        )}
                    </Box>

                    <Box display="flex" alignItems="center" gap={0.5} flexShrink={0}>
                        <Typography variant="caption" color="text.secondary">
                            {survey.lastOpened.toLocaleDateString()}
                        </Typography>
                        {onDelete && (
                            <IconButton
                                size="small"
                                onClick={async (event) => {
                                    event.stopPropagation();
                                    await onDelete();
                                }}
                            >
                                <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                        )}
                    </Box>
                </Box>
            </CardActionArea>
        </Card>
    );
};
