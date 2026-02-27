/**
 *  index.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import React from 'react';
import { Grid } from '@mui/material';
import { Outlet } from 'react-router-dom';
import MinimalFooter from './MinimalFooter';

// ==============================|| MINIMAL LAYOUT ||============================== //

const MinimalLayout: React.FC = () => (
  <Grid
    container
    direction="column"
    justifyContent="space-between"
    sx={{
      minHeight: '90vh'
    }}
  >
    <Grid size={12}></Grid>
    <Grid size={12}
      alignItems="center"
    >
      <Outlet />
    </Grid>
    <Grid size={12}>
      <MinimalFooter />
    </Grid>
  </Grid>
);

export default MinimalLayout;
