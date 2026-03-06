/**
 *  CreateProject.ts
 *
 *  @copyright 2026 Digital Aid Seattle
 *
 */

import { getCoreServices } from "@digitalaidseattle/core";
import { v4 as uuid } from 'uuid';
import { getContentGenerationServices } from "../contentGenerationServices";
import { Project } from "../types";

const DEFAULT_NAME = 'New Project';

export async function createProject(): Promise<Project> {
    const authService = getCoreServices().authService!;
    const projectService = getContentGenerationServices().projectService;

    const now = new Date();
    const user = await authService.getUser();
    const email = user?.email;

    let count = 0;
    let newName = DEFAULT_NAME;
    do {
        count = await projectService.findByName(newName)
            .then(pps => pps.length);
        newName = newName + (count > 0 ? ` (${count})` : '');
    } while (count > 0);

    return projectService.upsert({
        ...projectService.empty(),
        id: uuid(),
        name: newName,
        created_at: now,
        created_by: email,
        updated_at: now,
        updated_by: email,
    });

}