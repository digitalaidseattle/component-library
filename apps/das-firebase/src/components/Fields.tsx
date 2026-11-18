/**
 * Fields.tsx
 * Form building blocks for the venture debrief page
*/

import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
    Autocomplete,
    Button,
    Card,
    CardContent,
    CardHeader,
    FormControl,
    FormControlLabel,
    FormHelperText,
    FormLabel,
    IconButton,
    Radio,
    RadioGroup,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import React, { ReactNode } from "react";

// one numbered section of the venture evaluation card
export const Section: React.FC<{
    title: string,
    guidance?: string,
    action?: ReactNode,
    children: ReactNode
}> = ({ title, guidance, action, children }) => {
    return (
        <Card sx={{ flexShrink: 0 }}>
            <CardHeader
                title={<Typography variant="h5">{title}</Typography>}
                subheader={guidance}
                action={action}
                />

            <CardContent>{children}</CardContent>
        </Card>
    );
}

// editable list of single line entries, e.g. rationale bullets or links
export const StringListField: React.FC<{
    value: string[],
    onChange: (value: string[]) => void,
    label: string,
    addLabel: string
}> = ({ value, onChange, label, addLabel }) => {
    const entries = value.length > 0 ? value : [''];

    function change(index: number, text: string) {
        onChange(entries.map((entry, i) => i === index ? text : entry));
    }

    function remove(index: number) {
        onChange(entries.filter((_, i) => i !== index));
    }

    return (
        <Stack gap={1}>
            {entries.map((entry, index) =>
                <Stack key={index} direction="row" gap={1} alignItems="center">
                    <TextField
                        fullWidth
                        size="small"
                        label={`${label} ${index + 1}`}
                        value={entry}
                        onChange={evt => change(index, evt.target.value)} />
                    <IconButton aria-label={`Remove ${label} ${index + 1}`} onClick={() => remove(index)}>
                        <DeleteOutlined />
                    </IconButton>
                </Stack>
            )}
            <Button sx={{ alignSelf: 'flex-start' }} startIcon={<PlusOutlined />} onClick={() => onChange([...entries, ''])}>
                {addLabel}
            </Button>
        </Stack>
    );
}

// free text with suggestions taken from previous debriefs
export const SuggestField: React.FC<{
    value: string,
    onChange: (value: string) => void,
    label: string,
    options: string[],
    required?: boolean,
    error?: string
}> = ({ value, onChange, label, options, required, error }) => {
    return (
        <Autocomplete
            freeSolo
            options={options}
            inputValue={value ?? ''}
            onInputChange={(_evt, text) => onChange(text)}
            renderInput={(params) =>
                <TextField {...params} label={label} required={required} error={!!error} helperText={error} />}
        />
    );
}

// multiple free text values shown as chips
export const ChipsField: React.FC<{
    value: string[],
    onChange: (value: string[]) => void,
    label: string,
    options: string[],
    helperText?: string
}> = ({ value, onChange, label, options, helperText }) => {
    return (
        <Autocomplete
            multiple
            freeSolo
            options={options}
            value={value ?? []}
            onChange={(_evt, values) => onChange(values.map(v => v.trim()).filter(Boolean))}
            renderInput={(params) =>
                <TextField {...params} label={label} helperText={helperText ?? 'Press Enter to add'} />}
        />
    );
}

export const RadioField: React.FC<{
    value: string,
    onChange: (value: string) => void,
    label: string,
    options: string[],
    required?: boolean,
    error?: string
}> = ({ value, onChange, label, options, required, error }) => {
    return (
        <FormControl required={required} error={!!error}>
            <FormLabel>{label}</FormLabel>
            <RadioGroup row value={value ?? ''} onChange={evt => onChange(evt.target.value)}>
                {options.map(option =>
                    <FormControlLabel key={option} value={option} control={<Radio />} label={option} />
                )}
            </RadioGroup>
            {error && <FormHelperText>{error}</FormHelperText>}
        </FormControl>
    );
}
