/**
 * projects/grants.tsx
 * Example of firestore
*/

import { useState } from "react";
import { Button, Card, Stack, TextField } from "@mui/material";
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { grantAiService } from './grantAiService';

import Markdown from 'react-markdown';

// Dummy KeyValueForm component for demonstration; replace with your actual implementation or import
type KeyValueFormProps = {
    parameters: Map<string, string>;
    onChange: (newParams: Map<string, string>) => void;
};

const KeyValueForm: React.FC<KeyValueFormProps> = ({ parameters, onChange }) => {
    // Simple rendering of key-value pairs
    return (
        <Stack sx={{  marginBottom: '8px' }}>
            {[...parameters.entries()].map(([key, value], idx) => (
                <Stack direction={'row'} key={idx} sx={{ gap: 1, marginBottom: '8px' }}>
                    <TextField
                        value={key}
                        onChange={(e) => {
                            const newParams = new Map(parameters);
                            const value = parameters.get(key)!;
                            newParams.delete(key);
                            newParams.set(e.target.value, value);
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


const GrantsPage: React.FC = ({ }) => {

    const [thinking, setThinking] = useState<boolean>(false);
    const [query, setQuery] = useState<string>(`Create a grant proposal using:`);
    const [proposal, setProposal] = useState<string>("");
    const [parameters, setParameters] = useState<Map<string, any>>(new Map<string, any>([
        ['to', 'Micrsoft Philanthropy'],
        ['from', 'Digital Aid Seattle'],
        ['word-limit', 500],
        ['request', '$5000']
    ]));


    function generate() {
        setProposal("");
        setThinking(true);
        const obj = Object.fromEntries(parameters);
        const json = `${query} ${JSON.stringify(obj, null, 2)}`;
        console.log("Querying AI with: ", json);
        grantAiService.query(json)
            .then((response: any) => {
                setProposal(response);
            })
            .catch((error: any) => {
                console.error("Error querying AI: ", error);
                alert("Failed to query AI: " + error.message);
            })
            .finally(() => {
                setThinking(false);
            });
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
                <KeyValueForm
                    parameters={parameters}
                    onChange={(newParams: Map<string, string>) => {
                        setParameters(newParams);
                    }}
                />
                <Button
                    variant="outlined"
                    size="medium"
                    onClick={generate}>Generate</Button>
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

export default GrantsPage;
