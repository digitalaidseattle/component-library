/**
 *  MainLayout.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

// material-ui
import { Box, Breadcrumbs, Toolbar, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// project import
import Drawer from './Drawer';
import Header from './Header';

// types
import { User } from '@supabase/supabase-js';
import { DrawerOpenContext } from '../../components/DrawerOpenContext';
import { UserContext, useAuthService, LoadingContextProvider, RefreshContextProvider } from '@digitalaidseattle/core';
import { useLayoutConfiguration } from './LayoutConfigurationContext';
import ScrollTop from '../../components/ScrollTop';

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout: React.FC = () => {
  const theme = useTheme();
  const matchDownLG = useMediaQuery(theme.breakpoints.down('lg'));
  const [user, setUser] = useState<User>(null as unknown as User);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const navigate = useNavigate();
  
  const authService= useAuthService();

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
              <ScrollTop>
                <Box sx={{ display: 'flex', width: '100%' }}>
                  <Header open={drawerOpen} handleDrawerToggle={handleDrawerToggle} />
                  <Drawer open={drawerOpen} handleDrawerToggle={handleDrawerToggle} />
                  <Box component="main" sx={{
                    width: '100%', flexGrow: 1, p: { xs: 2, sm: 3 },
                    backgroundColor: theme.palette.background.default, minHeight: '100vh'
                  }}>
                    <Toolbar />
                    {/* <Breadcrumbs /> */}
                    <Outlet />
                  </Box>
                </Box>
              </ScrollTop>
            </RefreshContextProvider>
          </DrawerOpenContext.Provider>
        </LoadingContextProvider>
      }
    </UserContext.Provider>
  );
};

export default MainLayout;
