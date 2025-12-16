import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItemButton,
  ListItemText,
  Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";

import getMockSurveyData from "../../models/MockSurveyData";
import type { Survey } from "../../models/MockSurveyData";

export default function DashboardSidebar() {
  const navigate = useNavigate();
  const surveys: Survey[] = getMockSurveyData();

  const activeSurveys = surveys.filter(
    (s) => s.status === "active"
  );
  const draftSurveys = surveys.filter(
    (s) => s.status === "draft"
  );

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {/* Create New Survey */}
      <Card variant="outlined">
      <CardActionArea onClick={() => navigate("/new")}>
          <CardContent
            sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
          >
            <AddIcon color="primary" />
            <Typography fontWeight={600}>
              Create New Survey
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>

      {/* Active */}
      <Accordion disableGutters elevation={0}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>Active</Typography>
          <Chip
            size="small"
            color="primary"
            label={activeSurveys.length}
            sx={{ ml: "auto" }}
          />
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <List disablePadding>
            {activeSurveys.map((s) => (
              <ListItemButton key={s.id} sx={{ pl: 4 }}>
                <ListItemText primary={s.title} />
              </ListItemButton>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>

      {/* Drafts */}
      <Accordion disableGutters elevation={0}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>Drafts</Typography>
          <Chip
            size="small"
            label={draftSurveys.length}
            sx={{ ml: "auto" }}
          />
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <List disablePadding>
            {draftSurveys.map((s) => (
              <ListItemButton key={s.id} sx={{ pl: 4 }}>
                <ListItemText primary={s.title} />
              </ListItemButton>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}