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
    confirmText?: string;
    cancelText?: string;
    iconBackColor?: string;
    iconBackColorOpen?: string;
    confirmColor?: string;
    cancelColor?: string;
    open: boolean;
    handleConfirm: () => void;
    handleCancel: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ title, message, confirmText = 'OK', confirmColor = 'text.success', cancelText = 'Cancel', cancelColor = 'text.secondary', iconBackColor = 'grey.100', iconBackColorOpen = 'grey.300', open, handleConfirm, handleCancel }) => {

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
                    sx={{ color: cancelColor, bgcolor: open ? iconBackColorOpen : iconBackColor, borderColor: cancelColor }}
                    onClick={() => handleCancel()}>{cancelText}</Button>
                <Button
                    variant='outlined'
                    sx={{ color: confirmColor, bgcolor: open ? iconBackColorOpen : iconBackColor, borderColor: confirmColor }}
                    onClick={handleConfirm}>{confirmText}</Button>
            </DialogActions>
        </Dialog>
    )
}
export default ConfirmationDialog;
