/**
 *  SaveProject.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { getCoreServices } from "@digitalaidseattle/core";
import { Project, ProjectContext } from "../types";
import { getContentGenerationServices } from "..";
import { v4 as uuid } from 'uuid';

const DEFAULT_FOLDER = import.meta.env.VITE_FIREBASE_STORAGE_FOLDER;

async function validate(project: Project) {
    const projectService = getContentGenerationServices().projectService!;

    if ((project.name ?? "").trim().length === 0) {
        throw new Error("Name is required.");
    }

    projectService.findByName(project.name)
        .then(pps => {
            if (pps.length === 1) {
                if (pps[0].id !== project.id) {
                    throw new Error("There is an existing project with the same name.");
                }
            }
        })
}

async function organizeContextsFiles(project: Project): Promise<ProjectContext[]> {
    const storageService = getCoreServices().storageService!;
    const cloudFiles = await storageService
        .list(`${DEFAULT_FOLDER}/${project.id}`)
        .then((files: any[]) => files.map((file: any) => file.name));

    const updatedContexts: ProjectContext[] = [];
    project.contexts.forEach(async context => {
        if (context.type === 'text') {
            updatedContexts.push(context);
        } else if (context.file! instanceof File) {
            // Existing files will be overwritten
            const url = await storageService.upload(`${DEFAULT_FOLDER}/${project.id}/${context.file!.name}`, context.file!);
            const newContext = { ...context, fileUrl: url };
            delete newContext.file;
            updatedContexts.push(newContext);
        } else {
            const index = cloudFiles.indexOf(context.name);
            if (index > -1) {  // remove from cloudFiles list
                cloudFiles.splice(index, 1);
                updatedContexts.push(context);
            } else {
                console.error('not in the cloud & no file to upload', context);
            }
        }
    });
    cloudFiles.forEach(async fileName => {
        await storageService.removeFile(`${DEFAULT_FOLDER}/${project.id}/${fileName}`)
    })
    return updatedContexts;
}

export async function saveProject(project: Project): Promise<Project> {
    const authService = getCoreServices().authService!;
    const aiService = getContentGenerationServices().aiService;
    const projectService = getContentGenerationServices().projectService;

    await validate(project);

    const contexts = await organizeContextsFiles(project);
    const now = new Date();
    const user = await authService.getUser();
    const email = user!.email;
    const prompt = aiService.generatePrompt(project);

    const updatedProject = {
        ...project,
        id: project.id ?? uuid(),
        created_by: project.created_by ?? email,
        created_at: project.created_at ?? now,
        updated_by: email,
        updated_at: now,
        contexts: contexts,
        prompt: prompt
    } as Project;
    return projectService.upsert(updatedProject);
}

