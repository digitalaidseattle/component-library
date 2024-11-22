/**
 *  App.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import React, { ReactNode } from 'react';

// material-ui
import { Box, Card, CardContent, CardHeader, CardMedia, Container, Grid, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// das
import Social from '../components/Social';
import { useLayoutConfiguration } from '../layout';

// ================================|| 404 ||================================ //

const Login: React.FC = () => {
  const theme = useTheme();
  const { configuration } = useLayoutConfiguration();
  return (
    <Container id="cont" sx={{ width: "33%" }}>
      <Card id="card" sx={{ gap: 2 }}>
        <CardContent sx={{ textAlign: 'center', alignItems: 'center'}}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <CardMedia
              component="img"
              sx={{
                objectFit: "cover",
                width: "150px"
              }}
              image={configuration.logoUrl}
              alt={configuration.appName + ' Logo'}
            />
          </Box>
          <Typography variant="h4">{configuration.appName}</Typography>
          <Typography variant="h6">Please login</Typography>
          <Social />
        </CardContent>
      </Card>
    </Container>
  )
};
export default Login;
