import type { CaseRecord } from "@/lib/domain/schema";

export function buildCaseReport(record: CaseRecord, format: "MARKDOWN" | "JSON" = "MARKDOWN") {
  if (format === "JSON") {
    return JSON.stringify(
      {
        caseId: record.caseId,
        score: record.score,
        recommendation: record.recommendation.action,
        promptState: record.prompt.state,
        resolutionState: record.resolutionState,
        facts: record.facts,
        aiInferences: record.aiInferences,
        auditEvents: record.auditEvents,
      },
      null,
      2,
    );
  }

  return [
    `# ${record.caseId}`,
    "",
    `- User: ${record.maskedUserLabel}`,
    `- Score: ${record.score}`,
    `- Recommendation: ${record.recommendation.action}`,
    `- Prompt: ${record.prompt.state}`,
    `- Resolution: ${record.resolutionState}`,
    "",
    "## Facts",
    ...record.facts.map((fact) => `- ${fact}`),
    "",
    "## AI Inferences",
    ...record.aiInferences.map((item) => `- ${item}`),
    "",
    "## Network Signals",
    ...(record.networkObservations.length > 0
      ? record.networkObservations.map(
          (observation) =>
            `- ${observation.ipAddress} | ${observation.geoLabel} | ${observation.asnLabel} | ${observation.disposition} | ${observation.reputation}`,
        )
      : ["- No seeded IP observations on this case."]),
    "",
    "## Suspicious Actions",
    ...record.suspiciousActions.map(
      (action) =>
        `- ${action.label} | ${action.amountLabel} | ${action.succeeded ? "completed" : "blocked"} | ${action.note}`,
    ),
    "",
    "## Policy",
    ...record.policyHits.map((hit) => `- ${hit.policyId}: ${hit.title}`),
    "",
    "## Audit",
    ...record.auditEvents.map(
      (event) => `- ${event.createdAt} | ${event.actorName} | ${event.summary}`,
    ),
  ].join("\n");
}
