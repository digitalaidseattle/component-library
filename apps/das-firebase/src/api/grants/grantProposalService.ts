import { FirestoreService } from "@digitalaidseattle/firebase";
import { GrantProposal } from "./types";


class GrantProposalService extends FirestoreService<GrantProposal> {

    constructor() {
        super("GRANT-PROPOSALS");
    }

}


const grantProposalService = new GrantProposalService();
export { grantProposalService };

