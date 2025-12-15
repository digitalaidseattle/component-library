/**
 * GrantOutputEditor.tsx
 * 
 * @copyright 2025 Digital Aid Seattle
*/
import React, { useEffect, useState } from "react";
import { GeminiService } from "@digitalaidseattle/firebase";
import {
  Box,
  Card,
  CardContent, CardHeader,
  Grid,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography
} from "@mui/material";
import { GrantRecipe } from '../services/types';


export const GrantSettingsEditor = ({ disabled = false, grantRecipe, onChange }: { disabled?: boolean, grantRecipe: GrantRecipe, onChange: (updated: GrantRecipe) => void }) => {

  const [models, setModels] = useState<string[]>([]);

  useEffect(() => {
    if (grantRecipe && grantRecipe.modelType) {
      setModels(new GeminiService().getModels());
    }
  }, [grantRecipe]);

  return (grantRecipe &&
    <Card>
      <CardHeader title="Settings" />
      <CardContent>
        <Grid container spacing={2} >
          <Grid size={2}>
            Description:
          </Grid>
          <Grid size={10}>
            <TextField
              fullWidth
              value={grantRecipe.description}
              onChange={(event) => onChange(Object.assign(grantRecipe, { description: event.target.value }))}
            />
          </Grid>
          <Grid size={2}>
            Model:
          </Grid>
          <Grid size={10}>
            <Select
              fullWidth
              value={grantRecipe.modelType ?? ''}
              onChange={(event) => onChange(Object.assign(grantRecipe, { modelType: event.target.value }))} >
              {models.map(model => <MenuItem key={model} value={model}>{model}</MenuItem>)}
            </Select>
          </Grid>
          <Grid size={2}>
            Project Context:
          </Grid>
          <Grid size={10}>
            <Stack direction={'row'}>
              <Box sx={{ alignItems: 'center', justifyItems: 'center' }}>
                <Typography>Enabled</Typography>
                <Switch
                  value={grantRecipe.enableContext}
                  onChange={() => onChange(Object.assign(grantRecipe, { enableContext: !grantRecipe.enableContext }))}
                ></Switch>
              </Box>
              <TextField
                id="context"
                label="Context folder location"
                fullWidth
                value={grantRecipe.context}
                disabled={disabled || grantRecipe.enableContext}
                onChange={(event) => onChange(Object.assign(grantRecipe, { context: event.target.value }))}
              />
            </Stack>
          </Grid>
          <Grid size={2}>
            Prompt Template:
          </Grid>
          <Grid size={10}>
            <TextField
              id="template"
              fullWidth
              multiline={true}
              rows={6}
              value={grantRecipe.template}
              disabled={disabled}
              onChange={(event) => onChange(Object.assign(grantRecipe, { template: event.target.value }))}
              sx={{
                '& .MuiInputBase-input': {
                  resize: 'vertical',
                  overflow: 'auto',
                }
              }}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card >
  );

}
