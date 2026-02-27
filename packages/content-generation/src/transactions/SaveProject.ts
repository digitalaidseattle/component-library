/**
 *  SaveProject.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { getCoreServices } from "@digitalaidseattle/core";
import { Project, ProjectContext } from "../services/types";
import { getContentGenerationServices } from "../services";
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
                console.log(pps[0].id, project.id)
                if (pps[0].id !== project.id) {
                    throw new Error("There is an existing project with the same name.");
                } else {
                    throw new Error("There is an existing project with the same name.");
                }
            }
        })
}

function isNewFile(context: ProjectContext): boolean {
    if (context.type === 'text') {
        return false;
    }
    if (context.fileUrl) {  // previously uploaded
        return false;
    }
    if (context.file! instanceof File) {  // new file
        return true;
    }
    return false;
}

async function uploadFiles(project: Project): Promise<ProjectContext[]> {
    const storageService = getCoreServices().storageService!;
    return await Promise.all(project.contexts
        .map(async (context) => {
            if (isNewFile(context)) {
                const url = await storageService.upload(`${DEFAULT_FOLDER}/${project.id}/${context.file!.name}`, context.file!);
                const newContext = { ...context, fileUrl: url };
                delete newContext.file;
                return newContext;
            }
            return { ...context };
        }));
}

async function removeFiles(project: Project): Promise<void> {
    const storageService = getCoreServices().storageService!;
    const projectFiles = project.contexts
        .filter(con => (con.type !== 'text'))
        .map(con => con.name);
    const cloudFiles = await storageService.list(`${DEFAULT_FOLDER}/${project.id}`);
    const fileRemovals = cloudFiles
        .filter(fileName => !projectFiles.includes(fileName))
        .map((file) => storageService.removeFile(`${DEFAULT_FOLDER}/${project.id}/${file.name}`))
    Promise.all(fileRemovals);
}


export async function saveProject(project: Project): Promise<Project> {
    const authService = getCoreServices().authService!;
    const aiService = getContentGenerationServices().aiService!;
    const projectService = getContentGenerationServices().projectService!;

    await validate(project);
    await removeFiles(project);

    const now = new Date();
    const user = await authService.getUser();
    const email = user!.email;
    const contexts = await uploadFiles(project);
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

    if (project.id) {
        return projectService.update(project.id, updatedProject, undefined, undefined, user!);
    } else {
        const forInsertion = {
            ...updatedProject,
            created_by: user?.email,
            created_at: now,
        }
        return projectService.insert(forInsertion, undefined, undefined, user!);
    }
}

