import { beforeEach, describe, expect, test, vi } from "vitest";

import { POST as resetDemoRoute } from "@/app/api/demo/reset/route";
import { POST as inboundReplyRoute } from "@/app/api/webhooks/twilio/inbound/route";
import { POST as sweepExpiredPrompts } from "@/app/api/internal/sweep-expired-prompts/route";
import { applyCaseAction } from "@/lib/services/action-orchestrator";
import { resetEnvCacheForTests } from "@/lib/config/env";
import { resetDemoState } from "@/lib/demo-state/store";
import { getCaseDetail } from "@/lib/services/case-service";
import { resendLivePrompt } from "@/lib/services/prompt-service";
import { saveRuleDraft } from "@/lib/services/replay-service";
import { createEmptyRule } from "@/lib/rules/rule-builder";
import { resolveCaseFromReply } from "@/lib/services/resolution-service";

describe("seeded demo flow", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    delete process.env.VITEST;
    delete process.env.TWILIO_ACCOUNT_SID;
    delete process.env.TWILIO_AUTH_TOKEN;
    delete process.env.TWILIO_MESSAGING_SERVICE_SID;
    delete process.env.TWILIO_WHATSAPP_FROM;
    delete process.env.TWILIO_WHATSAPP_TO;
    delete process.env.TWILIO_STATUS_CALLBACK_URL;
    resetEnvCacheForTests();
    resetDemoState();
  });

  test("applying a severe action updates control state and prompt state", async () => {
    const record = await applyCaseAction({
      caseId: "CASE-ATO-008",
      action: "STEP_UP_VERIFICATION",
      actorName: "Fraud analyst",
      actorType: "ANALYST",
    });

    expect(record?.currentControlState).toBe("STEP_UP_REQUIRED");
    expect(record?.prompt.state).toBe("SIMULATED");
    expect(record?.status).toBe("ACTION_APPLIED");
  });

  test("replying /tng-login resolves the case as reactivated", async () => {
    await applyCaseAction({
      caseId: "CASE-ATO-008",
      action: "STEP_UP_VERIFICATION",
      actorName: "Fraud analyst",
      actorType: "ANALYST",
    });

    const resolved = resolveCaseFromReply("CASE-ATO-008", "SIM-IN-1");

    expect(resolved?.resolutionState).toBe("REACTIVATED");
    expect(resolved?.prompt.state).toBe("USER_REPLIED_TNG_LOGIN");
    expect(resolved?.prompt.lastInboundBody).toBe("/tng-login");
    expect(resolved?.prompt.lastInboundMessageSid).toBe("SIM-IN-1");
    expect(resolved?.status).toBe("RESOLVED");
  });

  test("non-matching inbound reply is persisted without resolving the case", async () => {
    await applyCaseAction({
      caseId: "CASE-ATO-008",
      action: "STEP_UP_VERIFICATION",
      actorName: "Fraud analyst",
      actorType: "ANALYST",
    });

    const formData = new FormData();
    formData.set("MessageSid", "SIM-IN-OTHER");
    formData.set("Body", "/tng-help");
    formData.set("CaseId", "CASE-ATO-008");

    const response = await inboundReplyRoute(
      new Request("http://localhost/api/webhooks/twilio/inbound", {
        method: "POST",
        body: formData,
      }),
    );

    expect(response.status).toBe(200);
    const responseText = await response.text();
    expect(responseText).toContain("Reply received, but verification is not complete yet.");
    expect(responseText).toContain("Reply `/tng-login` to confirm this login.");

    const record = await getCaseDetail("CASE-ATO-008");
    expect(record?.resolutionState).toBe("PENDING_USER");
    expect(record?.status).toBe("ACTION_APPLIED");
    expect(record?.prompt.state).toBe("USER_REPLIED_OTHER");
    expect(record?.prompt.lastInboundBody).toBe("/tng-help");
    expect(record?.prompt.lastInboundMessageSid).toBe("SIM-IN-OTHER");
  });

  test("successful inbound reply returns a clear confirmation message", async () => {
    await applyCaseAction({
      caseId: "CASE-ATO-008",
      action: "STEP_UP_VERIFICATION",
      actorName: "Fraud analyst",
      actorType: "ANALYST",
    });

    const formData = new FormData();
    formData.set("MessageSid", "SIM-IN-SUCCESS");
    formData.set("Body", "/tng-login");
    formData.set("CaseId", "CASE-ATO-008");

    const response = await inboundReplyRoute(
      new Request("http://localhost/api/webhooks/twilio/inbound", {
        method: "POST",
        body: formData,
      }),
    );

    expect(response.status).toBe(200);
    const responseText = await response.text();
    expect(responseText).toContain("Verification confirmed. This login is now verified.");
  });

  test("empty inbound reply returns guidance instead of silence", async () => {
    await applyCaseAction({
      caseId: "CASE-ATO-008",
      action: "STEP_UP_VERIFICATION",
      actorName: "Fraud analyst",
      actorType: "ANALYST",
    });

    const formData = new FormData();
    formData.set("MessageSid", "SIM-IN-EMPTY");
    formData.set("Body", "   ");
    formData.set("CaseId", "CASE-ATO-008");

    const response = await inboundReplyRoute(
      new Request("http://localhost/api/webhooks/twilio/inbound", {
        method: "POST",
        body: formData,
      }),
    );

    expect(response.status).toBe(200);
    const responseText = await response.text();
    expect(responseText).toContain("We received an empty reply.");
    expect(responseText).toContain("Reply `/tng-login` to confirm this login.");
  });

  test("reply without a pending case still returns a TwiML guidance message", async () => {
    const formData = new FormData();
    formData.set("MessageSid", "SIM-IN-NO-CASE");
    formData.set("Body", "/tng-login");
    formData.set("CaseId", "CASE-UNKNOWN");

    const response = await inboundReplyRoute(
      new Request("http://localhost/api/webhooks/twilio/inbound", {
        method: "POST",
        body: formData,
      }),
    );

    expect(response.status).toBe(200);
    const responseText = await response.text();
    expect(responseText).toContain("We could not match this reply to an active verification request.");
  });

  test("saving a draft rule updates the controls workspace", async () => {
    const workspace = await import("@/lib/repositories/risk-ops-repository").then((module) =>
      module.riskOpsRepository.getControlsWorkspace(),
    );
    const nextRule = {
      ...workspace.rules[0],
      freezeThreshold: 80,
    };

    const updatedWorkspace = saveRuleDraft(workspace.rules[0].ruleId, nextRule);

    expect(updatedWorkspace.rules[0]?.freezeThreshold).toBe(80);
    expect(updatedWorkspace.draftRule).toContain(":is_new_device");
  });

  test("saving a new draft rule inserts it into the controls workspace", async () => {
    const workspace = await import("@/lib/repositories/risk-ops-repository").then((module) =>
      module.riskOpsRepository.getControlsWorkspace(),
    );
    const nextRule = {
      ...createEmptyRule(workspace),
      name: "Review new device with low threshold",
    };

    const updatedWorkspace = saveRuleDraft(nextRule.ruleId, nextRule);

    expect(updatedWorkspace.rules[0]?.ruleId).toBe(nextRule.ruleId);
    expect(updatedWorkspace.rules[0]?.name).toBe("Review new device with low threshold");
  });

  test("internal sweep route escalates delivered prompts with a valid token", async () => {
    await applyCaseAction({
      caseId: "CASE-ATO-008",
      action: "STEP_UP_VERIFICATION",
      actorName: "Fraud analyst",
      actorType: "ANALYST",
    });

    const response = await sweepExpiredPrompts(
      new Request("http://localhost/api/internal/sweep-expired-prompts", {
        method: "POST",
        headers: { authorization: "Bearer change-me" },
      }),
    );

    expect(response.status).toBe(200);

    const record = await getCaseDetail("CASE-ATO-008");
    expect(record?.resolutionState).toBe("ESCALATED");
    expect(record?.prompt.state).toBe("EXPIRED");
  });

  test("real Twilio send uses the live message sid and queued state mapping", async () => {
    process.env.TWILIO_ACCOUNT_SID = "AC123";
    process.env.TWILIO_AUTH_TOKEN = "secret";
    process.env.TWILIO_MESSAGING_SERVICE_SID = "MG123";
    process.env.TWILIO_WHATSAPP_TO = "+15551234567";
    process.env.TWILIO_STATUS_CALLBACK_URL = "https://example.com/api/webhooks/twilio/status";
    process.env.VITEST = "";
    resetEnvCacheForTests();

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        sid: "SM123",
        status: "queued",
      }),
    });
    vi.stubGlobal(
      "fetch",
      fetchMock,
    );

    const record = await applyCaseAction({
      caseId: "CASE-ATO-008",
      action: "STEP_UP_VERIFICATION",
      actorName: "Fraud analyst",
      actorType: "ANALYST",
    });

    expect(record?.prompt.messageSid).toBe("SM123");
    expect(record?.prompt.state).toBe("PENDING_SEND");
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [, requestInit] = fetchMock.mock.calls[0] ?? [];
    expect(requestInit?.body).toBeInstanceOf(URLSearchParams);

    const requestBody = requestInit?.body as URLSearchParams;
    expect(requestBody.get("To")).toBe("whatsapp:+15551234567");
    expect(requestBody.get("MessagingServiceSid")).toBe("MG123");
    expect(requestBody.get("StatusCallback")).toBe(
      "https://example.com/api/webhooks/twilio/status",
    );
  });

  test("manual live resend replaces a seeded prompt with a Twilio message sid", async () => {
    process.env.TWILIO_ACCOUNT_SID = "AC123";
    process.env.TWILIO_AUTH_TOKEN = "secret";
    process.env.TWILIO_WHATSAPP_FROM = "+14155238886";
    process.env.TWILIO_WHATSAPP_TO = "+60138509983";
    process.env.APP_URL = "https://whatsapp-agent-5pjot.ondigitalocean.app";
    process.env.VITEST = "";
    resetEnvCacheForTests();

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        sid: "SM999",
        status: "queued",
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const record = await resendLivePrompt("CASE-ATO-008");

    expect(record.prompt.messageSid).toBe("SM999");
    expect(record.prompt.state).toBe("PENDING_SEND");
    expect(record.auditEvents[0]?.eventType).toBe("PROMPT_RESENT");

    const persisted = await getCaseDetail("CASE-ATO-008");
    expect(persisted?.prompt.messageSid).toBe("SM999");
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [, requestInit] = fetchMock.mock.calls[0] ?? [];
    const requestBody = requestInit?.body as URLSearchParams;
    expect(requestBody.get("From")).toBe("whatsapp:+14155238886");
    expect(requestBody.get("StatusCallback")).toBe(
      "https://whatsapp-agent-5pjot.ondigitalocean.app/api/webhooks/twilio/status",
    );
  });

  test("reset demo route restores the seeded baseline after runtime mutations", async () => {
    await applyCaseAction({
      caseId: "CASE-ATO-008",
      action: "STEP_UP_VERIFICATION",
      actorName: "Fraud analyst",
      actorType: "ANALYST",
    });
    resolveCaseFromReply("CASE-ATO-008", "SIM-IN-RESET");

    let record = await getCaseDetail("CASE-ATO-008");
    expect(record?.resolutionState).toBe("REACTIVATED");

    const response = await resetDemoRoute();
    expect(response.status).toBe(200);

    record = await getCaseDetail("CASE-ATO-008");
    expect(record?.resolutionState).toBe("PENDING_USER");
    expect(record?.prompt.state).toBe("SIMULATED");
    expect(record?.prompt.messageSid).toBe("SIM-MSG-008");
  });
});
