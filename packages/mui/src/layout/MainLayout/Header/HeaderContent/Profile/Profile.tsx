import React, { ReactNode, useEffect, useRef, useState } from 'react';

// material-ui
import { LogoutOutlined } from '@ant-design/icons';
import {
  Avatar,
  Box,
  ButtonBase,
  ClickAwayListener,
  Divider,
  IconButton,
  List,
  ListItem,
  Paper,
  Popper,
  Stack,
  Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router';

import { useAuthService, UserContext, UserContextType } from '@digitalaidseattle/core';

import Transitions from '../../../../../components/Transitions';
import { useLayoutConfiguration } from '../../../../LayoutConfigurationContext';

// ==============================|| HEADER CONTENT - PROFILE ||============================== //
const iconBackColorOpen = 'grey.300';

const Profile = () => {
  const theme = useTheme();
  // TODO: figure out why UserContextType is not exporting correctly
  const { user } = React.useContext<UserContextType>(UserContext);
  const { configuration } = useLayoutConfiguration();
  const authService = useAuthService();
  const anchorRef = useRef(null);

  const [open, setOpen] = useState(false);

  const [username, setUsername] = useState<string>('')
  const [avatar, setAvatar] = useState<string>('')
  const [version, setVersion] = useState<string>('')
  const [profileItems, setProfileItems] = useState<ReactNode[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.user_metadata) {
      setAvatar(user.user_metadata.avatar_url ?? '')
      setUsername(user.user_metadata.name ? user.user_metadata.name : user.user_metadata.email)
    }
  }, [user])

  useEffect(() => {
    if (configuration) {
      setVersion(configuration ? configuration.version ?? '' : '');
      setProfileItems(configuration.profileItems ?? []);
    }
  }, [configuration])


  const handleToggleMenu = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: MouseEvent | TouchEvent) => {
    // eslint-disable-next-line 
    const ref = anchorRef as any;
    if (ref.current && ref.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleLogout = async () => {
    authService.signOut()
      .then(() => navigate('/login'))
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <ButtonBase
        sx={{
          p: 0.25,
          bgcolor: open ? iconBackColorOpen : theme.palette.background.default,
          borderRadius: 1,
          '&:hover': { bgcolor: theme.palette.secondary.light },
          paddingRight: '15px'
        }}
        aria-label="open profile"
        ref={anchorRef}
        aria-controls={open ? 'profile-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggleMenu}
      >
        <Stack direction="row" spacing={2} alignItems="center" sx={{ p: 0.5 }}>
          <Avatar alt="profile user" src={avatar} sx={{ width: 32, height: 32 }} />
          <Typography variant="subtitle1">{username}</Typography>
        </Stack>
      </ButtonBase>
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 9]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions type="fade" in={open} {...TransitionProps}>
            {open && (
              <Paper
                sx={{
                  boxShadow: theme.shadows['1'],
                  width: 290,
                  minWidth: 240,
                  maxWidth: 290,
                  [theme.breakpoints.down('md')]: {
                    maxWidth: 250
                  }
                }}
              >
                <ClickAwayListener onClickAway={handleClose}>
                  <List>
                    <ListItem>
                      <Stack direction="row" spacing={1.25} alignItems="center">
                        <Avatar alt="profile user" src={avatar} sx={{ width: 32, height: 32 }} />
                        <Stack>
                          <Typography variant="h6">{username}</Typography>
                          {/* <Typography variant="body2" color="textSecondary">
                                {role}
                              </Typography> */}
                        </Stack>
                      </Stack>

                    </ListItem>
                    <Divider />
                    {profileItems.map((item, idx) => <ListItem key={idx}>{item}</ListItem>)}
                    <Divider />
                    {version &&
                      <ListItem>
                        <Typography>Version: {version}</Typography>
                      </ListItem>
                    }
                    <ListItem>
                      <IconButton color="secondary" onClick={handleLogout}>
                        <LogoutOutlined />
                      </IconButton>
                      <Typography>Logout</Typography>
                    </ListItem>
                  </List>
                </ClickAwayListener>
              </Paper>
            )}
          </Transitions>
        )}
      </Popper>
    </Box >
  );
};

export default Profile;
