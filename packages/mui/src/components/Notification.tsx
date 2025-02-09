/**
 *  Notification.tsx
 *
 *  Opinionated snackbar;  
 *    top-right
 *    errors don't close automatically
 * 
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import React from "react";
import { Alert, AlertColor, Snackbar } from "@mui/material";
import { useNotifications } from "@digitalaidseattle/core";

const Notification: React.FC<{ delay?: number }> = (props) => {
    const DEFAULT_DELAY = 5000;
    const { displayOptions } = useNotifications();

    return (
        <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={displayOptions.open}
            autoHideDuration={displayOptions.severity === 'error' ? undefined : props.delay ?? DEFAULT_DELAY}
            onClose={displayOptions.handleClose} >
            <Alert
                onClose={displayOptions.handleClose}
                severity={displayOptions.severity as AlertColor}
                variant="filled"
                sx={{ width: '100%' }}>
                {displayOptions.message}
            </Alert>
        </Snackbar>
    );
}

export default Notification