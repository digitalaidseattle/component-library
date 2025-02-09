/**
 *  taskDialog.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import { InputForm } from '@digitalaidseattle/mui';
import { Button, Dialog, DialogActions, DialogContent, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Project, projectService } from './projectService';
import { InputOption } from '@digitalaidseattle/mui/dist/declarations/src/components/InputForm';

// material-ui

interface EntityDialogProps<T> {
    entity: T;
    open: boolean;
    handleSuccess: (resp: T | null) => void;
    handleError: (err: Error) => void;
}

interface InputOption {
    name: string;
    label: string;
    type: string;
    disabled: boolean;
    options?: { label: string, value: string }[];
}


const ProjectDialog: React.FC<EntityDialogProps<Project>> = ({ open, entity, handleSuccess, handleError }) => {

    const [dirty, setDirty] = useState<boolean>(false);
    const [dialogTitle, setDialogTitle] = useState<string>('edit');
    const [project, setProject] = useState<Project>({} as Project);

    useEffect(() => {
        setDirty(false);
        setProject(Object.assign({}, entity));
    }, [entity]);


    useEffect(() => {
        setDialogTitle(project.id ? 'Update Project' : 'Add Project');
    }, [project]);


    const onChange = (field: string, value: any) => {
        // stringify & parse needed for string keys
        const updatedChanges = JSON.parse(`{ "${field}" : ${JSON.stringify(value)} }`)
        setProject({
            ...project,
            ...updatedChanges
        });
        setDirty(true);
    }
    
    const handleSubmit = () => {
        return projectService
            .update(project)
            .then(() => handleSuccess(project))
            .catch(e => handleError(e))
    }

    const inputFields: InputOption[] = [
        {
            name: "name",
            label: 'Name',
            type: 'string',
            disabled: false,
        },
        {
            name: "partner",
            label: 'Partner',
            type: 'string',
            disabled: false,
        },
        {
            name: "status",
            label: 'Status',
            type: 'select',
            options: [
                { label: 'New', value: 'new' },
                { label: 'In-Progress', value: 'inprogress' },
                { label: 'In Review', value: 'review' },
                { label: 'Complete', value: 'complete' }
            ],
            disabled: false,
        },
        {
            name: "createdAt",
            label: 'Created At',
            type: 'datetime',
            disabled: false,
        },
        {
            name: "createdAt",
            label: 'Created At',
            type: 'time',
            disabled: false,
        }
        
    ]

    return (
        <Dialog
            fullWidth={true}
            open={open}
            onClose={() => handleSuccess(null)}>
            <DialogContent>
                <Stack gap={2}>
                    <Typography variant='h4'>{dialogTitle}</Typography>
                    <InputForm
                        entity={project}
                        inputFields={inputFields}
                        onChange={onChange}
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button
                    variant='outlined'
                    sx={{ color: 'text.secondary'}}
                    onClick={() => handleSuccess(null)}>Cancel</Button>
                <Button
                    variant='contained'
                    sx={{ color: 'text.success'}}
                    onClick={handleSubmit}
                    disabled={!dirty}>OK</Button>
            </DialogActions>
        </Dialog>
    )
}
export default ProjectDialog;
