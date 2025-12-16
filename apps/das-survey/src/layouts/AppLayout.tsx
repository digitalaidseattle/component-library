import { Box, Toolbar } from "@mui/material";
import { useState } from "react";
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

const SIDEBAR_WIDTH = 350;
const APPBAR_OFFSET = 72;

export default function AppLayout({
  breadcrumbs,
  sidebarContent,
  children,
}: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const hasSidebar = Boolean(sidebarContent);

  return (
    <Box display="flex">
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
            pt: 1,
          }}
        >
          {sidebarContent}
        </Box>
      )}

      <Box component="main" flexGrow={1} p={3}>
        {/* Spacer for floating AppBar */}
        <Toolbar sx={{ minHeight: APPBAR_OFFSET }} />

        {children}
      </Box>
    </Box>
  );
}