import { Box, Toolbar, useMediaQuery } from "@mui/material";
import { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import AppAppBar from "../components/utils/AppAppBar";

export type Breadcrumb = {
  label: string;
  path?: string;
};

type AppLayoutProps = {
  breadcrumbs: Breadcrumb[];
  sidebarContent: React.ReactNode;
  children: React.ReactNode;
};

const SIDEBAR_WIDTH = 280;
const APPBAR_HEIGHT = 72;

export default function AppLayout({
  breadcrumbs,
  sidebarContent,
  children,
}: AppLayoutProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const hasSidebar = Boolean(sidebarContent);

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  return (
    <Box display="flex" width="100%">
      <AppAppBar
        breadcrumbs={breadcrumbs}
        sidebarOpen={sidebarOpen && hasSidebar}
        sidebarWidth={SIDEBAR_WIDTH}
        onToggleSidebar={() => setSidebarOpen((o) => !o)}
      />

      {hasSidebar && sidebarOpen && (
        <Box
          sx={{
            width: SIDEBAR_WIDTH,
            flexShrink: 0,
            overflow: "auto",
            borderRight: "1px solid",
            borderColor: "divider",
          }}
        >
          {sidebarContent}
        </Box>
      )}

      <Box component="main" flexGrow={1} width="100%">
        {/* Spacer for fixed AppBar */}
        <Toolbar sx={{ minHeight: APPBAR_HEIGHT }} />

        <Box sx={{ p: { xs: 2, sm: 3 }, backgroundColor: "background.default" }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}