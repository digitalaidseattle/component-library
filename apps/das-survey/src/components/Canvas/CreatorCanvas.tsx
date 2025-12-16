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
import type { ParticipantField, ParticipantFieldType } from "../../pages/CreatorSurveyPage";

type CreatorCanvasProps = {
  surveyTitle: string | null;
  surveyDescription: string | null;
  participantFields: ParticipantField[];

  onUpdateSurveyTitle: (value: string) => void;
  onUpdateSurveyDescription: (value: string) => void;
  onUpdateParticipantLabel: (
    type: ParticipantFieldType,
    value: string
  ) => void;
  onUpdateParticipantRequired: (
    type: ParticipantFieldType,
    required: boolean
  ) => void;
};

function fieldDisplayName(type: ParticipantFieldType) {
  if (type === "name") return "Name";
  if (type === "email") return "Email";
  return "Address";
}

export default function CreatorCanvas({
  surveyTitle,
  surveyDescription,
  participantFields,
  onUpdateSurveyTitle,
  onUpdateSurveyDescription,
  onUpdateParticipantLabel,
  onUpdateParticipantRequired,
}: CreatorCanvasProps) {
  return (
    <Box sx={{ maxWidth: 900, mx: "auto" }}>
      {(surveyTitle !== null || surveyDescription !== null) && (
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
          <Typography fontWeight={600} gutterBottom>
            Survey Introduction
          </Typography>

          {surveyTitle !== null && (
            <TextField
              fullWidth
              label="Survey title"
              value={surveyTitle}
              onChange={(e) => onUpdateSurveyTitle(e.target.value)}
              sx={{ mb: 2 }}
            />
          )}

          {surveyDescription !== null && (
            <TextField
              fullWidth
              multiline
              minRows={2}
              label="Brief introduction"
              value={surveyDescription}
              onChange={(e) => onUpdateSurveyDescription(e.target.value)}
            />
          )}
        </Box>
      )}

      <Box
        sx={{
          p: 3,
          border: "2px dashed",
          borderColor: "divider",
          borderRadius: 2,
        }}
      >
        <Typography fontWeight={600} gutterBottom>
          Participant Introduction
        </Typography>

        {participantFields.length === 0 ? (
          <Typography color="text.secondary">
            No participant information requested yet.
          </Typography>
        ) : (
          <Box display="flex" flexDirection="column" gap={1.5}>
            {participantFields.map((field) => (
              <Accordion
                key={field.type}
                disableGutters
                elevation={0}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  backgroundColor: "background.paper",
                  "&:before": { display: "none" },
                }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="overline" color="text.secondary">
                    {fieldDisplayName(field.type)}
                  </Typography>
                </AccordionSummary>

                <AccordionDetails>
                  <TextField
                    fullWidth
                    size="small"
                    label="Prompt text"
                    value={field.label}
                    onChange={(e) =>
                      onUpdateParticipantLabel(field.type, e.target.value)
                    }
                    sx={{ mb: 2 }}
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={field.required}
                        onChange={(e) =>
                          onUpdateParticipantRequired(
                            field.type,
                            e.target.checked
                          )
                        }
                      />
                    }
                    label="Required"
                  />
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}