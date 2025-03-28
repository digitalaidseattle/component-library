/**
 *  Login.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import React from 'react';

// material-ui
import { Box, Card, CardContent, CardMedia, Container, Typography } from '@mui/material';

// das
import { useLayoutConfiguration } from '../layout';
import Social from '../components/Social';

const Login: React.FC = () => {
  const { configuration } = useLayoutConfiguration();
  return (
    <Container id="cont" sx={{ width: "33%" }}>
      <Card id="card" sx={{ gap: 2 }}>
        <CardContent sx={{ textAlign: 'center', alignItems: 'center' }}>
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
          <Box sx={{ margin: 2 }}>
            <Typography variant="h4">{configuration.appName}</Typography>
          </Box>
          <Box sx={{ margin: 2 }}>
            <Typography variant="h5">Please login</Typography>
          </Box>
          <Social />
        </CardContent>
      </Card>
    </Container>
  )
};
export default Login;
