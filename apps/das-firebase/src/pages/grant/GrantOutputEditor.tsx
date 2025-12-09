/**
 * GrantOutputEditor.tsx
 * 
 * @copyright 2025 Digital Aid Seattle
*/
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button, Card,
  CardContent, CardHeader, Fab, FormControlLabel,
  Stack,
  Switch,
  TextField
} from "@mui/material";
import { useEffect, useState } from "react";
import { GrantOutput } from '../../api/grants/types';

interface ParameterRowProps {
  index: number;
  disabled: boolean;
  parameter: GrantOutput;
  onChange: (index: number, param: GrantOutput) => void
  onDelete: (index: number) => void
};
const ParameterRow = ({ index, disabled, parameter, onChange, onDelete }: ParameterRowProps) => {


  return (
    <Stack
      direction={'row'}
      key={index}
      gap={1}
      sx={{ position: 'relative', width: '100%' }}
    >
      <Button
        disabled={disabled}
        aria-label="Delete parameter"
        color="error"
        onClick={() => {
          onDelete(index);
        }}>
        <DeleteOutlined />
      </Button>
      <TextField
        label="Field"
        value={parameter.name}
        disabled={disabled}
        onChange={(e) => onChange(index, { ...parameter, name: e.target.value })}
        sx={{ width: '200px' }}
      />
      <TextField
        label={`Max ${parameter.unit === 'words' ? 'Words' : 'Characters'}`}
        type="number"
        value={parameter.maxSymbols}
        disabled={disabled}
        onChange={(e) => onChange(index, { ...parameter, maxSymbols: Number(e.target.value) })}
        sx={{ width: '150px' }}
      />
      <FormControlLabel
        control={
          <Switch
            disabled={disabled}
            checked={parameter.unit === 'characters'}
            onChange={(e) => {
              console.log(e.target.value)
              onChange(index, { ...parameter, unit: parameter.unit === 'words' ? 'characters' : 'words' })
            }}

          // onChange={(e) => onChange(index, { ...parameter, unit: e.target.value === 'characters' })}
          />
        }
        label={parameter.unit === 'words' ? 'Words' : 'Chars'}
      />

    </Stack>
  )
}


export const GrantOutputEditor = ({ disabled = false, parameters, onChange }: { disabled?: boolean, parameters: GrantOutput[], onChange: (updated: GrantOutput[]) => void }) => {

  const [outputFields, setOutputFields] = useState<GrantOutput[]>([]);

  useEffect(() => {
    if (parameters) {
      setOutputFields(parameters);
    }
  }, [parameters])

  const handleAddOutputField = () => {
    onChange([...outputFields, { name: "", maxSymbols: 500, unit: 'words' }]);
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
          {outputFields.map((parameter, index) => (
            <ParameterRow
              index={index}
              disabled={disabled}
              parameter={parameter}
              onChange={(index: number, param: GrantOutput) => {
                outputFields[index] = param;
                onChange(outputFields.slice());
              }}
              onDelete={function (index: number): void {
                onChange(outputFields.filter((_, i) => i !== index));
              }} />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );

}
