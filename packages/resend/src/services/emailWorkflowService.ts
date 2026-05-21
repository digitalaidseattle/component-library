import { getSurveyEmailPersistence } from "./emailWorkflowConfig";
import {
    createId,
    createSurveyEmailCampaign,
    SurveyContact,
    SurveyEmailCampaign,
    SurveyEmailRecipient,
    SurveyResponse,
} from "./emailModels";

export async function listSurveyContacts(ownerKey: string): Promise<SurveyContact[]> {
    return getSurveyEmailPersistence().contactStore.list(ownerKey);
}

export async function saveSurveyContact(contact: SurveyContact): Promise<SurveyContact> {
    const nextContact = {
        ...contact,
        email: contact.email.trim(),
        updatedAt: Date.now(),
    };
    await getSurveyEmailPersistence().contactStore.upsert(nextContact);
    return nextContact;
}

export async function deleteSurveyContact(
    ownerKey: string,
    contactId: string
): Promise<void> {
    await getSurveyEmailPersistence().contactStore.delete(contactId, ownerKey);
}

export async function listSurveyEmailCampaigns(
    ownerKey: string,
    surveyId?: string
): Promise<SurveyEmailCampaign[]> {
    return getSurveyEmailPersistence().campaignStore.list(ownerKey, surveyId);
}

export async function listSurveyEmailRecipients(
    ownerKey: string,
    surveyId?: string
): Promise<SurveyEmailRecipient[]> {
    return getSurveyEmailPersistence().recipientStore.list(ownerKey, surveyId);
}

export async function sendSurveyEmailCampaign(input: {
    ownerKey: string;
    surveyId: string;
    subject: string;
    messageHtml: string;
    contacts: SurveyContact[];
    surveyUrlForContact: (contact: SurveyContact) => string;
}): Promise<{
    campaign: SurveyEmailCampaign;
    recipients: SurveyEmailRecipient[];
}> {
    const persistence = getSurveyEmailPersistence();
    const campaign = createSurveyEmailCampaign(input.ownerKey, {
        surveyId: input.surveyId,
        subject: input.subject,
        messageHtml: input.messageHtml,
        selectedContactIds: input.contacts.map((contact) => contact.id),
    });
    const sendingCampaign = {
        ...campaign,
        status: "sending" as const,
        updatedAt: Date.now(),
    };

    await persistence.campaignStore.upsert(sendingCampaign);

    try {
        const result = await persistence.sender.send({
            ownerKey: input.ownerKey,
            campaign: sendingCampaign,
            contacts: input.contacts,
            surveyUrlForContact: input.surveyUrlForContact,
        });
        await persistence.campaignStore.upsert(result.campaign);
        await persistence.recipientStore.upsertMany(result.recipients);
        return result;
    } catch (error) {
        const failedCampaign = {
            ...sendingCampaign,
            status: "failed" as const,
            errorMessage: error instanceof Error ? error.message : "Unable to send survey email.",
            updatedAt: Date.now(),
        };
        await persistence.campaignStore.upsert(failedCampaign);
        throw error;
    }
}

export async function listSurveyResponses(
    ownerKey: string,
    surveyId?: string
): Promise<SurveyResponse[]> {
    return getSurveyEmailPersistence().responseStore.list(ownerKey, surveyId);
}

export async function saveSurveyResponse(input: {
    ownerKey?: string;
    surveyId: string;
    recipientId?: string;
    contactId?: string;
    respondentEmail?: string;
    respondentName?: string;
    answers: Record<string, unknown>;
}): Promise<SurveyResponse> {
    const submittedAt = Date.now();
    const response: SurveyResponse = {
        id: createId("response"),
        ownerKey: input.ownerKey,
        surveyId: input.surveyId,
        recipientId: input.recipientId,
        contactId: input.contactId,
        respondentEmail: input.respondentEmail,
        respondentName: input.respondentName,
        answers: input.answers,
        submittedAt,
    };
    const persistence = getSurveyEmailPersistence();

    await persistence.responseStore.upsert(response);

    if (input.recipientId) {
        await persistence.recipientStore.markSubmitted(input.recipientId, submittedAt);
    }

    return response;
}
