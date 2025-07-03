import { Entity, FirestoreService } from "@digitalaidseattle/firebase";

type Institution = Entity & {
    createdAt: Date;
    createdBy: string;
    name: string;
    description: string;
    email: string;
    phone: string;
    address: string;
    contact: string;
}

class InstitutionService extends FirestoreService<Institution> {

    constructor() {
        super("INSTITUTIONS");
    }

    empty() {
        return {
            id: undefined,
            createdAt: new Date(),
            createdBy: "",
            name: "",
            description: "",
            email: "",
            phone: "",
            address: "",
            contact: ""
        }
    }
}

const institutionService = new InstitutionService();
export { institutionService };
export type { Institution };

