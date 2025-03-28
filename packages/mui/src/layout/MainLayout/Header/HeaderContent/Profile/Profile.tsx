import React, { ReactNode, useContext, useEffect, useRef, useState } from 'react';

// material-ui
import {
  Avatar,
  Box,
  ButtonBase,
  CardContent,
  ClickAwayListener,
  Grid,
  IconButton,
  Paper,
  Popper,
  Stack,
  Typography
} from '@mui/material';
import { Direction, useTheme } from '@mui/material/styles';

import { LogoutOutlined } from '@ant-design/icons';
import { useAuthService, UserContext, UserContextType } from '@digitalaidseattle/core';
import { useNavigate } from 'react-router';

import MainCard from '../../../../../components/cards/MainCard';
import Transitions from '../../../../../components/Transitions';
import { useLayoutConfiguration } from '../../../../LayoutConfigurationContext';
// import ProfileTab from './ProfileTab';
// import SettingTab from './SettingTab';

interface TabPanelProps {
  children: ReactNode,
  index: number,
  value: number,
  dir: Direction
}
// tab panel wrapper
const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, dir, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      dir={dir}
      {...other}>
      {value === index && children}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `profile-tab-${index}`,
    'aria-controls': `profile-tabpanel-${index}`
  };
}

// ==============================|| HEADER CONTENT - PROFILE ||============================== //

const Profile = () => {
  const theme = useTheme();
  // TODO: figure out why UserContextType is not exporting correctly
  const { user } = useContext<UserContextType>(UserContext);
  const [username, setUsername] = useState<string>('')
  const [avatar, setAvatar] = useState<string>('')
  const [version, setVersion] = useState<string>('')
  const navigate = useNavigate();
  const authService = useAuthService();
  const { configuration } = useLayoutConfiguration();

  useEffect(() => {
    if (user && user.user_metadata) {
      setAvatar(user.user_metadata.avatar_url ?? '')
      setUsername(user.user_metadata.name ? user.user_metadata.name : user.user_metadata.email)
    }
  }, [user])

  useEffect(() => {
    if (user && user.user_metadata) {
      setAvatar(user.user_metadata.avatar_url ?? '')
      setVersion(configuration ? configuration.version : '');
    }
  }, [configuration])


  const handleLogout = async () => {
    authService.signOut()
      .then(() => navigate('/login'))
  };

  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: MouseEvent | TouchEvent) => {
    // FIXME
    // eslint-disable-next-line 
    const ref = anchorRef as any;
    if (ref.current && ref.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const [value, setValue] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const iconBackColorOpen = 'grey.300';

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
        onClick={handleToggle}
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
                  <MainCard elevation={0} border={false} content={false}>
                    <CardContent sx={{ px: 2.5, pt: 3 }}>
                      <Grid container justifyContent="space-between" alignItems="center">
                        <Grid item>
                          <Stack direction="row" spacing={1.25} alignItems="center">
                            <Avatar alt="profile user" src={avatar} sx={{ width: 32, height: 32 }} />
                            <Stack>
                              <Typography variant="h6">{username}</Typography>
                              {/* <Typography variant="body2" color="textSecondary">
                                {role}
                              </Typography> */}
                            </Stack>
                          </Stack>
                        </Grid>
                        <Grid item>
                          <IconButton size="large" color="secondary" onClick={handleLogout}>
                            <LogoutOutlined />
                          </IconButton>
                        </Grid>
                      </Grid>
                      <Grid container justifyContent="space-between" alignItems="center">
                        <Grid item>
                          {version && <Typography>version: {version}</Typography>}
                        </Grid>
                      </Grid>
                    </CardContent>
                    {/* {open && (
                      <>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                          <Tabs variant="fullWidth" value={value} onChange={handleChange} aria-label="profile tabs">
                            <Tab
                              sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                textTransform: 'capitalize'
                              }}
                              icon={<UserOutlined style={{ marginBottom: 0, marginRight: '10px' }} />}
                              label="Profile"
                              {...a11yProps(0)}
                            />
                            <Tab
                              sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                textTransform: 'capitalize'
                              }}
                              icon={<SettingOutlined style={{ marginBottom: 0, marginRight: '10px' }} />}
                              label="Setting"
                              {...a11yProps(1)}
                            />
                          </Tabs>
                        </Box>
                        <TabPanel value={value} index={0} dir={theme.direction}>
                          <ProfileTab handleLogout={handleLogout} />
                        </TabPanel>
                        <TabPanel value={value} index={1} dir={theme.direction}>
                          <SettingTab />
                        </TabPanel>
                      </>
                    )} */}
                  </MainCard>
                </ClickAwayListener>
              </Paper>
            )}
          </Transitions>
        )}
      </Popper>
    </Box>
  );
};

export default Profile;
