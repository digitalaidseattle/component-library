/**
 *  MarkdownGenerator.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { AiService } from "@digitalaidseattle/core";
import { grantProposalService } from "./grantProposalService";
import { GrantProposal, GrantRecipe } from "./types";

export class MarkdownGenerator {

    aiService: AiService;

    constructor(service: AiService) {
        this.aiService = service;
    }

    createPrompt(grantRecipe: GrantRecipe): string {
        // TODO switch to handlebars
        const inputs = `${grantRecipe.inputParameters.map(param => `'${param.key}' : '${param.value}'`).join(', ')}`;
        const outputNames = grantRecipe.outputParameters.map(p => p.name).join(', ');
        let limits = '';
        if (grantRecipe.outputParameters.length > 0) {
            limits = grantRecipe.outputParameters.map(propOutput => {
                `${propOutput.name} to ${propOutput.maxSymbols} words`
            }).join(', and ')
        }
        const request = `${grantRecipe.template} using the inputs: {${inputs}}.  Include in the output the following: ${outputNames}, limiting ${limits} `;
        return request;
    }

    async generate(grantRecipe: GrantRecipe): Promise<GrantProposal> {
        const response = await this.aiService.generateContent(grantRecipe.modelType, grantRecipe.prompt)
        const proposal = {
            id: "",
            grantRecipeId: grantRecipe.id as string,
            createdAt: new Date(),
            createdBy: '',
            textResponse: response,
            rating: null
        }
        return await grantProposalService.insert(proposal)
    }
}
