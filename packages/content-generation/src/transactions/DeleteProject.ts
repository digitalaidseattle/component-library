/**
 *  DeleteProject.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { getCoreServices, Identifier } from "@digitalaidseattle/core";
import { getContentGenerationServices } from "../services";
import { Project } from "../services/types";

const DEFAULT_FOLDER = import.meta.env.VITE_FIREBASE_STORAGE_FOLDER;

async function removeFiles(project: Project): Promise<void> {
    const storageService = getCoreServices().storageService!;
    const files = await storageService.list(`${DEFAULT_FOLDER}/${project.id}`);
    const fileRemovals = files
        .map((file) => storageService.removeFile(`${DEFAULT_FOLDER}/${project.id}/${file.name}`))
    const folderRemoval = storageService.removeFile(`${DEFAULT_FOLDER}/${project.id}`);
    Promise.all([...fileRemovals, folderRemoval]);
}

export async function deleteProject(id: Identifier): Promise<void> {
    const authService = getCoreServices().authService!;
    const projectService = getContentGenerationServices().projectService!;

    const user = await authService.getUser();

    if (id) {
        const project = await projectService.getById(id);
        await removeFiles(project!);
        return projectService.delete(id, user!);
    }
}

