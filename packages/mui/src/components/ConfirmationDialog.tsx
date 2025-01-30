/**
 *  ConfirmationDialog.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { Button, Dialog, DialogActions, DialogContent, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';

// material-ui

interface ConfirmationDialogProps {
    title?: string;
    message: string;
    open: boolean;
    handleConfirm: () => void;
    handleCancel: () => void;
}

const iconBackColorOpen = 'grey.300';
const iconBackColor = 'grey.100';

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ title, message, open, handleConfirm, handleCancel }) => {

    const [dialogTitle] = useState<string>(title ?? 'Confirm');

    return (
        <Dialog
            fullWidth={true}
            open={open}
            onClose={() => handleCancel()}>
            <DialogContent>
                <Stack gap={2}>
                    <Typography variant='h4'>{dialogTitle}</Typography>
                    <Typography>{message}</Typography>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button
                    variant='outlined'
                    sx={{ color: 'text.secondary', bgcolor: open ? iconBackColorOpen : iconBackColor }}
                    onClick={() => handleCancel()}>Cancel</Button>
                <Button
                    variant='outlined'
                    sx={{ color: 'text.success', bgcolor: open ? iconBackColorOpen : iconBackColor }}
                    onClick={handleConfirm}>OK</Button>
            </DialogActions>
        </Dialog>
    )
}
export default ConfirmationDialog;
