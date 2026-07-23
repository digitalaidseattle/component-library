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
import { Accordion, AccordionDetails, AccordionSummary, Alert, AlertColor, Card, CardContent, CardHeader, IconButton, Snackbar, Typography } from "@mui/material";
import { useNotifications } from "@digitalaidseattle/core";
import { DownCircleOutlined, DownOutlined } from "@ant-design/icons";

const LABEL_DETAILS_TITLE = "Details...";

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
                sx={{ width: '100%' }}>
                <Typography fontWeight={500} fontSize={14}>{displayOptions.message}</Typography>
                {displayOptions.details &&
                    <Accordion
                        disableGutters
                        slotProps={{ heading: { component: 'h6' } }}
                        sx={{
                            bgcolor: "inherit",
                            color: "inherit",
                            boxShadow: "none",
                            borderColor: "currentColor",
                        }}
                    >
                        <AccordionSummary
                            aria-controls='details-content'
                            id='details-content'
                            sx={{ flexDirection: 'row-reverse' }}
                            expandIcon={<IconButton size="small" ><DownCircleOutlined /></IconButton>}
                        >
                            <Typography component="span">{LABEL_DETAILS_TITLE}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            {displayOptions.details}
                        </AccordionDetails>
                    </Accordion>
                }
            </Alert>
        </Snackbar>
    );
}

export default Notification