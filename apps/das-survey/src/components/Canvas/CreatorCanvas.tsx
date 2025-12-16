import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import type {
  CreatorModel,
  CreatorElement,
  ChapterId,
} from "../../models/CreatorModel";

type Props = {
  model: CreatorModel;
  onFocusChapter: (id: ChapterId) => void;
};

function renderElement(el: CreatorElement) {
  switch (el.type) {
    case "title":
      return (
        <TextField
          fullWidth
          placeholder="Story title"
          value={el.value}
          sx={{ mb: 2 }}
          InputProps={{
            sx: { fontSize: 22, fontWeight: 600 },
          }}
        />
      );

    case "blurb":
      return (
        <TextField
          fullWidth
          multiline
          minRows={3}
          placeholder="Write a short blurb…"
          sx={{ mb: 2 }}
        />
      );

    case "participantField":
      return (
        <TextField
          fullWidth
          placeholder={el.label}
          sx={{ mb: 2 }}
        />
      );

    default:
      return null;
  }
}

export default function CreatorCanvas({
  model,
  onFocusChapter,
}: Props) {
  return (
      <Box
        sx={{
          maxWidth: 900,
          mx: "auto",        // centers horizontally
          width: "100%",     // ensures it shrinks properly on small screens
        }}
      >
      {model.chapters.map((chapter) => {
        const isExpanded =
          chapter.id === model.activeChapterId;

        return (
          <Accordion
            key={chapter.id}
            expanded={isExpanded}
            onChange={(_, expanded) => {
              if (expanded) {
                onFocusChapter(chapter.id);
              }
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
            >
              <Typography fontWeight={600}>
                {chapter.title}
              </Typography>
            </AccordionSummary>

            <AccordionDetails>
              {chapter.elements.length === 0 ? (
                <Typography color="text.secondary">
                  Nothing here yet.
                </Typography>
              ) : (
                chapter.elements.map((el, i) => (
                  <Box key={i}>
                    {renderElement(el)}
                  </Box>
                ))
              )}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
}