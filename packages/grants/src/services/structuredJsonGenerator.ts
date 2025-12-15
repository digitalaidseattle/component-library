/**
 *  StructuredJsonGenerator.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { AiService } from "@digitalaidseattle/core";
import { grantProposalService } from "./grantProposalService";
import { GrantProposal, GrantRecipe } from "./types";

export class StructuredJsonGenerator {

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

    createSchema(grantRecipe: GrantRecipe): string[] {
        return grantRecipe.outputParameters.map(p => p.name);
    }

    async generate(grantRecipe: GrantRecipe): Promise<GrantProposal> {
        const schemaFields = this.createSchema(grantRecipe);
        const structured = await this.aiService.generateParameterizedContent(grantRecipe.modelType, grantRecipe.prompt, schemaFields)
        const proposal = {
            id: null,
            grantRecipeId: grantRecipe.id as string,
            createdAt: new Date(),
            createdBy: '',
            structuredResponse: structured,
            rating: null
        }
        return await grantProposalService.insert(proposal)
    }

}
