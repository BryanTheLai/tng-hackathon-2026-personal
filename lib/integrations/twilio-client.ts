import { canAttemptTwilioSend, getEnv, getTwilioStatusCallbackUrl } from "@/lib/config/env";

export interface TwilioSendMessageInput {
  body: string;
}

export interface TwilioSendMessageResult {
  sid: string;
  status: string;
}

export async function sendWhatsAppMessage(
  input: TwilioSendMessageInput,
): Promise<TwilioSendMessageResult | null> {
  if (!canAttemptTwilioSend()) {
    return null;
  }

  const env = getEnv();
  const requestBody = new URLSearchParams({
    To: normalizeWhatsAppAddress(env.TWILIO_WHATSAPP_TO ?? ""),
    Body: input.body,
  });
  const statusCallbackUrl = getTwilioStatusCallbackUrl();

  if (env.TWILIO_MESSAGING_SERVICE_SID) {
    requestBody.set("MessagingServiceSid", env.TWILIO_MESSAGING_SERVICE_SID);
  } else if (env.TWILIO_WHATSAPP_FROM) {
    requestBody.set("From", normalizeWhatsAppAddress(env.TWILIO_WHATSAPP_FROM));
  }

  if (statusCallbackUrl) {
    requestBody.set("StatusCallback", statusCallbackUrl);
  }

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${env.TWILIO_ACCOUNT_SID}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${env.TWILIO_ACCOUNT_SID}:${env.TWILIO_AUTH_TOKEN}`,
        ).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: requestBody,
      cache: "no-store",
    },
  );

  const payload = (await response.json()) as {
    sid?: string;
    status?: string;
    message?: string;
    error_message?: string | null;
  };

  if (!response.ok || !payload.sid) {
    throw new Error(payload.message ?? payload.error_message ?? "Twilio send failed.");
  }

  return {
    sid: payload.sid,
    status: payload.status ?? "queued",
  };
}

function normalizeWhatsAppAddress(value: string) {
  return value.startsWith("whatsapp:") ? value : `whatsapp:${value}`;
}
