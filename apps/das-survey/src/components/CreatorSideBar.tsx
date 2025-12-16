import {
  Box,
  Button,
  Typography,
  Divider,
} from "@mui/material";

export type CreatorSidebarProps = {
  hasSurveyTitle: boolean;
  hasSurveyDescription: boolean;

  hasParticipantName: boolean;
  hasParticipantEmail: boolean;
  hasParticipantAddress: boolean;

  onAddSurveyTitle: () => void;
  onAddSurveyDescription: () => void;
  onAddParticipantName: () => void;
  onAddParticipantEmail: () => void;
  onAddParticipantAddress: () => void;
};

export default function CreatorSidebar({
  hasSurveyTitle,
  hasSurveyDescription,
  hasParticipantName,
  hasParticipantEmail,
  hasParticipantAddress,
  onAddSurveyTitle,
  onAddSurveyDescription,
  onAddParticipantName,
  onAddParticipantEmail,
  onAddParticipantAddress,
}: CreatorSidebarProps) {
  return (
    <Box p={3}>
      {/* Tabs placeholder */}
      <Box
        display="flex"
        gap={3}
        mb={3}
        fontWeight={600}
      >
        <Typography color="primary">
          BUILD
        </Typography>
        <Typography color="text.secondary">
          STYLE
        </Typography>
        <Typography color="text.secondary">
          WORKFLOW
        </Typography>
      </Box>

      {/* Survey Introduction */}
      <Typography
        fontWeight={600}
        gutterBottom
      >
        Survey Introduction
      </Typography>

      <Button
        fullWidth
        variant="outlined"
        sx={{ mb: 1 }}
        disabled={hasSurveyTitle}
        onClick={onAddSurveyTitle}
      >
        Add survey title
      </Button>

      <Button
        fullWidth
        variant="outlined"
        disabled={hasSurveyDescription}
        onClick={onAddSurveyDescription}
      >
        Add brief introduction
      </Button>

      <Divider sx={{ my: 3 }} />

      {/* Participant Introduction */}
      <Typography
        fontWeight={600}
        gutterBottom
      >
        Participant Introduction
      </Typography>

      <Button
        fullWidth
        variant="outlined"
        sx={{ mb: 1 }}
        disabled={hasParticipantName}
        onClick={onAddParticipantName}
      >
        Ask for name
      </Button>

      <Button
        fullWidth
        variant="outlined"
        sx={{ mb: 1 }}
        disabled={hasParticipantEmail}
        onClick={onAddParticipantEmail}
      >
        Ask for email
      </Button>

      <Button
        fullWidth
        variant="outlined"
        disabled={hasParticipantAddress}
        onClick={onAddParticipantAddress}
      >
        Ask for address
      </Button>
    </Box>
  );
}