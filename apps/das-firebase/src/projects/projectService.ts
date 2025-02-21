import { Entity, FirestoreService } from "@digitalaidseattle/firebase";

type Project = Entity & {
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

    empty() {
        return {
            id: undefined,
            airtableId: "",
            createdAt: new Date(),
            createdBy: "",
            name: "",
            partner: "",
            status: ""
        }
    }
}

const projectService = new ProjectService();
export { projectService };
export type { Project };

