import { HomeOutlined } from "@ant-design/icons";
import { Box, Breadcrumbs, IconButton, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { ProjectsListCard } from "../components/ProjectsListCard";
import { HelpTopicContext, useHelp } from "@digitalaidseattle/core";
import { HelpDrawer } from "@digitalaidseattle/mui";
import { ProjectHelpUtils } from "../services";


const ProjectsListPage: React.FC<{ detailPath?: string, helpFilePath?: string }> = ({ detailPath = "projects", helpFilePath }) => {
  const { showHelp } = useHelp();
  const [helpTopic, setHelpTopic] = useState<string | undefined>('default');

  return (
    <>
      <HelpTopicContext.Provider value={{ helpTopic, setHelpTopic }} >
        <Breadcrumbs aria-label="breadcrumb">
          <NavLink color="text.primary" to="/" ><IconButton size="medium"><HomeOutlined /></IconButton></NavLink>
          <Typography color="text.primary">Projects</Typography>
        </Breadcrumbs>
        <Box gap={4}>
          <Stack sx={{
            height: "calc(100dvh - 112px)",
            gap: 2,
            marginRight: `${showHelp ? ProjectHelpUtils.DRAWER_WIDTH : 0}px`
          }}>
            <ProjectsListCard detailPath={detailPath} />
          </Stack>
          <HelpDrawer
            helpFilePath={helpFilePath}
            title={ProjectHelpUtils.title}
            width={ProjectHelpUtils.DRAWER_WIDTH}
            dictionary={ProjectHelpUtils.dictionary} />
        </Box>
      </HelpTopicContext.Provider >

    </>
  );
};

export { ProjectsListPage };
