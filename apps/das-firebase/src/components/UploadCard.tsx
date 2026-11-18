/**
 * projects/index.tsx
 * Example of firestore
*/


import React, { useContext, useEffect, useState } from "react";

import { Box, Button, Card, CardHeader, CircularProgress, Stack, Toolbar, Typography } from "@mui/material";
import Dropzone from "react-dropzone";

import { RefreshContext, useNotifications } from "@digitalaidseattle/core";



export type FileValidation = { valid: boolean, errors?: string[] };
type UploadCardProps = {
    onValidate(files: File[]): Promise<FileValidation[]>;
    onSubmit(files: File[]): Promise<string>;
}

export const UploadCard: React.FC<UploadCardProps> = ({ onValidate, onSubmit }) => {
    const { setRefresh } = useContext(RefreshContext);
    const notifications = useNotifications();

    const [files, setFiles] = React.useState<File[]>([]);
    const [validations, setValidations] = useState<Map<File, FileValidation>>(new Map());
    const [thinking, setThinking] = useState<boolean>(false);

    const allValid = files.length > 0
        && files.every(file => validations.get(file)?.valid);

    useEffect(() => {
        if (files.length === 0) {
            setValidations(new Map());
            setThinking(false);
            return;
        }

        let active = true;
        setThinking(true);
        onValidate(files)
            .catch((err: Error): FileValidation[] =>
                files.map(() => ({ valid: false, errors: [err.message] })))
            .then(results => {
                if (active) {
                    // results are in the same order as files
                    setValidations(new Map(files.map((file, idx) => [file, results[idx]])));
                }
            })
            .finally(() => {
                if (active) {
                    setThinking(false);
                }
            });
        return () => { active = false; };
    }, [files]);


    function handleClearClick() {
        setFiles([]);
    }

    async function handleAddClick() {
        setThinking(true);
        onSubmit(files)
            .then((message) => {
                setRefresh(Date.now());
                setFiles([]);
                notifications.success(message)
            })
            .finally(() => setThinking(false))
    }

    return (
        <Card>
            <CardHeader title="Upload"></CardHeader>
            <Stack gap={1} m={1}>
                <Dropzone onDrop={acceptedFiles => setFiles([...files, ...acceptedFiles])}>
                    {({ getRootProps, getInputProps }) => (
                        <section>
                            <Box {...getRootProps()}
                                sx={{
                                    border: (theme) => `2px dashed ${theme.palette.divider}`,
                                    p: 2,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}>
                                <input {...getInputProps()} />
                                <Typography>Drag 'n' drop some files here, or click to select files</Typography>
                            </Box>
                        </section>
                    )}
                </Dropzone>
                {files.map((file, idx) => {
                    const validation = validations.get(file);
                    return (
                        <Box key={`${file.name}-${idx}`}>
                            <Typography color={validation && !validation.valid ? 'error' : undefined}>
                                {file.name}
                            </Typography>
                            {validation?.errors?.map((error, errIdx) =>
                                <Typography key={errIdx} variant="caption" color="error" display="block">
                                    {error}
                                </Typography>
                            )}
                        </Box>
                    );
                })}
                <Toolbar sx={{ gap: 2, alignItems: 'flex-end' }}>
                    <Button
                        variant="outlined"
                        size="medium"
                        onClick={handleClearClick}>Clear</Button>
                    <Button
                        variant="outlined"
                        size="medium"
                        disabled={thinking || !allValid}
                        onClick={handleAddClick}>Add {thinking && <CircularProgress size={24} />}</Button>
                </Toolbar>
            </Stack>
        </Card >
    );
}
