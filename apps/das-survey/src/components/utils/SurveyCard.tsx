import {
  Box,
  Typography,
  Avatar,
  AvatarGroup,
  CardActionArea,
  IconButton,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { styled, alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

import { deleteDraft } from "../../storage/DraftSurveyStorage";
import type { SurveyCardModel } from "../../models/SurveyCardModel";

/* ---------- Styles ---------- */

const CardRoot = styled("div", {
  shouldForwardProp: (prop) => prop !== "status",
})<{ status: SurveyCardModel["status"] }>(({ theme, status }) => {
  const isActive = status === "active";

  return {
    height: "100%",
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`,
    borderLeft: `4px solid ${
      isActive
        ? theme.palette.primary.main
        : theme.palette.divider
    }`,
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
  };
});

/* ---------- Component ---------- */

export default function SurveyCard({
  survey,
}: {
  survey: SurveyCardModel;
}) {
  const navigate = useNavigate();

  function handleOpen() {
    if (survey.status === "draft") {
      navigate(`/surveys/edit/${survey.id}`);
    } else {
      navigate(`/surveys/${survey.id}`);
    }
  }

  return (
    <CardRoot status={survey.status}>
      <CardActionArea
        sx={{
          height: "100%",
          p: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        }}
        onClick={handleOpen}
      >
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

        {/* Title */}
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

        {/* ===== Blurb (survey description) ===== */}
        {survey.description ? (
          <Typography
            variant="body2"
            sx={{
              mt: 1,
              mb: 2,
              color: "text.secondary",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {survey.description}
          </Typography>
        ) : (
          <Typography
            variant="body2"
            sx={{
              mt: 1,
              mb: 2,
              fontStyle: "italic",
              color: "text.disabled",
            }}
          >
            No description yet
          </Typography>
        )}

        {/* Footer */}
        <Box
          mt="auto"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box display="flex" alignItems="center" gap={1}>
            {survey.collaborators && (
              <>
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
                  {survey.collaborators
                    .map((c) => c.name)
                    .join(", ")}
                </Typography>
              </>
            )}
          </Box>

          <Box display="flex" alignItems="center" gap={0.5}>
            <Typography
              variant="caption"
              color="text.secondary"
            >
              {survey.lastOpened.toLocaleDateString()}
            </Typography>

            {survey.status === "draft" && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteDraft(survey.id);
                  window.location.reload();
                }}
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        </Box>
      </CardActionArea>
    </CardRoot>
  );
}