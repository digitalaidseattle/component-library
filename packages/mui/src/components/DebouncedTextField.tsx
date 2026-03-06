/**
*  DebouncedTextField.tsx
*
*  @copyright 2026 Digital Aid Seattle
*
*/


import { TextField, TextFieldProps } from '@mui/material';
import React, { useEffect, useState } from 'react';

type DebouncedTextFieldProps = TextFieldProps & {
  value: string;
  debounceMs?: number;
  onDebouncedChange?: (value: string) => void;
};

export const DebouncedTextField: React.FC<DebouncedTextFieldProps> = ({
  value,
  debounceMs = 500,
  onDebouncedChange,
  ...props
}) => {
  const [internal, setInternal] = useState(value);

  useEffect(() => {
    setInternal(value);
  }, [value]);

  useEffect(() => {
    const handle = setTimeout(() => {
      onDebouncedChange?.(value);
    }, debounceMs);

    return () => clearTimeout(handle);
  }, [value, debounceMs, onDebouncedChange]);

  return (
    <TextField
      {...props}
      value={value}
      onChange={(e) => setInternal(e.target.value)}
    />
  );
};
