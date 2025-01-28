/**
 *  Error.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router';

// material-ui
import { Box, Button, Card, CardContent, CardMedia, Container, Typography } from '@mui/material';

// das
import { useLayoutConfiguration } from '../layout';

const Error: React.FC = () => {
  const { configuration } = useLayoutConfiguration();
  const [message, setMessage] = useState<string>('Could not find the page you were looking for.');
  const [buttonTitle, setButtonTitle] = useState<string>('Return to Home');

  const navigate = useNavigate();

  const returnHandler = () => {
    navigate('/login');
  };

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
            <Typography variant="h5">{message}</Typography>
          </Box>
          <Button
            title='Return to Home'
            variant="outlined"
            color="primary"
            onClick={returnHandler}>
            {buttonTitle}
          </Button>
        </CardContent>
      </Card>
    </Container>
  )
};
export default Error;
