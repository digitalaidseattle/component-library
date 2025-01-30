/**
 *  taskDialog.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import { Button, Dialog, DialogActions, DialogContent, FormControl, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Project, projectService } from './projectService';

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
}

const iconBackColorOpen = 'grey.300';
const iconBackColor = 'grey.100';

const ProjectDialog: React.FC<EntityDialogProps<Project>> = ({ open, entity, handleSuccess, handleError }) => {

    const [dirty, setDirty] = useState<boolean>(false);
    const [dialogTitle, setDialogTitle] = useState<string>('edit');
    const [project, setProject] = useState<Project>({} as Project);

    useEffect(() => {
        setProject(Object.assign({}, entity));
    }, [entity]);


    useEffect(() => {
        setDialogTitle(project.id ? 'Update Project' : 'Add Project');
    }, [project]);

    const inputs: InputOption[] = [
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
    ]

    const change = (field: string, value: any) => {
        // stringify & parse needed for string keys
        const updatedChanges = JSON.parse(`{ "${field}" : ${JSON.stringify(value)} }`)
        setProject({
            ...project,
            ...updatedChanges
        });
        setDirty(true);
    }

    const inputField = (option: InputOption) => {
        switch (option.type) {
            case 'string':
            default:
                return (
                    <FormControl fullWidth key={option.name}>
                        <TextField
                            key={option.name}
                            id={option.name}
                            name={option.name}
                            disabled={option.disabled}
                            type="text"
                            label={option.label}
                            value={(project as any)[option.name]}
                            fullWidth
                            variant="outlined"
                            onChange={(evt) => change(option.name, evt.target.value)}
                        />
                    </FormControl>);
        }
    }

    const handleSubmit = () => {
        return projectService
            .update(project)
            .then(() => handleSuccess(project))
            .catch(e => handleError(e))
    }

    return (
        <Dialog
            fullWidth={true}
            open={open}
            onClose={() => handleSuccess(null)}>
            <DialogContent>
                <Stack gap={2}>
                    <Typography variant='h4'>{dialogTitle}</Typography>
                    {inputs.map(input => inputField(input))}
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button
                    variant='outlined'
                    sx={{ color: 'text.secondary', bgcolor: open ? iconBackColorOpen : iconBackColor }}
                    onClick={() => handleSuccess(null)}>Cancel</Button>
                <Button
                    variant='outlined'
                    sx={{ color: 'text.success', bgcolor: open ? iconBackColorOpen : iconBackColor }}
                    onClick={handleSubmit}
                    disabled={!dirty}>OK</Button>
            </DialogActions>
        </Dialog>
    )
}
export default ProjectDialog;
