/**
 *  GrantProposalService.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { firebaseClient, FirestoreService } from "@digitalaidseattle/firebase";

import { GrantProposal } from "./types";
import { collection, getDocs, getFirestore, query, Timestamp, where } from "firebase/firestore";

class GrantProposalService extends FirestoreService<GrantProposal> {

    constructor() {
        super("GRANT-PROPOSALS");
    }

    async findByGrantRecipeId(recipeId: string): Promise<GrantProposal[]> {
        try {
            const adb = getFirestore(firebaseClient);
            const proposalRef = collection(adb, this.collectionName);
            const q = query(proposalRef, where("grantRecipeId", "==", recipeId));
            const querySnapshot = await getDocs(q);
            const results = querySnapshot.docs
                .map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as GrantProposal));
            return results
                .sort((a, b) => (a.createdAt as Timestamp).nanoseconds - (b.createdAt as Timestamp).nanoseconds);
        } catch (err) {
            console.error("Error fetching documents:", err);
            throw err;
        }
    }

}

const grantProposalService = new GrantProposalService();
export { grantProposalService, GrantProposalService };

