import {
  Typography,
  Button,
  Paper,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";

type Props = {
  onUseTemplate: () => void;
};

export default function BlankTemplatePreview({
  onUseTemplate,
}: Props) {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        minHeight: 400,
        border: `2px dashed`,
        borderColor: "divider",
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        bgcolor: alpha(theme.palette.primary.main, 0.02),
        p: 4,
        transition: "all 0.2s ease",
        "&:hover": {
          borderColor: "primary.main",
          backgroundColor: alpha(theme.palette.primary.main, 0.04),
        },
      }}
    >
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Blank Template
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        mb={3}
        sx={{ maxWidth: 400 }}
      >
        Start with a clean slate. Build your survey step by step from the ground up.
      </Typography>

      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={onUseTemplate}
        sx={{
          px: 3,
          py: 1,
          fontWeight: 600,
        }}
      >
        Use This Template
      </Button>
    </Paper>
  );
}
