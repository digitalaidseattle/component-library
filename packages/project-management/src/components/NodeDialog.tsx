/**
 * NodeDialog
 *
 */

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import { NodeService } from '../services/NodeService';
import { Node } from '../types';
import { MDXEditorField } from './MDXEditorField';
import { ProgramContext } from './ProgramContext';

type NodeDialogProps = {
    title: string;
    node: Node;
    open: boolean;
    onChange: (updated: Node | null) => void
};

export default function NodeDialog({
    title,
    node,
    open,
    onChange
}: NodeDialogProps) {

    const nodeService = NodeService.getInstance();
    const { program } = React.useContext(ProgramContext);

    const {
        control,
        register,
        handleSubmit,
        reset,
        formState: { errors, validatingFields, isDirty },
    } = useForm<Node>({
        mode: 'onBlur',
        reValidateMode: 'onChange',
        defaultValues: node ?? nodeService.empty()
    });

    useEffect(() => {
        if (open && node) {
            reset(node);
        }
    }, [open, node, reset]);

    function handleCancel() {
        onChange(null);
    }

    const onSubmit: SubmitHandler<Node> = (data: Node) => {
        onChange(data);
    };

    return (
        <Dialog
            fullWidth={true}
            open={open}
            onClose={handleCancel}>
            <DialogTitle><Typography fontWeight={600} fontSize={16}>{title}</Typography></DialogTitle>
            <DialogContent>
                <Stack spacing={2}>
                    <TextField
                        label={'Name'}
                        {...register('name', {
                            required: 'Name is required'
                        })}
                        required
                        error={!!errors.name}
                        helperText={errors.name?.message || (validatingFields.name ? 'Checking availability...' : undefined)}
                        sx={{ minHeight: '75px' }}  //TODO  minHeight avoids layout resizing,  may have to make this more repsonsive
                    />
                    <MDXEditorField
                        label="Description"
                        name="description"
                        control={control}
                    />
                    <Controller
                        name="status"
                        control={control}
                        rules={{
                            required: 'Please select a status',
                        }}
                        render={({ field, fieldState }) => (
                            <FormControl
                                fullWidth
                                required
                                error={!!fieldState.error}>
                                <InputLabel id={'status-label'}>{'Status'}</InputLabel>
                                <Select
                                    {...field}
                                    id="status"
                                    labelId="status-label"
                                    label="Status"
                                    value={field.value ?? ''}
                                >
                                    <MenuItem value="">
                                        <em>&lt;Make Selection&gt;</em>
                                    </MenuItem>

                                    {program.node_statuses.map((status) => (
                                        <MenuItem key={status} value={status}>{status}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>
                                    {fieldState.error?.message}
                                </FormHelperText>
                            </FormControl>
                        )}
                    />

                    <FormControl fullWidth>
                        <InputLabel id={'assignee-label'}>{'Assigned To'}</InputLabel>
                        <Controller
                            name="assignee_id"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    id="assignee_id"
                                    labelId="assignee-label"
                                    label="Assigned To"
                                    value={field.value ?? ''}
                                >
                                    <MenuItem value="">
                                        <em>&lt;Make Selection&gt;</em>
                                    </MenuItem>

                                    {program.members.map((member) => (
                                        <MenuItem
                                            key={member.id}
                                            value={member.id as string}
                                        >
                                            {member.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                    </FormControl>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button
                    variant='outlined'
                    sx={{ color: 'text.secondary' }}
                    onClick={handleCancel}>Cancel</Button>
                <Button
                    variant='contained'
                    sx={{ color: 'text.success' }}
                    disabled={!isDirty || Object.keys(errors).length > 0}
                    onClick={handleSubmit(onSubmit)}>OK</Button>
            </DialogActions>
        </Dialog>
    );

}
