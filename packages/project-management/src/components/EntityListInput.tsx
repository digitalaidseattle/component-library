import { CheckOutlined } from "@ant-design/icons";
import { Entity } from '@digitalaidseattle/core';
import { FormControl, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, SelectChangeEvent } from '@mui/material';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import React from 'react';
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
type EntityListInputProps<T extends Entity> = {
    source: T[];
    value: T[];
    onChange: (next: T[]) => void;
    label?: React.ReactNode;
    placeholder?: string;
    error?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
    size?: 'small' | 'medium';
    entityRender?: (entity: T) => React.ReactNode
};

export default function EntityListInput<T extends Entity>({
    source = [],
    value = [],
    onChange,
    label = 'Values',
    placeholder = 'apple, banana, cherry',
    error = false,
    disabled = false,
    fullWidth = true,
    size = 'medium',
    entityRender = (entity: T) => <Chip label={entity.id} />,
    ...rest
}: EntityListInputProps<T>) {

    const handleChange = (event: SelectChangeEvent<typeof value>) => {
        const selection = (event.target.value as any[]).pop();
        const targetIndex = (value as T[]).findIndex(v => v.id === selection);
        if (targetIndex > -1) {
            value.splice(targetIndex, 1)
        } else {
            const match = source.find(entity => selection === entity.id);
            value.push(match!)
        }
        onChange([...value])
    };

    return (
        <FormControl fullWidth={fullWidth}>
            <InputLabel id="multiple-checkbox-label">{label}</InputLabel>
            <Select
                labelId="multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={value}
                onChange={handleChange}
                input={<OutlinedInput label="Tag" />}
                renderValue={(selected) => selected.map(entity => <Box component="span" sx={{ marginRight: 1 }}>{entityRender(entity)}</Box>)}
            >
                {source.map((src) => {
                    const selected = value.find(entity => src.id === entity.id);
                    return (
                        <MenuItem key={src.id?.toString()} value={src.id?.toString()}>
                            <Box sx={{ minWidth: 25 }}>
                                {selected
                                    ? <CheckOutlined style={{ marginRight: 2 }} />
                                    : null
                                }
                            </Box>
                            < ListItemText primary={entityRender(src)} />
                        </MenuItem>
                    );
                })}
            </Select>
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
