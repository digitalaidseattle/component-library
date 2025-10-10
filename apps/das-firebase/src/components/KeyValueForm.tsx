import { Button, Stack, TextField } from "@mui/material";
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { GrantInput } from "../api/grants/types";



// Dummy KeyValueForm component for demonstration; replace with your actual implementation or import
type InputParametersFormProps = {
    parameters: GrantInput[];
    onChange: (newParams: GrantInput[]) => void;
};

export const InputParametersForm: React.FC<InputParametersFormProps> = ({ parameters, onChange }) => {
    // Simple rendering of key-value pairs
    return (
        <Stack sx={{ marginBottom: '8px' }}>
            {parameters.map((param, idx) => (
                <Stack direction={'row'} key={idx} sx={{ gap: 1, marginBottom: '8px' }}>
                    <TextField
                        value={param.key}
                        onChange={(e) => {
                            const newParams = parameters.slice();
                            newParams[idx].key = e.target.value;
                            onChange(newParams);
                        }}
                        style={{ marginBottom: '8px', width: '300px' }} />
                    <TextField
                        value={param.value}
                        onChange={(e) => {
                            const newParams = parameters.slice();
                            newParams[idx].value = e.target.value;
                            onChange(newParams);
                        }}
                        style={{ marginBottom: '8px', width: '300px' }} />
                    <Button
                        color="error"
                        onClick={() => {
                            const newParams = parameters.slice();
                            newParams.push({ key: "", value: "" }); // Add a new empty key-value pair
                            onChange(newParams);
                        }}><DeleteOutlined /></Button>
                </Stack>
            ))}
            <Button
                variant="outlined"
                color="success"
                onClick={() => {
                    const newParams = parameters.slice();
                    newParams.push({ key: "", value: "" }); // Add a new empty key-value pair
                    onChange(newParams);
                }}><PlusOutlined /></Button>
        </Stack>
    );
};

