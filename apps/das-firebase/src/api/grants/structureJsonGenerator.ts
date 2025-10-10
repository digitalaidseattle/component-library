import { AiService } from "../aitypes";
import { grantProposalService } from "./grantProposalService";
import { grantService } from "./grantService";
import { GrantRecipe } from "./types";

export class StructureJsonGenerator {
    aiService: AiService;

    constructor(service: AiService) {
        this.aiService = service;
    }

    async generate(grantRecipe: GrantRecipe): Promise<GrantRecipe> {
        const { request, schemaFields } = grantService.createStructuredRequest(grantRecipe);
        const tokenCount = await this.aiService.calcTokenCount(request)
        const structured = await this.aiService.generateParameterizedContent(request, schemaFields)
        const proposal = {
            id: "",
            grantRecipeId: grantRecipe.id as string,
            createdAt: new Date(),
            structuredResponse: structured,
            rating: null
        }
        const savedProposal = await grantProposalService.insert(proposal)
        const updatedRecipe = {
            ...grantRecipe,
            tokenString: request,
            tokenCount: tokenCount
        }
        updatedRecipe.proposalIds.push(savedProposal.id as string);
        return await grantService.update(updatedRecipe.id as string, updatedRecipe);
    }
}
