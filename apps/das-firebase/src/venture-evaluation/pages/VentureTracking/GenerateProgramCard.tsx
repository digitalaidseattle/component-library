/**
 * GenerateProgramCard.tsx
 * Enter a name and prefix and generate a program from the evaluation template
*/

import {
    Button,
    Card, CardActions, CardContent, CardHeader,
    Stack,
    TextField
} from "@mui/material";
import { useContext, useEffect, useState } from "react";

import { LoadingContext, RefreshContext, useNotifications } from "@digitalaidseattle/core";
import { Program } from "@digitalaidseattle/program-management";
import { ProgramService } from "../../services/ProgramService";

export const GenerateProgramCard: React.FC = ({ }) => {
    const notifications = useNotifications();
    const { setLoading } = useContext(LoadingContext);
    const { refresh, setRefresh } = useContext(RefreshContext);

    const [programs, setPrograms] = useState<Program[]>([]);
    const [name, setName] = useState<string>('');
    const [prefix, setPrefix] = useState<string>('');

    useEffect(() => {
        let active = true;
        ProgramService.getInstance().findByOrganization()
            .then(data => {
                if (active) {
                    setPrograms(data);
                }
            })
            .catch(err => {
                notifications.error('Error fetching programs.');
                console.error('Error fetching programs:', err);
            });
        return () => { active = false; };
    }, [refresh]);

    const errors = ProgramService.getInstance().validate(name, prefix, programs);

    async function handleGenerate() {
        setLoading(true);
        try {
            await ProgramService.getInstance().generateProgram(name, prefix);
            notifications.success(`Program ${name.trim()} generated.`);
            setName('');
            setPrefix('');
            setRefresh(Date.now());
        } catch (err) {
            notifications.error('Error generating program.');
            console.error('Error generating program:', err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card>
            <CardHeader title="Create Tracking Tasks" />
            <CardContent>
                <Stack gap={2}>
                    <TextField
                        label="Name"
                        value={name}
                        onChange={event => setName(event.target.value)}
                        error={!!name && !!errors.name}
                        helperText={name ? errors.name : undefined}
                        fullWidth
                        required
                    />
                    <TextField
                        label="Prefix"
                        value={prefix}
                        onChange={event => setPrefix(event.target.value)}
                        error={!!prefix && !!errors.prefix}
                        helperText={prefix ? errors.prefix : undefined}
                        fullWidth
                        required
                    />
                </Stack>
            </CardContent>
            <CardActions>
                <Button variant="contained" disabled={!!errors.name || !!errors.prefix} onClick={handleGenerate}>
                    Generate Tasks
                </Button>
            </CardActions>
        </Card>
    );
}
