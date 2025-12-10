/**
 *  Clipboard.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import React, { useEffect, useState } from 'react';
import CheckIcon from '@mui/icons-material/Check';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { IconButton } from "@mui/material";

export const Clipboard = (props: { text: string, size?: "large" | "medium" | "small" }) => {
    const [copying, setCopying] = React.useState<boolean>(false);
    const [iconSize, setIconSize] = useState<number>(20);

    useEffect(() => {
        if (props.size) {
            setIconSize(props.size === "small" ? 10 : props.size === "medium" ? 20 : 30);
        }

    }, [props]);

    const wait = (seconds: number) => {
        return new Promise(resolve => setTimeout(resolve, seconds * 1000));
    }

    const copyToClipboardFallback = (text: string) => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed'; // Prevent scrolling to bottom
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();

        try {
            document.execCommand('copy');
            setCopying(true);
            wait(2).then(() => setCopying(false))
        } catch (error) {
            console.error('Failed to copy text: ', error);
        } finally {
            document.body.removeChild(textarea);
        }
    };

    // TODO add protocol check
    // Requires https
    // const copyToClipboardModern = (text: string) => {
    //     navigator.clipboard.writeText(text)
    //         .then(() => {
    //             setCopying(true);
    //             wait(2).then(() => setCopying(false))
    //         })
    //         .catch(err => console.error('Failed to copy: ', err))
    // }

    function copyToClipboard() {
        copyToClipboardFallback(props.text)
    }
    return (
        <IconButton
            color={copying ? "success" : "primary"}
            aria-label="Hide Help"
            onClick={() => copyToClipboard()}>
            {copying ? <CheckIcon sx={{ fontSize: iconSize }} /> : <ContentCopyIcon sx={{ fontSize: iconSize }} />}
        </IconButton>
    );
}