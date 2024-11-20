/**
 *  MinimalWrapper.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import React, { ReactNode } from 'react';

// material-ui
import { Box, Grid } from '@mui/material';

// project import

// assets
import MinimalFooter from './MinimalFooter';

// ==============================|| AUTHENTICATION - WRAPPER ||============================== //

const MinimalWrapper = (props: { children: ReactNode }) => (
  <Box sx={{ minHeight: '100vh' }}>
    <Grid
      container
      direction="column"
      justifyContent="space-between"
      sx={{
        minHeight: '100vh'
      }}
    >
      <Grid item xs={12}></Grid>
      <Grid item xs={12}
        alignItems="center"
      >
        {props.children}
      </Grid>
      <Grid item xs={12}>
        <MinimalFooter />
      </Grid>
    </Grid>
  </Box>
);

export default MinimalWrapper;
