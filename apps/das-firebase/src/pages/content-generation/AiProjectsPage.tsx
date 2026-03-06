/**
 * ProjectPage.tsx
 * 
 * @copyright 2025 Digital Aid Seattle
*/

import { HomeOutlined, MoreOutlined } from "@ant-design/icons";
import { Accordion, AccordionDetails, AccordionSummary, Box, Breadcrumbs, Grid, IconButton, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import Markdown from "react-markdown";
import { NavLink } from "react-router";

import { ProjectHelpUtils, ProjectsListCard } from "@digitalaidseattle/content-generation";
import { HelpTopicContext, useHelp } from "@digitalaidseattle/core";
import { HelpDrawer } from "@digitalaidseattle/mui";
import ProjectHelp from "./projects.md?raw";

const detailPath = "ai-projects";
const helpFilePath = './projects.md'

const AiProjectsPage: React.FC = () => {
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
            marginRight: `${showHelp ? ProjectHelpUtils.DRAWER_WIDTH : 0}px`
          }}>
            <Grid container spacing={2}>
              <Grid size={12}>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<MoreOutlined />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                  >
                    <Typography component="span" fontWeight={600} fontSize={16}>AI Projects</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Markdown>{ProjectHelp}</Markdown>
                  </AccordionDetails>
                </Accordion>
              </Grid>
              <Grid size={12} >
                <ProjectsListCard detailPath={detailPath} />
              </Grid>
            </Grid>
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

export { AiProjectsPage };
