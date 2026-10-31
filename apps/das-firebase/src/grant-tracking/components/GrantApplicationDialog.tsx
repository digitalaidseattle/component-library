/**
 *  GrantApplicationDialog.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import { Button, Dialog, DialogActions, DialogContent, MenuItem, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { GrantApplicationService } from '../services/grantApplicationService';
import { GrantApplication } from '../types';

interface EntityDialogProps<T> {
    entity: T;
    open: boolean;
    handleSuccess: (resp: T | null) => void;
}

const STATUS_OPTIONS = ['To Apply', 'In Progress', 'Applied', 'Closed', 'Next Cycle', 'Declined'];

export const GrantApplicationDialog: React.FC<EntityDialogProps<GrantApplication>> = ({ open, entity, handleSuccess }) => {
    const applicationService = GrantApplicationService.getInstance();

    const {
        control,
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
    } = useForm<GrantApplication>({
        mode: 'onBlur',
        reValidateMode: 'onChange',
        defaultValues: entity ?? applicationService.empty()
    });

    useEffect(() => {
        if (open && entity) {
            reset(entity);
        }
    }, [open, entity, reset]);

    const dialogTitle = entity?.id ? 'Update Grant Application' : 'Add Grant Application';

    const onSubmit: SubmitHandler<GrantApplication> = (data: GrantApplication) => {
        handleSuccess({
            ...entity,
            ...data
        });
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
                        label='Email'
                        type='email'
                        {...register('email', {
                            required: 'Email is required'
                        })}
                        required
                        error={!!errors.email}
                        helperText={errors.email?.message}
                    />
                    <Controller
                        name='status'
                        control={control}
                        rules={{ required: 'Status is required' }}
                        render={({ field }) => (
                            <TextField
                                select
                                id='status'
                                label='Status'
                                required
                                fullWidth
                                inputRef={field.ref}
                                onBlur={field.onBlur}
                                value={field.value ?? ''}
                                onChange={field.onChange}
                                error={!!errors.status}
                                helperText={errors.status?.message}
                            >
                                {STATUS_OPTIONS.map(option => (
                                    <MenuItem key={option} value={option}>{option}</MenuItem>
                                ))}
                            </TextField>
                        )}
                    />
                    <TextField
                        label='Notes'
                        multiline
                        minRows={3}
                        {...register('notes')}
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
