
/**
 * MDXEditorField.tsx
 *
 *
 */

import React, { useEffect, useState } from "react";

import {
    BoldItalicUnderlineToggles,
    headingsPlugin,
    listsPlugin,
    ListsToggle,
    MDXEditor,
    toolbarPlugin,
    UndoRedo
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';
import {
    Box,
    FormControl,
    FormHelperText,
    FormLabel,
} from '@mui/material';
import {
    Control,
    Controller,
    FieldValues,
    Path,
} from 'react-hook-form';

type MDXEditorFieldProps<T extends FieldValues> = {
    name: Path<T>;
    control: Control<T>;
    label?: string;
    required?: boolean;
    minHeight?: number;
};

export function MDXEditorField<T extends FieldValues>({
    name,
    control,
    label,
    required = false,
    minHeight = 250,
}: MDXEditorFieldProps<T>): React.ReactNode {
    const [rules, setRules] = useState<any>();

    useEffect(() => {
        setRules(required && {
            required: `${label} is required.`,
            validate: (value: string) => value?.trim().length > 0 || `${label} is required.`,
        });
    }, [required, label]);

    return (
        <Controller
            name={name}
            control={control}
            rules={{ ...rules }}
            render={({ field, fieldState: { error } }) => {
                return (
                    <FormControl fullWidth
                        error={!!error}
                        required={required}
                        sx={{ mb: 2 }}>
                        <FormLabel sx={{ mb: 1, fontWeight: 'bold' }}>{label}</FormLabel>
                        <Box sx={{
                            border: '1px solid',
                            borderColor: error ? 'error.main' : 'grey.450',
                            borderRadius: 1,
                            overflow: 'hidden',
                            '& .mdxeditor': {
                                minHeight,
                            },
                        }}>
                            <MDXEditor
                                markdown={field.value}
                                onChange={value => {
                                    console.log(value)
                                    field.onChange(value)
                                }}
                                plugins={[
                                    headingsPlugin(),
                                    listsPlugin(),
                                    toolbarPlugin({
                                        toolbarClassName: 'my-classname',
                                        toolbarContents: () => (
                                            <>
                                                <UndoRedo />
                                                <BoldItalicUnderlineToggles />
                                                <ListsToggle />
                                            </>
                                        )
                                    })
                                ]}
                            />
                        </Box>
                        {error && <FormHelperText>{error.message}</FormHelperText>}
                    </FormControl>
                )
            }
            }
        />
    );
}