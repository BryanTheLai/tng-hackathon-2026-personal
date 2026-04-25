import type { CaseRecord } from "@/lib/domain/schema";
import { canAttemptAlibaba } from "@/lib/config/env";
import { createAlibabaCompletion } from "@/lib/integrations/alibaba-modelstudio";
import { renderPromptTemplate } from "@/lib/prompts/template-loader";

export async function generateCaseExplanation(record: CaseRecord) {
  const fallback = [
    "## Case",
    `- ${record.caseId} is high-risk because ${record.reasonChips.slice(0, 3).join(", ")} occurred in a tight sequence.`,
    "",
    "## Key facts",
    ...record.facts.slice(0, 5).map((fact) => `- ${fact}`),
    ...record.networkObservations.slice(0, 2).map((observation) =>
      `- IP ${observation.ipAddress} is ${observation.disposition.toLowerCase()} with ${observation.reputation.toLowerCase()} reputation (${observation.label}).`,
    ),
    "",
    "## Assessment",
    `${record.aiInferences[0] ?? "Signals align with a high-confidence fraud pattern."}`,
    "",
    "## Action",
    `${formatAction(record.recommendation.action)} remains the recommended action because the evidence and policy path already align.`,
  ].join("\n");

  if (!canAttemptAlibaba()) {
    return fallback;
  }

  try {
    const completion = await createAlibabaCompletion([
      {
        role: "system",
        content: renderPromptTemplate("ai/explanation/system.md", {}),
      },
      {
        role: "user",
        content: renderPromptTemplate("ai/explanation/user.md", {
          case_id: record.caseId,
          user_label: record.maskedUserLabel,
          score: record.score,
          recommended_action: formatAction(record.recommendation.action),
          prompt_state: formatAction(record.prompt.state),
          resolution_state: formatAction(record.resolutionState),
          facts_bullets: toBulletList([
            ...record.facts,
            ...record.networkObservations.map(
              (observation) =>
                `IP ${observation.ipAddress} | ${observation.geoLabel} | ${observation.label} | ${observation.disposition.toLowerCase()}`,
            ),
          ]),
          inferences_bullets: toBulletList(record.aiInferences),
          evidence_ids_bullets: toBulletList(record.evidenceItems.map((item) => item.evidenceId)),
          policy_ids_bullets: toBulletList(record.policyHits.map((hit) => hit.policyId)),
        }),
      },
    ]);

    return normalizeMarkdownOutput(completion?.trim(), fallback);
  } catch {
    return fallback;
  }
}

export async function draftCaseNote(record: CaseRecord) {
  const fallback = [
    "## Decision",
    `- Action: ${formatAction(record.recommendation.action)}`,
    `- Prompt: ${formatAction(record.prompt.state)} | Resolution: ${formatAction(record.resolutionState)}`,
    "",
    "## Why",
    ...record.facts.slice(0, 4).map((fact) => `- ${fact}`),
    ...record.networkObservations.slice(0, 2).map((observation) =>
      `- IP ${observation.ipAddress} was ${observation.disposition.toLowerCase()} with ${observation.reputation.toLowerCase()} reputation.`,
    ),
    "",
    "## Follow-up",
    `- Keep support and compliance aligned to ${record.caseId}.`,
    `- Reference the current control state: ${record.currentControlState}.`,
  ].join("\n");

  if (!canAttemptAlibaba()) {
    return fallback;
  }

  try {
    const completion = await createAlibabaCompletion([
      {
        role: "system",
        content: renderPromptTemplate("ai/draft-note/system.md", {}),
      },
      {
        role: "user",
        content: renderPromptTemplate("ai/draft-note/user.md", {
          case_id: record.caseId,
          recommended_action: formatAction(record.recommendation.action),
          prompt_state: formatAction(record.prompt.state),
          resolution_state: formatAction(record.resolutionState),
          facts_bullets: toBulletList([
            ...record.facts,
            ...record.networkObservations.map(
              (observation) =>
                `IP ${observation.ipAddress} | ${observation.geoLabel} | ${observation.label} | ${observation.disposition.toLowerCase()}`,
            ),
          ]),
          suspicious_actions_bullets: toBulletList(
            record.suspiciousActions.map((action) => `${action.label}: ${action.note}`),
          ),
        }),
      },
    ]);

    return normalizeMarkdownOutput(completion?.trim(), fallback);
  } catch {
    return fallback;
  }
}

function toBulletList(values: string[]) {
  if (values.length === 0) {
    return "- None";
  }

  return values.map((value) => `- ${value}`).join("\n");
}

function formatAction(value: string) {
  return value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function normalizeMarkdownOutput(content: string | undefined, fallback: string) {
  if (!content) {
    return fallback;
  }

  if (content.includes("## ")) {
    return content;
  }

  return fallback;
}
