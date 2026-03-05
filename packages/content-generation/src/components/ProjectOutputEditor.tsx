/**
 * ProjectOutputEditor.tsx
 * 
 * @copyright 2025 Digital Aid Seattle
*/
import { DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { HelpTopicContext, useHelp } from '@digitalaidseattle/core';
import {
  Button, ButtonGroup,
  Card, CardContent, CardHeader,
  IconButton,
  Stack
} from "@mui/material";
import React, { useContext, useEffect } from "react";
import { ProjectOutput } from '../services/types';
import { AiProjectContext } from './AiProjectContext';
import { StableCursorTextField } from '@digitalaidseattle/mui';

export const ProjectOutputEditor = ({ title, onChange }: { title: string, onChange: (updated: ProjectOutput[]) => void }) => {
  const { project } = useContext(AiProjectContext);

  const [outputFields, setOutputFields] = React.useState<ProjectOutput[]>([]);
  const { setHelpTopic } = useContext(HelpTopicContext);
  const { setShowHelp } = useHelp();

  useEffect(() => {
    if (project) {
      setOutputFields(project.outputs);
    }
  }, [project])

  const handleOutputFieldChange = (index: number, field: 'name' | 'maxWords', value: string | number) => {
    const newFields = [...outputFields];
    newFields[index] = { ...newFields[index], [field]: value };
    onChange(newFields);
  };

  const handleOutputUnitToggle = (index: number) => {
    const newFields = [...outputFields];
    newFields[index] = {
      ...newFields[index],
      unit: newFields[index].unit === 'words' ? 'characters' : 'words'
    };
    onChange(newFields);
  };

  const handleAddOutputField = () => {
    onChange([...outputFields, { name: "", maxWords: 500, unit: 'words' }]);
  };

  const handleRemoveOutputField = (index: number) => {
    onChange(outputFields.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader title={title}
        slotProps={{ title: { fontWeight: 600, fontSize: 16 } }}
        avatar={<IconButton
          onClick={() => { setHelpTopic('Outputs'); setShowHelp(true) }}
          color="primary"><InfoCircleOutlined /></IconButton>}
        action={
          <Button
            variant="outlined"
            color="primary"
            onClick={handleAddOutputField}
            sx={{ alignSelf: 'flex-start' }}
          >
            Add Output Field
          </Button>
        } />

      <CardContent>
        <Stack spacing={2} sx={{ mt: 2 }}>
          {outputFields.map((field, index) => (
            <Stack direction="row" spacing={2} key={index} alignItems="center">
              <Button
                color="error"
                aria-label="remove output field"
                onClick={() => handleRemoveOutputField(index)}
              >
                <DeleteOutlined />
              </Button>
              <StableCursorTextField
                label="Field"
                fullWidth={true}
                value={field.name}
                onChange={(e) => handleOutputFieldChange(index, 'name', e.target.value)}
              />
              <StableCursorTextField
                label={`Max ${field.unit === 'words' ? 'Words' : 'Characters'}`}
                type="number"
                value={field.maxWords}
                onChange={(e) => handleOutputFieldChange(index, 'maxWords', parseInt(e.target.value) || 0)}
              />
              <ButtonGroup variant="contained" aria-label="Basic button group">
                <Button
                  variant={field.unit === 'words' ? 'contained' : 'outlined'}
                  onClick={() => handleOutputUnitToggle(index)}
                >Words</Button>
                <Button
                  variant={field.unit === 'characters' ? 'contained' : 'outlined'}
                  onClick={() => handleOutputUnitToggle(index)}
                >Characters</Button>
              </ButtonGroup>

            </Stack>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );

}
