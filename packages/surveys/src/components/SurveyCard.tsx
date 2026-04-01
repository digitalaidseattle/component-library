/**
 *  SurveyCard.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import React from "react";
import { Card, CardContent, CardHeader, Typography } from "@mui/material";
import { Survey } from "../services/surveyService";
import dayjs from "dayjs";

export const SurveyCard = ({ survey }: { survey: Survey }) => {
    return <Card>
        <CardHeader title={survey.name}
            subheader={dayjs(survey.updated_at).format("MMM/DD/YYYY hh:mm a")} />
        <CardContent>
            <Typography>Question would go here.</Typography>
        </CardContent>
    </Card>
}