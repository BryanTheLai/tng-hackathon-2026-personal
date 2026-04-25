import type { ControlsWorkspace, RuleCondition, RuleDefinition } from "@/lib/domain/schema";

export const ruleActionOptions: RuleDefinition["action"][] = [
  "ALLOW",
  "REVIEW",
  "STEP_UP_VERIFICATION",
  "FREEZE_ACCOUNT",
  "ESCALATE",
];

export const ruleStatusOptions: RuleDefinition["status"][] = ["ACTIVE", "DRAFT", "SHADOW"];

const numericOperatorOptions: RuleCondition["operator"][] = ["=", "!=", "<", ">", "<=", ">="];
const booleanOperatorOptions: RuleCondition["operator"][] = ["=", "!="];

export function formatRuleLabel(value: string) {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function cloneRule(rule: RuleDefinition) {
  return {
    ...rule,
    conditions: rule.conditions.map((condition) => ({ ...condition })),
  };
}

export function buildRuleExpression(rule: RuleDefinition) {
  return `${rule.action} if ${rule.conditions
    .map((condition) => `:${condition.variableName} ${condition.operator} ${condition.value}`)
    .join(" and ")}`;
}

export function clampFreezeThreshold(value: number) {
  if (!Number.isFinite(value)) {
    return 80;
  }

  return Math.min(90, Math.max(75, Math.round(value)));
}

export function getVariableDefinition(
  workspace: ControlsWorkspace,
  variableName: string,
) {
  return workspace.variableDefinitions.find((variable) => variable.name === variableName);
}

export function getOperatorOptionsForVariable(
  workspace: ControlsWorkspace,
  variableName: string,
) {
  const variable = getVariableDefinition(workspace, variableName);

  if (variable?.type === "BOOLEAN") {
    return booleanOperatorOptions;
  }

  return numericOperatorOptions;
}

export function getDefaultValueForVariable(
  workspace: ControlsWorkspace,
  variableName: string,
) {
  const variable = getVariableDefinition(workspace, variableName);

  switch (variable?.type) {
    case "BOOLEAN":
      return "true";
    case "COUNT":
    case "DURATION_HOURS":
    case "NUMBER":
      return "1";
    case "RATIO":
      return "1.5";
    default:
      return "true";
  }
}

export function createConditionDraft(
  workspace: ControlsWorkspace,
  clauseId: string,
  variableName?: string,
  hint?: string,
): RuleCondition {
  const fallbackVariable = workspace.variableDefinitions[0]?.name ?? "is_new_device";
  const nextVariableName = variableName ?? fallbackVariable;
  const variable = getVariableDefinition(workspace, nextVariableName);

  return {
    clauseId,
    variableName: nextVariableName,
    operator: getOperatorOptionsForVariable(workspace, nextVariableName)[0] ?? "=",
    value: getDefaultValueForVariable(workspace, nextVariableName),
    hint: hint ?? variable?.description ?? "New clause added in the workspace.",
  };
}

export function createDraftRuleId(workspace: ControlsWorkspace) {
  const existingIds = new Set(workspace.rules.map((rule) => rule.ruleId));
  let sequence = workspace.rules.length + 1;

  while (existingIds.has(`RULE-DRAFT-${String(sequence).padStart(3, "0")}`)) {
    sequence += 1;
  }

  return `RULE-DRAFT-${String(sequence).padStart(3, "0")}`;
}

export function createEmptyRule(workspace: ControlsWorkspace) {
  const templateRule = workspace.rules[0];
  const primaryVariable = workspace.variableDefinitions[0]?.name;

  return {
    ruleId: createDraftRuleId(workspace),
    name: "New draft rule",
    status: "DRAFT" as const,
    appliesTo: templateRule?.appliesTo ?? "Wallet risk controls",
    action: "REVIEW" as const,
    version: `v${workspace.rules.length + 1}-draft`,
    owner: templateRule?.owner ?? "Risk controls",
    lastEditedAt: new Date().toISOString(),
    freezeThreshold: clampFreezeThreshold(templateRule?.freezeThreshold ?? 80),
    rationale: "Describe the exact signals that should trigger this rule.",
    conditions: [createConditionDraft(workspace, "C-1", primaryVariable)],
  } satisfies RuleDefinition;
}

export function nextClauseId(rule: RuleDefinition) {
  const nextIndex =
    rule.conditions.reduce((maxValue, condition) => {
      const match = /^C-(\d+)$/.exec(condition.clauseId);
      const numericValue = match ? Number.parseInt(match[1] ?? "0", 10) : 0;
      return Math.max(maxValue, numericValue);
    }, 0) + 1;

  return `C-${nextIndex}`;
}
