/**
 * ProjectPage.tsx
 * 
 * @copyright 2025 Digital Aid Seattle
*/

import { HomeOutlined } from "@ant-design/icons";
import { Box, Breadcrumbs, IconButton, Stack, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";

import { HelpTopicContext, LoadingContext, useHelp } from "@digitalaidseattle/core";
import { HelpDrawer, LoadingOverlay } from "@digitalaidseattle/mui";

import { ProjectCard } from "../components/ProjectCard";
import { ProjectHelpUtils } from "../services/ProjectHelpUtils";

const ProjectPage: React.FC<{ listPath?: string }> = ({ listPath = "projects" }) => {

  const { loading } = useContext(LoadingContext);
  const { showHelp } = useHelp();
  const [helpTopic, setHelpTopic] = useState<string | undefined>();

  return (
    <>
      <LoadingOverlay loading={loading} />
      <HelpTopicContext.Provider value={{ helpTopic, setHelpTopic }} >
        <Breadcrumbs aria-label="breadcrumbs">
          <NavLink to="/" ><IconButton size="medium"><HomeOutlined /></IconButton></NavLink>
          <NavLink to={`/${listPath}`} >Projects</NavLink>
          <Typography color="text.primary">Project Detail</Typography>
        </Breadcrumbs>
        <Box gap={4} >
          <Stack sx={{
            height: "calc(100dvh - 112px)",
            gap: 2,
            marginRight: `${showHelp ? ProjectHelpUtils.DRAWER_WIDTH : 0}px`
          }}>
            <ProjectCard />
          </Stack>
          <HelpDrawer title={ProjectHelpUtils.title} width={ProjectHelpUtils.DRAWER_WIDTH} dictionary={ProjectHelpUtils.dictionary} />
        </Box>
      </HelpTopicContext.Provider >
    </>
  );

}

export { ProjectPage };
