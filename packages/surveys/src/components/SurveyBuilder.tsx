import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PreviewIcon from "@mui/icons-material/Preview";
import PublishIcon from "@mui/icons-material/Publish";
import RedoIcon from "@mui/icons-material/Redo";
import UndoIcon from "@mui/icons-material/Undo";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Divider,
    FormControlLabel,
    Grid,
    IconButton,
    MenuItem,
    Paper,
    Select,
    Stack,
    Switch,
    Tab,
    Tabs,
    TextField,
    Typography
} from "@mui/material";
import React, { useMemo, useState } from "react";
import { DragAndDrop, DDCategory } from "@digitalaidseattle/draganddrop";
import {
    SurveyDraft,
    SurveyQuestion,
    SurveyQuestionKind,
    commitDefinition,
    createOption,
    createQuestion,
    getCurrentDefinition,
    redoDraft,
    reorderQuestions,
    undoDraft
} from "../services";
import { SurveyForm } from "./SurveyForm";

const questionCategory: DDCategory<string> = {
    value: "questions",
    label: "Question order"
};

export const SurveyBuilder = ({
    draft,
    onChange,
    onPublish,
    primaryActionLabel,
    onPrimaryAction,
    primaryActionIcon,
    title,
    description,
    introSectionTitle,
    titleFieldLabel,
    descriptionFieldLabel
}: {
    draft: SurveyDraft;
    onChange: (draft: SurveyDraft) => void;
    onPublish?: (draft: SurveyDraft) => Promise<void> | void;
    primaryActionLabel?: string;
    onPrimaryAction?: (draft: SurveyDraft) => Promise<void> | void;
    primaryActionIcon?: React.ReactNode;
    title?: string;
    description?: string;
    introSectionTitle?: string;
    titleFieldLabel?: string;
    descriptionFieldLabel?: string;
}) => {
    const definition = getCurrentDefinition(draft);
    const [activeTab, setActiveTab] = useState<"build" | "preview">("build");
    const items = useMemo(() => new Map([[questionCategory, definition.questions]]), [definition.questions]);
    const primaryAction = onPrimaryAction ?? onPublish;
    const actionLabel = primaryActionLabel ?? "Publish";
    const actionIcon = primaryActionIcon ?? <PublishIcon />;
    const headerTitle = title ?? "Survey Builder";
    const headerDescription = description ?? "Drag questions to reorder them, tune each control, and publish the current draft.";
    const introTitle = introSectionTitle ?? "Survey Introduction";
    const introTitleFieldLabel = titleFieldLabel ?? "Survey title";
    const introDescriptionFieldLabel = descriptionFieldLabel ?? "Survey description";

    const updateDefinition = (next: typeof definition) => {
        onChange(commitDefinition(draft, next));
    };

    const updateQuestion = (questionId: string, updater: (question: SurveyQuestion) => SurveyQuestion) => {
        updateDefinition({
            ...definition,
            questions: definition.questions.map((question) => question.id === questionId ? updater(question) : question)
        });
    };

    const addQuestion = (kind: SurveyQuestionKind, preset?: string) => {
        updateDefinition({
            ...definition,
            questions: [...definition.questions, createQuestion(kind, preset)]
        });
    };

    return (
        <Box sx={{ maxWidth: 1500, mx: "auto" }}>
            <Grid container spacing={{ xs: 2, md: 3 }} sx={{ minHeight: "calc(100vh - 220px)" }}>
                <Grid size={{ xs: 12, md: 3 }}>
                    <Paper square variant="outlined" sx={{ height: "100%", p: { xs: 2, md: 2.5 } }}>
                        <Tabs value={activeTab} onChange={(_, value) => setActiveTab(value)} variant="fullWidth" sx={{ mb: 2 }}>
                            <Tab value="build" label="Build" wrapped sx={{ textTransform: "none", minWidth: 0 }} />
                            <Tab value="preview" icon={<PreviewIcon fontSize="small" />} iconPosition="start" label="Preview" wrapped sx={{ textTransform: "none", minWidth: 0 }} />
                        </Tabs>
                        <Divider sx={{ mb: 2 }} />
                        <QuestionPalette onAddQuestion={addQuestion} />
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 9 }}>
                    <Paper square variant="outlined" sx={{ height: "100%", p: { xs: 2, md: 3 } }}>
                            <Stack
                                direction={{ xs: "column", xl: "row" }}
                                justifyContent="space-between"
                                alignItems={{ xs: "stretch", xl: "flex-start" }}
                                gap={2}
                                sx={{ mb: 3 }}
                            >
                            <Box sx={{ maxWidth: { xs: "100%", xl: "52ch" }, minWidth: 0 }}>
                                <Typography variant="h5" sx={{ mb: 0.5 }}>{headerTitle}</Typography>
                                <Typography color="text.secondary" variant="body1" sx={{ overflowWrap: "anywhere" }}>
                                    {headerDescription}
                                </Typography>
                            </Box>
                            <Stack direction="row" gap={1} flexWrap="wrap" useFlexGap justifyContent={{ xs: "flex-start", xl: "flex-end" }}>
                                <Button variant="outlined" startIcon={<UndoIcon />} disabled={draft.historyIndex === 0} onClick={() => onChange(undoDraft(draft))}>
                                    Undo
                                </Button>
                                <Button variant="outlined" startIcon={<RedoIcon />} disabled={draft.historyIndex >= draft.history.length - 1} onClick={() => onChange(redoDraft(draft))}>
                                    Redo
                                </Button>
                                {primaryAction && (
                                    <Button variant="contained" startIcon={actionIcon} onClick={() => primaryAction(draft)}>
                                        {actionLabel}
                                    </Button>
                                )}
                            </Stack>
                        </Stack>

                        {activeTab === "preview" ? (
                            <SurveyForm definition={definition} />
                        ) : (
                            <Stack gap={3}>
                                <Paper variant="outlined" sx={{ p: 3 }}>
                                    <Typography variant="h6" gutterBottom>{introTitle}</Typography>
                                    <Stack gap={2}>
                                        <TextField
                                            fullWidth
                                            label={introTitleFieldLabel}
                                            value={definition.surveyTitle ?? ""}
                                            onChange={(event) => updateDefinition({
                                                ...definition,
                                                surveyTitle: event.target.value
                                            })}
                                        />
                                        <TextField
                                            fullWidth
                                            multiline
                                            minRows={3}
                                            label={introDescriptionFieldLabel}
                                            value={definition.surveyDescription ?? ""}
                                            onChange={(event) => updateDefinition({
                                                ...definition,
                                                surveyDescription: event.target.value
                                            })}
                                        />
                                    </Stack>
                                </Paper>

                                <Paper variant="outlined" sx={{ p: 2 }}>
                                    {definition.questions.length === 0 ? (
                                        <Typography color="text.secondary">
                                            Add a question from the build panel to start shaping the survey.
                                        </Typography>
                                    ) : (
                                        <DragAndDrop
                                            categories={[questionCategory]}
                                            items={items}
                                            onChange={(changes: Map<string, unknown>, item?: SurveyQuestion) => {
                                                const activeId = item?.id;
                                                const newIndex = changes.get("newIndex");
                                                if (!activeId || typeof newIndex !== "number") {
                                                    return;
                                                }
                                                updateDefinition({
                                                    ...definition,
                                                    questions: reorderQuestions(definition.questions, String(activeId), newIndex)
                                                });
                                            }}
                                            headerRenderer={() => <Typography fontWeight={700}>Drag to reorder questions</Typography>}
                                            cardRenderer={(question: SurveyQuestion) => (
                                                <QuestionEditorCard
                                                    question={question}
                                                    onChange={(updater) => updateQuestion(question.id, updater)}
                                                    onDelete={() => updateDefinition({
                                                        ...definition,
                                                        questions: definition.questions.filter((candidate) => candidate.id !== question.id)
                                                    })}
                                                />
                                            )}
                                        />
                                    )}
                                </Paper>
                            </Stack>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

const QuestionPalette = ({
    onAddQuestion
}: {
    onAddQuestion: (kind: SurveyQuestionKind, preset?: string) => void;
}) => (
    <Stack gap={2}>
        <PaletteSection title="Contact fields">
            <PaletteButton label="Name" onClick={() => onAddQuestion("text", "name")} />
            <PaletteButton label="Email" onClick={() => onAddQuestion("text", "email")} />
            <PaletteButton label="Address" onClick={() => onAddQuestion("text", "address")} />
        </PaletteSection>
        <PaletteSection title="Choice questions">
            <PaletteButton label="Multiple choice" onClick={() => onAddQuestion("multipleChoice")} />
            <PaletteButton label="Checkboxes" onClick={() => onAddQuestion("multipleChoice", "multiple")} />
            <PaletteButton label="Dropdown" onClick={() => onAddQuestion("dropdown")} />
            <PaletteButton label="Ranking" onClick={() => onAddQuestion("ranking")} />
        </PaletteSection>
        <PaletteSection title="Scales">
            <PaletteButton label="Likert agreement" onClick={() => onAddQuestion("likert", "agreement")} />
            <PaletteButton label="Likert satisfaction" onClick={() => onAddQuestion("likert", "satisfaction")} />
            <PaletteButton label="Rating 1-10" onClick={() => onAddQuestion("rating")} />
            <PaletteButton label="Matrix" onClick={() => onAddQuestion("matrix")} />
        </PaletteSection>
        <PaletteSection title="Text">
            <PaletteButton label="Open-ended text" onClick={() => onAddQuestion("text")} />
        </PaletteSection>
    </Stack>
);

const PaletteSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <Box>
        <Typography variant="overline" color="text.secondary" sx={{ display: "block", mb: 1 }}>
            {title}
        </Typography>
        <Stack gap={1}>{children}</Stack>
    </Box>
);

const PaletteButton = ({ label, onClick }: { label: string; onClick: () => void }) => (
    <Button
        variant="outlined"
        size="small"
        startIcon={<AddIcon />}
        onClick={onClick}
        sx={{
            justifyContent: "flex-start",
            textTransform: "none",
            textAlign: "left",
            whiteSpace: "normal",
            py: 1,
        }}
    >
        {label}
    </Button>
);

const QuestionEditorCard = ({
    question,
    onChange,
    onDelete
}: {
    question: SurveyQuestion;
    onChange: (updater: (question: SurveyQuestion) => SurveyQuestion) => void;
    onDelete: () => void;
}) => (
    <Accordion disableGutters variant="outlined" sx={{ "&:before": { display: "none" } }}>
        <AccordionSummary>
            <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%">
                <Box>
                    <Typography variant="overline" color="text.secondary">{question.kind}</Typography>
                    <Typography fontWeight={700}>{question.title}</Typography>
                </Box>
                <IconButton onClick={(event) => {
                    event.stopPropagation();
                    onDelete();
                }}>
                    <DeleteOutlineIcon />
                </IconButton>
            </Stack>
        </AccordionSummary>
        <AccordionDetails>
            <Stack gap={2}>
                <TextField
                    fullWidth
                    label="Question title"
                    value={question.title}
                    onChange={(event) => onChange((current) => ({
                        ...current,
                        title: event.target.value
                    }))}
                />
                <TextField
                    fullWidth
                    multiline
                    minRows={2}
                    label="Help text"
                    value={question.description ?? ""}
                    onChange={(event) => onChange((current) => ({
                        ...current,
                        description: event.target.value
                    }))}
                />
                <FormControlLabel
                    control={<Switch checked={question.required} onChange={(event) => onChange((current) => ({ ...current, required: event.target.checked }))} />}
                    label="Required"
                />
                <QuestionSettingsEditor question={question} onChange={onChange} />
            </Stack>
        </AccordionDetails>
    </Accordion>
);

const QuestionSettingsEditor = ({
    question,
    onChange
}: {
    question: SurveyQuestion;
    onChange: (updater: (question: SurveyQuestion) => SurveyQuestion) => void;
}) => {
    switch (question.kind) {
        case "text":
            return (
                <Stack gap={2}>
                    <TextField
                        fullWidth
                        label="Placeholder"
                        value={question.settings.placeholder ?? ""}
                        onChange={(event) => onChange((current) => current.kind === "text" ? {
                            ...current,
                            settings: { ...current.settings, placeholder: event.target.value }
                        } : current)}
                    />
                    <FormControlLabel
                        control={<Switch checked={question.settings.multiline} onChange={(event) => onChange((current) => current.kind === "text" ? {
                            ...current,
                            settings: { ...current.settings, multiline: event.target.checked }
                        } : current)} />}
                        label="Allow multi-line response"
                    />
                </Stack>
            );
        case "multipleChoice":
            return (
                <Stack gap={2}>
                    <FormControlLabel
                        control={<Switch checked={question.settings.allowMultiple} onChange={(event) => onChange((current) => current.kind === "multipleChoice" ? {
                            ...current,
                            settings: { ...current.settings, allowMultiple: event.target.checked }
                        } : current)} />}
                        label="Allow multiple answers"
                    />
                    <OptionsEditor
                        options={question.settings.options}
                        onChangeOptions={(options) => onChange((current) => current.kind === "multipleChoice" ? {
                            ...current,
                            settings: { ...current.settings, options }
                        } : current)}
                    />
                </Stack>
            );
        case "likert":
            return (
                <Stack gap={2}>
                    <Select
                        value={question.settings.preset}
                        onChange={(event) => onChange((current) => current.kind === "likert" ? {
                            ...current,
                            settings: { ...current.settings, preset: event.target.value as "agreement" | "satisfaction" }
                        } : current)}
                    >
                        <MenuItem value="agreement">Agreement</MenuItem>
                        <MenuItem value="satisfaction">Satisfaction</MenuItem>
                    </Select>
                    <TextField
                        fullWidth
                        label="Low label"
                        value={question.settings.lowLabel}
                        onChange={(event) => onChange((current) => current.kind === "likert" ? {
                            ...current,
                            settings: { ...current.settings, lowLabel: event.target.value }
                        } : current)}
                    />
                    <TextField
                        fullWidth
                        label="High label"
                        value={question.settings.highLabel}
                        onChange={(event) => onChange((current) => current.kind === "likert" ? {
                            ...current,
                            settings: { ...current.settings, highLabel: event.target.value }
                        } : current)}
                    />
                </Stack>
            );
        case "rating":
            return (
                <Stack direction={{ xs: "column", md: "row" }} gap={2}>
                    <TextField
                        fullWidth
                        type="number"
                        label="Minimum"
                        value={question.settings.min}
                        onChange={(event) => onChange((current) => current.kind === "rating" ? {
                            ...current,
                            settings: { ...current.settings, min: Number(event.target.value) }
                        } : current)}
                    />
                    <TextField
                        fullWidth
                        type="number"
                        label="Maximum"
                        value={question.settings.max}
                        onChange={(event) => onChange((current) => current.kind === "rating" ? {
                            ...current,
                            settings: { ...current.settings, max: Number(event.target.value) }
                        } : current)}
                    />
                </Stack>
            );
        case "dropdown":
            return (
                <OptionsEditor
                    options={question.settings.options}
                    onChangeOptions={(options) => onChange((current) => current.kind === "dropdown" ? {
                        ...current,
                        settings: { ...current.settings, options }
                    } : current)}
                />
            );
        case "ranking":
            return (
                <OptionsEditor
                    options={question.settings.options}
                    onChangeOptions={(options) => onChange((current) => current.kind === "ranking" ? {
                        ...current,
                        settings: { ...current.settings, options }
                    } : current)}
                />
            );
        case "matrix":
            return (
                <Stack gap={2}>
                    <FormControlLabel
                        control={<Switch checked={question.settings.allowMultiple} onChange={(event) => onChange((current) => current.kind === "matrix" ? {
                            ...current,
                            settings: { ...current.settings, allowMultiple: event.target.checked }
                        } : current)} />}
                        label="Allow multiple selections per row"
                    />
                    <Typography variant="subtitle2">Rows</Typography>
                    <OptionsEditor
                        options={question.settings.rows}
                        onChangeOptions={(rows) => onChange((current) => current.kind === "matrix" ? {
                            ...current,
                            settings: { ...current.settings, rows }
                        } : current)}
                    />
                    <Typography variant="subtitle2">Columns</Typography>
                    <OptionsEditor
                        options={question.settings.columns}
                        onChangeOptions={(columns) => onChange((current) => current.kind === "matrix" ? {
                            ...current,
                            settings: { ...current.settings, columns }
                        } : current)}
                    />
                </Stack>
            );
    }
};

const OptionsEditor = ({
    options,
    onChangeOptions
}: {
    options: { id: string; label: string }[];
    onChangeOptions: (options: { id: string; label: string }[]) => void;
}) => (
    <Stack gap={1.5}>
        {options.map((option) => (
            <Stack key={option.id} direction="row" gap={1}>
                <TextField
                    fullWidth
                    size="small"
                    value={option.label}
                    onChange={(event) => onChangeOptions(options.map((current) =>
                        current.id === option.id ? { ...current, label: event.target.value } : current
                    ))}
                />
                <IconButton onClick={() => onChangeOptions(options.filter((current) => current.id !== option.id))}>
                    <DeleteOutlineIcon />
                </IconButton>
            </Stack>
        ))}
        <Button variant="text" startIcon={<AddIcon />} onClick={() => onChangeOptions([...options, createOption(`Option ${options.length + 1}`)])}>
            Add option
        </Button>
    </Stack>
);
