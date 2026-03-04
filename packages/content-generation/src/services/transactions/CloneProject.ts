/**
 *  CloneProject.ts
 *
 *  @copyright 2026 Digital Aid Seattle
 *
 */

import { getCoreServices } from "@digitalaidseattle/core";
import { getContentGenerationServices } from "..";
import { Project, ProjectContext } from "../types";
import { v4 as uuid } from 'uuid';

const DEFAULT_FOLDER = import.meta.env.VITE_FIREBASE_STORAGE_FOLDER;

async function validate(project: Project) {
    if ((project.name ?? "").trim().length === 0) {
        throw new Error("Please name your project before cloning.");
    }
}

async function getCloneName(project: Project): Promise<string> {
    const projectService = getContentGenerationServices().projectService;

    let count = 0;
    const baseName = `Clone of ${project.name}`;
    let newName = baseName;
    do {
        count = await projectService.findByName(newName)
            .then(pps => pps.length);
        if (count > 0) {
            newName = `${baseName} (${count})`;
        }
    } while (count > 0);
    return newName;
}

async function cloneProjectContexts(project: Project, cloneId: string): Promise<ProjectContext[]> {
    const storageService = getCoreServices().storageService!;
    const sourceProjectPath = `${DEFAULT_FOLDER}/${project.id}`;
    const cloneProjectPath = `${DEFAULT_FOLDER}/${cloneId}`;

    return Promise.all(project.contexts.map(async (context) => {
        if (context.type === "text" || !context.name) {
            return { ...context };
        }

        const sourcePath = `${sourceProjectPath}/${context.name}`;
        const targetPath = `${cloneProjectPath}/${context.name}`;
        const sourceBlob = await storageService.downloadBlob(sourcePath);

        if (!sourceBlob) {
            throw new Error(`Unable to copy file for context "${context.name}".`);
        }

        const url = await storageService.upload(targetPath, sourceBlob);

        return {
            ...context,
            fileUrl: url,
        };
    }));
}


export async function cloneProject(project: Project): Promise<Project> {
    const authService = getCoreServices().authService!;
    const projectService = getContentGenerationServices().projectService;

    await validate(project);

    const now = new Date();
    const user = await authService.getUser();
    const email = user?.email;
    const cloneName = await getCloneName(project);
    const cloneId = uuid();

    const clonedContexts = await cloneProjectContexts(project, cloneId);

    const clone = {
        ...project,
        id: cloneId,
        name: cloneName,
        contexts: clonedContexts,
        created_at: now,
        created_by: email,
        updated_at: now,
        updated_by: email,
    } as Project;

    return projectService.upsert(clone);
}
