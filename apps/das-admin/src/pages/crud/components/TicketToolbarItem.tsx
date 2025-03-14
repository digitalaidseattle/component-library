/**
 *  TicketToolbarItem.tsx
 *
 *  Ideal for adding a button in the toolbar to quickly create a ticket.
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import React, { useContext, useRef, useState } from 'react';

// material-ui
import {
  Box,
  IconButton,
  useTheme
} from '@mui/material';

// project import

// assets
import { ThunderboltOutlined } from '@ant-design/icons';
import { useLoggingService, UserContext } from '@digitalaidseattle/core';
import TicketDialog from './TicketDialog';

// ==============================|| HEADER CONTENT - NOTIFICATION ||============================== //

const TicketToolbarItem: React.FC = () => {
  const theme = useTheme();
  const anchorRef = useRef(null);
  const { user } = useContext(UserContext);
  const [open, setOpen] = useState(false);

  const loggingService = useLoggingService();

  const iconBackColorOpen = 'grey.300';
  const iconBackColor = 'grey.100';

  const handleSuccess = (resp: Ticket | null) => {
    loggingService.info(`Ticket ${resp!.id} create`, user!);
    setOpen(false);
  };

  const handleError = (err: Error) => {
    loggingService.error(err.message, user!);
    setOpen(false);
  };

  const toggle = () => {
    setOpen(!open);
  };

  return (
    <React.Fragment>
      <Box sx={{ flexShrink: 0, ml: 0.75 }}>
        <IconButton
          disableRipple
          color="secondary"
          sx={{
            color: 'text.primary', bgcolor: open ? iconBackColorOpen : iconBackColor,
            '&:hover': { bgcolor: theme.palette.secondary.light }
          }}
          aria-label="open profile"
          ref={anchorRef}
          aria-controls={open ? 'profile-grow' : undefined}
          aria-haspopup="true"
          onClick={toggle}
        >
          <ThunderboltOutlined />
        </IconButton>
      </Box>
      <TicketDialog open={open} handleSuccess={handleSuccess} handleError={handleError} />
    </React.Fragment>
  );
};

export default TicketToolbarItem;
