/**
 * ProjectInfoEditor.tsx
 * 
 * @copyright 2025 Digital Aid Seattle
*/
import React from "react";

import {
  Chip,
  Grid,
  Rating,
  Stack,
  Typography
} from "@mui/material";
import { Project } from '../services/types';
import { AiProjectContext } from "./AiProjectContext";
import { TagButton } from "./TagButton";

export const ProjectInfoEditor = ({ onChange }: { onChange: (updated: Project) => void }) => {
  const { project } = React.useContext(AiProjectContext);

  function handleRatingChange(newValue: number) {
    onChange({ ...project, rating: newValue });
  };

  function handleDeleteTag(tag: string): void {
    const tags = project.tags ?? [];
    const index = tags.indexOf(tag);
    if (index > -1) {
      tags.splice(index, 1);
      onChange({ ...project, tags: tags });
    }
  }

  function handleAddTag(newValue: string | null): void {
    if (newValue) {
      onChange({ ...project, tags: [...project.tags ?? [], newValue] });
    }
  }

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid size={1}><Typography>Rating</Typography></Grid>
      <Grid size={2}>
        <Rating
          name="simple-controlled"
          value={project.rating ?? 0}
          onChange={(_event, newValue) => {
            handleRatingChange(newValue ?? 0);
          }}
        />
      </Grid>
      <Grid size={1}><Typography>Tags</Typography></Grid>
      <Grid size={8}>
        <Stack direction={'row'} spacing={1} sx={{ alignItems: 'center' }}>
          {(project.tags ?? []).map((tag, idx) => <Chip key={idx} label={tag} onDelete={() => handleDeleteTag(tag)} />)}
          <TagButton onChange={handleAddTag} />
        </Stack>
      </Grid>
    </Grid>
  );

}
