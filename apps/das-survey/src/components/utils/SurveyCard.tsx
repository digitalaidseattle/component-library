// src/components/SurveyCard.tsx

import {
  Box,
  Typography,
  Avatar,
  AvatarGroup,
  CardActionArea,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { styled, alpha } from "@mui/material/styles";
import type { Survey } from "../../models/MockSurveyData";

const CardRoot = styled("div", {
  shouldForwardProp: (prop) => prop !== "status",
})<{ status: Survey["status"] }>(({ theme, status }) => {
  const isActive = status === "active";

  return {
    height: "100%",
    borderRadius: theme.shape.borderRadius,

    /* Base border */
    border: `1px solid ${theme.palette.divider}`,

    /* Status indicator (left rail) */
    borderLeft: `4px solid ${
      isActive
        ? theme.palette.primary.main
        : theme.palette.divider
    }`,

    /* Background tint */
    backgroundColor: isActive
      ? alpha(theme.palette.primary.main, 0.06)
      : theme.palette.background.paper,

    transition: "all 0.2s ease",

    "&:hover": {
      backgroundColor: isActive
        ? alpha(theme.palette.primary.main, 0.1)
        : theme.palette.action.hover,
      boxShadow: theme.shadows[3],
      transform: "translateY(-2px)",
    },

    "&:hover .title": {
      textDecoration: "underline",
    },

    "&:hover .arrow": {
      opacity: 1,
      transform: "translateX(4px)",
    },

    "&:focus-visible": {
      outline: `3px solid ${theme.palette.primary.main}`,
      outlineOffset: 2,
    },
  };
});

export default function SurveyCard({ survey }: { survey: Survey }) {
  return (
    <CardRoot
      status={survey.status}
      tabIndex={0}
    >
      <CardActionArea sx={{ height: "100%", p: 3 }}>
        {/* Status */}
        <Typography
          variant="caption"
          fontWeight={600}
          color={
            survey.status === "active"
              ? "primary"
              : "text.secondary"
          }
        >
          {survey.status === "active" ? "Active" : "Draft"}
        </Typography>

        {/* Title + arrow */}
        <Box display="flex" alignItems="center" gap={1} mt={1}>
          <Typography
            variant="h6"
            className="title"
            sx={{ flexGrow: 1 }}
          >
            {survey.title}
          </Typography>

          <ArrowForwardIcon
            className="arrow"
            sx={{
              opacity: 0,
              transition: "all 0.2s ease",
              color: "text.secondary",
            }}
          />
        </Box>

        {/* Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mt: 1,
            mb: 3,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {survey.description}
        </Typography>

        {/* Footer */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mt="auto"
        >
          <Box display="flex" alignItems="center" gap={1}>
            <AvatarGroup max={3}>
              {survey.collaborators.map((c, i) => (
                <Avatar
                  key={i}
                  sx={{ width: 24, height: 24 }}
                >
                  {c.name[0]}
                </Avatar>
              ))}
            </AvatarGroup>

            <Typography variant="caption">
              {survey.collaborators.map((c) => c.name).join(", ")}
            </Typography>
          </Box>

          <Typography variant="caption" color="text.secondary">
            {survey.lastOpened.toLocaleDateString()}
          </Typography>
        </Box>
      </CardActionArea>
    </CardRoot>
  );
}