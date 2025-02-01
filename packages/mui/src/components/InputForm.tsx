/**
 *  taskDialog.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import React, { ReactNode } from 'react';
import { FormControl, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';
import { useEffect, useState } from 'react';

// TODO add more input types
// TODO change input types into enum

// enum InputType {
//     String = "string",
//     Text = "text"
// }

interface InputOption {
    name: string;
    label: string;
    type: string;
    disabled: boolean;
    options?: { label: string, value: string }[];
}

interface InputFormProps<T> {
    entity: T;
    inputFields: InputOption[]
    onChange: (field: string, value: any) => void;
}

const InputForm: React.FC<InputFormProps<any>> = <T,>({ entity, inputFields, onChange }: InputFormProps<T>) => {

    const [inputs, setInputs] = useState<ReactNode[]>([]);

    useEffect(() => {
        if (entity && inputFields.length > 0) {
            setInputs(inputFields.map(ii => inputField(ii, (entity as any)[ii.name])));
        }
    }, [inputFields, entity]);

    const inputField = (option: InputOption, value: string) => {
        switch (option.type) {
            case 'select': {
                const menutItems = option.options!
                    .map((item: { label: string, value: string }, idx) => <MenuItem key={`m-${idx}`} value={item.value} >{item.label}</MenuItem>)
                return (value &&
                    <FormControl fullWidth key={option.name}>
                        <InputLabel id={option.name + '-label'}>{option.label}</InputLabel>
                        <Select
                            labelId={option.name + '-label'}
                            id={option.name}
                            value={value}
                            label={option.label}
                            onChange={(evt) => onChange(option.name, evt.target.value)}>
                            {menutItems}
                        </Select>
                    </FormControl>
                )
            }
            case 'string':
            default:
                return (
                    <FormControl fullWidth key={option.name}>
                        <TextField
                            id={option.name}
                            name={option.name}
                            disabled={option.disabled}
                            type="text"
                            label={option.label}
                            value={value}
                            fullWidth
                            variant="outlined"
                            onChange={(evt) => onChange(option.name, evt.target.value)}
                        />
                    </FormControl>
                );
        }
    }

    return (
        <Stack gap={2}>
            {inputs}
        </Stack>
    )
}
export default InputForm;
export type { InputOption }