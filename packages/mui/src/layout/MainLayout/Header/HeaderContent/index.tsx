/**
 *  HeaderContent.tsx
 * 
 * 
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import React from 'react';
import { useNavigate } from 'react-router';
// material-ui
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';

// project import
import { useLayoutConfiguration } from '../../../LayoutConfigurationContext';
import { useLayoutConfiguration } from '../../../LayoutConfigurationContext';
import MobileSection from './MobileSection';
import Profile from './Profile/Profile';

// ==============================|| HEADER - CONTENT ||============================== //

const HeaderContent: React.FC = () => {

  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down('md'));
  const { configuration } = useLayoutConfiguration();
  const navigate = useNavigate();

  return (
    <>
      {!matchesXs &&
        <Box sx={{ width: '100%', ml: { xs: 0, md: 1 }, cursor: 'pointer' }} onClick={() => navigate('/')}>
          <Typography variant='h4' >{configuration.appName}</Typography>
        </Box>}
      {matchesXs && <Box sx={{ width: '100%', ml: 1 }} />}
      {configuration.toolbarItems}
      {!matchesXs && <Profile />}
      {matchesXs && <MobileSection />}
    </>
  );
};

export default HeaderContent;
