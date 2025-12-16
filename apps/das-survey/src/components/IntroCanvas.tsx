import {
  Box,
  Typography,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Switch,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import type { IntroChapter } from "../models/SurveyModel";

type IntroCanvasProps = {
  introChapter: IntroChapter;

  onUpdateSurveyTitle: (value: string) => void;
  onUpdateSurveyDescription: (value: string) => void;

  onUpdateParticipantLabel: (
    fieldType: "name" | "email" | "address",
    value: string
  ) => void;

  onUpdateParticipantRequired: (
    fieldType: "name" | "email" | "address",
    required: boolean
  ) => void;
};

function fieldDisplayName(
  type: "name" | "email" | "address"
) {
  if (type === "name") return "Name";
  if (type === "email") return "Email";
  return "Address";
}

function fieldExamplePlaceholder(
  type: "name" | "email" | "address"
) {
  if (type === "name") return "e.g., Jane Doe";
  if (type === "email") return "e.g., jane@example.com";
  return "e.g., 123 Main St, Seattle, WA";
}

export default function IntroCanvas({
  introChapter,
  onUpdateSurveyTitle,
  onUpdateSurveyDescription,
  onUpdateParticipantLabel,
  onUpdateParticipantRequired,
}: IntroCanvasProps) {
  const hasSurveyTitle =
    Boolean(introChapter.surveyIntro.title);
  const hasSurveyDescription =
    Boolean(introChapter.surveyIntro.description);

  return (
    <Box sx={{ maxWidth: 900 }}>
      {/* Survey Introduction */}
      {(hasSurveyTitle || hasSurveyDescription) && (
        <Box
          sx={{
            p: 3,
            mb: 4,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            backgroundColor: "background.paper",
          }}
        >
          <Typography
            fontWeight={600}
            gutterBottom
          >
            Survey Introduction
          </Typography>

          {hasSurveyTitle && (
            <TextField
              fullWidth
              label="Survey title"
              value={
                introChapter.surveyIntro.title
                  ?.value ?? ""
              }
              onChange={(e) =>
                onUpdateSurveyTitle(
                  e.target.value
                )
              }
              sx={{ mb: 2 }}
              InputProps={{
                sx: {
                  color: "text.primary",
                },
              }}
            />
          )}

          {hasSurveyDescription && (
            <TextField
              fullWidth
              multiline
              minRows={2}
              label="Brief introduction"
              value={
                introChapter.surveyIntro
                  .description?.value ?? ""
              }
              onChange={(e) =>
                onUpdateSurveyDescription(
                  e.target.value
                )
              }
              InputProps={{
                sx: {
                  color: "text.primary",
                },
              }}
            />
          )}
        </Box>
      )}

      {/* Participant Introduction */}
      <Box
        sx={{
          p: 3,
          border: "2px dashed",
          borderColor: "divider",
          borderRadius: 2,
        }}
      >
        <Typography
          fontWeight={600}
          gutterBottom
        >
          Participant Introduction
        </Typography>

        {introChapter.participantIntro.fields
          .length === 0 ? (
          <Typography color="text.secondary">
            No participant information requested yet.
          </Typography>
        ) : (
          <Box
            display="flex"
            flexDirection="column"
            gap={1.5}
          >
            {introChapter.participantIntro.fields.map(
              (field) => {
                const t = field.type;

                return (
                  <Accordion
                    key={t}
                    disableGutters
                    elevation={0}
                    sx={{
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 2,
                      backgroundColor:
                        "background.paper",
                      "&:before": {
                        display: "none",
                      },
                    }}
                  >
                    <AccordionSummary
                      expandIcon={
                        <ExpandMoreIcon />
                      }
                    >
                      <Box sx={{ width: "100%" }}>
                        <Typography
                          variant="overline"
                          color="text.secondary"
                        >
                          {fieldDisplayName(t)}
                        </Typography>

                        {/* Prompt preview (not filled) */}
                        <TextField
                          fullWidth
                          size="small"
                          placeholder={field.label}
                          value=""
                          inputProps={{
                            readOnly: true,
                          }}
                          sx={{ mt: 1 }}
                        />
                      </Box>
                    </AccordionSummary>

                    <AccordionDetails>
                      <Typography
                        variant="subtitle2"
                        gutterBottom
                      >
                        Prompt text
                      </Typography>

                      <TextField
                        fullWidth
                        size="small"
                        value={field.label}
                        onChange={(e) =>
                          onUpdateParticipantLabel(
                            t,
                            e.target.value
                          )
                        }
                        sx={{ mb: 2 }}
                      />

                      <Typography
                        variant="subtitle2"
                        gutterBottom
                      >
                        Example input
                      </Typography>

                      <TextField
                        fullWidth
                        size="small"
                        placeholder={fieldExamplePlaceholder(
                          t
                        )}
                        value=""
                        inputProps={{
                          readOnly: true,
                        }}
                        sx={{ mb: 2 }}
                      />

                      <FormControlLabel
                        control={
                          <Switch
                            checked={
                              field.required
                            }
                            onChange={(e) =>
                              onUpdateParticipantRequired(
                                t,
                                e.target.checked
                              )
                            }
                          />
                        }
                        label="Required"
                      />
                    </AccordionDetails>
                  </Accordion>
                );
              }
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}