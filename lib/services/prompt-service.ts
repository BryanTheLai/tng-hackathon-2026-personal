import type { CaseRecord } from "@/lib/domain/schema";
import { appendAuditEvent, appendTimelineEvent } from "@/lib/audit/audit-service";
import { canAttemptTwilioSend } from "@/lib/config/env";
import { createAuditId, getCaseFromState, nowIso, upsertCaseInState } from "@/lib/demo-state/store";
import { sendWhatsAppMessage } from "@/lib/integrations/twilio-client";
import { renderPromptTemplate } from "@/lib/prompts/template-loader";

export class PromptServiceError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
    this.name = "PromptServiceError";
  }
}

export async function ensurePromptForAction(record: CaseRecord) {
  if (!needsCustomerPrompt(record)) {
    return record.prompt;
  }

  await applyPromptSend(record, { allowSimulation: true, mode: "initial" });
  return record.prompt;
}

export async function resendLivePrompt(caseId: string) {
  const record = getCaseFromState(caseId);

  if (!record) {
    throw new PromptServiceError("Case not found.", 404);
  }

  if (!needsCustomerPrompt(record)) {
    throw new PromptServiceError(
      "This case does not use the WhatsApp re-verification flow.",
      409,
    );
  }

  if (record.resolutionState !== "PENDING_USER") {
    throw new PromptServiceError(
      "Only pending-user cases can send a live WhatsApp prompt.",
      409,
    );
  }

  if (!canAttemptTwilioSend()) {
    throw new PromptServiceError(
      "Live Twilio send is not configured on this runtime.",
      503,
    );
  }

  const failure = await applyPromptSend(record, { allowSimulation: false, mode: "resend" });
  upsertCaseInState(record);

  if (failure) {
    throw failure;
  }

  return record;
}

async function applyPromptSend(
  record: CaseRecord,
  options: { allowSimulation: boolean; mode: "initial" | "resend" },
) {
  const timestamp = nowIso();
  const messagePreview = renderPromptTemplate("customer/ato-reverify-required.md", {});

  try {
    const twilioMessage = await sendWhatsAppMessage({
      body: messagePreview,
    });

    if (twilioMessage) {
      record.prompt = {
        ...record.prompt,
        state: mapPromptState(twilioMessage.status),
        messageSid: twilioMessage.sid,
        sentAt: timestamp,
        deliveredAt:
          twilioMessage.status === "delivered" ? timestamp : record.prompt.deliveredAt,
        expiredAt: undefined,
        messagePreview,
      };

      appendAuditEvent(
        record,
        "SYSTEM",
        "PromptService",
        options.mode === "resend" ? "PROMPT_RESENT" : "PROMPT_SENT",
        options.mode === "resend"
          ? `Live WhatsApp prompt re-sent to Twilio with status ${twilioMessage.status}.`
          : `WhatsApp prompt submitted to Twilio with status ${twilioMessage.status}.`,
      );
      appendTimelineEvent(
        record,
        "PROMPT",
        options.mode === "resend"
          ? "Live WhatsApp prompt re-sent"
          : "Re-verification prompt submitted",
        options.mode === "resend"
          ? `Manual live send submitted to Twilio with status ${twilioMessage.status}.`
          : `Twilio accepted outbound WhatsApp prompt with status ${twilioMessage.status}.`,
      );

      return null;
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Twilio send error.";

    record.prompt = {
      ...record.prompt,
      state: "FAILED",
      sentAt: timestamp,
      deliveredAt: undefined,
      expiredAt: undefined,
      messagePreview,
    };

    appendAuditEvent(
      record,
      "SYSTEM",
      "PromptService",
      options.mode === "resend" ? "PROMPT_RESEND_FAILED" : "PROMPT_SEND_FAILED",
      options.mode === "resend"
        ? `Live WhatsApp resend failed: ${message}`
        : `WhatsApp prompt failed to send: ${message}`,
    );
    appendTimelineEvent(
      record,
      "PROMPT",
      options.mode === "resend"
        ? "Live WhatsApp prompt failed"
        : "Re-verification prompt failed",
      message,
      false,
    );

    return options.allowSimulation ? null : new PromptServiceError(message, 502);
  }

  if (!options.allowSimulation) {
    return new PromptServiceError("Live Twilio send is not configured on this runtime.", 503);
  }

  record.prompt = {
    ...record.prompt,
    state: "SIMULATED",
    messageSid: createAuditId("SIM-MSG"),
    sentAt: timestamp,
    deliveredAt: timestamp,
    expiredAt: undefined,
    messagePreview,
  };

  appendAuditEvent(
    record,
    "SYSTEM",
    "PromptService",
    "PROMPT_SENT",
    "WhatsApp re-verification prompt simulated because live Twilio send is not configured.",
  );
  appendTimelineEvent(
    record,
    "PROMPT",
    "Re-verification prompt simulated",
    "Demo-only prompt simulation used in place of a live Twilio send.",
  );

  return null;
}

function needsCustomerPrompt(record: CaseRecord) {
  return (
    record.recommendation.action === "FREEZE_ACCOUNT" ||
    record.recommendation.action === "STEP_UP_VERIFICATION"
  );
}

function mapPromptState(status: string): CaseRecord["prompt"]["state"] {
  const normalized = status.toLowerCase();

  if (normalized === "delivered") {
    return "DELIVERED";
  }

  if (normalized === "queued" || normalized === "accepted") {
    return "PENDING_SEND";
  }

  if (normalized === "sent" || normalized === "sending") {
    return "SENT";
  }

  if (normalized === "failed" || normalized === "undelivered") {
    return "FAILED";
  }

  return "SENT";
}
