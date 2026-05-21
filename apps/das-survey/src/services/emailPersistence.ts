import {
    configureSurveyEmailPersistence,
    createId,
    SendSurveyEmailInput,
    SendSurveyEmailResult,
    SurveyContact,
    SurveyContactStore,
    SurveyEmailCampaign,
    SurveyEmailCampaignStore,
    SurveyEmailRecipient,
    SurveyEmailRecipientStore,
    SurveyEmailSender,
    SurveyResponse,
    SurveyResponseStore,
} from "@digitalaidseattle/resend";
import {
    surveySupabaseClient,
    surveySupabaseConfigured,
} from "./surveySupabase";

export type SurveyEmailProvider = "supabase" | "local";

type SurveyContactRow = {
    id: string;
    owner_key: string;
    email: string;
    name: string | null;
    organization: string | null;
    tags: string[];
    created_at: string;
    updated_at: string;
};

type SurveyEmailCampaignRow = {
    id: string;
    owner_key: string;
    survey_id: string;
    subject: string;
    message_html: string;
    status: SurveyEmailCampaign["status"];
    selected_contact_ids: string[];
    created_at: string;
    updated_at: string;
    sent_at: string | null;
    error_message: string | null;
};

type SurveyEmailRecipientRow = {
    id: string;
    owner_key: string;
    campaign_id: string;
    survey_id: string;
    contact_id: string;
    email: string;
    name: string | null;
    status: SurveyEmailRecipient["status"];
    survey_url: string;
    sent_at: string | null;
    submitted_at: string | null;
    error_message: string | null;
};

type SurveyResponseRow = {
    id: string;
    owner_key: string | null;
    survey_id: string;
    recipient_id: string | null;
    contact_id: string | null;
    respondent_email: string | null;
    respondent_name: string | null;
    answers: Record<string, unknown>;
    submitted_at: string;
};

function toTimestamp(value: string | null | undefined): number | undefined {
    return value ? new Date(value).getTime() : undefined;
}

function contactFromRow(row: SurveyContactRow): SurveyContact {
    return {
        id: row.id,
        ownerKey: row.owner_key,
        email: row.email,
        name: row.name ?? undefined,
        organization: row.organization ?? undefined,
        tags: row.tags ?? [],
        createdAt: toTimestamp(row.created_at) ?? Date.now(),
        updatedAt: toTimestamp(row.updated_at) ?? Date.now(),
    };
}

function contactToRow(contact: SurveyContact): SurveyContactRow {
    return {
        id: contact.id,
        owner_key: contact.ownerKey,
        email: contact.email,
        name: contact.name ?? null,
        organization: contact.organization ?? null,
        tags: contact.tags,
        created_at: new Date(contact.createdAt).toISOString(),
        updated_at: new Date(contact.updatedAt).toISOString(),
    };
}

function campaignFromRow(row: SurveyEmailCampaignRow): SurveyEmailCampaign {
    return {
        id: row.id,
        ownerKey: row.owner_key,
        surveyId: row.survey_id,
        subject: row.subject,
        messageHtml: row.message_html,
        status: row.status,
        selectedContactIds: row.selected_contact_ids ?? [],
        createdAt: toTimestamp(row.created_at) ?? Date.now(),
        updatedAt: toTimestamp(row.updated_at) ?? Date.now(),
        sentAt: toTimestamp(row.sent_at),
        errorMessage: row.error_message ?? undefined,
    };
}

function campaignToRow(campaign: SurveyEmailCampaign): SurveyEmailCampaignRow {
    return {
        id: campaign.id,
        owner_key: campaign.ownerKey,
        survey_id: campaign.surveyId,
        subject: campaign.subject,
        message_html: campaign.messageHtml,
        status: campaign.status,
        selected_contact_ids: campaign.selectedContactIds,
        created_at: new Date(campaign.createdAt).toISOString(),
        updated_at: new Date(campaign.updatedAt).toISOString(),
        sent_at: campaign.sentAt ? new Date(campaign.sentAt).toISOString() : null,
        error_message: campaign.errorMessage ?? null,
    };
}

function recipientFromRow(row: SurveyEmailRecipientRow): SurveyEmailRecipient {
    return {
        id: row.id,
        ownerKey: row.owner_key,
        campaignId: row.campaign_id,
        surveyId: row.survey_id,
        contactId: row.contact_id,
        email: row.email,
        name: row.name ?? undefined,
        status: row.status,
        surveyUrl: row.survey_url,
        sentAt: toTimestamp(row.sent_at),
        submittedAt: toTimestamp(row.submitted_at),
        errorMessage: row.error_message ?? undefined,
    };
}

function recipientToRow(recipient: SurveyEmailRecipient): SurveyEmailRecipientRow {
    return {
        id: recipient.id,
        owner_key: recipient.ownerKey,
        campaign_id: recipient.campaignId,
        survey_id: recipient.surveyId,
        contact_id: recipient.contactId,
        email: recipient.email,
        name: recipient.name ?? null,
        status: recipient.status,
        survey_url: recipient.surveyUrl,
        sent_at: recipient.sentAt ? new Date(recipient.sentAt).toISOString() : null,
        submitted_at: recipient.submittedAt
            ? new Date(recipient.submittedAt).toISOString()
            : null,
        error_message: recipient.errorMessage ?? null,
    };
}

function responseFromRow(row: SurveyResponseRow): SurveyResponse {
    return {
        id: row.id,
        ownerKey: row.owner_key ?? undefined,
        surveyId: row.survey_id,
        recipientId: row.recipient_id ?? undefined,
        contactId: row.contact_id ?? undefined,
        respondentEmail: row.respondent_email ?? undefined,
        respondentName: row.respondent_name ?? undefined,
        answers: row.answers,
        submittedAt: toTimestamp(row.submitted_at) ?? Date.now(),
    };
}

function responseToRow(response: SurveyResponse): SurveyResponseRow {
    return {
        id: response.id,
        owner_key: response.ownerKey ?? null,
        survey_id: response.surveyId,
        recipient_id: response.recipientId ?? null,
        contact_id: response.contactId ?? null,
        respondent_email: response.respondentEmail ?? null,
        respondent_name: response.respondentName ?? null,
        answers: response.answers,
        submitted_at: new Date(response.submittedAt).toISOString(),
    };
}

class SupabaseSurveyContactStore implements SurveyContactStore {
    async list(ownerKey: string): Promise<SurveyContact[]> {
        const { data, error } = await surveySupabaseClient
            .from("survey_contacts")
            .select("*")
            .eq("owner_key", ownerKey)
            .order("updated_at", { ascending: false });

        if (error) {
            throw error;
        }

        return (data ?? []).map((row) => contactFromRow(row as SurveyContactRow));
    }

    async get(id: string, ownerKey: string): Promise<SurveyContact | undefined> {
        const { data, error } = await surveySupabaseClient
            .from("survey_contacts")
            .select("*")
            .eq("id", id)
            .eq("owner_key", ownerKey)
            .maybeSingle();

        if (error) {
            throw error;
        }

        return data ? contactFromRow(data as SurveyContactRow) : undefined;
    }

    async upsert(contact: SurveyContact): Promise<void> {
        const { error } = await surveySupabaseClient
            .from("survey_contacts")
            .upsert([contactToRow(contact)]);

        if (error) {
            throw error;
        }
    }

    async delete(id: string, ownerKey: string): Promise<void> {
        const { error } = await surveySupabaseClient
            .from("survey_contacts")
            .delete()
            .eq("id", id)
            .eq("owner_key", ownerKey);

        if (error) {
            throw error;
        }
    }

    isConfigured(): boolean {
        return surveySupabaseConfigured;
    }
}

class SupabaseSurveyEmailCampaignStore implements SurveyEmailCampaignStore {
    async list(ownerKey: string, surveyId?: string): Promise<SurveyEmailCampaign[]> {
        let query = surveySupabaseClient
            .from("survey_email_campaigns")
            .select("*")
            .eq("owner_key", ownerKey)
            .order("updated_at", { ascending: false });

        if (surveyId) {
            query = query.eq("survey_id", surveyId);
        }

        const { data, error } = await query;

        if (error) {
            throw error;
        }

        return (data ?? []).map((row) => campaignFromRow(row as SurveyEmailCampaignRow));
    }

    async get(id: string, ownerKey: string): Promise<SurveyEmailCampaign | undefined> {
        const { data, error } = await surveySupabaseClient
            .from("survey_email_campaigns")
            .select("*")
            .eq("id", id)
            .eq("owner_key", ownerKey)
            .maybeSingle();

        if (error) {
            throw error;
        }

        return data ? campaignFromRow(data as SurveyEmailCampaignRow) : undefined;
    }

    async upsert(campaign: SurveyEmailCampaign): Promise<void> {
        const { error } = await surveySupabaseClient
            .from("survey_email_campaigns")
            .upsert([campaignToRow(campaign)]);

        if (error) {
            throw error;
        }
    }

    isConfigured(): boolean {
        return surveySupabaseConfigured;
    }
}

class SupabaseSurveyEmailRecipientStore implements SurveyEmailRecipientStore {
    async list(ownerKey: string, surveyId?: string): Promise<SurveyEmailRecipient[]> {
        let query = surveySupabaseClient
            .from("survey_email_recipients")
            .select("*")
            .eq("owner_key", ownerKey);

        if (surveyId) {
            query = query.eq("survey_id", surveyId);
        }

        const { data, error } = await query;

        if (error) {
            throw error;
        }

        return (data ?? []).map((row) => recipientFromRow(row as SurveyEmailRecipientRow));
    }

    async listByCampaign(
        ownerKey: string,
        campaignId: string
    ): Promise<SurveyEmailRecipient[]> {
        const { data, error } = await surveySupabaseClient
            .from("survey_email_recipients")
            .select("*")
            .eq("owner_key", ownerKey)
            .eq("campaign_id", campaignId);

        if (error) {
            throw error;
        }

        return (data ?? []).map((row) => recipientFromRow(row as SurveyEmailRecipientRow));
    }

    async upsertMany(recipients: SurveyEmailRecipient[]): Promise<void> {
        if (recipients.length === 0) {
            return;
        }

        const { error } = await surveySupabaseClient
            .from("survey_email_recipients")
            .upsert(recipients.map(recipientToRow));

        if (error) {
            throw error;
        }
    }

    async markSubmitted(recipientId: string, submittedAt: number): Promise<void> {
        const { error } = await surveySupabaseClient
            .from("survey_email_recipients")
            .update({
                status: "submitted",
                submitted_at: new Date(submittedAt).toISOString(),
            })
            .eq("id", recipientId);

        if (error) {
            throw error;
        }
    }

    isConfigured(): boolean {
        return surveySupabaseConfigured;
    }
}

class SupabaseSurveyResponseStore implements SurveyResponseStore {
    async list(ownerKey: string, surveyId?: string): Promise<SurveyResponse[]> {
        let query = surveySupabaseClient
            .from("survey_responses")
            .select("*")
            .eq("owner_key", ownerKey)
            .order("submitted_at", { ascending: false });

        if (surveyId) {
            query = query.eq("survey_id", surveyId);
        }

        const { data, error } = await query;

        if (error) {
            throw error;
        }

        return (data ?? []).map((row) => responseFromRow(row as SurveyResponseRow));
    }

    async upsert(response: SurveyResponse): Promise<void> {
        const { error } = await surveySupabaseClient
            .from("survey_responses")
            .upsert([responseToRow(response)]);

        if (error) {
            throw error;
        }
    }

    isConfigured(): boolean {
        return surveySupabaseConfigured;
    }
}

class SupabaseSurveyEmailSender implements SurveyEmailSender {
    async send(input: SendSurveyEmailInput): Promise<SendSurveyEmailResult> {
        const { data, error } = await surveySupabaseClient.functions.invoke(
            "send-survey-email",
            {
                body: {
                    ownerKey: input.ownerKey,
                    campaign: input.campaign,
                    contacts: input.contacts,
                    surveyUrls: Object.fromEntries(
                        input.contacts.map((contact) => [
                            contact.id,
                            input.surveyUrlForContact(contact),
                        ])
                    ),
                },
            }
        );

        if (error) {
            throw error;
        }

        if (data?.campaign && Array.isArray(data?.recipients)) {
            return data as SendSurveyEmailResult;
        }

        const sentAt = Date.now();
        return {
            campaign: {
                ...input.campaign,
                status: "sent",
                sentAt,
                updatedAt: sentAt,
            },
            recipients: input.contacts.map((contact) => ({
                id: createId("recipient"),
                ownerKey: input.ownerKey,
                campaignId: input.campaign.id,
                surveyId: input.campaign.surveyId,
                contactId: contact.id,
                email: contact.email,
                name: contact.name,
                status: "sent",
                surveyUrl: input.surveyUrlForContact(contact),
                sentAt,
            })),
        };
    }

    isConfigured(): boolean {
        return surveySupabaseConfigured;
    }
}

export function resolveSurveyEmailProvider(): SurveyEmailProvider {
    const configuredProvider = (
        import.meta.env.VITE_SURVEY_EMAIL_PROVIDER ??
        import.meta.env.VITE_SURVEY_DATA_PROVIDER ??
        "auto"
    ).toLowerCase();

    if (configuredProvider === "local") {
        return "local";
    }

    if (configuredProvider === "supabase") {
        return surveySupabaseConfigured ? "supabase" : "local";
    }

    return surveySupabaseConfigured ? "supabase" : "local";
}

export function configureSurveyEmail(
    provider: SurveyEmailProvider = resolveSurveyEmailProvider()
): SurveyEmailProvider {
    if (provider === "supabase") {
        configureSurveyEmailPersistence({
            contactStore: new SupabaseSurveyContactStore(),
            campaignStore: new SupabaseSurveyEmailCampaignStore(),
            recipientStore: new SupabaseSurveyEmailRecipientStore(),
            responseStore: new SupabaseSurveyResponseStore(),
            sender: new SupabaseSurveyEmailSender(),
        });
        return provider;
    }

    configureSurveyEmailPersistence({});
    return "local";
}
