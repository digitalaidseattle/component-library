
import { TextField } from "@mui/material";
import { SetStateAction, useEffect, useState } from "react";

type DebouncedTextFieldProps = {
    value: string;
    label?: string;
    variant?: "outlined" | "filled" | "standard";
    style?: React.CSSProperties;
    onChange: (newValue: string) => void;
};
const DebouncedTextField: React.FC<DebouncedTextFieldProps> = ({
    value,
    label,
    variant = "outlined",
    style,
    onChange }) => {
    const [inputValue, setInputValue] = useState(value);
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebouncedValue(inputValue);
            onChange(inputValue);
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [inputValue, 500]);


    function handleInputChange(event: { target: { value: SetStateAction<string>; }; }) {
        setInputValue(event.target.value);
    };

    return <TextField
        label={label}
        variant={variant}
        value={debouncedValue}
        onChange={handleInputChange}
        style={style} />;
};


export default DebouncedTextField;