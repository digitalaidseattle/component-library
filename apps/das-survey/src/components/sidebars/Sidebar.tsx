import {
  Box,
  Button,
  Card,
  CardActionArea,
  Typography,
} from "@mui/material";

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
  const cards = [
    { title: "Contacts", subtitle: "People you commonly survey" },
    { title: "Responses", subtitle: "View and export survey answers" },
    { title: "Tasks", subtitle: "Internal follow-ups and reminders" },
    { title: "Settings", subtitle: "Organization preferences" },
  ];

  return (
    <Box
      sx={{
        width: 280,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid #eee",
        p: 2,
      }}
    >
      {/* Dynamic primary action */}
      <Button
        variant="contained"
        fullWidth
        startIcon={primaryAction.icon}
        onClick={primaryAction.onClick}
        sx={{ mb: 3 }}
      >
        {primaryAction.label}
      </Button>

      {/* Centered cards */}
      <CenteredCards>
        {cards.map((card) => (
          <Card key={card.title} elevation={1} sx={{ borderRadius: 2 }}>
            <CardActionArea sx={{ p: 2 }}>
              <Typography fontWeight={600}>
                {card.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {card.subtitle}
              </Typography>
            </CardActionArea>
          </Card>
        ))}
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
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}