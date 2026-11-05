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
    confirmColor?: string;
    confirmBackColor?: string;
    confirmBackColorOpen?: string;
    cancelText?: string;
    cancelColor?: string;
    cancelBackColor?: string;
    cancelBackColorOpen?: string;
    open: boolean;
    handleConfirm: () => void;
    handleCancel: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
     title,
     message, 
     confirmText = 'OK', 
     confirmColor = 'text.success', 
     confirmBackColor = 'grey.100', 
     confirmBackColorOpen = 'grey.300',
     cancelText = 'Cancel', 
     cancelColor = 'text.secondary',   
     cancelBackColor = 'grey.100', 
     cancelBackColorOpen = 'grey.300', 
     open, 
     handleConfirm, 
     handleCancel 
    }) => {

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
                    sx={{ color: cancelColor, bgcolor: open ? cancelBackColorOpen : cancelBackColor, borderColor: cancelColor }}
                    onClick={() => handleCancel()}>{cancelText}</Button>
                <Button
                    variant='outlined'
                    sx={{ color: confirmColor, bgcolor: open ? confirmBackColorOpen : confirmBackColor, borderColor: confirmColor }}
                    onClick={handleConfirm}>{confirmText}</Button>
            </DialogActions>
        </Dialog>
    )
}
export default ConfirmationDialog;
