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

type ResendSendResult = {
  data?: {
    id?: string;
  } | null;
  error?: {
    message?: string;
    name?: string;
  } | null;
};

const corsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers":
    "authorization, x-client-info, apikey, content-type",
  "access-control-allow-methods": "POST, OPTIONS",
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "content-type": "application/json",
    },
  });
}

function renderMessage(messageHtml: string, surveyUrl: string): string {
  return messageHtml.replaceAll("{{survey_link}}", surveyUrl);
}

serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const fromEmail = Deno.env.get("RESEND_FROM_EMAIL");

    console.log("send-survey-email env", {
      hasResendApiKey: Boolean(resendApiKey),
      hasFromEmail: Boolean(fromEmail),
      fromEmail,
    });

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

    console.log("send-survey-email request", {
      campaignId: payload.campaign.id,
      surveyId: payload.campaign.surveyId,
      contactCount: payload.contacts.length,
    });

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
        const sendResult = (await resend.emails.send({
          from: fromEmail,
          to: contact.email,
          subject: payload.campaign.subject,
          html: renderMessage(payload.campaign.messageHtml, surveyUrl),
        })) as ResendSendResult;

        if (sendResult.error || !sendResult.data?.id) {
          const message =
            sendResult.error?.message || "Resend did not return a sent email id.";

          console.error("Resend email send failed", {
            campaignId: payload.campaign.id,
            surveyId: payload.campaign.surveyId,
            contactId: contact.id,
            email: contact.email,
            message,
          });

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
            errorMessage: message,
          });
          continue;
        }

        console.log("Resend email accepted", {
          campaignId: payload.campaign.id,
          surveyId: payload.campaign.surveyId,
          contactId: contact.id,
          email: contact.email,
          resendEmailId: sendResult.data.id,
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
        const message =
          error instanceof Error ? error.message : "Unable to send email.";

        console.error("Resend email send failed", {
          campaignId: payload.campaign.id,
          surveyId: payload.campaign.surveyId,
          contactId: contact.id,
          email: contact.email,
          message,
        });

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
          errorMessage: message,
        });
      }
    }

    const failedCount = recipients.filter((recipient) => recipient.status === "failed").length;

    console.log("send-survey-email complete", {
      campaignId: payload.campaign.id,
      sentCount: recipients.length - failedCount,
      failedCount,
    });

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
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected send-survey-email error.";

    console.error("send-survey-email failed", { message });

    return jsonResponse({ error: message }, 500);
  }
});
