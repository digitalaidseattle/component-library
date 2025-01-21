import React from 'react';

// material-ui
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';

// project import
import { useLayoutConfiguration } from '../../../LayoutConfigurationContext';
import MobileSection from './MobileSection';
import Profile from './Profile/Profile';

// ==============================|| HEADER - CONTENT ||============================== //

const HeaderContent: React.FC = () => {

  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down('md'));
  const { configuration } = useLayoutConfiguration();

  return (
    <>
      {!matchesXs &&
        <Box sx={{ width: '100%', ml: 1 }} >
          <Typography variant='h4'>{configuration.appName}</Typography>
        </Box>
      }

      {matchesXs && <Box sx={{ width: '100%', ml: 1 }} />}
      {configuration.toolbarItems}
      {!matchesXs && <Profile />}
      {matchesXs && <MobileSection />}
    </>
  );
};

export default HeaderContent;
