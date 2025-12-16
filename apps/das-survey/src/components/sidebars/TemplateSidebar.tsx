import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Chip,
  Divider,
} from "@mui/material";

type TemplateId = "blank";

type TemplateSidebarProps = {
  selected: TemplateId;
  onSelect: (id: TemplateId) => void;
};

export default function TemplateSidebar({
  selected,
  onSelect,
}: TemplateSidebarProps) {
  return (
    <Box p={3} height="100%">
      <Typography
        fontWeight={600}
        gutterBottom
      >
        Templates
      </Typography>

      <List disablePadding>
        <ListItemButton
          selected={selected === "blank"}
          onClick={() => onSelect("blank")}
          sx={{ borderRadius: 1 }}
        >
          <ListItemText
            primary="Blank survey"
            secondary="Start from scratch"
          />
        </ListItemButton>
      </List>

      <Divider sx={{ my: 3 }} />

      <Typography
        variant="body2"
        color="text.secondary"
      >
        More templates coming soon
      </Typography>

      <Chip
        label="Coming soon"
        size="small"
        sx={{ mt: 1 }}
      />
    </Box>
  );
}
