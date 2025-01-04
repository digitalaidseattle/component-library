/**
 * Privacy.tsx
 * Example of reader a stored file and displaying

*/
// material-ui
import React, { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import Markdown from 'react-markdown';

import { useStorageService } from '@digitalaidseattle/core';

export interface MarkdownPageProps {
    filepath: string
}

const MarkdownPage: React.FC<MarkdownPageProps> = ({ filepath }) => {
    const [file, setFile] = useState('');
    const storageService = useStorageService()

    useEffect(() => {
        if (storageService) {
            storageService.downloadFile(filepath)
                .then((text: string) => setFile(text))
                .catch((err: any) => alert(err))
        }
    }, [storageService, filepath]);

    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item>
                <Markdown>
                    {file}
                </Markdown>
            </Grid>
        </Grid>
    );
}

export default MarkdownPage;
