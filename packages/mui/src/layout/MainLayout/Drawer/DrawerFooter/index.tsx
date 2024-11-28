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

const DrawerFooter = (props: { open: boolean }) => {

  return (
    <>{props.open &&
      <ListItemButton style={{ position: 'absolute', bottom: 0, paddingBottom: 10 }}>
        <Link
          style={{ 'textDecoration': 'none' }}
          color="secondary" to={`/privacy`}>
          Privacy Policy
        </Link>
      </ListItemButton>
    }</>
  );
};

export default DrawerFooter;
