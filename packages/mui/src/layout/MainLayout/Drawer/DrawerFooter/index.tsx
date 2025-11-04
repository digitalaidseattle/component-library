/**
 *  DrawerFooter/index.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import React from 'react';

// material-ui
import { ListItemButton } from '@mui/material';

// project import
import { Link } from 'react-router-dom';

// ==============================|| DRAWER HEADER ||============================== //

const DrawerFooter = (props: { children?: React.ReactNode, open: boolean }) => {

  return (
    <>{props.open &&
      <ListItemButton style={{ position: 'absolute', bottom: 0, paddingBottom: 10 }}>
        {props.children}
      </ListItemButton>
    }</>
  );
};

export default DrawerFooter;
