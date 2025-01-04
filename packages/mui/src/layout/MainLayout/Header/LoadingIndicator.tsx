
/**
 *  LoadingIndicator.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import React from "react";
import { Box, LinearProgress } from "@mui/material";
import { LoadingContext } from "@digitalaidseattle/core";

export const LoadingIndicator = () => {
    const { loading } = React.useContext(LoadingContext);

    // creating an overlay effect
    return (loading &&
        <Box sx={{
            zIndex: 2,
            position: 'fixed',
            width: '100%'
        }}>
            <LinearProgress color="primary" />
        </Box>
    )
}