import { Configuration as FirebaseConfig, FirestoreService } from "@digitalaidseattle/firebase";
import { GrantApplication } from "../types";

export class GrantApplicationService extends FirestoreService<GrantApplication> {


    private static instance: GrantApplicationService;

    static getInstance() {
        if (!GrantApplicationService.instance) {
            GrantApplicationService.instance = new GrantApplicationService();
        }
        return GrantApplicationService.instance;
    }


    constructor() {
        super("grant_applications", FirebaseConfig.getInstance().getClient());
    }

    empty(): GrantApplication {
        return {
            id: null,
            grant_program_id: '',
            priority_score: 0,
            status: '',
            notes: '',
            email: '',
        }
    }

}
