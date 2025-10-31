/**
 *  InputForm.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import React, { ReactNode, useEffect, useState } from 'react';

import { FormControl, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';
import { DatePicker, DateTimePicker, TimePicker } from "@mui/x-date-pickers";
import dayjs from 'dayjs';
import InputRating from './InputRating';

interface InputOption {
    name: string;
    label: string;
    type?: 'custom' | 'date' | 'time' | 'datetime' | 'select' | 'rating' | 'string'; // defaults to string
    disabled: boolean;
    size?: number;
    options?: { label: string, value: string }[];
    inputRenderer?: (idx: number, option: InputOption, value: any) => ReactNode;
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
            setInputs(inputFields.map((input, idx) => inputField(idx, input, (entity as any)[input.name])));
        }
    }, [inputFields, entity]);

    const inputField = (idx: number, option: InputOption, value: any) => {
        switch (option.type) {
            case 'custom':
                return option.inputRenderer!(idx, option, value)
            case 'date':
                return <DatePicker
                    key={`${idx}-${option.name}`}
                    label={option.label}
                    disabled={option.disabled}
                    value={dayjs(value)}
                    onChange={(value) => onChange(option.name, value?.toDate())}
                />
            case 'time':
                return <TimePicker
                    key={`${idx}-${option.name}`}
                    label={option.label}
                    disabled={option.disabled}
                    value={dayjs(value)}
                    onChange={(value) => onChange(option.name, value?.toDate())}
                />
            case 'datetime':
                return <DateTimePicker
                    label={option.label}
                    value={dayjs(value)}
                    onChange={(newValue) => onChange(option.name, newValue?.toDate())}
                />
            case 'select': {
                const menuItems = option.options!
                    .map((item: { label: string, value: string }, idx) =>
                        <MenuItem key={`m-${idx + 1}`} value={item.value} >{item.label}</MenuItem>
                    )
                return (
                    <FormControl fullWidth
                        key={`${idx}-${option.name}`} >
                        <InputLabel id={option.name + '-label'}>{option.label}</InputLabel>
                        <Select
                            id={option.name}
                            labelId={option.name + '-label'}
                            disabled={option.disabled}
                            value={value}
                            label={option.label}
                            onChange={(evt) => onChange(option.name, evt.target.value)}>
                            {[
                                <MenuItem key={`m-0`} value={undefined} ></MenuItem>,
                                ...menuItems]}
                        </Select>
                    </FormControl>
                )
            }
            case 'rating': {
                return <InputRating index={idx}
                    option={option}
                    value={value}
                    onChange={(field, value) => onChange(field, value)} />
            }
            case 'string':
            default:
                return (
                    <FormControl fullWidth
                        key={`${idx}-${option.name}`} >
                        <TextField
                            id={option.name}
                            name={option.name}
                            disabled={option.disabled}
                            type="text"
                            label={option.label}
                            multiline={option.size && option.size > 1 ? true : false}
                            rows={option.size ?? 1}
                            value={value ?? ''}
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
export { InputForm };
export type { InputOption };

