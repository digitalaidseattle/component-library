/**
 *  NotificationContext.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import React, { createContext, useState } from "react";

export type NotificationOptions = {
    open: boolean;
    message: string;
    severity: string;
    handleClose: () => void
}

const DEFAULT_OPTIONS: NotificationOptions = {
    open: false,
    message: '',
    severity: 'info',
    handleClose: () => { }
}

interface NotificationContextType {
    displayOptions: NotificationOptions
    setDisplayOptions: (_open: NotificationOptions) => void,
}

export const NotificationContext = createContext<NotificationContextType>({
    displayOptions: DEFAULT_OPTIONS,
    setDisplayOptions: () => { }
});

export const NotificationContextProvider = (props: { children: React.ReactNode }) => {

    const [displayOptions, setDisplayOptions] = useState<NotificationOptions>({
        open: false,
        message: '',
        severity: 'info',
        handleClose: () => { }
    });

    return (
        <NotificationContext.Provider value={{ displayOptions, setDisplayOptions }}>
            {props.children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {

    const { displayOptions, setDisplayOptions } = React.useContext(NotificationContext);

    const notifications = {
        displayOptions,
        info: (message: string) => {
            setDisplayOptions({
                open: true,
                message: message,
                severity: 'info',
                handleClose: () => setDisplayOptions(DEFAULT_OPTIONS)
            })
        },
        success: (message: string) => {
            setDisplayOptions({
                open: true,
                message: message,
                severity: 'success',
                handleClose: () => setDisplayOptions(DEFAULT_OPTIONS)
            })
        },
        warn: (message: string) => {
            setDisplayOptions({
                open: true,
                message: message,
                severity: 'warning',
                handleClose: () => setDisplayOptions(DEFAULT_OPTIONS)
            })
        },
        error: (message: string) => {
            setDisplayOptions({
                open: true,
                message: message,
                severity: 'error',
                handleClose: () => setDisplayOptions(DEFAULT_OPTIONS)
            })
        }
    };

    return notifications;

};
