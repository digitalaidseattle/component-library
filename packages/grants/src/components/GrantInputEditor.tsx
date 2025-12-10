/**
 *  GrantInputEditor.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, CardContent, CardHeader, Stack, TextField } from "@mui/material";
import { GrantInput } from '../services/types';

interface ParameterRowProps {
    index: number;
    disabled: boolean;
    parameter: GrantInput;
    onChange: (index: number, param: GrantInput) => void
    onDelete: (index: number) => void
};
const ParameterRow = ({ index, disabled, parameter, onChange, onDelete }: ParameterRowProps) => {
    return (
        <Stack
            direction={'row'}
            key={index}
            gap={1}
            sx={{
                position: 'relative',
                width: '100%'
            }}
        >
            <Button
                disabled={disabled}
                aria-label="remove parameter"
                color="error"
                onClick={() => onDelete(index)}>
                <DeleteOutlined />
            </Button>
            <TextField
                disabled={disabled}
                value={parameter.key}
                onChange={(e) => onChange(index, { ...parameter, key: e.target.value })}
                style={{ marginBottom: '8px', width: '300px' }} />
            <TextField
                disabled={disabled}
                fullWidth={true}
                value={parameter.value}
                onChange={(e) => onChange(index, { ...parameter, value: e.target.value })}
                multiline={true}
                rows={4}
                sx={{
                    '& .MuiInputBase-input': {
                        resize: 'vertical',
                        overflow: 'auto',
                    }
                }} />
        </Stack >
    )
}


// Dummy KeyValueForm component for demonstration; replace with your actual implementation or import
type GrantInputEditorProps = {
    disabled: boolean;
    parameters: GrantInput[];
    onChange: (newParams: GrantInput[]) => void;
};
export const GrantInputEditor: React.FC<GrantInputEditorProps> = ({ disabled, parameters, onChange }) => {
    // Simple rendering of key-value pairs
    return (
        <Card>
            <CardHeader title="Input Parameters: (key / value)"
                action={
                    <Button
                        disabled={disabled}
                        variant="outlined"
                        color="success"
                        onClick={() => {
                            const newParams = parameters.slice();
                            newParams.push({ key: "", value: "" }); // Add a new empty key-value pair
                            onChange(newParams);
                        }}><PlusOutlined />Add Input Parameter
                    </Button>} />
            <CardContent>
                <Stack gap={2}>
                    {parameters.map((param, idx) => (
                        <ParameterRow index={idx}
                            disabled={disabled}
                            parameter={param}
                            onChange={(index: number, param: GrantInput) => {
                                parameters[index] = param;
                                onChange(parameters.slice());
                            }}
                            onDelete={(index: number) => {
                                onChange(parameters.filter((_, i) => i !== index));
                            }} />
                    ))}

                </Stack>
            </CardContent>
        </Card>
    );
};

