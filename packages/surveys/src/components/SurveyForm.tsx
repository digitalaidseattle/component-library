import {
    Box,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    InputLabel,
    MenuItem,
    Paper,
    Radio,
    RadioGroup,
    Select,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Typography
} from "@mui/material";
import React, { useMemo, useState } from "react";
import { SurveyDefinition, SurveyQuestion, SurveyRankingQuestion } from "../services";

type AnswerMap = Record<string, unknown>;

export const SurveyForm = ({ definition }: { definition: SurveyDefinition }) => {
    const [answers, setAnswers] = useState<AnswerMap>({});

    return (
        <Stack gap={2}>
            <Paper variant="outlined" sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>{definition.surveyTitle ?? "Untitled survey"}</Typography>
                <Typography color="text.secondary">{definition.surveyDescription ?? "No introduction provided."}</Typography>
            </Paper>

            {definition.questions.map((question, index) => (
                <Paper key={question.id} variant="outlined" sx={{ p: 3 }}>
                    <Stack gap={2}>
                        <Box>
                            <Typography variant="subtitle1" fontWeight={700}>
                                {index + 1}. {question.title}
                            </Typography>
                            {question.description && (
                                <Typography variant="body2" color="text.secondary">
                                    {question.description}
                                </Typography>
                            )}
                        </Box>
                        {renderQuestion(question, answers[question.id], (value) => {
                            setAnswers((current) => ({
                                ...current,
                                [question.id]: value
                            }));
                        })}
                    </Stack>
                </Paper>
            ))}
        </Stack>
    );
};

function renderQuestion(question: SurveyQuestion, value: unknown, onChange: (value: unknown) => void) {
    switch (question.kind) {
        case "text":
            return (
                <TextField
                    fullWidth
                    multiline={question.settings.multiline}
                    minRows={question.settings.multiline ? 3 : 1}
                    placeholder={question.settings.placeholder}
                    type={question.settings.inputType === "email" ? "email" : "text"}
                    value={(value as string) ?? ""}
                    onChange={(event) => onChange(event.target.value)}
                />
            );
        case "multipleChoice":
            if (question.settings.allowMultiple) {
                const selected = new Set((value as string[] | undefined) ?? []);
                return (
                    <FormGroup>
                        {question.settings.options.map((option) => (
                            <FormControlLabel
                                key={option.id}
                                control={
                                    <Checkbox
                                        checked={selected.has(option.id)}
                                        onChange={(event) => {
                                            const next = new Set(selected);
                                            if (event.target.checked) {
                                                next.add(option.id);
                                            } else {
                                                next.delete(option.id);
                                            }
                                            onChange([...next]);
                                        }}
                                    />
                                }
                                label={option.label}
                            />
                        ))}
                    </FormGroup>
                );
            }

            return (
                <RadioGroup value={(value as string) ?? ""} onChange={(event) => onChange(event.target.value)}>
                    {question.settings.options.map((option) => (
                        <FormControlLabel key={option.id} value={option.id} control={<Radio />} label={option.label} />
                    ))}
                </RadioGroup>
            );
        case "likert":
            return (
                <Stack gap={1}>
                    <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">{question.settings.lowLabel}</Typography>
                        <Typography variant="body2" color="text.secondary">{question.settings.highLabel}</Typography>
                    </Stack>
                    <ToggleButtonGroup exclusive fullWidth value={(value as string) ?? ""} onChange={(_, next) => next !== null && onChange(next)}>
                        {question.settings.options.map((option) => (
                            <ToggleButton key={option.id} value={option.id}>{option.label}</ToggleButton>
                        ))}
                    </ToggleButtonGroup>
                </Stack>
            );
        case "rating": {
            const values = Array.from({ length: question.settings.max - question.settings.min + 1 }, (_, index) => question.settings.min + index);
            return (
                <ToggleButtonGroup exclusive fullWidth value={(value as number | undefined) ?? null} onChange={(_, next) => next !== null && onChange(next)}>
                    {values.map((rating) => (
                        <ToggleButton key={rating} value={rating}>{rating}</ToggleButton>
                    ))}
                </ToggleButtonGroup>
            );
        }
        case "dropdown":
            return (
                <FormControl fullWidth>
                    <InputLabel id={`${question.id}-label`}>Select one</InputLabel>
                    <Select
                        labelId={`${question.id}-label`}
                        label="Select one"
                        value={(value as string) ?? ""}
                        onChange={(event) => onChange(event.target.value)}
                    >
                        {question.settings.options.map((option) => (
                            <MenuItem key={option.id} value={option.id}>{option.label}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            );
        case "matrix": {
            const matrixValue = (value as Record<string, string | string[]> | undefined) ?? {};
            return (
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            {question.settings.columns.map((column) => (
                                <TableCell key={column.id} align="center">{column.label}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {question.settings.rows.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>{row.label}</TableCell>
                                {question.settings.columns.map((column) => (
                                    <TableCell key={column.id} align="center">
                                        {question.settings.allowMultiple ? (
                                            <Checkbox
                                                checked={Array.isArray(matrixValue[row.id]) && matrixValue[row.id].includes(column.id)}
                                                onChange={(event) => {
                                                    const current = Array.isArray(matrixValue[row.id]) ? [...matrixValue[row.id] as string[]] : [];
                                                    const next = event.target.checked
                                                        ? [...current, column.id]
                                                        : current.filter((item) => item !== column.id);
                                                    onChange({
                                                        ...matrixValue,
                                                        [row.id]: next
                                                    });
                                                }}
                                            />
                                        ) : (
                                            <Radio
                                                checked={matrixValue[row.id] === column.id}
                                                onChange={() => onChange({
                                                    ...matrixValue,
                                                    [row.id]: column.id
                                                })}
                                            />
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            );
        }
        case "ranking":
            return <RankingQuestion question={question} value={value} onChange={onChange} />;
    }
}

const RankingQuestion = ({
    question,
    value,
    onChange
}: {
    question: SurveyRankingQuestion;
    value: unknown;
    onChange: (value: unknown) => void;
}) => {
    const initialOrder = useMemo(() => question.settings.options.map((option) => option.id), [question.settings.options]);
    const order = ((value as string[] | undefined) ?? initialOrder).filter((optionId) =>
        question.settings.options.some((option) => option.id === optionId)
    );

    const move = (from: number, to: number) => {
        if (to < 0 || to >= order.length) {
            return;
        }
        const next = [...order];
        const [moved] = next.splice(from, 1);
        next.splice(to, 0, moved);
        onChange(next);
    };

    return (
        <Stack gap={1.5}>
            {order.map((optionId, index) => {
                const option = question.settings.options.find((candidate) => candidate.id === optionId);
                if (!option) {
                    return null;
                }
                return (
                    <Paper key={option.id} variant="outlined" sx={{ p: 1.5 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography>{index + 1}. {option.label}</Typography>
                            <Stack direction="row" gap={1}>
                                <ToggleButton value="up" size="small" disabled={index === 0} onClick={() => move(index, index - 1)}>
                                    Up
                                </ToggleButton>
                                <ToggleButton value="down" size="small" disabled={index === order.length - 1} onClick={() => move(index, index + 1)}>
                                    Down
                                </ToggleButton>
                            </Stack>
                        </Stack>
                    </Paper>
                );
            })}
        </Stack>
    );
};
