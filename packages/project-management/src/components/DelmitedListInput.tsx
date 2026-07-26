import React, { useState, useCallback } from 'react';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import { FormControl, FormLabel, IconButton, InputAdornment } from '@mui/material';
import { PlusCircleOutlined } from "@ant-design/icons";
/**
 * DelimitedListInput
 *
 * A MUI TextField that accepts a comma-delimited string of values and
 * exposes the parsed result as a string array via onChange.
 *
 * - Typing "a, b,, c" -> ['a', 'b', 'c'] (empty entries and surrounding
 *   whitespace are stripped).
 * - The raw text is kept in local state so the user can freely type
 *   commas/spaces without the field fighting them; parsing happens on
 *   every keystroke, but you can switch to parsing onBlur if preferred
 *   (see the `parseOn` prop).
 *
 * Props:
 * - value: string[]            current array value (controlled)
 * - onChange: (string[]) => void   called with the parsed array
 * - label, placeholder, helperText, error, disabled, fullWidth, size: passed to TextField
 * - delimiter: string          defaults to ','
 * - parseOn: 'change' | 'blur' defaults to 'change'
 * - showChips: boolean         renders parsed values as chips below the field, defaults to true
 */
type DelimitedListInputProps = {
    value: string[];
    onChange: (next: string[]) => void;
    label?: React.ReactNode;
    placeholder?: string;
    delimiter?: string;
    error?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
    size?: 'small' | 'medium';
    [key: string]: any;
};

export default function DelimitedListInput({
    value = [],
    onChange,
    label = 'Values',
    placeholder = 'apple, banana, cherry',
    delimiter = ',',
    error = false,
    disabled = false,
    fullWidth = true,
    size = 'medium',
    ...rest
}: DelimitedListInputProps) {
    // Keep the raw text separately so users can type freely (e.g. trailing
    // commas, spaces) without the array<->string round-trip clobbering it.
    const [rawText, setRawText] = useState<string>('');

    const parseList = useCallback(
        (text: string) =>
            text
                .split(delimiter)
                .map((s) => s.trim())
                .filter((s) => s.length > 0),
        [delimiter]
    );

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const text = e.target.value;
        setRawText(text);
    };

    const handleDeleteChip = (indexToRemove: number) => {
        const next = value.filter((_, i) => i !== indexToRemove);
        onChange?.(next);
    };

    const handleKeyDown = (evt: React.KeyboardEvent<HTMLDivElement>) => {
        if (evt.key === 'Enter') {
            processText();
        }
    };

    function processText() {
        // parse raw text before adding
        const parsed = parseList(rawText);
        onChange?.([...value, ...parsed]);
        setRawText('');
    };

    return (
        <FormControl fullWidth={fullWidth}>
            <FormLabel>{label}</FormLabel>
            <Box
                sx={{
                    width: fullWidth ? "100%" : "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,              // Space between chips and text field
                    mt: 1,
                    p: 1.5,
                    border: 1,
                    borderColor: error ? "error.main" : "divider",
                    borderRadius: 1,
                    bgcolor: "background.paper",
                    "&:focus-within": {
                        borderColor: "primary.main",
                        borderWidth: 2,
                    },
                }}
            >

                {value.length > 0 && (
                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 0.5,
                        }}
                    >
                        {value.map((item, index) => (
                            <Chip
                                key={`${item}-${index}`}
                                label={item}
                                size="small"
                                onDelete={
                                    disabled
                                        ? undefined
                                        : () => handleDeleteChip(index)
                                }
                            />
                        ))}
                    </Box>
                )}
                <TextField
                    placeholder={placeholder}
                    value={rawText}
                    onKeyUpCapture={handleKeyDown}
                    onChange={handleTextChange}
                    error={error}
                    disabled={disabled}
                    fullWidth
                    variant="outlined"
                    title="Hit Enter to create list"
                    slotProps={{
                        input: {
                            startAdornment: <InputAdornment position="start">
                                <IconButton
                                    aria-label={'Add entry'}
                                    onClick={processText}
                                    edge="end"
                                >
                                    <PlusCircleOutlined />
                                </IconButton>
                            </InputAdornment>,
                        },
                    }}
                    {...rest}
                />
            </Box>
        </FormControl>
    );
}

/* Example usage:

import { useState } from 'react';

function Example() {
  const [tags, setTags] = useState(['react', 'mui']);

  return (
    <DelimitedListInput
      label="Tags"
      value={tags}
      onChange={setTags}
    />
  );
}

*/
