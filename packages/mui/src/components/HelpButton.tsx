/**
 *  HelpButton.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { useHelp } from '@digitalaidseattle/core';
import HelpIcon from '@mui/icons-material/Help';
import { IconButton } from "@mui/material";
import React from 'react';

export const HelpButton: React.FC = () => {
    const { setShowHelp } = useHelp();
    return (
        <IconButton color="primary"
            aria-label="Hide Help"
            onClick={() => setShowHelp(true)}>
            <HelpIcon />
        </IconButton>
    )
}