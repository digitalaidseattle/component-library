/**
 *  ProjectResponseDialog.ts
 * 
 *  @copyright 2026 Digital Aid Seattle
 *
 */
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Dialog, DialogActions, DialogContent, DialogTitle,
    Stack,
    Tooltip,
    Typography
} from "@mui/material";
import React, { useMemo } from "react";

import Markdown from "react-markdown";
import remarkGfm from 'remark-gfm';

import { Clipboard } from "@digitalaidseattle/mui";
import { Project, ProjectContent } from "../services";
import { exportProjectContent } from "../transactions/ExportProjectContent";

//Count words in string
function countWords(text: string): number {
    return text.trim() ? text.trim().split(/\s+/).length : 0;
}
//Count characters in a string
function countCharacters(text: string): number {
    return text.length;
}

interface ProjectContentDialogProps {
    title?: string;
    project: Project;
    content: ProjectContent;
    open: boolean
    onClose: () => void
};

const ProjectContentDialog = ({ title = "AI Generated Project", project, content, open, onClose }: ProjectContentDialogProps) => {
    const dialogRef = React.useRef<HTMLDivElement | null>(null);

    const reponses: {
        name: string;
        subheader: string;
        value: string;
    }[] | undefined = useMemo(() => {
        if (project && content && content.structuredResponse) {
            const outputs = project.outputs;
            return outputs.map((o) => {
                const value = content.structuredResponse ? content.structuredResponse[o.name] : "";
                const wordCount = countWords(value);
                const charCount = countCharacters(value);
                return {
                    name: o.name,
                    subheader: o.unit === "words" ? `${wordCount} / ${o.maxWords} words` : `${charCount} / ${o.maxWords} characters`,
                    value: value
                }
            })
        }
    }, [project, content]);

    async function handleExport() {
        await exportProjectContent(content);
    }

    function handleClose(_event: {}, reason: "backdropClick" | "escapeKeyDown"): void {
        if (reason) {
            // ignore
        } else {
            onClose();
        }
    }

    return (content &&
        <Dialog
            fullWidth={true}
            maxWidth={'lg'}
            open={open}
            onClose={handleClose}
            sx={{ minHeight: '600px' }}>
            <DialogTitle sx={{ fontSize: 16, fontWeight: 600 }}>{`${content.name}`}</DialogTitle>
            <DialogContent>
                <Typography>Total token count: {content.totalTokenCount ?? "N/A"}</Typography>
            </DialogContent>
            <DialogContent>
                <Stack gap={1}>
                    {content.markdownResponse &&
                        <Markdown remarkPlugins={[remarkGfm]}>{content.markdownResponse}</Markdown>
                    }
                    {reponses &&
                        reponses.map((section) => {
                            return (
                                <Card key={section.name} variant="outlined">
                                    <CardHeader
                                        title={section.name}
                                        subheader={section.subheader}
                                        action={
                                            <Tooltip title="Copies this section of the proposal into clipboard.">
                                                <Box>
                                                    <Clipboard text={section.value} parentRef={dialogRef.current} />
                                                </Box>
                                            </Tooltip>
                                        }
                                    />
                                    <CardContent>
                                        <Markdown>{section.value}</Markdown>
                                    </CardContent>
                                </Card>
                            );
                        })
                    }
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button
                    variant='outlined'
                    onClick={() => handleExport()}>Export</Button>
                <Button
                    variant='outlined'
                    onClick={onClose}>OK</Button>
            </DialogActions>
        </Dialog>
    )
}

export { ProjectContentDialog };
