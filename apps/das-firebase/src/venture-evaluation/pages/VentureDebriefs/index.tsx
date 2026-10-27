/**
 * projects/index.tsx
 * Example of firestore
*/



import { Card, CardHeader, Grid, Stack, Typography } from "@mui/material";

export const VentureDebriefsPage: React.FC = ({ }) => {

    return (
        <Card sx={{ padding: 2 }}>
            <CardHeader title="Venture Debriefs"></CardHeader>
            <Stack gap={2}>
                <Grid container spacing={2}>
                    <Grid size={6}>
                        <Typography>Add Venture Debrief Response</Typography>
                    </Grid>
                </Grid>
                <Card>
                    <Typography>List of debriefs</Typography>
                </Card>
            </Stack>
        </Card >
    );
}
