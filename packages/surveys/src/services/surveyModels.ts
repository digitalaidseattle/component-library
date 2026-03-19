import { Entity } from "@digitalaidseattle/core";
import { v4 as uuid } from "uuid";

export type SurveyQuestionKind =
    | "text"
    | "multipleChoice"
    | "likert"
    | "rating"
    | "matrix"
    | "dropdown"
    | "ranking";

export type SurveyTemplateId = string;

export type SurveyOption = {
    id: string;
    label: string;
};

export type BaseSurveyQuestion = {
    id: string;
    kind: SurveyQuestionKind;
    title: string;
    description?: string;
    required: boolean;
};

export type SurveyTextQuestion = BaseSurveyQuestion & {
    kind: "text";
    settings: {
        multiline: boolean;
        placeholder?: string;
        inputType?: "text" | "email";
        preset?: "generic" | "name" | "email" | "address";
    };
};

export type SurveyMultipleChoiceQuestion = BaseSurveyQuestion & {
    kind: "multipleChoice";
    settings: {
        allowMultiple: boolean;
        options: SurveyOption[];
    };
};

export type SurveyLikertQuestion = BaseSurveyQuestion & {
    kind: "likert";
    settings: {
        preset: "agreement" | "satisfaction";
        lowLabel: string;
        highLabel: string;
        options: SurveyOption[];
    };
};

export type SurveyRatingQuestion = BaseSurveyQuestion & {
    kind: "rating";
    settings: {
        min: number;
        max: number;
        lowLabel?: string;
        highLabel?: string;
    };
};

export type SurveyMatrixQuestion = BaseSurveyQuestion & {
    kind: "matrix";
    settings: {
        allowMultiple: boolean;
        rows: SurveyOption[];
        columns: SurveyOption[];
    };
};

export type SurveyDropdownQuestion = BaseSurveyQuestion & {
    kind: "dropdown";
    settings: {
        options: SurveyOption[];
    };
};

export type SurveyRankingQuestion = BaseSurveyQuestion & {
    kind: "ranking";
    settings: {
        options: SurveyOption[];
    };
};

export type SurveyQuestion =
    | SurveyTextQuestion
    | SurveyMultipleChoiceQuestion
    | SurveyLikertQuestion
    | SurveyRatingQuestion
    | SurveyMatrixQuestion
    | SurveyDropdownQuestion
    | SurveyRankingQuestion;

export type SurveyDefinition = {
    surveyTitle: string | null;
    surveyDescription: string | null;
    questions: SurveyQuestion[];
};

export type SurveyDraftStatus = "draft" | "published";

export type SurveyDraft = {
    id: string;
    status: SurveyDraftStatus;
    updatedAt: number;
    templateId: SurveyTemplateId;
    history: SurveyDefinition[];
    historyIndex: number;
};

export type PublishedSurvey = Entity & {
    id: string;
    draftId: string;
    templateId: SurveyTemplateId;
    title: string;
    description: string | null;
    questions: SurveyQuestion[];
    publishedAt: number;
    updatedAt: number;
};

export type SurveyCardModel = {
    id: string;
    title: string;
    description?: string;
    status: "draft" | "active";
    lastOpened: Date;
    questionCount: number;
    collaborators?: {
        name: string;
    }[];
};

export type SurveyTemplate = {
    id: SurveyTemplateId;
    title: string;
    description: string;
    category: string;
    definition: SurveyDefinition;
    scope?: "system" | "user";
    ownerEmail?: string;
    updatedAt?: number;
};

export function createOption(label: string): SurveyOption {
    return {
        id: uuid(),
        label
    };
}

export function createQuestion(kind: SurveyQuestionKind, preset?: string): SurveyQuestion {
    switch (kind) {
        case "text":
            if (preset === "name") {
                return {
                    id: uuid(),
                    kind,
                    title: "Your name",
                    description: "Tell us how you would like to be addressed.",
                    required: true,
                    settings: {
                        multiline: false,
                        placeholder: "Jane Doe",
                        inputType: "text",
                        preset: "name"
                    }
                };
            }
            if (preset === "email") {
                return {
                    id: uuid(),
                    kind,
                    title: "Email address",
                    description: "We will only use this for survey follow-up if needed.",
                    required: true,
                    settings: {
                        multiline: false,
                        placeholder: "jane@example.com",
                        inputType: "email",
                        preset: "email"
                    }
                };
            }
            if (preset === "address") {
                return {
                    id: uuid(),
                    kind,
                    title: "Mailing address",
                    description: "Provide your mailing address if you would like printed follow-up materials.",
                    required: false,
                    settings: {
                        multiline: true,
                        placeholder: "123 Main St, Seattle, WA",
                        inputType: "text",
                        preset: "address"
                    }
                };
            }
            return {
                id: uuid(),
                kind,
                title: "Open-ended response",
                description: "Allow respondents to answer in their own words.",
                required: false,
                settings: {
                    multiline: true,
                    placeholder: "Share your thoughts",
                    inputType: "text",
                    preset: "generic"
                }
            };
        case "multipleChoice":
            return {
                id: uuid(),
                kind,
                title: "What best describes you?",
                description: "Choose one or more options.",
                required: false,
                settings: {
                    allowMultiple: preset === "multiple",
                    options: [
                        createOption("Option A"),
                        createOption("Option B"),
                        createOption("Option C")
                    ]
                }
            };
        case "likert":
            return {
                id: uuid(),
                kind,
                title: preset === "satisfaction" ? "How satisfied are you?" : "How strongly do you agree?",
                description: "Use a familiar sentiment scale.",
                required: false,
                settings: {
                    preset: preset === "satisfaction" ? "satisfaction" : "agreement",
                    lowLabel: preset === "satisfaction" ? "Very dissatisfied" : "Strongly disagree",
                    highLabel: preset === "satisfaction" ? "Very satisfied" : "Strongly agree",
                    options: [
                        createOption("1"),
                        createOption("2"),
                        createOption("3"),
                        createOption("4"),
                        createOption("5")
                    ]
                }
            };
        case "rating":
            return {
                id: uuid(),
                kind,
                title: "Rate your experience",
                description: "Give a score on a numeric scale.",
                required: false,
                settings: {
                    min: 1,
                    max: 10,
                    lowLabel: "Low",
                    highLabel: "High"
                }
            };
        case "matrix":
            return {
                id: uuid(),
                kind,
                title: "Please evaluate the following areas",
                description: "Matrix questions are useful for comparing multiple criteria.",
                required: false,
                settings: {
                    allowMultiple: false,
                    rows: [
                        createOption("Communication"),
                        createOption("Support"),
                        createOption("Overall experience")
                    ],
                    columns: [
                        createOption("Poor"),
                        createOption("Fair"),
                        createOption("Good"),
                        createOption("Excellent")
                    ]
                }
            };
        case "dropdown":
            return {
                id: uuid(),
                kind,
                title: "Select your preferred option",
                description: "Compact selection list for a single answer.",
                required: false,
                settings: {
                    options: [
                        createOption("North"),
                        createOption("South"),
                        createOption("East"),
                        createOption("West")
                    ]
                }
            };
        case "ranking":
            return {
                id: uuid(),
                kind,
                title: "Rank these priorities",
                description: "Order the items from most important to least important.",
                required: false,
                settings: {
                    options: [
                        createOption("Cost"),
                        createOption("Speed"),
                        createOption("Quality"),
                        createOption("Support")
                    ]
                }
            };
    }
}

export function createDefinition(questionSeeds: SurveyQuestion[] = []): SurveyDefinition {
    return {
        surveyTitle: null,
        surveyDescription: null,
        questions: questionSeeds
    };
}

export function createDraft(templateId: SurveyTemplateId = "blank", definition: SurveyDefinition = createDefinition()): SurveyDraft {
    return {
        id: uuid(),
        status: "draft",
        updatedAt: Date.now(),
        templateId,
        history: [definition],
        historyIndex: 0
    };
}

export function getCurrentDefinition(draft: SurveyDraft): SurveyDefinition {
    return draft.history[draft.historyIndex];
}

export function commitDefinition(draft: SurveyDraft, definition: SurveyDefinition): SurveyDraft {
    return {
        ...draft,
        updatedAt: Date.now(),
        history: [...draft.history.slice(0, draft.historyIndex + 1), definition],
        historyIndex: draft.historyIndex + 1
    };
}

export function undoDraft(draft: SurveyDraft): SurveyDraft {
    return {
        ...draft,
        historyIndex: Math.max(draft.historyIndex - 1, 0)
    };
}

export function redoDraft(draft: SurveyDraft): SurveyDraft {
    return {
        ...draft,
        historyIndex: Math.min(draft.historyIndex + 1, draft.history.length - 1)
    };
}

export function reorderQuestions(questions: SurveyQuestion[], activeId: string, newIndex: number): SurveyQuestion[] {
    const currentIndex = questions.findIndex((question) => question.id === activeId);
    if (currentIndex === -1 || newIndex < 0 || newIndex >= questions.length) {
        return questions;
    }

    const next = [...questions];
    const [moved] = next.splice(currentIndex, 1);
    next.splice(newIndex, 0, moved);
    return next;
}

export function publishDraft(draft: SurveyDraft): { draft: SurveyDraft; published: PublishedSurvey } {
    const definition = getCurrentDefinition(draft);
    const updatedAt = Date.now();
    return {
        draft: {
            ...draft,
            status: "published",
            updatedAt
        },
        published: {
            id: draft.id,
            draftId: draft.id,
            templateId: draft.templateId,
            title: definition.surveyTitle ?? "Untitled survey",
            description: definition.surveyDescription ?? null,
            questions: definition.questions,
            publishedAt: updatedAt,
            updatedAt
        }
    };
}

export function toSurveyCardModel(draft: SurveyDraft): SurveyCardModel {
    const definition = getCurrentDefinition(draft);
    return {
        id: draft.id,
        title: definition.surveyTitle ?? "Untitled survey",
        description: definition.surveyDescription ?? "",
        status: draft.status === "published" ? "active" : "draft",
        lastOpened: new Date(draft.updatedAt),
        questionCount: definition.questions.length,
        collaborators: [{ name: "You" }]
    };
}

export function toPublishedSurveyCardModel(survey: PublishedSurvey): SurveyCardModel {
    return {
        id: survey.id,
        title: survey.title,
        description: survey.description ?? "",
        status: "active",
        lastOpened: new Date(survey.updatedAt),
        questionCount: survey.questions.length,
        collaborators: [{ name: "You" }]
    };
}
