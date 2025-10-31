/**
*  DebouncedInputTextField.tsx
*
*  @copyright 2025 Digital Aid Seattle
*
*/

import { TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { InputOption } from "./InputForm";

interface InputProps {
    index: number;
    option: InputOption;
    value: number,
    onChange: (field: string, value: any) => void
}
function DebouncedInputTextField({ index, option, value, onChange }: InputProps) {
    const [inputValue, setInputValue] = useState('');
    const [debouncedValue, setDebouncedValue] = useState('');

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(inputValue);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [inputValue]);

    useEffect(() => {
        if (debouncedValue) {
            onChange(option.name, debouncedValue)
        }
    }, [debouncedValue]); // Re-run effect when debouncedValue changes

    return (
        <TextField
            key={index}
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
            onChange={(evt) => setInputValue(evt.target.value)}
        />
    );
}


export { DebouncedInputTextField }