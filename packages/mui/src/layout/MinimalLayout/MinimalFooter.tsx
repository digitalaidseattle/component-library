/**
 *  MinimalFooter.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

// material-ui
import React from 'react'
import { useMediaQuery, Container, Link, Typography, Stack, useTheme } from '@mui/material';

// ==============================|| FOOTER - AUTHENTICATION ||============================== //

const MinimalFooter: React.FC = () => {
  const theme = useTheme()
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container maxWidth="xl">
      <Stack
        direction={matchDownSM ? 'column' : 'row'}
        justifyContent={matchDownSM ? 'center' : 'space-between'}
        spacing={2}
        textAlign={matchDownSM ? 'center' : 'inherit'}
      >
        <Typography variant="subtitle2" color="secondary" component="span">
          <Typography component={Link} variant="subtitle2" href="https://digitalaidseattle.org" target="_blank" underline="hover">
            &copy; Digital Aid Seattle
          </Typography>
        </Typography>

        <Stack direction={matchDownSM ? 'column' : 'row'} spacing={matchDownSM ? 1 : 3} textAlign={matchDownSM ? 'center' : 'inherit'}>
          <Typography
            variant="subtitle2"
            color="secondary"
            component={Link}
            href="https://github.com/digitalaidseattle"
            target="_blank"
            underline="hover"
          >
            Github
          </Typography>
          <Typography
            variant="subtitle2"
            color="secondary"
            component={Link}
            href="https://www.digitalaidseattle.org/privacy"
            target="_blank"
            underline="hover"
          >
            Privacy Policy
          </Typography>
        </Stack>
      </Stack>
    </Container>
  );
};

export default MinimalFooter;
