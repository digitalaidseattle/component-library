import { FirestoreService } from "@digitalaidseattle/firebase";
import { GrantProposal, GrantRecipe } from "./types";


class GrantService extends FirestoreService<GrantRecipe> {

    constructor() {
        super("GRANT-RECIPES");
    }

    empty(): GrantRecipe {
        return {
            id: "",
            createdAt: new Date(),
            createdBy: '',
            updatedAt: new Date(),
            updatedBy: '',
            description: "New Proposal",
            prompt: "Create a grant proposal",
            inputParameters: [
                { key: "to", value: 'Microsoft Philanthropy' },
                { key: "from", value: 'Digital Aid Seattle' }
            ],

            outputsWithWordCount: [
                { name: 'description', maxWords: 500 },
                { name: 'usage', maxWords: 500 }
            ],
            tokenString: "",
            tokenCount: 0,
            proposalIds: [],
            modelType: ''
        }
    }

    createMarkdownRequest(proposal: GrantRecipe): string {
        const inputs = `${proposal.inputParameters.map(param => `'${param.key}' : '${param.value}'`).join(', ')}`;
        const outputNames = proposal.outputsWithWordCount.map(p => p.name).join(', ');
        let limits = '';
        if (proposal.outputsWithWordCount.length > 0) {
            limits = proposal.outputsWithWordCount.map(propOutput => {
                `${propOutput.name} to ${propOutput.maxWords} words`
            }).join(', and ')
        }
        const request = `${proposal.prompt} using the inputs: {${inputs}}.
          Include in the output the following: ${outputNames},
           limiting ${limits} `;
        return request
    }

    createStructuredRequest(proposal: GrantRecipe): { request: string, schemaFields: string[] } {
        const inputs = `${proposal.inputParameters.map(param => `'${param.key}' : '${param.value}'`).join(', ')}`;
        const outputNames = proposal.outputsWithWordCount.map(p => p.name).join(', ');
        let limits = '';
        if (proposal.outputsWithWordCount.length > 0) {
            limits = proposal.outputsWithWordCount.map(propOutput => {
                `${propOutput.name} to ${propOutput.maxWords} words`
            }).join(', and ')
        }
        const request = `${proposal.prompt} using the inputs: {${inputs}}.  Include in the output the following: ${outputNames}, limiting ${limits} `;
        const schemaFields = proposal.outputsWithWordCount.map(p => p.name);
        return { request: request, schemaFields: schemaFields }
    }

}


const grantService = new GrantService();
export { grantService };

