import { FirestoreService } from "@digitalaidseattle/firebase";

import { GrantProposal } from "./types";
import { collection, getDocs, query, where } from "@firebase/firestore";


class GrantProposalService extends FirestoreService<GrantProposal> {

    constructor() {
        super("GRANT-PROPOSALS");
    }

    async findByGrantRecipeId(recipeId: string): Promise<GrantProposal[]> {
        try {
            const proposalCollection = collection(this.db, this.collectionName);
            const q = query(proposalCollection, where("grantRecipeId", "==", recipeId));

            const querySnapshot = await getDocs(q);

            const results = querySnapshot.docs
                .map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as GrantProposal));

            console.log(results);
            return results;
        } catch (err) {
            console.error("Error fetching documents:", err);
            throw err;
        }
    }

}


const grantProposalService = new GrantProposalService();
export { grantProposalService };

