/**
 *  ProjectContextEditor.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import React, { useContext, useEffect, useState } from 'react';

import { DeleteOutlined, InfoCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, CardContent, CardHeader, FormControl, IconButton, OutlinedInput, Stack, Toolbar, Typography } from "@mui/material";

import { HelpTopicContext, StorageFile, useHelp, useNotifications } from '@digitalaidseattle/core';
import { getContentGenerationServices } from '../services';
import { Project, ProjectContext } from '../services/types';
import { AiProjectContext as ContentGenerationProjectContext } from './AiProjectContext';
import { FileUploadDialog } from './FileUploadDialog';
import { SplitButton } from '@digitalaidseattle/mui';

const SUPPORTED_FILE_TYPES = [
    "text/plain",
    "application/pdf",
    "text/html",
    "application/json",
    "text/markdown"];

interface ContextRowProps {
    index: number;
    context: ProjectContext;
    onChange: (index: number, param: ProjectContext) => void
    onDelete: (index: number) => void
};
const ContextRow = ({ index, context, onChange, onDelete }: ContextRowProps) => {

    function handleTextChange(e: React.ChangeEvent<HTMLInputElement>): void {
        onChange(index, { ...context, value: e.target.value });
    }

    return (
        <Stack
            direction={'row'}
            key={index}
            gap={1}
            sx={{
                position: 'relative',
                width: '100%'
            }}
        >
            <Button
                aria-label="remove context"
                color="error"
                onClick={() => onDelete(index)}>
                <DeleteOutlined />
            </Button>
            {(context.type === 'text') &&
                <OutlinedInput
                    fullWidth={true}
                    value={context.value}
                    placeholder='Enter context information here'
                    onChange={handleTextChange}
                    multiline={true}
                    rows={1}
                    sx={{
                        '& .MuiInputBase-input': {
                            resize: 'vertical',
                            overflow: 'auto',
                        }
                    }} />}
            {(SUPPORTED_FILE_TYPES.includes(context.type)) &&
                <>
                    <FormControl fullWidth={true} sx={{ border: '1px solid', borderBlockColor: 'grey', padding: 2, borderRadius: 1, pr: 1 }}>
                        <Typography >File: {context.name}</Typography>
                    </FormControl>
                </>
            }
            <Typography variant="body2" sx={{ alignSelf: 'center', minWidth: 80 }}>
                Tokens: {context.tokenCount}
            </Typography>
        </Stack >
    )
}

const HELP_TOPIC= "Contexts";

type ProjectContextEditorProps = {
    title: string;
    onChange: (recipe: Project) => void;
};

export const ProjectContextEditor: React.FC<ProjectContextEditorProps> = ({ title, onChange }) => {

    const aiService = getContentGenerationServices().aiService;
    const notifications = useNotifications();

    const { setHelpTopic } = useContext(HelpTopicContext);
    const { setShowHelp } = useHelp();
    const { project } = useContext(ContentGenerationProjectContext);
    const [contexts, setContexts] = React.useState<ProjectContext[]>([]);

    const [showUploadDialog, setShowUploadDialog] = useState<boolean>(false);
    useEffect(() => {
        setContexts(project ? project.contexts : []);
    }, [project]);

    async function addContexts(newContexts: ProjectContext[]) {
        const revised = [...(contexts ?? []), ...newContexts]
        onChange({ ...project, contexts: revised });
    }

    async function udpateContext(index: number, revised: ProjectContext) {
        revised.tokenCount = await aiService.calcTokenCount(project.modelType, revised.value || '');
        contexts[index] = revised;
        onChange({ ...project, contexts: contexts.slice() });
    }

    function removeContext(index: number) {
        const revised = contexts.filter((_, i) => i !== index);
        onChange({ ...project, contexts: revised });
    }

    async function handleFileSelection(files: (File | StorageFile)[] | null) {
        if (files) {
            const contexts = files
                .filter(file => {
                    const fileType = file.type;
                    if (!fileType || !SUPPORTED_FILE_TYPES.includes(fileType)) {
                        const message = `Unsupported file type: ${file.type}. Supported types are: ${SUPPORTED_FILE_TYPES.join(", ")}`;
                        notifications.error(message);
                        throw new Error(message);
                    } else {
                        return true;
                    }
                })
                .map(async file => {
                    const tokenCount = file instanceof File
                        ? await aiService.calcFileTokenCount(project.modelType, file)
                        : await aiService.calcStorageFileTokenCount(project.modelType, file);
                    return ({
                        type: file.type!,
                        value: "",
                        name: file.name,
                        tokenCount: tokenCount,
                        file: file
                    });
                })
            addContexts(await Promise.all(contexts));
        }
        setShowUploadDialog(false);
    }

    async function handleAddContext(option: string): Promise<void> {
        switch (option) {
            case "text":
                addContexts([{
                    type: "text",
                    value: "",
                    name: "",
                    tokenCount: 0
                }]);
                break;
            default:
                setShowUploadDialog(true);
        }
    }


    return (
        <Card>
            <CardHeader title={title}
                action={
                    <SplitButton
                        variant='outlined'
                        options={[
                            { label: `Add file`, value: 'file' },
                            { label: `Add text`, value: 'text' }
                        ]}
                        onClick={(option: string) => handleAddContext(option)} />
                }
                slotProps={{ title: { fontWeight: 600, fontSize: 16 } }}
                avatar={<IconButton
                    onClick={() => { setHelpTopic(HELP_TOPIC); setShowHelp(true) }}
                    color="primary"><InfoCircleOutlined /></IconButton>} />
            <CardContent>
                <Stack gap={2}>
                    {(contexts ?? []).map((context, idx) => (
                        <ContextRow
                            key={idx}
                            index={idx}
                            context={context}
                            onChange={udpateContext}
                            onDelete={removeContext} />
                    ))}
                </Stack>
                <FileUploadDialog
                    open={showUploadDialog}
                    onChange={(files) => { handleFileSelection(files) }}
                />
            </CardContent>
        </Card>
    );
};
