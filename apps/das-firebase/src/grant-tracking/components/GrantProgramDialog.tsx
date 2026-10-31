/**
 *  GrantProgramDialog.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import { Button, Dialog, DialogActions, DialogContent, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { GrantProgramService } from '../services/grantProgramService';
import { GrantProgram } from '../types';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

interface EntityDialogProps<T> {
    entity: T;
    open: boolean;
    handleSuccess: (resp: T | null) => void;
}


type StringField = Exclude<keyof GrantProgram, 'id' | 'funder_id' | 'name' | 'focus_areas'>;

const TEXT_FIELDS: { name: StringField, label: string }[] = [
    { name: 'population_focus', label: 'Population Focus' },
    { name: 'mission_alignment', label: 'Mission Alignment' },
    { name: 'grant_range', label: 'Grant Range' },
    { name: 'operational_support', label: 'Operational Support' },
    { name: 'application_cycle', label: 'Application Cycle' },
    { name: 'typical_deadline', label: 'Typical Deadline' },
    { name: 'current_deadline', label: 'Current Deadline' },
    { name: 'geographic_scope', label: 'Geographic Scope' },
    { name: 'website', label: 'Website' },
];

export const GrantProgramDialog: React.FC<EntityDialogProps<GrantProgram>> = ({ open, entity, handleSuccess }) => {
    const programService = GrantProgramService.getInstance();

    const {
        control,
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
    } = useForm<GrantProgram>({
        mode: 'onBlur',
        reValidateMode: 'onChange',
        defaultValues: entity ?? programService.empty()
    });

    useEffect(() => {
        if (open && entity) {
            reset(entity);
        }
    }, [open, entity, reset]);

    const dialogTitle = entity?.id ? 'Update Grant Program' : 'Add Grant Program';

    const onSubmit: SubmitHandler<GrantProgram> = (data: GrantProgram) => {
        handleSuccess({
            ...entity,
            ...data,
            focus_areas: (data.focus_areas ?? []).map(s => s.trim()).filter(s => s.length > 0)
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
                        label='Name'
                        {...register('name', {
                            required: 'Name is required'
                        })}
                        required
                        error={!!errors.name}
                        helperText={errors.name?.message}
                    />
                    {/* focus areas are edited as a comma separated list */}
                    <Controller
                        name='focus_areas'
                        control={control}
                        render={({ field }) => (
                            <TextField
                                id='focus_areas'
                                label='Focus Areas'
                                fullWidth
                                inputRef={field.ref}
                                onBlur={field.onBlur}
                                value={(field.value ?? []).join(', ')}
                                onChange={(event) => field.onChange(event.target.value.split(/,\s*/))}
                            />
                        )}
                    />
                    {TEXT_FIELDS.map(({ name, label }) => (
                        <TextField
                            key={name}
                            label={label}
                            {...register(name)}
                        />
                    ))}
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
