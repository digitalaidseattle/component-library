import {
    SurveyDefinition,
    SurveyTemplate,
    createDefinition,
    createQuestion
} from "./surveyModels";

export const systemSurveyTemplates: SurveyTemplate[] = [
    {
        id: "blank",
        title: "Blank survey",
        description: "Start from scratch and assemble the exact set of questions you need.",
        category: "General",
        scope: "system",
        definition: createDefinition()
    },
    {
        id: "intake",
        title: "Client intake",
        description: "Collect participant details, service needs, and basic intake routing information.",
        category: "Operations",
        scope: "system",
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
        scope: "system",
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
        scope: "system",
        definition: createDefinition([
            createQuestion("likert", "agreement"),
            createQuestion("matrix"),
            createQuestion("multipleChoice", "multiple"),
            createQuestion("dropdown"),
            createQuestion("text")
        ])
    }
];

export function getSurveyTemplate(
    templates: SurveyTemplate[],
    templateId: string | undefined
) {
    return templates.find((template) => template.id === templateId) ?? templates[0] ?? systemSurveyTemplates[0];
}

export function mergeSurveyTemplates(customTemplates: SurveyTemplate[]): SurveyTemplate[] {
    return [
        ...systemSurveyTemplates,
        ...[...customTemplates].sort((left, right) => (right.updatedAt ?? 0) - (left.updatedAt ?? 0))
    ];
}

export function createUserSurveyTemplate(
    title: string,
    description: string,
    category: string,
    definition: SurveyDefinition,
    ownerEmail: string
): SurveyTemplate {
    return {
        id: crypto.randomUUID(),
        title,
        description,
        category,
        definition: structuredClone(definition),
        scope: "user",
        ownerEmail,
        updatedAt: Date.now()
    };
}

export function makeNewSurveyFromTemplate(
    templates: SurveyTemplate[],
    templateId: string | undefined
) {
    const template = getSurveyTemplate(templates, templateId);

    return {
        title: `${template.title} - New Survey`,
        description: "",
        definition: structuredClone(template.definition)
    };
}
