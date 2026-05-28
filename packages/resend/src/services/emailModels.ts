import { Entity } from "@digitalaidseattle/core";

export type SurveyContact = Entity & {
    id: string;
    ownerKey: string;
    email: string;
    name?: string;
    organization?: string;
    tags: string[];
    createdAt: number;
    updatedAt: number;
};

export type SurveyEmailCampaignStatus =
    | "draft"
    | "sending"
    | "sent"
    | "failed";

export type SurveyEmailCampaign = Entity & {
    id: string;
    ownerKey: string;
    surveyId: string;
    subject: string;
    messageHtml: string;
    status: SurveyEmailCampaignStatus;
    selectedContactIds: string[];
    createdAt: number;
    updatedAt: number;
    sentAt?: number;
    errorMessage?: string;
};

export type SurveyEmailRecipientStatus =
    | "pending"
    | "sent"
    | "failed"
    | "submitted";

export type SurveyEmailRecipient = Entity & {
    id: string;
    ownerKey: string;
    campaignId: string;
    surveyId: string;
    contactId: string;
    email: string;
    name?: string;
    status: SurveyEmailRecipientStatus;
    surveyUrl: string;
    sentAt?: number;
    submittedAt?: number;
    errorMessage?: string;
};

export type SurveyResponse = Entity & {
    id: string;
    ownerKey?: string;
    surveyId: string;
    recipientId?: string;
    contactId?: string;
    respondentEmail?: string;
    respondentName?: string;
    answers: Record<string, unknown>;
    submittedAt: number;
};

export type SendSurveyEmailInput = {
    ownerKey: string;
    campaign: SurveyEmailCampaign;
    contacts: SurveyContact[];
    surveyUrlForContact: (contact: SurveyContact) => string;
};

export type SendSurveyEmailResult = {
    campaign: SurveyEmailCampaign;
    recipients: SurveyEmailRecipient[];
};

export function createId(prefix: string): string {
    const randomId =
        typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : Math.random().toString(36).slice(2);

    return `${prefix}_${randomId}`;
}

export function createSurveyContact(
    ownerKey: string,
    input: {
        email: string;
        name?: string;
        organization?: string;
        tags?: string[];
    }
): SurveyContact {
    const now = Date.now();

    return {
        id: createId("contact"),
        ownerKey,
        email: input.email.trim(),
        name: input.name?.trim() || undefined,
        organization: input.organization?.trim() || undefined,
        tags: input.tags ?? [],
        createdAt: now,
        updatedAt: now,
    };
}

export function createSurveyEmailCampaign(
    ownerKey: string,
    input: {
        surveyId: string;
        subject: string;
        messageHtml: string;
        selectedContactIds: string[];
    }
): SurveyEmailCampaign {
    const now = Date.now();

    return {
        id: createId("campaign"),
        ownerKey,
        surveyId: input.surveyId,
        subject: input.subject.trim(),
        messageHtml: input.messageHtml,
        selectedContactIds: input.selectedContactIds,
        status: "draft",
        createdAt: now,
        updatedAt: now,
    };
}
