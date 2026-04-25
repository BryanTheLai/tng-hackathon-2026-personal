import type { CaseRecord } from "@/lib/domain/schema";
import { appendAuditEvent, appendTimelineEvent } from "@/lib/audit/audit-service";
import { getCaseFromState, upsertCaseInState } from "@/lib/demo-state/store";
import { ensurePromptForAction } from "@/lib/services/prompt-service";

export interface ApplyActionInput {
  caseId: string;
  action: CaseRecord["recommendation"]["action"];
  actorName: string;
  actorType: "SYSTEM" | "ANALYST";
  reason?: string;
  override?: boolean;
}

export async function applyCaseAction(input: ApplyActionInput) {
  const record = getCaseFromState(input.caseId);

  if (!record) {
    return null;
  }

  record.recommendation = {
    ...record.recommendation,
    action: input.action,
    rationale: input.override && input.reason
      ? `Override applied by ${input.actorName}: ${input.reason}`
      : record.recommendation.rationale,
  };
  record.currentControlState = mapControlState(input.action);
  record.status = input.action === "ALLOW" ? "RESOLVED" : "ACTION_APPLIED";
  record.resolutionState = mapResolutionState(input.action);
  record.exportNote = buildExportNote(record, input);

  appendAuditEvent(
    record,
    input.actorType,
    input.actorName,
    input.override ? "ACTION_OVERRIDDEN" : "ACTION_APPLIED",
    input.override
      ? `${formatAction(input.action)} override applied. Reason: ${input.reason ?? "none"}`
      : `${formatAction(input.action)} applied.`,
  );
  appendTimelineEvent(
    record,
    "CONTROL_APPLY",
    `${formatAction(input.action)} applied`,
    input.override
      ? `Override applied by ${input.actorName}.`
      : "Recommended control path applied.",
    input.action !== "ALLOW",
  );

  await ensurePromptForAction(record);
  upsertCaseInState(record);

  return record;
}

function mapControlState(action: CaseRecord["recommendation"]["action"]) {
  switch (action) {
    case "FREEZE_ACCOUNT":
      return "FREEZE_APPLIED";
    case "STEP_UP_VERIFICATION":
      return "STEP_UP_REQUIRED";
    case "REVIEW":
      return "REVIEW_PENDING";
    case "ESCALATE":
      return "ESCALATED";
    case "ALLOW":
      return "ALLOW_CONFIRMED";
  }
}

function mapResolutionState(action: CaseRecord["recommendation"]["action"]): CaseRecord["resolutionState"] {
  switch (action) {
    case "ALLOW":
      return "REACTIVATED";
    case "ESCALATE":
      return "ESCALATED";
    case "FREEZE_ACCOUNT":
    case "STEP_UP_VERIFICATION":
    case "REVIEW":
      return "PENDING_USER";
  }
}

function buildExportNote(record: CaseRecord, input: ApplyActionInput) {
  const resolutionState = formatAction(mapResolutionState(input.action));
  const followUp = record.missingData.slice(0, 2);

  return [
    `## ${record.caseId}`,
    "",
    "### Status",
    `- Action applied: ${formatAction(input.action)}`,
    `- Resolution state: ${resolutionState}`,
    `- Control state: ${record.currentControlState}`,
    "",
    "### Why",
    ...record.facts.slice(0, 3).map((fact) => `- ${fact}`),
    ...record.networkObservations.slice(0, 2).map(
      (observation) =>
        `- IP ${observation.ipAddress} is ${observation.disposition.toLowerCase()} with ${observation.reputation.toLowerCase()} reputation.`,
    ),
    ...(input.override && input.reason ? ["", "### Override", `- ${input.reason}`] : []),
    ...(followUp.length > 0 ? ["", "### Follow-up", ...followUp.map((item) => `- ${item}`)] : []),
  ].join("\n");
}

function formatAction(action: string) {
  return action.replaceAll("_", " ");
}
