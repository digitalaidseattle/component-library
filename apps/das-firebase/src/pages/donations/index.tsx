/**
 * projects/grants.tsx
 * Example of firestore
*/

import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Stack, TextField } from "@mui/material";
import { useState } from "react";

import Markdown from 'react-markdown';
import DebouncedTextField from '../../components/DebouncedTextField';
import { GeminiService } from '@digitalaidseattle/firebase';


// Dummy KeyValueForm component for demonstration; replace with your actual implementation or import
type KeyValueFormProps = {
    parameters: Map<string, string>;
    onChange: (newParams: Map<string, string>) => void;
};

const KeyValueForm: React.FC<KeyValueFormProps> = ({ parameters, onChange }) => {
    // Simple rendering of key-value pairs
    return (
        <Stack sx={{ marginBottom: '8px' }}>
            {[...parameters.entries()].map(([key, value], idx) => (
                <Stack direction={'row'} key={idx} sx={{ gap: 1, marginBottom: '8px' }}>
                    <DebouncedTextField
                        value={key}
                        onChange={(newKey) => {
                            const newParams = new Map(parameters);
                            const value = parameters.get(key)!;
                            newParams.delete(key);
                            newParams.set(newKey, value);
                            onChange(newParams);
                        }}
                        style={{ marginBottom: '8px', width: '300px' }} />
                    <TextField
                        value={value}
                        onChange={(e) => {
                            const newParams = new Map(parameters);
                            newParams.set(key, e.target.value);
                            onChange(newParams);
                        }}
                        style={{ marginBottom: '8px', width: '300px' }} />
                    <Button
                        color="error"
                        onClick={() => {
                            const newParams = new Map(parameters);
                            newParams.delete(key);
                            onChange(newParams);
                        }}><DeleteOutlined /></Button>
                </Stack>
            ))}
            <Button
                variant="outlined"
                color="success"
                onClick={() => {
                    const newParams = new Map(parameters);
                    newParams.set("", ""); // Add a new empty key-value pair
                    onChange(newParams);
                }}><PlusOutlined /></Button>
        </Stack>
    );
};

const DonationsPage: React.FC = ({ }) => {

    const [thinking, setThinking] = useState<boolean>(false);
    const [query, setQuery] = useState<string>(`Create a donation thank you letter using:`);
    const [proposal, setProposal] = useState<string>("");
    const [parameters, setParameters] = useState<Map<string, string>>(new Map<string, string>([
        ['donor-name', 'Jane Donor'],
        ['from', 'Digital Aid Seattle'],
        ['donation amount', '$500']
    ]));

    const geminiService = new GeminiService()

    function generate() {
        setProposal("");
        setThinking(true);

        const obj = Object.fromEntries(parameters);
        const inputs = JSON.stringify(obj);
        const json = `${query} ${inputs}`;
        geminiService.generateContent(geminiService.getModels()[0], json)
            .then((response: any) => setProposal(response))
            .catch((error: any) => {
                console.error("Error querying AI: ", error);
                alert("Failed to query AI: " + error.message);
            })
            .finally(() => setThinking(false));
    }

    return (
        <Stack gap={2}>
            <Card sx={{ padding: 2, gap: 1, display: 'flex', flexDirection: 'column' }}>
                <TextField
                    label="Prompt"
                    fullWidth
                    value={query}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setQuery(event.target.value);
                    }}
                ></TextField>
                <fieldset>
                    <legend>Input Parameters:</legend>
                    <KeyValueForm
                        parameters={parameters}
                        onChange={(newParams: Map<string, string>) => {
                            setParameters(newParams);
                        }}
                    />
                </fieldset>
                <Stack direction="row" gap={1} justifyContent="flex-start">
                    <Button
                        variant="outlined"
                        size="medium"
                        disabled={thinking}
                        onClick={generate}>Generate</Button>
                </Stack>
            </Card>
            {thinking &&
                <div>Thinking...</div>
            }
            <Markdown>
                {proposal}
            </Markdown>
        </Stack>
    );
}

export default DonationsPage;
