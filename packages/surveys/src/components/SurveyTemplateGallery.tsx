import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Button, Card, CardActions, CardContent, Grid, Stack, Typography } from "@mui/material";
import React from "react";
import { SurveyTemplate } from "../services";

export const SurveyTemplateGallery = ({
    templates,
    onSelectTemplate,
    onDeleteTemplate
}: {
    templates: SurveyTemplate[];
    onSelectTemplate: (templateId: string) => void;
    onDeleteTemplate?: (templateId: string) => void;
}) => {
    return (
        <Grid container spacing={2}>
            {templates.map((template) => (
                <Grid key={template.id} size={{ xs: 12, md: 6 }}>
                    <Card variant="outlined" sx={{ height: "100%" }}>
                        <CardContent>
                            <Stack gap={1}>
                                <Typography variant="h6">{template.title}</Typography>
                                <Typography color="text.secondary">{template.description}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {template.definition.questions.length} starter questions
                                </Typography>
                            </Stack>
                        </CardContent>
                        <CardActions sx={{ px: 2, pb: 2 }}>
                            <Button variant="contained" onClick={() => onSelectTemplate(template.id)}>
                                Use Template
                            </Button>
                            {template.scope === "user" && onDeleteTemplate && (
                                <Button
                                    color="inherit"
                                    startIcon={<DeleteOutlineIcon />}
                                    onClick={() => onDeleteTemplate(template.id)}
                                >
                                    Delete
                                </Button>
                            )}
                        </CardActions>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};
