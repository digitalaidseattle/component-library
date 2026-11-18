/**
 * projects/index.tsx
 * Example of firestore
*/



import { Button, Card, CardHeader, CircularProgress, Stack, TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";

import { useNotifications } from "@digitalaidseattle/core";



export const ResearchCard: React.FC = ({ }) => {

    const notifications = useNotifications();
    const notificationsRef = useRef(notifications);


    const [thinking, setThinking] = useState<boolean>(false);

    const [prompt, setPrompt] = useState<string>("List five philanthropic institutions near Seattle.");


    useEffect(() => {
        notificationsRef.current = notifications;
    });

    function handleQuery() {
        setThinking(true)
        alert('Not implemented yet.')
        // fundersService.query(prompt)
        //     .then((response: any) => {
        //         console.log("AI Response: ", response.characters);
        //         const indexed = (response.characters as Funder[])
        //             .map((inst, idx) => {
        //                 return {
        //                     ...inst,
        //                     id: idx
        //                 } as Funder
        //             })
        //         console.log("indexed AI Response: ", indexed);
        //         setFunders(indexed);
        //     })
        //     .finally(() => setThinking(false));
        setThinking(false)

    }

    return (
        <Card>
            <CardHeader title="Find funders"></CardHeader>
            <Stack gap={1} m={1}>
                <TextField
                    label="Prompt"
                    fullWidth
                    defaultValue={prompt}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setPrompt(event.target.value);
                    }}
                ></TextField>
                <Button
                    variant="outlined"
                    size="medium"
                    disabled={thinking}
                    onClick={handleQuery}>Search {thinking && <CircularProgress />}</Button>
            </Stack>
        </Card >
    );
}
