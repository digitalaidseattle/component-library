import { FirestoreService } from "@digitalaidseattle/firebase";

type Project = {
    id: string | undefined;
    airtableId: string;
    createdAt: Date;
    createdBy: string;
    name: string;
    partner: string;
    status?: string;
}

class ProjectService extends FirestoreService<Project> {
    constructor() {
        super("PROJECTS");
    }
}

const projectService = new ProjectService();
export { projectService };
export type { Project };

