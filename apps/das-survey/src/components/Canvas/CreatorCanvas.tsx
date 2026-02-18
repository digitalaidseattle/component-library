import {
  Box,
  Typography,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  FormControlLabel,
  Switch,
  Tabs,
  Tab,
  Divider,
  IconButton,
  useTheme,
  Paper,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";

import type {
  ParticipantField,
  ParticipantFieldType,
} from "../../pages/CreatorSurveyPage";

/* ---------- Props ---------- */

type CreatorCanvasProps = {
  surveyTitle: string | null;
  surveyDescription: string | null;
  participantFields: ParticipantField[];

  onAddParticipantField: (type: ParticipantFieldType) => void;
  onDeleteParticipantField: (type: ParticipantFieldType) => void;

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

/* ---------- Component ---------- */

export default function CreatorCanvas({
  surveyTitle,
  surveyDescription,
  participantFields,
  onAddParticipantField,
  onDeleteParticipantField,
  onUpdateSurveyTitle,
  onUpdateSurveyDescription,
  onUpdateParticipantLabel,
  onUpdateParticipantRequired,
}: CreatorCanvasProps) {
  const theme = useTheme();
  const [activeMode, setActiveMode] = useState(0); // Build only

  return (
    <Box sx={{ maxWidth: 1400, mx: "auto" }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "0", md: "280px 1fr" },
          minHeight: "calc(100vh - 200px)",
          gap: 0,
        }}
      >
        {/* ================= SIDE PANEL ================= */}
        <Box
          sx={{
            borderRight: "1px solid",
            borderColor: "divider",
            p: 2,
            backgroundColor: "background.paper",
            display: { xs: "none", md: "block" },
            overflowY: "auto",
          }}
        >
          <Tabs
            orientation="vertical"
            value={activeMode}
            onChange={(_, v) => setActiveMode(v)}
            sx={{
              mb: 3,
              "& .MuiTab-root": {
                alignItems: "flex-start",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.95rem",
              },
            }}
          >
            <Tab label="Build" />
            <Tab label="Style" disabled />
            <Tab label="Logic" disabled />
          </Tabs>

          <Divider sx={{ mb: 2 }} />

          {activeMode === 0 && (
            <SideSection title="Participant information">
              <SideButton
                label="Name"
                onClick={() => onAddParticipantField("name")}
                disabled={participantFields.some(
                  (f) => f.type === "name"
                )}
              />
              <SideButton
                label="Email"
                onClick={() =>
                  onAddParticipantField("email")
                }
                disabled={participantFields.some(
                  (f) => f.type === "email"
                )}
              />
              <SideButton
                label="Address"
                onClick={() =>
                  onAddParticipantField("address")
                }
                disabled={participantFields.some(
                  (f) => f.type === "address"
                )}
              />
            </SideSection>
          )}
        </Box>

        {/* ================= CANVAS ================= */}
        <Box sx={{ p: { xs: 2, sm: 3 }, overflowY: "auto" }}>
          {/* ---------- Survey introduction (ALWAYS EXISTS) ---------- */}
          <Paper
            elevation={0}
            sx={{
              position: "relative",
              p: 3,
              mb: 4,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              backgroundColor: "background.paper",
              borderTop: `4px solid ${theme.palette.primary.main}`,
            }}
          >
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Survey Introduction
            </Typography>

            <TextField
              fullWidth
              label="Survey title"
              value={surveyTitle ?? ""}
              onChange={(e) =>
                onUpdateSurveyTitle(e.target.value)
              }
              variant="outlined"
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              multiline
              minRows={2}
              label="Brief introduction"
              value={surveyDescription ?? ""}
              onChange={(e) =>
                onUpdateSurveyDescription(
                  e.target.value
                )
              }
              variant="outlined"
            />
          </Paper>

          {/* ---------- Participant information ---------- */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: "2px dashed",
              borderColor: "divider",
              borderRadius: 2,
              backgroundColor: "background.paper",
            }}
          >
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Participant Information
            </Typography>

            {participantFields.length === 0 ? (
              <Typography color="text.secondary" sx={{ py: 2 }}>
                Add fields from the <strong>Build</strong> panel to get
                started.
              </Typography>
            ) : (
              <Box display="flex" flexDirection="column" gap={2}>
                {participantFields.map((field) => {
                  const t = field.type;

                  return (
                    <Accordion
                      key={t}
                      disableGutters
                      elevation={0}
                      sx={{
                        position: "relative",
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 1,
                        backgroundColor: "background.paper",
                        "&:before": {
                          display: "none",
                        },
                        borderLeft: `4px solid ${theme.palette.secondary.main}`,
                      }}
                    >

                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                      >
                        <Box
                          sx={{
                            width: "100%",
                            display: "flex",
                            justifyContent:
                              "space-between",
                            alignItems: "flex-start",
                            gap: 2,
                          }}
                        >
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography
                              variant="overline"
                              color="text.secondary"
                            >
                              {fieldDisplayName(t)}
                            </Typography>

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

                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteParticipantField(
                                t
                              );
                            }}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
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
                              checked={field.required}
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
                })}
              </Box>
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}

/* ---------- Helpers ---------- */

function fieldDisplayName(type: ParticipantFieldType) {
  if (type === "name") return "Name";
  if (type === "email") return "Email";
  return "Address";
}

function fieldExamplePlaceholder(type: ParticipantFieldType) {
  if (type === "name") return "e.g., Jane Doe";
  if (type === "email")
    return "e.g., jane@example.com";
  return "e.g., 123 Main St, Seattle, WA";
}

function SideSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography
        variant="overline"
        color="text.secondary"
        sx={{ display: "block", mb: 1.5, fontWeight: 700, fontSize: "0.7rem" }}
      >
        {title}
      </Typography>
      <Box display="flex" flexDirection="column" gap={1}>
        {children}
      </Box>
    </Box>
  );
}

function SideButton({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <Button
      variant="outlined"
      size="small"
      onClick={onClick}
      disabled={disabled}
      startIcon={!disabled ? <AddIcon /> : undefined}
      sx={{
        justifyContent: "flex-start",
        textTransform: "none",
        fontWeight: 500,
      }}
    >
      {label}
    </Button>
  );
}