import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Stack, TextField } from "@mui/material";
import { GrantOutput } from "../api/grants/types";



// Dummy KeyValueForm component for demonstration; replace with your actual implementation or import
type OutputParametersFormProps = {
    disabled: boolean;
    parameters: GrantOutput[];
    onChange: (newParams: GrantOutput[]) => void;
};

export const OutputParametersForm: React.FC<OutputParametersFormProps> = ({ disabled, parameters, onChange }) => {
    // Simple rendering of key-value pairs
    return (
        <Stack sx={{ marginBottom: '8px' }}>
            {parameters.map((param, idx) => (
                <Stack direction={'row'} key={idx} sx={{ gap: 1, marginBottom: '8px' }}>
                    <TextField
                        disabled={disabled}
                        value={param.name}
                        onChange={(e) => {
                            const newParams = parameters.slice();
                            newParams[idx].name = e.target.value;
                            onChange(newParams);
                        }}
                        style={{ marginBottom: '8px', width: '300px' }} />
                    <TextField
                        disabled={disabled}
                        value={param.maxWords}
                        type='number'
                        onChange={(e) => {
                            const newParams = parameters.slice();
                            newParams[idx].maxWords = Number(e.target.value);
                            onChange(newParams);
                        }}
                        style={{ marginBottom: '8px', width: '300px' }} />
                    <Button
                        disabled={disabled}
                        color="error"
                        onClick={() => {
                            const newParams = parameters.slice();
                            newParams.push({ name: "", maxWords: 500 }); // Add a new empty key-value pair
                            onChange(newParams);
                        }}><DeleteOutlined /></Button>
                </Stack>
            ))}
            <Button
                disabled={disabled}
                variant="outlined"
                color="success"
                onClick={() => {
                    const newParams = parameters.slice();
                    newParams.push({ name: "", maxWords: 0 }); // Add a new empty key-value pair
                    onChange(newParams);
                }}><PlusOutlined /></Button>
        </Stack>
    );
};

