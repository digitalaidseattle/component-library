/**
 *  taskDialog.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import { InputForm, InputOption } from '@digitalaidseattle/mui';
import { Button, Dialog, DialogActions, DialogContent, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { FundersService } from '../services/fundersService';
import { Funder } from '../types';

// material-ui

interface EntityDialogProps<T> {
    entity: T;
    open: boolean;
    handleSuccess: (resp: T | null) => void;
}

export const FunderDialog: React.FC<EntityDialogProps<Funder>> = ({ open, entity, handleSuccess }) => {
    const fundersService = FundersService.getInstance();

    const [dirty, setDirty] = useState<boolean>(false);
    const [dialogTitle, setDialogTitle] = useState<string>('edit');
    const [institution, setInstitution] = useState<Funder>(fundersService.empty());

    useEffect(() => {
        setDirty(false);
        setInstitution(Object.assign({}, entity));
    }, [entity]);


    useEffect(() => {
        setDialogTitle(institution.id ? 'Update Funder' : 'Add Funder');
    }, [institution]);


    const onChange = (field: string, value: any) => {
        // stringify & parse needed for string keys
        const updatedChanges = JSON.parse(`{ "${field}" : ${JSON.stringify(value)} }`)
        setInstitution({
            ...institution,
            ...updatedChanges
        });
        setDirty(true);
    }

    const handleSubmit = () => {
        handleSuccess(institution);
    }

    const inputFields: InputOption[] = [
        {
            name: "name",
            label: 'Name',
            type: 'string',
            disabled: false,
        },
        {
            name: "type",
            label: 'Type',
            type: 'select',
            disabled: false,
            options: [
                {
                    label: 'Funder Collaborative',
                    value: 'Funder Collaborative',
                },
                {
                    label: 'Private Foundation',
                    value: 'Private Foundation',
                },
                {
                    label: 'State/ Local Government',
                    value: 'State/ Local Government',
                },
                {
                    label: 'Fiscally sponsored',
                    value: 'Fiscally sponsored',
                },
                {
                    label: 'Public Foundation',
                    value: 'Public Foundation',
                },
                {
                    label: 'Venture Philanthropy',
                    value: 'Venture Philanthropy',
                },
                {
                    label: 'Grant Facilitator',
                    value: 'Grant Facilitator',
                }]
        },
        {
            name: "description",
            label: 'Description',
            type: 'string',
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
                        entity={institution}
                        inputFields={inputFields}
                        onChange={onChange}
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button
                    variant='outlined'
                    sx={{ color: 'text.secondary' }}
                    onClick={() => handleSuccess(null)}>Cancel</Button>
                <Button
                    variant='contained'
                    sx={{ color: 'text.success' }}
                    onClick={handleSubmit}
                    disabled={!dirty}>OK</Button>
            </DialogActions>
        </Dialog>
    )
}
