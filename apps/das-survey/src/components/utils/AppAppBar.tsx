import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import { alpha, styled } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { UserContext, UserContextType, useAuthService } from "@digitalaidseattle/core";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

type Breadcrumb = {
  label: string;
  path?: string;
};

type AppAppBarProps = {
  breadcrumbs: Breadcrumb[];
  sidebarOpen: boolean;
  sidebarWidth: number;
  onToggleSidebar: () => void;
};

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexShrink: 0,
  borderRadius: 0,
  backdropFilter: "blur(24px)",
  border: "1px solid",
  borderColor: theme.palette.divider,
  backgroundColor: alpha(theme.palette.background.default, 0.4),
  boxShadow: theme.shadows[1],
  padding: "8px 12px",
}));

export default function AppAppBar({
  breadcrumbs,
  sidebarOpen,
  sidebarWidth,
  onToggleSidebar,
}: AppAppBarProps) {
  const authService = useAuthService();
  const navigate = useNavigate();
  const { user, setUser } = React.useContext<UserContextType>(UserContext);
  const authEnabled = authService.getProviders().length > 0;

  async function handleSignOut() {
    await authService.signOut();
    setUser(undefined);
    navigate("/login?code=Logout");
  }

  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: "transparent",
        backgroundImage: "none",
        top: 0,
        left: sidebarOpen ? sidebarWidth : 0,
        width: sidebarOpen
          ? `calc(100% - ${sidebarWidth}px)`
          : "100%",
        transition: "all 0.25s ease",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        mx: 0,
      }}
    >
      <StyledToolbar variant="dense" disableGutters>
        {/* Left side - Menu and Breadcrumbs */}
        <Box display="flex" alignItems="center" gap={1.5}>
          <IconButton
            onClick={onToggleSidebar}
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
            sx={{
              color: "text.primary",
              "&:hover": {
                backgroundColor: alpha("#000", 0.05),
              },
            }}
          >
            <MenuOpenIcon
              sx={{
                transform: sidebarOpen ? "rotate(0deg)" : "rotate(180deg)",
                transition: "transform 0.2s ease",
              }}
            />
          </IconButton>

          {/* Breadcrumbs */}
          <Box display="flex" alignItems="center" sx={{ pl: 1 }}>
            {breadcrumbs.map((b, i) => {
              const isLast = i === breadcrumbs.length - 1;

              return (
                <Box key={i} display="flex" alignItems="center">
                  {b.path && !isLast ? (
                    <Typography
                      component={RouterLink}
                      to={b.path}
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        textDecoration: "none",
                        color: "text.secondary",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          color: "primary.main",
                          textDecoration: "underline",
                        },
                      }}
                    >
                      {b.label}
                    </Typography>
                  ) : (
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: "text.primary",
                      }}
                    >
                      {b.label}
                    </Typography>
                  )}

                  {!isLast && (
                    <Typography
                      variant="caption"
                      color="text.disabled"
                      sx={{ mx: 0.75 }}
                    >
                      /
                    </Typography>
                  )}
                </Box>
              );
            })}
          </Box>
        </Box>

        <Box display="flex" gap={1} alignItems="center">
          {!authEnabled && (
            <Chip
              label="Local workspace"
              size="small"
              variant="outlined"
              sx={{ borderRadius: 1.5 }}
            />
          )}

          {authEnabled && user && (
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography
                variant="caption"
                sx={{ color: "text.secondary", display: { xs: "none", sm: "block" } }}
              >
                {user.email}
              </Typography>
              <Button
                size="small"
                color="inherit"
                startIcon={<LogoutIcon />}
                onClick={() => void handleSignOut()}
              >
                Sign out
              </Button>
            </Stack>
          )}

          {authEnabled && !user && (
            <Button
              size="small"
              color="inherit"
              component={RouterLink}
              to="/login"
              startIcon={<LoginIcon />}
            >
              Sign in
            </Button>
          )}
        </Box>
      </StyledToolbar>
    </AppBar>
  );
}
