import { Configuration as FirebaseConfig, FirestoreService } from "@digitalaidseattle/firebase";
import { ApplicationHistory } from "../types";

export class ApplicationHistoryService extends FirestoreService<ApplicationHistory> {


    private static instance: ApplicationHistoryService;

    static getInstance() {
        if (!ApplicationHistoryService.instance) {
            ApplicationHistoryService.instance = new ApplicationHistoryService();
        }
        return ApplicationHistoryService.instance;
    }


    constructor() {
        super("application_history", FirebaseConfig.getInstance().getClient());
    }

    empty(): ApplicationHistory {
        return {
            id: null,
            application_id: '',
            status: '',
            notes: '',
        }
    }

    async getForApplication(applicationId: string): Promise<ApplicationHistory[]> {
        const all = await this.getAll();
        return all.filter(h => h.application_id?.toString() === applicationId);
    }

}
