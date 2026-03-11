/**
 *  taskDialog.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import { InputForm, InputOption } from '@digitalaidseattle/mui';
import { Button, Dialog, DialogActions, DialogContent, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Institution, institutionService } from './institutionService';

// material-ui

interface EntityDialogProps<T> {
    entity: T;
    open: boolean;
    handleSuccess: (resp: T | null) => void;
    handleError: (err: Error) => void;
}

const InstitutionDialog: React.FC<EntityDialogProps<Institution>> = ({ open, entity, handleSuccess, handleError }) => {

    const [dirty, setDirty] = useState<boolean>(false);
    const [dialogTitle, setDialogTitle] = useState<string>('edit');
    const [institution, setInstitution] = useState<Institution>({} as Institution);

    useEffect(() => {
        setDirty(false);
        setInstitution(Object.assign({}, entity));
    }, [entity]);


    useEffect(() => {
        setDialogTitle(institution.id ? 'Update Institution' : 'Add Institution');
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
        if (institution.id) {
            return institutionService
                .update(institution.id, institution)
                .then(() => handleSuccess(institution))
                .catch(e => handleError(e))
        } else {
            return institutionService
                .insert(institution)
                .then(() => handleSuccess(institution))
                .catch(e => handleError(e))
        }
    }

    const inputFields: InputOption[] = [
        {
            name: "name",
            label: 'Name',
            type: 'string',
            disabled: false,
        },
        {
            name: "description",
            label: 'Description',
            type: 'string',
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
export default InstitutionDialog;
