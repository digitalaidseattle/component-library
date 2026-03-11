import {
    SurveyTemplate,
    createDefinition,
    createQuestion
} from "./surveyModels";

export const surveyTemplates: SurveyTemplate[] = [
    {
        id: "blank",
        title: "Blank survey",
        description: "Start from scratch and assemble the exact set of questions you need.",
        category: "General",
        definition: createDefinition()
    },
    {
        id: "intake",
        title: "Client intake",
        description: "Collect participant details, service needs, and basic intake routing information.",
        category: "Operations",
        definition: createDefinition([
            createQuestion("text", "name"),
            createQuestion("text", "email"),
            createQuestion("text", "address"),
            createQuestion("dropdown"),
            createQuestion("multipleChoice", "multiple"),
            createQuestion("text")
        ])
    },
    {
        id: "customer-feedback",
        title: "Customer feedback",
        description: "Gather satisfaction, ratings, and open-ended follow-up in a familiar feedback flow.",
        category: "Feedback",
        definition: createDefinition([
            createQuestion("likert", "satisfaction"),
            createQuestion("rating"),
            createQuestion("multipleChoice"),
            createQuestion("ranking"),
            createQuestion("text")
        ])
    },
    {
        id: "program-evaluation",
        title: "Program evaluation",
        description: "Use scales, matrix questions, and comments for a more structured evaluation survey.",
        category: "Evaluation",
        definition: createDefinition([
            createQuestion("likert", "agreement"),
            createQuestion("matrix"),
            createQuestion("multipleChoice", "multiple"),
            createQuestion("dropdown"),
            createQuestion("text")
        ])
    }
];

export function getSurveyTemplate(templateId: string | undefined) {
    return surveyTemplates.find((template) => template.id === templateId) ?? surveyTemplates[0];
}
