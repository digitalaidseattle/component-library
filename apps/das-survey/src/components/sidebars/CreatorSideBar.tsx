// src/components/sidebars/CreatorSidebar.tsx

import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Divider,
  Tabs,
  Tab,
} from "@mui/material";
import type { CreatorCommand } from "../../models/CreatorModel";

type SidebarTab = "build" | "style" | "workflow";

export type CreatorSidebarProps = {
  onCommand: (cmd: CreatorCommand) => void;
};

export default function CreatorSidebar({
  onCommand,
}: CreatorSidebarProps) {
  const [activeTab, setActiveTab] = useState<SidebarTab>("build");

  return (
    <Box p={3} height="100%" display="flex" flexDirection="column">
      <Tabs
        value={activeTab}
        onChange={(_, v) => setActiveTab(v)}
        sx={{ mb: 3 }}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="scrollable auto tabs example"
      >
        <Tab label="Build" value="build" />
        <Tab label="Style" value="style" />
        <Tab label="Workflow" value="workflow" />
      </Tabs>

      {activeTab === "build" && (
        <>
          <Typography variant="overline" color="text.secondary">
            Chapter 0
          </Typography>
          <Typography fontWeight={600} gutterBottom>
            Cover
          </Typography>

          <Button
            fullWidth
            variant="outlined"
            sx={{ mb: 1 }}
            onClick={() => onCommand({ type: "ADD_TITLE" })}
          >
            Add story title
          </Button>

          <Button
            fullWidth
            variant="outlined"
            onClick={() => onCommand({ type: "ADD_BLURB" })}
          >
            Add short blurb
          </Button>

          <Divider sx={{ my: 3 }} />

          <Typography variant="overline" color="text.secondary">
            Chapter 1
          </Typography>
          <Typography fontWeight={600} gutterBottom>
            The reader steps in
          </Typography>

          <Button
            fullWidth
            variant="outlined"
            sx={{ mb: 1 }}
            onClick={() =>
              onCommand({
                type: "ADD_PARTICIPANT",
                fieldType: "name",
              })
            }
          >
            Ask for name
          </Button>

          <Button
            fullWidth
            variant="outlined"
            sx={{ mb: 1 }}
            onClick={() =>
              onCommand({
                type: "ADD_PARTICIPANT",
                fieldType: "email",
              })
            }
          >
            Ask for email
          </Button>

          <Button
            fullWidth
            variant="outlined"
            onClick={() =>
              onCommand({
                type: "ADD_PARTICIPANT",
                fieldType: "address",
              })
            }
          >
            Ask for address
          </Button>
        </>
      )}

      {activeTab === "style" && (
        <Typography color="text.secondary">
          Style controls coming next.
        </Typography>
      )}

      {activeTab === "workflow" && (
        <Typography color="text.secondary">
          Workflow controls coming next.
        </Typography>
      )}
    </Box>
  );
}