/**
*  DebouncedInputTextField.tsx
*
*  @copyright 2025 Digital Aid Seattle
*
*/

import React from "react"
import { TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { InputOption } from "./InputForm";

interface InputProps {
    index: number;
    option: InputOption;
    value: string,
    debounceTime?: number,
    onChange: (field: string, value: any) => void
}

const DEFAULT_DEBOUNCE = 500;

const DebouncedInputTextField: React.FC<InputProps> = ({ index, option, value, debounceTime, onChange }) => {
    const [inputValue, setInputValue] = useState('');
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(inputValue);
        }, debounceTime ?? DEFAULT_DEBOUNCE);

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