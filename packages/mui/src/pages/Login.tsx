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
      switch (searchParams.get('error')) {
        case 'AccessDenied':
          setErrorMessage('Not authorized to access this application.  Please contact the system administrator.');
          break;
        default:
          setErrorMessage('');
      }
    }
  }, [searchParams])

  return (
    <Container id="cont" sx={{ width: "33%", gap: 2 }}>
      {(errorMessage !== '') &&
        <Card>
          <CardContent sx={{ textAlign: 'center', alignItems: 'center' }}>
            <Box sx={{ margin: 2 }}>
              <Typography>{errorMessage}</Typography>
            </Box>
          </CardContent>
        </Card>
      }
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
