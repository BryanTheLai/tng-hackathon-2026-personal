import { z } from "zod";

import type { ControlsWorkspace, RuleCondition, RuleDefinition } from "@/lib/domain/schema";
import { canAttemptAlibaba } from "@/lib/config/env";
import { createAlibabaCompletion } from "@/lib/integrations/alibaba-modelstudio";
import { renderPromptTemplate } from "@/lib/prompts/template-loader";
import {
  clampFreezeThreshold,
  createEmptyRule,
  formatRuleLabel,
  getDefaultValueForVariable,
  getOperatorOptionsForVariable,
  getVariableDefinition,
  ruleActionOptions,
} from "@/lib/rules/rule-builder";

const generatedConditionSchema = z.object({
  variableName: z.string().optional(),
  operator: z.string().optional(),
  value: z.union([z.string(), z.number(), z.boolean()]).optional(),
  hint: z.string().optional(),
});

const generatedRuleSchema = z.object({
  name: z.string().optional(),
  action: z.string().optional(),
  appliesTo: z.string().optional(),
  freezeThreshold: z.union([z.number(), z.string()]).optional(),
  rationale: z.string().optional(),
  conditions: z.array(generatedConditionSchema).optional(),
});

interface GenerateRuleDraftInput {
  prompt: string;
  workspace: ControlsWorkspace;
  baseRule?: RuleDefinition | null;
}

export async function generateRuleDraft(input: GenerateRuleDraftInput) {
  const fallbackRule = generateFallbackRule(input);

  if (!canAttemptAlibaba()) {
    return fallbackRule;
  }

  try {
    const completion = await createAlibabaCompletion([
      {
        role: "system",
        content: renderPromptTemplate("ai/rule-generator/system.md", {}),
      },
      {
        role: "user",
        content: renderPromptTemplate("ai/rule-generator/user.md", {
          request: input.prompt.trim(),
          allowed_actions: ruleActionOptions.join(", "),
          available_variables: input.workspace.variableDefinitions
            .map(
              (variable) =>
                `- ${variable.name} | type=${variable.type} | description=${variable.description} | lookback=${variable.lookbackWindow}`,
            )
            .join("\n"),
          allowed_operators: [
            "- BOOLEAN: =, !=",
            "- NUMBER/RATIO/COUNT/DURATION_HOURS: =, !=, <, >, <=, >=",
          ].join("\n"),
          base_rule:
            input.baseRule == null
              ? "None"
              : [
                  `- rule_id: ${input.baseRule.ruleId}`,
                  `- name: ${input.baseRule.name}`,
                  `- action: ${input.baseRule.action}`,
                  `- applies_to: ${input.baseRule.appliesTo}`,
                  `- rationale: ${input.baseRule.rationale}`,
                ].join("\n"),
        }),
      },
    ]);

    const parsed = parseGeneratedRule(completion);

    if (!parsed) {
      return fallbackRule;
    }

    return coerceGeneratedRule(parsed, input, fallbackRule);
  } catch {
    return fallbackRule;
  }
}

function generateFallbackRule(input: GenerateRuleDraftInput) {
  const prompt = input.prompt.toLowerCase();
  const baseRule =
    input.baseRule == null
      ? createEmptyRule(input.workspace)
      : {
          ...input.baseRule,
          conditions: input.baseRule.conditions.map((condition) => ({ ...condition })),
        };

  const action = inferAction(prompt, baseRule.action);
  const appliesTo = inferAppliesTo(prompt, input.workspace, baseRule.appliesTo);
  const threshold = inferThreshold(prompt, baseRule.freezeThreshold);
  const conditionCandidates = inferConditions(input.prompt, input.workspace);

  return {
    ...baseRule,
    name: inferRuleName(input.prompt, action, appliesTo, baseRule.name),
    action,
    status: "DRAFT",
    appliesTo,
    freezeThreshold: threshold,
    rationale: input.prompt.trim(),
    conditions:
      conditionCandidates.length > 0
        ? conditionCandidates
        : baseRule.conditions.map((condition) => ({ ...condition })),
  } satisfies RuleDefinition;
}

function inferAction(
  prompt: string,
  fallback: RuleDefinition["action"],
): RuleDefinition["action"] {
  if (prompt.includes("freeze")) {
    return "FREEZE_ACCOUNT";
  }

  if (prompt.includes("step up") || prompt.includes("step-up") || prompt.includes("reverify")) {
    return "STEP_UP_VERIFICATION";
  }

  if (prompt.includes("escalate")) {
    return "ESCALATE";
  }

  if (prompt.includes("allow")) {
    return "ALLOW";
  }

  if (prompt.includes("review")) {
    return "REVIEW";
  }

  return fallback;
}

function inferAppliesTo(
  prompt: string,
  workspace: ControlsWorkspace,
  fallback: string,
) {
  const normalizedPrompt = prompt.toLowerCase();
  const matchingRule = workspace.rules.find((rule) =>
    normalizedPrompt.includes(rule.appliesTo.toLowerCase()),
  );

  if (matchingRule) {
    return matchingRule.appliesTo;
  }

  if (normalizedPrompt.includes("dormant")) {
    return "Dormant wallets";
  }

  if (normalizedPrompt.includes("unauthorized")) {
    return "Unauthorized transaction review";
  }

  if (normalizedPrompt.includes("transfer")) {
    return "Transfer-enabled wallets";
  }

  return fallback;
}

function inferThreshold(prompt: string, fallback: number) {
  const matches = prompt.match(/\d+(\.\d+)?/g);
  const numericValue = matches?.map((value) => Number(value)).find((value) => value >= 1);

  if (numericValue == null) {
    return clampFreezeThreshold(fallback);
  }

  if (numericValue <= 10) {
    return clampFreezeThreshold(numericValue * 10);
  }

  return clampFreezeThreshold(numericValue);
}

function inferRuleName(
  prompt: string,
  action: RuleDefinition["action"],
  appliesTo: string,
  fallback: string,
) {
  const normalized = prompt.trim().replace(/\s+/g, " ");

  if (normalized.length >= 12) {
    return normalized.slice(0, 72);
  }

  return `${formatRuleLabel(action)} for ${appliesTo}` || fallback;
}

function inferConditions(prompt: string, workspace: ControlsWorkspace) {
  const normalizedPrompt = prompt.toLowerCase();
  const conditions: RuleCondition[] = [];

  for (const variable of workspace.variableDefinitions) {
    const variableName = variable.name.toLowerCase();
    const tokens = variableName.split("_");
    const isMentioned =
      normalizedPrompt.includes(variableName) ||
      tokens.some((token) => token.length > 2 && normalizedPrompt.includes(token)) ||
      normalizedPrompt.includes(variable.description.toLowerCase().split(" ").slice(0, 3).join(" "));

    if (!isMentioned) {
      continue;
    }

    const operators = getOperatorOptionsForVariable(workspace, variable.name);
    const clauseId = `C-${conditions.length + 1}`;

    if (variable.type === "BOOLEAN") {
      conditions.push({
        clauseId,
        variableName: variable.name,
        operator: normalizedPrompt.includes("not ") ? "!=" : "=",
        value: normalizedPrompt.includes("false") ? "false" : "true",
        hint: variable.description,
      });
      continue;
    }

    conditions.push({
      clauseId,
      variableName: variable.name,
      operator: inferNumericOperator(normalizedPrompt, operators),
      value: inferNumericValue(prompt, variable.name, getDefaultValueForVariable(workspace, variable.name)),
      hint: variable.description,
    });
  }

  return dedupeConditions(conditions);
}

function inferNumericOperator(
  prompt: string,
  operators: RuleCondition["operator"][],
): RuleCondition["operator"] {
  if (
    prompt.includes("at most") ||
    prompt.includes("less than") ||
    prompt.includes("below") ||
    prompt.includes("under")
  ) {
    return operators.includes("<=") ? "<=" : operators[0] ?? "=";
  }

  if (
    prompt.includes("more than") ||
    prompt.includes("at least") ||
    prompt.includes("greater than") ||
    prompt.includes("above") ||
    prompt.includes("over")
  ) {
    return operators.includes(">=") ? ">=" : operators[0] ?? "=";
  }

  return operators.includes(">=") ? ">=" : operators[0] ?? "=";
}

function inferNumericValue(prompt: string, variableName: string, fallback: string) {
  const ratios = prompt.match(/\d+(\.\d+)?x/g)?.[0];

  if (ratios && variableName.includes("ratio")) {
    return ratios.replace(/x$/i, "");
  }

  const matches = prompt.match(/\d+(\.\d+)?/g);
  const numericValue = matches?.map((value) => Number(value)).find((value) => value >= 1);

  return numericValue == null ? fallback : String(numericValue);
}

function parseGeneratedRule(content: string | undefined) {
  if (!content) {
    return null;
  }

  const fenced = content.match(/```json\s*([\s\S]*?)```/i)?.[1];
  const candidate = fenced ?? content.slice(content.indexOf("{"), content.lastIndexOf("}") + 1);

  if (!candidate || !candidate.trim().startsWith("{")) {
    return null;
  }

  try {
    return generatedRuleSchema.parse(JSON.parse(candidate));
  } catch {
    return null;
  }
}

function coerceGeneratedRule(
  generatedRule: z.infer<typeof generatedRuleSchema>,
  input: GenerateRuleDraftInput,
  fallbackRule: RuleDefinition,
) {
  const baseRule = input.baseRule ?? fallbackRule;
  const availableActions = new Set(ruleActionOptions);
  const action = availableActions.has(generatedRule.action as RuleDefinition["action"])
    ? (generatedRule.action as RuleDefinition["action"])
    : fallbackRule.action;

  const conditionSeed = normalizeGeneratedConditions(
    generatedRule.conditions ?? [],
    input.workspace,
    baseRule,
  );

  return {
    ...baseRule,
    name: generatedRule.name?.trim() || fallbackRule.name,
    status: "DRAFT",
    action,
    appliesTo: generatedRule.appliesTo?.trim() || fallbackRule.appliesTo,
    freezeThreshold: clampFreezeThreshold(Number(generatedRule.freezeThreshold ?? fallbackRule.freezeThreshold)),
    rationale: generatedRule.rationale?.trim() || fallbackRule.rationale,
    conditions: conditionSeed.length > 0 ? conditionSeed : fallbackRule.conditions,
  } satisfies RuleDefinition;
}

function normalizeGeneratedConditions(
  generatedConditions: z.infer<typeof generatedConditionSchema>[],
  workspace: ControlsWorkspace,
  baseRule: RuleDefinition,
) {
  const normalized = generatedConditions
    .map((condition, index) => {
      const variableName = condition.variableName?.trim();

      if (!variableName || !getVariableDefinition(workspace, variableName)) {
        return null;
      }

      const allowedOperators = getOperatorOptionsForVariable(workspace, variableName);
      const operator = allowedOperators.includes(condition.operator as RuleCondition["operator"])
        ? (condition.operator as RuleCondition["operator"])
        : allowedOperators[0] ?? "=";
      const defaultValue = getDefaultValueForVariable(workspace, variableName);

      return {
        clauseId: baseRule.conditions[index]?.clauseId ?? `C-${index + 1}`,
        variableName,
        operator,
        value: normalizeConditionValue(workspace, variableName, condition.value, defaultValue),
        hint:
          condition.hint?.trim() ||
          getVariableDefinition(workspace, variableName)?.description ||
          "Generated clause.",
      } satisfies RuleCondition;
    })
    .filter((condition): condition is RuleCondition => condition !== null);

  return dedupeConditions(normalized);
}

function normalizeConditionValue(
  workspace: ControlsWorkspace,
  variableName: string,
  value: string | number | boolean | undefined,
  fallback: string,
) {
  const variable = getVariableDefinition(workspace, variableName);

  if (!variable) {
    return fallback;
  }

  if (variable.type === "BOOLEAN") {
    if (typeof value === "boolean") {
      return value ? "true" : "false";
    }

    if (String(value).toLowerCase().includes("false")) {
      return "false";
    }

    return "true";
  }

  const numericValue =
    typeof value === "number" ? value : Number.parseFloat(String(value ?? ""));

  if (!Number.isFinite(numericValue)) {
    return fallback;
  }

  return String(numericValue);
}

function dedupeConditions(conditions: RuleCondition[]) {
  const seen = new Set<string>();

  return conditions.filter((condition) => {
    const signature = `${condition.variableName}|${condition.operator}|${condition.value}`;

    if (seen.has(signature)) {
      return false;
    }

    seen.add(signature);
    return true;
  });
}
