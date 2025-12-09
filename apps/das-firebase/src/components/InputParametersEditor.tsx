import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, CardContent, CardHeader, Stack, TextField } from "@mui/material";
import { GrantInput } from "../api/grants/types";

// Dummy KeyValueForm component for demonstration; replace with your actual implementation or import
type InputParametersEditorProps = {
    disabled: boolean;
    parameters: GrantInput[];
    onChange: (newParams: GrantInput[]) => void;
};

export const InputParametersEditor: React.FC<InputParametersEditorProps> = ({ disabled, parameters, onChange }) => {
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
                <Stack sx={{ marginBottom: '8px' }}>
                    {parameters.map((param, idx) => (
                        <Stack direction={'row'} key={idx} sx={{ gap: 1, marginBottom: '8px' }}>
                            <TextField
                                disabled={disabled}
                                value={param.key}
                                onChange={(e) => {
                                    const newParams = parameters.slice();
                                    newParams[idx].key = e.target.value;
                                    onChange(newParams);
                                }}
                                style={{ marginBottom: '8px', width: '300px' }} />
                            <TextField
                                disabled={disabled}
                                fullWidth={true}
                                value={param.value}
                                onChange={(e) => {
                                    const newParams = parameters.slice();
                                    newParams[idx].value = e.target.value;
                                    onChange(newParams);
                                }}
                                multiline={true}
                                rows={4}
                                sx={{
                                    '& .MuiInputBase-input': {
                                        resize: 'vertical',
                                        overflow: 'auto',
                                    }
                                }} />
                            <Button
                                disabled={disabled}
                                color="error"
                                onClick={() => {
                                    onChange(parameters.filter((_, i) => i !== idx));
                                }}><DeleteOutlined /></Button>
                        </Stack>
                    ))}

                </Stack>
            </CardContent>
        </Card>
    );
};

