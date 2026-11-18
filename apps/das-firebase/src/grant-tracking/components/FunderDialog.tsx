/**
 *  RHFunderDialog.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import { Button, Dialog, DialogActions, DialogContent, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { FundersService } from '../services/fundersService';
import { Funder } from '../types';

interface EntityDialogProps<T> {
    entity: T;
    open: boolean;
    handleSuccess: (resp: T | null) => void;
}

const FUNDER_TYPES = [
    'Funder Collaborative',
    'Private Foundation',
    'State/ Local Government',
    'Fiscally sponsored',
    'Public Foundation',
    'Venture Philanthropy',
    'Grant Facilitator'
];

export const FunderDialog: React.FC<EntityDialogProps<Funder>> = ({ open, entity, handleSuccess }) => {
    const fundersService = FundersService.getInstance();

    const {
        control,
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
    } = useForm<Funder>({
        mode: 'onBlur',
        reValidateMode: 'onChange',
        defaultValues: entity ?? fundersService.empty()
    });

    useEffect(() => {
        if (open && entity) {
            reset(entity);
        }
    }, [open, entity, reset]);

    const dialogTitle = entity?.id ? 'Update Funder' : 'Add Funder';

    const onSubmit: SubmitHandler<Funder> = (data: Funder) => {
        handleSuccess({ ...entity, ...data });
    };

    return (
        <Dialog
            fullWidth={true}
            open={open}
            onClose={() => handleSuccess(null)}>
            <DialogContent>
                <Stack gap={2}>
                    <Typography variant='h4'>{dialogTitle}</Typography>
                    <TextField
                        label='Name'
                        {...register('name', {
                            required: 'Name is required'
                        })}
                        required
                        error={!!errors.name}
                        helperText={errors.name?.message}
                    />
                    <FormControl fullWidth>
                        <InputLabel id='type-label'>Type</InputLabel>
                        <Controller
                            name='type'
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    id='type'
                                    labelId='type-label'
                                    label='Type'
                                    value={field.value ?? ''}
                                >
                                    <MenuItem value=''>
                                        <em>&lt;Make Selection&gt;</em>
                                    </MenuItem>
                                    {FUNDER_TYPES.map(type => (
                                        <MenuItem key={type} value={type}>{type}</MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                    </FormControl>
                    <TextField
                        label='Description'
                        {...register('description')}
                        multiline
                        minRows={3}
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
                    onClick={handleSubmit(onSubmit)}
                    disabled={!isDirty || Object.keys(errors).length > 0}>OK</Button>
            </DialogActions>
        </Dialog>
    )
}
