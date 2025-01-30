import { FirestoreService } from "../firebase/FirestoreService";


type Project = {
    id: string | undefined;
    airtableId: string;
    createdAt: Date;
    createdBy: string;
    name: string;
    partner: string;
}

class ProjectService extends FirestoreService<Project> {
    constructor() {
        super("PROJECTS");
    }
}

const projectService = new ProjectService();
export { projectService };
export type { Project };

