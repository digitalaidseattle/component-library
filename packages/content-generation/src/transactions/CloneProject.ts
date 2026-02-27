/**
 *  CloneProject.ts
 *
 *  @copyright 2026 Digital Aid Seattle
 *
 */

import { getCoreServices } from "@digitalaidseattle/core";
import { getContentGenerationServices } from "../services";
import { Project } from "../services/types";
import { v4 as uuid } from 'uuid';

async function validate(project: Project) {
    if ((project.name ?? "").trim().length === 0) {
        throw new Error("Please name your project before cloning.");
    }
}

export async function cloneProject(project: Project): Promise<Project> {
    const authService = getCoreServices().authService!;
    const projectService = getContentGenerationServices().projectService;

    await validate(project);

    let count = 0;
    let newName = `Clone of ${project.name}`;
    do {
        count = await projectService.findByName(newName)
            .then(pps => pps.length);
        newName = newName + (count > 0 ? ` (${count})` : '');
    } while (count > 0);

    const now = new Date();
    const user = await authService.getUser();
    const email = user?.email;

    const clone = {
        ...project,
        id: uuid(),
        name: newName,
        created_at: now,
        created_by: email,
        updated_at: now,
        updated_by: email,
    };
    return projectService.upsert(clone);
}