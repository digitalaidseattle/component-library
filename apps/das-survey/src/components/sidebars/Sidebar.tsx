import {
  Box,
  Button,
  Card,
  CardActionArea,
  Typography,
  useTheme,
  Divider,
} from "@mui/material";
import { alpha } from "@mui/material/styles";

export type SidebarPrimaryAction = {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
};

export default function Sidebar({
  primaryAction,
}: {
  primaryAction: SidebarPrimaryAction;
}) {
  const theme = useTheme();

  const cards = [
    { title: "Contacts", subtitle: "People you commonly survey" },
    { title: "Responses", subtitle: "View and export survey answers" },
    { title: "Tasks", subtitle: "Internal follow-ups and reminders" },
    { title: "Settings", subtitle: "Organization preferences" },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
      }}
    >
      <Box sx={{ p: 2 }}>
        {/* Primary action button */}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          startIcon={primaryAction.icon}
          onClick={primaryAction.onClick}
          sx={{
            mb: 3,
            py: 1.5,
            fontSize: "1rem",
            fontWeight: 600,
            borderRadius: 1,
            "&:hover": {
              boxShadow: theme.shadows[4],
            },
          }}
        >
          {primaryAction.label}
        </Button>

        <Divider sx={{ mb: 2 }} />
      </Box>

      {/* Navigation Cards */}
      <CenteredCards>
        <Box sx={{ px: 2, pb: 2, width: "100%" }}>
          {cards.map((card) => (
            <Card
              key={card.title}
              elevation={0}
              sx={{
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: alpha(theme.palette.primary.main, 0.02),
                transition: "all 0.2s ease",
                mb: 1.5,
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  boxShadow: theme.shadows[2],
                },
                "&:last-of-type": {
                  mb: 0,
                },
              }}
            >
              <CardActionArea sx={{ p: 2 }}>
                <Typography
                  fontWeight={600}
                  variant="body2"
                  sx={{ color: theme.palette.text.primary }}
                >
                  {card.title}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 0.5, display: "block" }}
                >
                  {card.subtitle}
                </Typography>
              </CardActionArea>
            </Card>
          ))}
        </Box>
      </CenteredCards>
    </Box>
  );
}

function CenteredCards({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: "100%",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
