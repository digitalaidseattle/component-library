import {
    SendSurveyEmailInput,
    SendSurveyEmailResult,
    SurveyContact,
    SurveyEmailCampaign,
    SurveyEmailRecipient,
    SurveyResponse,
} from "./emailModels";

export interface SurveyContactStore {
    list(ownerKey: string): Promise<SurveyContact[]>;
    get(id: string, ownerKey: string): Promise<SurveyContact | undefined>;
    upsert(contact: SurveyContact): Promise<void>;
    delete(id: string, ownerKey: string): Promise<void>;
    isConfigured(): boolean;
}

export interface SurveyEmailCampaignStore {
    list(ownerKey: string, surveyId?: string): Promise<SurveyEmailCampaign[]>;
    get(id: string, ownerKey: string): Promise<SurveyEmailCampaign | undefined>;
    upsert(campaign: SurveyEmailCampaign): Promise<void>;
    isConfigured(): boolean;
}

export interface SurveyEmailRecipientStore {
    list(ownerKey: string, surveyId?: string): Promise<SurveyEmailRecipient[]>;
    listByCampaign(ownerKey: string, campaignId: string): Promise<SurveyEmailRecipient[]>;
    upsertMany(recipients: SurveyEmailRecipient[]): Promise<void>;
    markSubmitted(recipientId: string, submittedAt: number): Promise<void>;
    isConfigured(): boolean;
}

export interface SurveyResponseStore {
    list(ownerKey: string, surveyId?: string): Promise<SurveyResponse[]>;
    upsert(response: SurveyResponse): Promise<void>;
    isConfigured(): boolean;
}

export interface SurveyEmailSender {
    send(input: SendSurveyEmailInput): Promise<SendSurveyEmailResult>;
    isConfigured(): boolean;
}

const contacts = new Map<string, SurveyContact>();
const campaigns = new Map<string, SurveyEmailCampaign>();
const recipients = new Map<string, SurveyEmailRecipient>();
const responses = new Map<string, SurveyResponse>();

export class LocalSurveyContactStore implements SurveyContactStore {
    list(ownerKey: string): Promise<SurveyContact[]> {
        return Promise.resolve(
            [...contacts.values()]
                .filter((contact) => contact.ownerKey === ownerKey)
                .sort((left, right) => right.updatedAt - left.updatedAt)
        );
    }

    async get(id: string, ownerKey: string): Promise<SurveyContact | undefined> {
        const contact = contacts.get(id);
        return contact?.ownerKey === ownerKey ? contact : undefined;
    }

    upsert(contact: SurveyContact): Promise<void> {
        contacts.set(contact.id, contact);
        return Promise.resolve();
    }

    delete(id: string, ownerKey: string): Promise<void> {
        const contact = contacts.get(id);
        if (contact?.ownerKey === ownerKey) {
            contacts.delete(id);
        }
        return Promise.resolve();
    }

    isConfigured(): boolean {
        return true;
    }
}

export class LocalSurveyEmailCampaignStore implements SurveyEmailCampaignStore {
    list(ownerKey: string, surveyId?: string): Promise<SurveyEmailCampaign[]> {
        return Promise.resolve(
            [...campaigns.values()]
                .filter((campaign) => campaign.ownerKey === ownerKey)
                .filter((campaign) => !surveyId || campaign.surveyId === surveyId)
                .sort((left, right) => right.updatedAt - left.updatedAt)
        );
    }

    async get(id: string, ownerKey: string): Promise<SurveyEmailCampaign | undefined> {
        const campaign = campaigns.get(id);
        return campaign?.ownerKey === ownerKey ? campaign : undefined;
    }

    upsert(campaign: SurveyEmailCampaign): Promise<void> {
        campaigns.set(campaign.id, campaign);
        return Promise.resolve();
    }

    isConfigured(): boolean {
        return true;
    }
}

export class LocalSurveyEmailRecipientStore implements SurveyEmailRecipientStore {
    list(ownerKey: string, surveyId?: string): Promise<SurveyEmailRecipient[]> {
        return Promise.resolve(
            [...recipients.values()]
                .filter((recipient) => recipient.ownerKey === ownerKey)
                .filter((recipient) => !surveyId || recipient.surveyId === surveyId)
        );
    }

    listByCampaign(ownerKey: string, campaignId: string): Promise<SurveyEmailRecipient[]> {
        return Promise.resolve(
            [...recipients.values()].filter(
                (recipient) =>
                    recipient.ownerKey === ownerKey && recipient.campaignId === campaignId
            )
        );
    }

    upsertMany(nextRecipients: SurveyEmailRecipient[]): Promise<void> {
        nextRecipients.forEach((recipient) => recipients.set(recipient.id, recipient));
        return Promise.resolve();
    }

    markSubmitted(recipientId: string, submittedAt: number): Promise<void> {
        const recipient = recipients.get(recipientId);
        if (recipient) {
            recipients.set(recipientId, {
                ...recipient,
                status: "submitted",
                submittedAt,
            });
        }
        return Promise.resolve();
    }

    isConfigured(): boolean {
        return true;
    }
}

export class LocalSurveyResponseStore implements SurveyResponseStore {
    list(ownerKey: string, surveyId?: string): Promise<SurveyResponse[]> {
        return Promise.resolve(
            [...responses.values()]
                .filter((response) => response.ownerKey === ownerKey)
                .filter((response) => !surveyId || response.surveyId === surveyId)
                .sort((left, right) => right.submittedAt - left.submittedAt)
        );
    }

    upsert(response: SurveyResponse): Promise<void> {
        responses.set(response.id, response);
        return Promise.resolve();
    }

    isConfigured(): boolean {
        return true;
    }
}
