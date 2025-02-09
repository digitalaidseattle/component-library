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
    // Update a document to a collection
    async getById(id: string): Promise<Project> {
        return super
            .getById(id)
            .then(proj => {
                return {
                    ...proj,
                    createdAt: (proj.createdAt as any).toDate()
                }
            })
    }

    async getAll(): Promise<Project[]> {
        return super
            .getAll()
            .then(data => data.map(proj => {
                return {
                    ...proj,
                    createdAt: (proj.createdAt as any).toDate()
                }
            }))
    }
}

const projectService = new ProjectService();
export { projectService };
export type { Project };

