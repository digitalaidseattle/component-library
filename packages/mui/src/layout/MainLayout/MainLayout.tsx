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
import { useTheme } from '@mui/material/styles';

// project import
import Drawer from './Drawer';
import Header from './Header';

// types
import type { User } from '@digitalaidseattle/core';
import {
  LoadingContextProvider,
  NotificationContextProvider,
  RefreshContextProvider,
  UserContext,
  useAuthService
} from '@digitalaidseattle/core';
import ScrollTop from '../../components/ScrollTop';
import { DrawerOpenContext } from './DrawerOpenContext';
import Notification from '../../components/Notification';

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout: React.FC = () => {
  const theme = useTheme();
  const matchDownLG = useMediaQuery(theme.breakpoints.down('lg'));
  const [user, setUser] = useState<User>(null as unknown as User);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const navigate = useNavigate();

  const authService = useAuthService();

  useEffect(() => {
    authService.getUser()
      .then((user: User | null) => {
        if (user) {
          setUser(user)
        } else {
          navigate("/login")
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

  return (
    <UserContext.Provider value={{ user, setUser }} >
      {user &&
        <LoadingContextProvider>
          <DrawerOpenContext.Provider value={{ drawerOpen, setDrawerOpen }} >
            <RefreshContextProvider >
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
                        minHeight: '100vh'
                      }}>
                      <Toolbar />
                      <Outlet />
                    </Box>
                  </Box>
              </ScrollTop>
              </NotificationContextProvider>
            </RefreshContextProvider>
          </DrawerOpenContext.Provider>
        </LoadingContextProvider>
      }
    </UserContext.Provider>
  );
};

export default MainLayout;
