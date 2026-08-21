/**
 * NodeDialog
 *
 */

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

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
        mode: 'onTouched',
        defaultValues: node ?? nodeService.empty()
    });

    useEffect(() => {
        if (open && node) {
            console.log('reset', node)
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
                        error={!!errors.name}
                        helperText={errors.name?.message || (validatingFields.name ? 'Checking availability...' : undefined)}
                        sx={{ minHeight: '75px' }}  //TODO  minHeight avoids layout resizing,  may have to make this more repsonsive
                    />
                    <MDXEditorField
                        label="Description"
                        name="description"
                        control={control}
                    />
                    <FormControl fullWidth>
                        <InputLabel id={'status-label'}>{'Status'}</InputLabel>
                        <Select
                            id={'status'}
                            labelId={'status-label'}
                            label={'Status'}
                            {...register('status')}
                            error={!!errors.status}>
                            {[
                                <MenuItem key={`s-0`} value={''}>{`<Make Selection>`}</MenuItem>,
                                ...program.node_statuses
                                    .map(value => ({ label: value, value: value }))
                                    .map((item: { label: string, value: string }, idx) =>
                                        <MenuItem key={`s-${idx + 1}`} value={item.value} >{item.label}</MenuItem>
                                    )
                            ]}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel id={'assignee-label'}>{'Assigned To'}</InputLabel>
                        <Select
                            id={'assignee_id'}
                            labelId={'assignee-label'}
                            label={'Assigned To'}
                            {...register('assignee_id')}>
                            {[
                                <MenuItem key={`m-0`} value={''}>{`<Make Selection>`}</MenuItem>,
                                ...program.members
                                    .map(member => ({ label: member.name, value: member.id as string }))
                                    .map((item: { label: string, value: string }, idx) =>
                                        <MenuItem key={`m-${idx + 1}`} value={item.value} >{item.label}</MenuItem>
                                    )
                            ]}
                        </Select>
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
