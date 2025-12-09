/**
 * GrantOutputEditor.tsx
 * 
 * @copyright 2025 Digital Aid Seattle
*/
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button, Card,
  CardContent, CardHeader, FormControlLabel,
  Stack,
  Switch,
  TextField
} from "@mui/material";
import { useEffect, useState } from "react";
import { GrantOutput } from './types';

export const GrantOutputEditor = ({ disabled = false, parameters, onChange }: { disabled?: boolean, parameters: GrantOutput[], onChange: (updated: GrantOutput[]) => void }) => {

  const [outputFields, setOutputFields] = useState<GrantOutput[]>([]);

  useEffect(() => {
    if (parameters) {
      setOutputFields(parameters);
    }
  }, [parameters])

  const handleOutputFieldChange = (index: number, field: 'name' | 'maxSymbols', value: string | number) => {
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
    onChange([...outputFields, { name: "", maxSymbols: 500, unit: 'words' }]);
  };

  const handleRemoveOutputField = (index: number) => {
    onChange(outputFields.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader title="Output Fields: (field / max symbol count)"
        action={<Button
          variant="outlined"
          color="success"
          disabled={disabled}
          onClick={handleAddOutputField}
          startIcon={<PlusOutlined />}
          sx={{ alignSelf: 'flex-start' }}
        >
          Add Output Field
        </Button>} />
      <CardContent>
        <Stack spacing={2} sx={{ mt: 2 }}>
          {outputFields.map((field, index) => (
            <Stack direction="row" spacing={2} key={index} alignItems="center">
              <TextField
                label="Field"
                value={field.name}
                disabled={disabled}
                onChange={(e) => handleOutputFieldChange(index, 'name', e.target.value)}
                sx={{ width: '200px' }}
              />
              <TextField
                label={`Max ${field.unit === 'words' ? 'Words' : 'Characters'}`}
                type="number"
                value={field.maxSymbols}
                disabled={disabled}
                onChange={(e) => handleOutputFieldChange(index, 'maxSymbols', parseInt(e.target.value) || 0)}
                sx={{ width: '150px' }}
              />
              <FormControlLabel
                control={
                  <Switch
                    disabled={disabled}
                    checked={field.unit === 'characters'}
                    onChange={() => handleOutputUnitToggle(index)}
                  />
                }
                label={field.unit === 'words' ? 'Words' : 'Chars'}
              />
              <Button
                disabled={disabled}
                color="error"
                onClick={() => handleRemoveOutputField(index)}
                startIcon={<DeleteOutlined />}
              >
                Remove
              </Button>
            </Stack>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );

}
