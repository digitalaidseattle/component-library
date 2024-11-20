/**
 *  App.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import React, { ReactNode } from 'react';

// material-ui
import { Grid, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// das
import CenteredCard from '../components/cards/CenteredCard';
import Social from '../components/Social';
import MinimalWrapper from '../layout/MinimalLayout/MinimalWrapper';

// ================================|| 404 ||================================ //

const Login: React.FC = (props: { logo?: ReactNode }) => {
  const theme = useTheme();

  return (<MinimalWrapper>
    <Grid
      container
      sx={{
        backgroundColor: theme.palette.primary.main
      }}
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center">
      <Grid item xs={3}>
        <Stack direction="row" spacing={1} alignItems="center">
          {props.logo}
        </Stack>
      </Grid>
      <CenteredCard>
        <Grid container spacing={3} >
          <Grid item xs={12} >
            <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
              <Typography variant="h3">Please login</Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Social />
          </Grid>
        </Grid>
      </CenteredCard>
    </Grid>
  </MinimalWrapper>)
};
export default Login;
