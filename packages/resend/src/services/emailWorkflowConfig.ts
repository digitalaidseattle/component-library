import {
    LocalSurveyContactStore,
    LocalSurveyEmailCampaignStore,
    LocalSurveyEmailRecipientStore,
    LocalSurveyResponseStore,
    SurveyContactStore,
    SurveyEmailCampaignStore,
    SurveyEmailRecipientStore,
    SurveyEmailSender,
    SurveyResponseStore,
} from "./emailStores";
import {
    createId,
    SendSurveyEmailInput,
    SendSurveyEmailResult,
    SurveyEmailRecipient,
} from "./emailModels";

export type SurveyEmailPersistence = {
    contactStore?: SurveyContactStore;
    campaignStore?: SurveyEmailCampaignStore;
    recipientStore?: SurveyEmailRecipientStore;
    responseStore?: SurveyResponseStore;
    sender?: SurveyEmailSender;
};

export type ResolvedSurveyEmailPersistence = {
    contactStore: SurveyContactStore;
    campaignStore: SurveyEmailCampaignStore;
    recipientStore: SurveyEmailRecipientStore;
    responseStore: SurveyResponseStore;
    sender: SurveyEmailSender;
};

class LocalSurveyEmailSender implements SurveyEmailSender {
    async send(input: SendSurveyEmailInput): Promise<SendSurveyEmailResult> {
        const sentAt = Date.now();
        const recipients: SurveyEmailRecipient[] = input.contacts.map((contact) => ({
            id: createId("recipient"),
            ownerKey: input.ownerKey,
            campaignId: input.campaign.id,
            surveyId: input.campaign.surveyId,
            contactId: contact.id,
            email: contact.email,
            name: contact.name,
            status: "pending",
            surveyUrl: input.surveyUrlForContact(contact),
            sentAt,
        }));

        return {
            campaign: {
                ...input.campaign,
                status: "sent",
                sentAt,
                updatedAt: sentAt,
            },
            recipients,
        };
    }

    isConfigured(): boolean {
        return true;
    }
}

const defaultPersistence: ResolvedSurveyEmailPersistence = {
    contactStore: new LocalSurveyContactStore(),
    campaignStore: new LocalSurveyEmailCampaignStore(),
    recipientStore: new LocalSurveyEmailRecipientStore(),
    responseStore: new LocalSurveyResponseStore(),
    sender: new LocalSurveyEmailSender(),
};

let configuredPersistence: SurveyEmailPersistence = {};

export function configureSurveyEmailPersistence(
    persistence: SurveyEmailPersistence
): ResolvedSurveyEmailPersistence {
    configuredPersistence = { ...persistence };
    return getSurveyEmailPersistence();
}

export function resetSurveyEmailPersistence(): void {
    configuredPersistence = {};
}

export function getSurveyEmailPersistence(): ResolvedSurveyEmailPersistence {
    return {
        contactStore: configuredPersistence.contactStore ?? defaultPersistence.contactStore,
        campaignStore: configuredPersistence.campaignStore ?? defaultPersistence.campaignStore,
        recipientStore:
            configuredPersistence.recipientStore ?? defaultPersistence.recipientStore,
        responseStore:
            configuredPersistence.responseStore ?? defaultPersistence.responseStore,
        sender: configuredPersistence.sender ?? defaultPersistence.sender,
    };
}
