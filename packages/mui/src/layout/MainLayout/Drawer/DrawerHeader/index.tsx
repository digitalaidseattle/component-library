/**
 *  DrawerHeader/index.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import React from 'react';

// material-ui
import { Box, Button, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router';

// project import
import Logo from '../../Logo';

// ==============================|| DRAWER HEADER ||============================== //

const DrawerHeader = (props: { open: boolean }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box
      display='flex'
      alignItems='center'
      justifyContent={'center'}
      paddingLeft={theme.spacing(props.open ? 3 : 0)} >
      <Stack direction="row" spacing={1} alignItems="center">
        <Button onClick={() => navigate('/')}>
          <Logo />
        </Button>
      </Stack>
    </Box>
  );
};

export default DrawerHeader;
