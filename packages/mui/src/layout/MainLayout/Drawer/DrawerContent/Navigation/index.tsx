
import React from 'react';

// material-ui
import { Box, Typography } from '@mui/material';

// project import
import NavGroup from './NavGroup';
import { useState } from 'react';
import { ActiveMenuItemContext } from '../../../ActiveMenuItemContext';
import { useLayoutConfiguration } from '../../../../../components/LayoutConfigurationContext';

// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

const Navigation = () => {
  const [activeMenuItem, setActiveMenuItem] = useState<string | null>(null)
  const { configuration } = useLayoutConfiguration();

  // FIXME
  // eslint-disable-next-line 
  const navGroups = configuration.menuItems.map((item: any) => {
    switch (item.type) {
      case 'group':
        return <NavGroup key={item.id} item={item} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Fix - Navigation Group
          </Typography>
        );
    }
  });

  return (
    <Box sx={{ pt: 2 }}>
      <ActiveMenuItemContext.Provider value={{ activeMenuItem, setActiveMenuItem }}>
        {navGroups}
      </ActiveMenuItemContext.Provider>
    </Box>
  );
};

export default Navigation;
