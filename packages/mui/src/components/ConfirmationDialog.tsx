/**
 *  ConfirmationDialog.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { Button, Dialog, DialogActions, DialogContent, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import { SxProps, Theme} from '@mui/material/styles'

// material-ui

interface ConfirmationDialogProps {
    title?: string;
    message: string;
    confirmText? : string;
    confirmSx?: SxProps<Theme>;
    cancelText? : string;
    cancelSx?: SxProps<Theme>;
    open: boolean;
    handleConfirm: () => void;
    handleCancel: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
     title,
     message, 
     open, 
     handleConfirm, 
     handleCancel,
     confirmText = 'OK',
     cancelText = 'Cancel',
     confirmSx = [],
     cancelSx = []
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
                    sx={[
                        {
                            color: 'text.secondary',
                            bgcolor: open ? 'grey.300' : 'grey.100'
                        },
                        ...(Array.isArray(cancelSx) ? cancelSx : [cancelSx]),
                    ]}
                    onClick={() => handleCancel()}>{cancelText}</Button>
                <Button
                    variant='outlined'
                    sx={[
                        {
                            color: 'text.secondary',
                            bgcolor: open ? 'grey.300' : 'grey.100'
                        },
                        ...(Array.isArray(confirmSx) ? confirmSx : [confirmSx]),
                    ]}
                    onClick={handleConfirm}>{confirmText}</Button>
            </DialogActions>
        </Dialog>
    )
}
export default ConfirmationDialog;
