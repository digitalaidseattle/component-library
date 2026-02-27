/**
 *  MarkdownGenerator.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { AiService, getContentGenerationServices } from "./contentGenerationServices";
import { Project } from "./types";

export class MarkdownGenerator {

    aiService: AiService

    constructor() {
        this.aiService = getContentGenerationServices().aiService;
    }

    // createPrompt(project: Project): string {
    //     // TODO switch to handlebars
    //     const inputs = `${project.inputParameters.map(param => `'${param.key}' : '${param.value}'`).join(', ')}`;
    //     const outputNames = project.outputParameters.map(p => p.name).join(', ');
    //     let limits = '';
    //     if (project.outputParameters.length > 0) {
    //         limits = project.outputParameters.map(propOutput => {
    //             `${propOutput.name} to ${propOutput.maxSymbols} words`
    //         }).join(', and ')
    //     }
    //     const request = `${project.template} using the inputs: {${inputs}}.  Include in the output the following: ${outputNames}, limiting ${limits} `;
    //     return request;
    // }

    // async generate(grantRecipe: GrantRecipe): Promise<GrantProposal> {
    //     const response = await this.aiService.generateContent(grantRecipe.modelType, grantRecipe.prompt)
    //     const proposal = {
    //         id: "",
    //         grantRecipeId: grantRecipe.id as string,
    //         createdAt: new Date(),
    //         createdBy: '',
    //         textResponse: response,
    //         rating: null
    //     }
    //     return await grantProposalService.insert(proposal)
    // }
}
