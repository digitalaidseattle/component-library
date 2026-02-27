/**
 * ProjectPage.tsx
 * 
 * @copyright 2025 Digital Aid Seattle
*/

import { Button, Card, CardActions, CardContent, CardHeader, Divider, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";

import { LoadingContext, useNotifications } from "@digitalaidseattle/core";
import { SplitButton } from "@digitalaidseattle/mui";

import { getContentGenerationServices } from "../services";
import { ProjectContent, Project, ProjectOutput } from "../services/types";
import { saveProject } from "../transactions";
import { cloneProject } from "../transactions/CloneProject";
import { generateProjectContent } from "../transactions/GenerateProjectContent";
import { DateUtils } from "../utils/dateUtils";
import { AiProjectContext } from "./AiProjectContext";
import { PlainTextCard } from "./PlainTextCard";
import { ProjectContextEditor } from "./ProjectContextEditor";
import { ProjectOutputEditor } from "./ProjectOutputEditor";
import { ProjectTemplateEditor } from "./ProjectTemplateEditor";
import { TextEdit } from "./TextEdit";
import { ProjectContentDialog } from "./ProjectContentDialog";

function getRootPath(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  segments.pop(); // remove last segment

  const newPath = segments.length ? `/${segments.join('/')}` : '';
  return `${newPath}`;
}

const UI_CONSTANTS = {
  TEMPLATE_TITLE: "What would like to have generated.",
  CONTEXT_TITLE: "Add context information for the project.",
  OUTPUT_TITLE: "For structured responses, add the sections to be included in the response",
  PROMPT_TITLE: "This prompt will be sent to the AI content generation service."
}

const ProjectCard: React.FC = () => {
  const aiService = getContentGenerationServices().aiService;
  const projectService = getContentGenerationServices().projectService;

  const { id } = useParams<string>();
  const [project, setProject] = useState<Project>();
  const [content, setContent] = useState<ProjectContent>();

  const navigate = useNavigate();

  const location = useLocation();
  const detailPath = getRootPath(location.pathname);
  const models = aiService.getModels();

  const notifications = useNotifications();
  const { loading, setLoading } = React.useContext(LoadingContext);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [dirty, setDirty] = useState<boolean>(false);
  const [isValid, setIsValid] = useState<boolean>(false);

  const [showContentDialog, setShowContentDialog] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      setProject(undefined);
      projectService
        .getById(id)
        .then(found => {
          setProject(found!)
          setDirty(false);
        });
    }
  }, [id]);

  useEffect(() => {
    if (project) {
      setIsValid((project?.name ?? "").trim().length > 0);
      setLastUpdated(DateUtils.formatDateTime(project.updated_at!));
    }
  }, [project]);

  function handleSave() {
    setLoading(true);
    saveProject(project!)
      .then(saved => {
        setProject(saved);
        setDirty(false);
        notifications.success(`${saved.name} has been successfully saved.`)
      })
      .catch(err => {
        console.error(err)
        notifications.error(`Could not save this project. ${err.message}`)
      })
      .finally(() => setLoading(false))
  }

  function handleClone() {
    setLoading(true);
    cloneProject(project!)
      .then(cloned => {
        navigate(`/${detailPath}/${cloned.id}`);
        notifications.success(`${project!.name} has been successfully cloned.`)
      })
      .catch(err => {
        console.error(err);
        notifications.error(`Could not clone this poject. ${err.message}`)
      })
      .finally(() => setLoading(false))
  }

  async function handleGenerate(model: string) {
    if (project) {
      setLoading(true);
      project.modelType = model;
      generateProjectContent(project)
        .then(content => {
          setContent(content);
          setShowContentDialog(true);
          notifications.success(`Proposal generated for ${project.name}.`);
        })
        .catch((err: any) => {
          console.error(err);
          notifications.error(
            `Could not generate a proposal for this recipe. ${err?.message ?? "Unknown error"
            }`
          )
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }

  function handleProjectOutputChange(updated: ProjectOutput[]): void {
    const prompt = aiService.generatePrompt({ ...project!, outputs: updated });
    setProject({
      ...project!,
      outputs: updated,
      prompt: prompt
    });
    setDirty(true);
  }

  function handleProjectContextsChange(revised: Project): void {
    // prompt not affected by contexts change
    setProject(revised);
    setDirty(true);
  }

  async function handleTemplateChange(updated: string): Promise<void> {
    const prompt = aiService.generatePrompt({ ...project!, template: updated });
    const tokenCoount = await aiService.calcTokenCount(project!.modelType, prompt);
    setProject({
      ...project!,
      template: updated,
      prompt: prompt,
      tokenCount: tokenCoount
    });
    setDirty(true);
  }

  function handleNameChange(newValue: string) {
    setProject({
      ...project!,
      name: newValue
    });
    setDirty(true);
  };

  return (project &&
    <AiProjectContext.Provider value={{ project: project, setProject: setProject }} >
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardHeader
          title={<TextEdit
            value={project.name}
            onChange={handleNameChange} />}
          action={`Token count = ${project.tokenCount}`}
          subheader={`Last updated: ${lastUpdated}`} />
        <CardContent
          sx={{
            flex: 1,
            overflowY: "auto",
          }}>
          <Stack gap={1}>
            <ProjectTemplateEditor title={UI_CONSTANTS.TEMPLATE_TITLE} onChange={handleTemplateChange} />
            <ProjectContextEditor title={UI_CONSTANTS.CONTEXT_TITLE} onChange={handleProjectContextsChange} />
            <ProjectOutputEditor title={UI_CONSTANTS.OUTPUT_TITLE} onChange={handleProjectOutputChange} />
            <PlainTextCard title={UI_CONSTANTS.PROMPT_TITLE} value={project.prompt} />
          </Stack>
        </CardContent>
        <CardActions
          sx={{
            borderTop: "1px solid",
            borderColor: "divider",
            justifyContent: "flex-end",
          }}>
          <SplitButton
            options={models.map(m => ({ label: `Generate with ${m}`, value: m }))}
            onClick={(model: string) => handleGenerate(model)} />
          <Button variant="contained" disabled={loading || !isValid} onClick={() => handleClone()}>Clone</Button>
          <Divider orientation="vertical" />
          <Button variant="contained" disabled={loading || !dirty || !isValid} onClick={() => handleSave()}>Save</Button>
        </CardActions>
      </Card>
      <ProjectContentDialog
        project={project}
        content={content!}
        open={showContentDialog}
        onClose={() => setShowContentDialog(false)} />
    </AiProjectContext.Provider >
  );
}

export { ProjectCard };
