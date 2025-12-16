import { alpha, styled } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import { Link as RouterLink } from "react-router-dom";

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
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
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
  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: "transparent",
        backgroundImage: "none",
        top: 8,
        left: sidebarOpen ? sidebarWidth : 0,
        width: sidebarOpen
          ? `calc(100% - ${sidebarWidth}px)`
          : "100%",
        transition: "all 0.25s ease",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
          {/* Left side */}
          <Box display="flex" alignItems="center" gap={2}>
            <IconButton
              onClick={onToggleSidebar}
              aria-label="Toggle sidebar"
            >
              <MenuIcon />
            </IconButton>

            {/* Breadcrumbs */}
            <Box display="flex" alignItems="center">
              {breadcrumbs.map((b, i) => {
                const isLast = i === breadcrumbs.length - 1;

                return (
                  <Box key={i} display="flex" alignItems="center">
                    {b.path && !isLast ? (
                      <Typography
                        component={RouterLink}
                        to={b.path}
                        variant="caption"
                        sx={{
                          textDecoration: "none",
                          color: "text.secondary",
                          "&:hover": {
                            textDecoration: "underline",
                          },
                        }}
                      >
                        {b.label}
                      </Typography>
                    ) : (
                      <Typography
                        variant="caption"
                        color="text.primary"
                        fontWeight={500}
                      >
                        {b.label}
                      </Typography>
                    )}

                    {!isLast && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        mx={0.5}
                      >
                        /
                      </Typography>
                    )}
                  </Box>
                );
              })}
            </Box>
          </Box>

          {/* Right side */}
          <Box display="flex" gap={1}>
            <Button variant="text" size="small">
              Sign in
            </Button>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}