/**
 *  ProgramAssessmentDialog.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import { Button, Dialog, DialogActions, DialogContent, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { ProgramAssessmentService } from '../services/programAssessmentService';
import { ProgramAssessment } from '../types';

interface EntityDialogProps<T> {
    entity: T;
    open: boolean;
    handleSuccess: (resp: T | null) => void;
}

export const ProgramAssessmentDialog: React.FC<EntityDialogProps<ProgramAssessment>> = ({ open, entity, handleSuccess }) => {
    const assessmentService = ProgramAssessmentService.getInstance();

    const {
        control,
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
    } = useForm<ProgramAssessment>({
        mode: 'onBlur',
        reValidateMode: 'onChange',
        defaultValues: entity ?? assessmentService.empty()
    });

    useEffect(() => {
        if (open && entity) {
            reset(entity);
        }
    }, [open, entity, reset]);

    const dialogTitle = entity?.id ? 'Update Program Assessment' : 'Add Program Assessment';

    const onSubmit: SubmitHandler<ProgramAssessment> = (data: ProgramAssessment) => {
        handleSuccess({
            ...entity,
            ...data,
            notes: (data.notes ?? []).map(s => s.trim()).filter(s => s.length > 0)
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
                    <TextField
                        label='Priority Score'
                        type='number'
                        {...register('priority_score', {
                            valueAsNumber: true
                        })}
                    />
                    {/* notes are edited one per line */}
                    <Controller
                        name='notes'
                        control={control}
                        render={({ field }) => (
                            <TextField
                                id='notes'
                                label='Notes'
                                helperText='One note per line'
                                multiline
                                minRows={3}
                                fullWidth
                                inputRef={field.ref}
                                onBlur={field.onBlur}
                                value={(field.value ?? []).join('\n')}
                                onChange={(event) => field.onChange(event.target.value.split('\n'))}
                            />
                        )}
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
