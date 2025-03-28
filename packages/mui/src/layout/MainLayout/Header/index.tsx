/**
 *  index.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import React from 'react';

// material-ui
import { AppBar, IconButton, Toolbar, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// project import
import HeaderContent from './HeaderContent';

// assets
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import AppBarStyled from './AppBarStyled';
import { LoadingIndicator } from './LoadingIndicator';
import { useLayoutConfiguration } from '../../LayoutConfigurationContext';

// ==============================|| MAIN LAYOUT - HEADER ||============================== //

interface HeaderProps {
  open: boolean,
  handleDrawerToggle: () => void
}

const Header: React.FC<HeaderProps> = ({ open, handleDrawerToggle }) => {
  const { configuration } = useLayoutConfiguration();

  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down('lg'));

  const iconBackColor = 'grey.100';
  const iconBackColorOpen = 'grey.200';

  // common header
  const mainHeader = (
    <>
      <Toolbar>
        <IconButton
          disableRipple
          aria-label="open drawer"
          onClick={handleDrawerToggle}
          edge="start"
          color="secondary"
          sx={{
            color: 'text.primary',
            bgcolor: open ? iconBackColorOpen : iconBackColor,
            '&:hover': { bgcolor: theme.palette.secondary.light },
            ml: { xs: 0, lg: -2 }
          }}
        >
          {!open ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </IconButton>
        <HeaderContent />
      </Toolbar>
      <LoadingIndicator />
    </>
  );

  // app-bar params
  const appBar = {
    position: 'fixed' as const,
    color: 'inherit' as const,
    elevation: 0,
    sx: {
      borderBottom: `1px solid ${theme.palette.divider}`,
      boxShadow: theme.shadows[1]
    }
  };

  return (
    <>
      {!matchDownMD ? (
        <AppBarStyled open={open} drawerwidth={configuration.drawerWidth} {...appBar}>
          {mainHeader}
        </AppBarStyled>
      ) : (
        <AppBar
          position='fixed'
          color='inherit'
          elevation={0}
          sx={{
            borderBottom: `1px solid ${theme.palette.divider}`,
            boxShadow: theme.shadows[1]
          }}>{mainHeader}</AppBar >
      )}
    </>
  );
};

export default Header;
