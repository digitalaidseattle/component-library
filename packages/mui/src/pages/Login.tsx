/**
 *  Login.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import React, { useEffect, useState } from 'react';

// material-ui
import { Box, Card, CardContent, CardMedia, Container, Typography } from '@mui/material';

// das
import { useLayoutConfiguration } from '../layout';
import Social from '../components/Social';
import { useSearchParams } from 'react-router-dom';

const Login: React.FC = () => {
  const { configuration } = useLayoutConfiguration();
  const [searchParams] = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (searchParams) {
      switch (searchParams.get('code')) {
        case 'AccessDenied':
          setErrorMessage('You are not authorized to access this application.  Please contact the system administrator.');
          break;
        case 'Unauthenticated':
          setErrorMessage('You have been logged out this application.  Please try again.');
          break;
        case 'Logout':
          setErrorMessage('You have successfully been logged out the application.');
          break;
        default:
          setErrorMessage('');
      }
    }
  }, [searchParams])

  return (
    <Container id="cont" sx={{ width: "33%", get: 2 }}>
      <Card id="card" sx={{ gap: 2 }}>
        <CardContent sx={{ textAlign: 'center', alignItems: 'center' }}>
          {(errorMessage !== '') &&
            <Box sx={{ margin: 2 }}>
              <Typography fontWeight={600}>{errorMessage}</Typography>
            </Box>
          }
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
