import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { Resend } from "npm:resend@4.0.1";

type SurveyContact = {
  id: string;
  email: string;
  name?: string;
};

type SurveyEmailCampaign = {
  id: string;
  ownerKey: string;
  surveyId: string;
  subject: string;
  messageHtml: string;
  selectedContactIds: string[];
};

type SendSurveyEmailPayload = {
  ownerKey: string;
  campaign: SurveyEmailCampaign;
  contacts: SurveyContact[];
  surveyUrls: Record<string, string>;
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
    },
  });
}

function renderMessage(messageHtml: string, surveyUrl: string): string {
  return messageHtml.replaceAll("{{survey_link}}", surveyUrl);
}

serve(async (request) => {
  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  const fromEmail = Deno.env.get("RESEND_FROM_EMAIL");

  if (!resendApiKey || !fromEmail) {
    return jsonResponse(
      { error: "RESEND_API_KEY and RESEND_FROM_EMAIL must be configured." },
      500
    );
  }

  const payload = (await request.json()) as SendSurveyEmailPayload;

  if (!payload?.campaign || !Array.isArray(payload.contacts)) {
    return jsonResponse({ error: "Invalid send survey email payload." }, 400);
  }

  const resend = new Resend(resendApiKey);
  const sentAt = Date.now();
  const recipients = [];

  for (const contact of payload.contacts) {
    const surveyUrl = payload.surveyUrls[contact.id];

    if (!surveyUrl) {
      recipients.push({
        id: crypto.randomUUID(),
        ownerKey: payload.ownerKey,
        campaignId: payload.campaign.id,
        surveyId: payload.campaign.surveyId,
        contactId: contact.id,
        email: contact.email,
        name: contact.name,
        status: "failed",
        surveyUrl: "",
        sentAt,
        errorMessage: "Missing survey URL.",
      });
      continue;
    }

    try {
      await resend.emails.send({
        from: fromEmail,
        to: contact.email,
        subject: payload.campaign.subject,
        html: renderMessage(payload.campaign.messageHtml, surveyUrl),
      });

      recipients.push({
        id: crypto.randomUUID(),
        ownerKey: payload.ownerKey,
        campaignId: payload.campaign.id,
        surveyId: payload.campaign.surveyId,
        contactId: contact.id,
        email: contact.email,
        name: contact.name,
        status: "sent",
        surveyUrl,
        sentAt,
      });
    } catch (error) {
      recipients.push({
        id: crypto.randomUUID(),
        ownerKey: payload.ownerKey,
        campaignId: payload.campaign.id,
        surveyId: payload.campaign.surveyId,
        contactId: contact.id,
        email: contact.email,
        name: contact.name,
        status: "failed",
        surveyUrl,
        sentAt,
        errorMessage: error instanceof Error ? error.message : "Unable to send email.",
      });
    }
  }

  const failedCount = recipients.filter((recipient) => recipient.status === "failed").length;

  return jsonResponse({
    campaign: {
      ...payload.campaign,
      status: failedCount === recipients.length ? "failed" : "sent",
      sentAt,
      updatedAt: sentAt,
      errorMessage:
        failedCount > 0 ? `${failedCount} recipient emails failed to send.` : undefined,
    },
    recipients,
  });
});
