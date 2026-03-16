/**
 *  MainLayout.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

// material-ui
import { Box, Toolbar, useMediaQuery } from '@mui/material';
import { SxProps, useTheme } from '@mui/material/styles';

// project import
import Drawer from './Drawer';
import Header from './Header';

// types
import type { User } from '@digitalaidseattle/core';
import {
  LoadingContextProvider,
  NotificationContextProvider,
  UserContext,
  useAuthService
} from '@digitalaidseattle/core';
import Notification from '../../components/Notification';
import ScrollTop from '../../components/ScrollTop';
import { DrawerOpenContext } from './DrawerOpenContext';

// ==============================|| MAIN LAYOUT ||============================== //
function MainLayout({ sx }: { sx?: SxProps }) {

  const theme = useTheme();
  const matchDownLG = useMediaQuery(theme.breakpoints.down('lg'));
  const [user, setUser] = React.useState<User | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const navigate = useNavigate();

  const authService = useAuthService();

  useEffect(() => {
    authService.getUser()
      .then(user => {
        if (user) {
          setUser(user)
        } else {
          navigate("/login?code=Unauthenticated")
        }
      })
  }, [navigate])


  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  // set media wise responsive drawer
  useEffect(() => {
    setDrawerOpen(!matchDownLG);
  }, [matchDownLG]);

  return (user &&
    <UserContext.Provider value={{ user, setUser }} >
      <LoadingContextProvider>
        <DrawerOpenContext.Provider value={{ drawerOpen, setDrawerOpen }} >
          <NotificationContextProvider>
            <ScrollTop>
              <Notification />
              <Box sx={{ display: 'flex', width: '100%' }}>
                <Header open={drawerOpen} handleDrawerToggle={handleDrawerToggle} />
                <Drawer open={drawerOpen} handleDrawerToggle={handleDrawerToggle} />
                <Box component="main"
                  sx={{
                    width: '100%',
                    flexGrow: 1,
                    p: { xs: 2, sm: 3 },
                    backgroundColor: theme.palette.background.default,
                    minHeight: '100vh',
                    ...sx
                  }}>
                  <Toolbar />
                  <Outlet />
                </Box>
              </Box>
            </ScrollTop>
          </NotificationContextProvider>
        </DrawerOpenContext.Provider>
      </LoadingContextProvider>
    </UserContext.Provider>
  );
};

export default MainLayout;
