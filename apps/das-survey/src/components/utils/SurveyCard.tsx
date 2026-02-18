import {
  Box,
  Typography,
  Avatar,
  AvatarGroup,
  Card,
  CardActionArea,
  IconButton,
  useTheme,
  Chip,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

import { deleteDraft } from "../../storage/DraftSurveyStorage";
import type { SurveyCardModel } from "../../models/SurveyCardModel";

/* ---------- Component ---------- */

export default function SurveyCard({
  survey,
}: {
  survey: SurveyCardModel;
}) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isActive = survey.status === "active";

  function handleOpen() {
    if (survey.status === "draft") {
      navigate(`/surveys/edit/${survey.id}`);
    } else {
      navigate(`/surveys/${survey.id}`);
    }
  }

  return (
    <Card
      sx={{
        height: "100%",
        border: `1px solid ${theme.palette.divider}`,
        borderLeft: `4px solid ${
          isActive ? theme.palette.primary.main : theme.palette.divider
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
      }}
    >
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
        {/* Status Badge */}
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <Chip
            label={isActive ? "Active" : "Draft"}
            size="small"
            color={isActive ? "primary" : "default"}
            variant={isActive ? "filled" : "outlined"}
            sx={{ fontWeight: 600 }}
          />
        </Box>

        {/* Title */}
        <Box display="flex" alignItems="flex-start" gap={1} mb={1}>
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              transition: "all 0.2s ease",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            {survey.title}
          </Typography>

          <ArrowForwardIcon
            sx={{
              opacity: 0.5,
              transition: "all 0.2s ease",
              color: "text.secondary",
              mt: 0.5,
              flexShrink: 0,
            }}
          />
        </Box>

        {/* Description */}
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
              lineHeight: 1.4,
            }}
          >
            {survey.description}
          </Typography>
        ) : (
          <Typography
            variant="body2"
            sx={{
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
          gap={1}
        >
          <Box display="flex" alignItems="center" gap={1} minWidth={0}>
            {survey.collaborators && survey.collaborators.length > 0 && (
              <>
                <AvatarGroup max={3} sx={{ flexShrink: 0 }}>
                  {survey.collaborators.map((c, i) => (
                    <Avatar
                      key={i}
                      sx={{
                        width: 24,
                        height: 24,
                        fontSize: "0.75rem",
                        backgroundColor: theme.palette.primary.main,
                      }}
                    >
                      {c.name[0].toUpperCase()}
                    </Avatar>
                  ))}
                </AvatarGroup>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {survey.collaborators.map((c) => c.name).join(", ")}
                </Typography>
              </>
            )}
          </Box>

          <Box
            display="flex"
            alignItems="center"
            gap={0.5}
            flexShrink={0}
          >
            <Typography variant="caption" color="text.secondary">
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
                sx={{
                  opacity: 0.7,
                  "&:hover": {
                    opacity: 1,
                    color: "error.main",
                  },
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
}