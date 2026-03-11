/**
 *  GenerateContent.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { getContentGenerationServices } from "../contentGenerationServices";
import { Project, ProjectContent } from "../types";

async function validate(project: Project) {

    // The prompt should already be generated and saved with the project
    if (!project.prompt || project.prompt.trim() === '') {
        throw new Error("Project prompt has not been generated");
    }

}

export async function generateProjectContent(project: Project): Promise<ProjectContent> {
    const aiService = getContentGenerationServices().aiService;
    const contentService = getContentGenerationServices().projectContentService;
    const transactionService = getContentGenerationServices().projectTransactionService;;

    await validate(project);

    let savedProject = await transactionService.save(project);

    // Ask AI for structured JSON using output field names as keys
    const outputs = project.outputs ?? [];
    if (outputs.length === 0) {
        const response = await aiService.query(
            project,
            project.modelType
        );
        return {
            ...contentService.empty(),
            name: `${savedProject.name}`,
            projectId: String(savedProject.id),
            markdownResponse: response.text!,
            rating: null,
            totalTokenCount: response.usageMetadata ? response.usageMetadata.totalTokenCount : null,
            model: project.modelType
        };
    } else {
        const response = await aiService.parameterizedQuery(
            project,
            project.modelType
        );

        return {
            ...contentService.empty(),
            name: `${savedProject.name}`,
            projectId: String(savedProject.id),
            structuredResponse: JSON.parse(response.text!),
            rating: null,
            totalTokenCount: response.usageMetadata ? response.usageMetadata.totalTokenCount : null,
            model: project.modelType
        };
    }
}