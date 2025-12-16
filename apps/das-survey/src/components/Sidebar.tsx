import { Box, Toolbar } from "@mui/material";

export default function Sidebar({
  open,
  width,
  children,
}: {
  open: boolean;
  width: number;
  children: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <Box
      width={width}
      borderRight={1}
      borderColor="divider"
      bgcolor="background.paper"
      flexShrink={0}
    >
      <Toolbar />
      <Box p={2}>{children}</Box>
    </Box>
  );
}