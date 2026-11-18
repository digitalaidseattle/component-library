/**
 * projects/index.tsx
 * Example of firestore
*/



import { Card, CardHeader, Grid, Stack } from "@mui/material";
import { GenerateProgramCard } from "./GenerateProgramCard";
import { ProgramsTable } from "./ProgramsTable";

export const VentureTrackingPage: React.FC = ({ }) => {

    return (
        <Card sx={{ padding: 2 }}>
            <CardHeader title="Venture Tracking"></CardHeader>
            <Stack gap={2}>
                <Grid container spacing={2}>
                    <Grid size={6}>
                        <GenerateProgramCard />
                    </Grid>
                </Grid>
                <Card>
                    <ProgramsTable />
                </Card>
            </Stack>
        </Card >
    );
}
