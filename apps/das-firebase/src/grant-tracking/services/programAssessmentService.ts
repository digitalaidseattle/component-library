import { Configuration as FirebaseConfig, FirestoreService } from "@digitalaidseattle/firebase";
import { ProgramAssessment } from "../types";

export class ProgramAssessmentService extends FirestoreService<ProgramAssessment> {

    private static instance: ProgramAssessmentService;

    static getInstance() {
        if (!ProgramAssessmentService.instance) {
            ProgramAssessmentService.instance = new ProgramAssessmentService();
        }
        return ProgramAssessmentService.instance;
    }

    constructor() {
        super("program_assessments", FirebaseConfig.getInstance().getClient());
    }

    empty(): ProgramAssessment {
        return {
            id: null,
            grant_program_id: '',
            priority_score: 0,
            notes: [],
            email: '',
        }
    }
}
