"use client";

import { Fragment, startTransition, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bot,
  ChevronDown,
  ChevronRight,
  CirclePlus,
  Play,
  Save,
  Settings2,
  Trash2,
} from "lucide-react";

import { SectionCard } from "@/components/ui/section-card";
import { Sheet } from "@/components/ui/sheet";
import { StatusBadge } from "@/components/ui/status-badge";
import type {
  ControlsWorkspace,
  RuleCondition,
  RuleDefinition,
} from "@/lib/domain/schema";
import { simulateReplay } from "@/lib/replay/simulate";
import {
  buildRuleExpression,
  clampFreezeThreshold,
  cloneRule,
  createConditionDraft,
  createEmptyRule,
  formatRuleLabel,
  getDefaultValueForVariable,
  getOperatorOptionsForVariable,
  getVariableDefinition,
  nextClauseId,
  ruleActionOptions,
  ruleStatusOptions,
} from "@/lib/rules/rule-builder";

type PendingAction = "save" | "replay" | "generate" | null;

function formatTimeLabel(timestamp: number) {
  return new Intl.DateTimeFormat("en-MY", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

function computeReplayRows(workspace: ControlsWorkspace, appliedRule: RuleDefinition) {
  return workspace.replayScenarios.map((scenario, index): ControlsWorkspace["replayScenarios"][number] => {
    if (index === 0) {
      return {
        ...scenario,
        afterAction:
          appliedRule.freezeThreshold <= 85
            ? appliedRule.action
            : "STEP_UP_VERIFICATION",
      };
    }

    if (index === 1) {
      return {
        ...scenario,
        afterAction:
          appliedRule.freezeThreshold <= 82 ? "STEP_UP_VERIFICATION" : "ALLOW",
      };
    }

    return {
      ...scenario,
      afterAction:
        appliedRule.action === "ESCALATE" || appliedRule.freezeThreshold <= 80
          ? "ESCALATE"
          : "REVIEW",
    };
  });
}

function getStatusTone(status: RuleDefinition["status"]) {
  if (status === "ACTIVE") {
    return "ALLOW";
  }

  if (status === "DRAFT") {
    return "STEP_UP_VERIFICATION";
  }

  return "REVIEW";
}

export function ControlsScreen({ workspace }: { workspace: ControlsWorkspace }) {
  const router = useRouter();
  const [workspaceState, setWorkspaceState] = useState(workspace);
  const initialRule = workspaceState.rules[0] ?? createEmptyRule(workspaceState);
  const [rules, setRules] = useState(workspaceState.rules.map(cloneRule));
  const [selectedRuleId, setSelectedRuleId] = useState(initialRule.ruleId);
  const [expandedRuleId, setExpandedRuleId] = useState<string | null>(initialRule.ruleId);
  const [builderOpen, setBuilderOpen] = useState(false);
  const [draftRule, setDraftRule] = useState(cloneRule(initialRule));
  const [appliedRule, setAppliedRule] = useState(cloneRule(initialRule));
  const [plainEnglishDraft, setPlainEnglishDraft] = useState("");
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [builderMessage, setBuilderMessage] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [replayedAt, setReplayedAt] = useState<string | null>(null);
  const [serverReplay, setServerReplay] = useState(() => {
    const initialReplay = simulateReplay(workspaceState, appliedRule.freezeThreshold);
    return {
      metrics: initialReplay,
      scenarios: computeReplayRows(workspaceState, appliedRule),
    };
  });

  const replay = serverReplay.metrics;
  const replayRows = useMemo(() => serverReplay.scenarios, [serverReplay]);
  const hasPendingChanges =
    JSON.stringify(draftRule) !== JSON.stringify(appliedRule);

  const openBuilder = (rule?: RuleDefinition) => {
    const nextRule = rule ? cloneRule(rule) : createEmptyRule(workspaceState);

    setSelectedRuleId(nextRule.ruleId);
    setDraftRule(nextRule);
    setAppliedRule(cloneRule(nextRule));
    setExpandedRuleId(nextRule.ruleId);
    setPlainEnglishDraft(rule?.rationale ?? "");
    setBuilderMessage(null);
    setSavedAt(null);
    setReplayedAt(null);
    setBuilderOpen(true);
  };

  const updateDraftRule = (updater: (rule: RuleDefinition) => RuleDefinition) => {
    startTransition(() => {
      setDraftRule((current) => updater(cloneRule(current)));
    });
  };

  const updateDraftCondition = (
    index: number,
    updater: (condition: RuleCondition) => RuleCondition,
  ) => {
    updateDraftRule((rule) => ({
      ...rule,
      conditions: rule.conditions.map((condition, conditionIndex) =>
        conditionIndex === index ? updater({ ...condition }) : condition,
      ),
    }));
  };

  const saveDraft = () => {
    setPendingAction("save");
    setBuilderMessage(null);

    startTransition(async () => {
      try {
        const response = await fetch("/api/controls/config", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ruleId: selectedRuleId,
            rule: draftRule,
          }),
        });
        const nextWorkspace: ControlsWorkspace = await response.json();
        const savedRule =
          nextWorkspace.rules.find((rule) => rule.ruleId === draftRule.ruleId) ??
          nextWorkspace.rules[0];

        setWorkspaceState(nextWorkspace);
        setRules(nextWorkspace.rules.map(cloneRule));
        if (savedRule) {
          setSelectedRuleId(savedRule.ruleId);
          setDraftRule(cloneRule(savedRule));
          setAppliedRule(cloneRule(savedRule));
          setExpandedRuleId(savedRule.ruleId);
        }
        setSavedAt(formatTimeLabel(Date.now()));
        setBuilderOpen(false);
        router.refresh();
      } finally {
        setPendingAction(null);
      }
    });
  };

  const replayDraft = () => {
    setPendingAction("replay");
    setBuilderMessage(null);

    startTransition(async () => {
      try {
        const response = await fetch("/api/controls/replay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rule: draftRule }),
        });
        const preview = await response.json();
        setAppliedRule(cloneRule(draftRule));
        setServerReplay(preview);
        setReplayedAt(formatTimeLabel(Date.now()));
        setExpandedRuleId(draftRule.ruleId);
        setBuilderMessage("Replay updated with the current draft.");
      } finally {
        setPendingAction(null);
      }
    });
  };

  const generateDraftFromText = () => {
    if (plainEnglishDraft.trim().length < 8) {
      setBuilderMessage("Describe the rule in plain English first.");
      return;
    }

    setPendingAction("generate");
    setBuilderMessage(null);

    startTransition(async () => {
      try {
        const response = await fetch("/api/controls/generate-rule", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: plainEnglishDraft,
            baseRuleId: rules.some((rule) => rule.ruleId === draftRule.ruleId)
              ? draftRule.ruleId
              : undefined,
          }),
        });
        const payload = await response.json();
        setDraftRule(cloneRule(payload.rule));
        setSelectedRuleId(payload.rule.ruleId);
        setExpandedRuleId(payload.rule.ruleId);
        setBuilderMessage("Draft generated. Only valid variables, operators, and actions were kept.");
      } finally {
        setPendingAction(null);
      }
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <SectionCard
        compact
        title="Rules workspace"
        subtitle="All rules live in one table. Expand a row to inspect it. Open builder to edit or add a rule in a popup instead of touching TypeScript."
        action={
          <button
            className="button-primary"
            onClick={() => openBuilder()}
            type="button"
          >
            <CirclePlus size={14} absoluteStrokeWidth />
            Add rule
          </button>
        }
      >
        <div className="grid gap-2 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="rounded-[10px] border border-[var(--line)] bg-[var(--surface-subtle)] px-3 py-3">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge label={draftRule.status} tone={getStatusTone(draftRule.status)} />
              {hasPendingChanges ? (
                <StatusBadge label="Pending replay" tone="PENDING_USER" />
              ) : (
                <StatusBadge label="Replay synced" tone="DELIVERED" />
              )}
            </div>
            <div className="mt-3 text-sm font-semibold">{draftRule.name}</div>
            <div className="mt-1 text-sm text-[var(--muted-strong)]">
              {draftRule.rationale}
            </div>
            <div className="mt-3 rounded-[8px] border border-[var(--line)] bg-[var(--surface)] px-3 py-2">
              <div className="text-[11px] uppercase tracking-[0.08em] text-[var(--muted)]">
                Last draft expression
              </div>
              <div className="mono mt-2 text-xs text-[var(--muted-strong)]">
                {buildRuleExpression(draftRule)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              ["Bad caught", replay.badCasesCaught],
              ["Good delayed", replay.goodUsersDelayed],
              ["Reviews", replay.analystReviews],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-[10px] border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-3"
              >
                <div className="text-[11px] uppercase tracking-[0.08em] text-[var(--muted)]">
                  {label}
                </div>
                <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>

      <SectionCard
        compact
        title="All rules"
        subtitle="This is the actual control surface. Expand a row for the logic. Open builder to edit or create a rule."
      >
        <div className="panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="dense-table min-w-[980px]">
              <thead>
                <tr>
                  <th />
                  <th>Rule</th>
                  <th>Status</th>
                  <th>Action</th>
                  <th>Threshold</th>
                  <th>Version</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rules.map((rule) => {
                  const isExpanded = expandedRuleId === rule.ruleId;

                  return (
                    <Fragment key={rule.ruleId}>
                      <tr
                        className={rule.ruleId === selectedRuleId ? "bg-[var(--surface-hover)]" : undefined}
                      >
                        <td className="w-[44px]">
                          <button
                            aria-label={isExpanded ? "Collapse rule" : "Expand rule"}
                            className="button-ghost px-2.5"
                            onClick={() =>
                              setExpandedRuleId((current) =>
                                current === rule.ruleId ? null : rule.ruleId,
                              )
                            }
                            type="button"
                          >
                            {isExpanded ? (
                              <ChevronDown size={14} absoluteStrokeWidth />
                            ) : (
                              <ChevronRight size={14} absoluteStrokeWidth />
                            )}
                          </button>
                        </td>
                        <td>
                          <div className="text-sm font-semibold">{rule.name}</div>
                          <div className="mt-1 text-xs text-[var(--muted)]">
                            {rule.ruleId} | {rule.appliesTo}
                          </div>
                        </td>
                        <td>
                          <StatusBadge label={rule.status} tone={getStatusTone(rule.status)} />
                        </td>
                        <td>
                          <StatusBadge label={formatRuleLabel(rule.action)} tone={rule.action} />
                        </td>
                        <td className="mono text-sm">{rule.freezeThreshold}</td>
                        <td className="mono text-xs text-[var(--muted)]">{rule.version}</td>
                        <td>
                          <button
                            className="button-secondary"
                            onClick={() => openBuilder(rule)}
                            type="button"
                          >
                            <Settings2 size={14} absoluteStrokeWidth />
                            Open builder
                          </button>
                        </td>
                      </tr>
                      {isExpanded ? (
                        <tr>
                          <td colSpan={7} className="bg-[var(--surface-strong)] px-4 py-4">
                            <div className="grid gap-3 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
                              <div className="grid gap-2">
                                <div className="text-[11px] uppercase tracking-[0.08em] text-[var(--muted)]">
                                  Rationale
                                </div>
                                <div className="text-sm text-[var(--muted-strong)]">
                                  {rule.rationale}
                                </div>
                                <div className="rounded-[8px] border border-[var(--line)] bg-[var(--surface)] px-3 py-2">
                                  <div className="text-[11px] uppercase tracking-[0.08em] text-[var(--muted)]">
                                    Rule expression
                                  </div>
                                  <div className="mono mt-2 text-xs text-[var(--muted-strong)]">
                                    {buildRuleExpression(rule)}
                                  </div>
                                </div>
                              </div>

                              <div className="grid gap-2">
                                <div className="text-[11px] uppercase tracking-[0.08em] text-[var(--muted)]">
                                  Conditions
                                </div>
                                {rule.conditions.map((condition) => (
                                  <div
                                    key={condition.clauseId}
                                    className="rounded-[8px] border border-[var(--line)] bg-[var(--surface)] px-3 py-2"
                                  >
                                    <div className="flex flex-wrap items-center gap-2 text-sm font-semibold">
                                      <span className="mono">:{condition.variableName}</span>
                                      <span>{condition.operator}</span>
                                      <span className="mono">{condition.value}</span>
                                    </div>
                                    <div className="mt-1 text-xs text-[var(--muted)]">
                                      {condition.hint}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      ) : null}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        compact
        title="Replay output"
        subtitle="Same seed, deterministic result, visible tradeoff. Replay only changes when the user presses replay."
      >
        <div className="panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="dense-table min-w-[860px]">
              <thead>
                <tr>
                  <th>Scenario</th>
                  <th>Before</th>
                  <th>After</th>
                  <th>Impact</th>
                </tr>
              </thead>
              <tbody>
                {replayRows.map((scenario) => (
                  <tr key={scenario.scenarioId}>
                    <td className="text-sm font-semibold">{scenario.label}</td>
                    <td>
                      <StatusBadge
                        label={formatRuleLabel(scenario.beforeAction)}
                        tone={scenario.beforeAction}
                      />
                    </td>
                    <td>
                      <StatusBadge
                        label={formatRuleLabel(scenario.afterAction)}
                        tone={scenario.afterAction}
                      />
                    </td>
                    <td className="text-sm text-[var(--muted)]">{scenario.impact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        compact
        title="Variable registry"
        subtitle="This is the allowed field catalog. The builder and AI draft flow both clamp to this list."
      >
        <div className="panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="dense-table min-w-[820px]">
              <thead>
                <tr>
                  <th>Variable</th>
                  <th>Type</th>
                  <th>Lookback</th>
                  <th>Source</th>
                  <th>Transform</th>
                </tr>
              </thead>
              <tbody>
                {workspaceState.variableDefinitions.map((variable) => (
                  <tr key={variable.name}>
                    <td>
                      <div className="mono text-sm">:{variable.name}</div>
                      <div className="mt-1 text-xs text-[var(--muted)]">
                        {variable.description}
                      </div>
                    </td>
                    <td>
                      <StatusBadge label={variable.type} tone="MEDIUM" />
                    </td>
                    <td className="text-sm">{variable.lookbackWindow}</td>
                    <td className="text-sm text-[var(--muted)]">
                      {variable.sourceFields.join(", ")}
                    </td>
                    <td className="mono text-xs">{variable.transform}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </SectionCard>

      <Sheet
        open={builderOpen}
        onClose={() => setBuilderOpen(false)}
        title={rules.some((rule) => rule.ruleId === draftRule.ruleId) ? "Rule builder" : "Add rule"}
        subtitle="Use plain English to draft a rule, then adjust the typed fields below. Only valid actions, variables, operators, and values are allowed."
        variant="modal"
      >
        <div className="grid gap-3">
          <div className="rounded-[10px] border border-[var(--line)] bg-[var(--surface-subtle)] px-3 py-3">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <Bot size={15} absoluteStrokeWidth />
              Text to rule
            </div>
            <div className="text-xs text-[var(--muted)]">
              Describe the rule in plain English. The draft is clamped to existing enums and variable definitions, so it cannot invent fake operators or fields.
            </div>
            <textarea
              className="mt-3 min-h-[96px] w-full rounded-[8px] border border-[var(--line)] bg-[var(--surface)] px-3 py-2 outline-none"
              onChange={(event) => setPlainEnglishDraft(event.target.value)}
              placeholder="Example: freeze transfer-enabled wallets when the device is new, PIN reset happened in 24h, and amount ratio is above 5."
              value={plainEnglishDraft}
            />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs text-[var(--muted)]">
                {builderMessage ?? "Generated drafts stay inside the same schema as the manual builder."}
              </div>
              <button
                className="button-secondary"
                onClick={generateDraftFromText}
                type="button"
                disabled={pendingAction !== null}
              >
                <Bot size={14} absoluteStrokeWidth />
                {pendingAction === "generate" ? "Drafting rule..." : "Draft from text"}
              </button>
            </div>
          </div>

          <div className="grid gap-2 lg:grid-cols-3">
            <div className="rounded-[10px] border border-[var(--line)] bg-[var(--surface-subtle)] px-3 py-3">
              <div className="text-[11px] uppercase tracking-[0.08em] text-[var(--muted)]">
                Status
              </div>
              <div className="mt-2">
                <StatusBadge label={draftRule.status} tone={getStatusTone(draftRule.status)} />
              </div>
            </div>
            <div className="rounded-[10px] border border-[var(--line)] bg-[var(--surface-subtle)] px-3 py-3">
              <div className="text-[11px] uppercase tracking-[0.08em] text-[var(--muted)]">
                Replay
              </div>
              <div className="mt-2">
                {hasPendingChanges ? (
                  <StatusBadge label="Pending replay" tone="PENDING_USER" />
                ) : (
                  <StatusBadge label="Replay synced" tone="DELIVERED" />
                )}
              </div>
            </div>
            <div className="rounded-[10px] border border-[var(--line)] bg-[var(--surface-subtle)] px-3 py-3">
              <div className="text-[11px] uppercase tracking-[0.08em] text-[var(--muted)]">
                Version
              </div>
              <div className="mono mt-2 text-sm">{draftRule.version}</div>
            </div>
          </div>

          <div className="grid gap-2 lg:grid-cols-3">
            <label className="grid gap-1 text-sm">
              <span className="text-[var(--muted)]">Rule name</span>
              <input
                className="rounded-[8px] border border-[var(--line)] bg-[var(--surface-subtle)] px-3 py-2 outline-none"
                onChange={(event) =>
                  updateDraftRule((rule) => ({
                    ...rule,
                    name: event.target.value,
                  }))
                }
                value={draftRule.name}
              />
            </label>

            <label className="grid gap-1 text-sm">
              <span className="text-[var(--muted)]">Action</span>
              <select
                className="rounded-[8px] border border-[var(--line)] bg-[var(--surface-subtle)] px-3 py-2 outline-none"
                onChange={(event) =>
                  updateDraftRule((rule) => ({
                    ...rule,
                    action: event.target.value as RuleDefinition["action"],
                  }))
                }
                value={draftRule.action}
              >
                {ruleActionOptions.map((action) => (
                  <option key={action} value={action}>
                    {formatRuleLabel(action)}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-1 text-sm">
              <span className="text-[var(--muted)]">Status</span>
              <select
                className="rounded-[8px] border border-[var(--line)] bg-[var(--surface-subtle)] px-3 py-2 outline-none"
                onChange={(event) =>
                  updateDraftRule((rule) => ({
                    ...rule,
                    status: event.target.value as RuleDefinition["status"],
                  }))
                }
                value={draftRule.status}
              >
                {ruleStatusOptions.map((status) => (
                  <option key={status} value={status}>
                    {formatRuleLabel(status)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-2 lg:grid-cols-3">
            <label className="grid gap-1 text-sm">
              <span className="text-[var(--muted)]">Applies to</span>
              <input
                className="rounded-[8px] border border-[var(--line)] bg-[var(--surface-subtle)] px-3 py-2 outline-none"
                onChange={(event) =>
                  updateDraftRule((rule) => ({
                    ...rule,
                    appliesTo: event.target.value,
                  }))
                }
                value={draftRule.appliesTo}
              />
            </label>

            <label className="grid gap-1 text-sm">
              <span className="text-[var(--muted)]">Owner</span>
              <input
                className="rounded-[8px] border border-[var(--line)] bg-[var(--surface-subtle)] px-3 py-2 outline-none"
                onChange={(event) =>
                  updateDraftRule((rule) => ({
                    ...rule,
                    owner: event.target.value,
                  }))
                }
                value={draftRule.owner}
              />
            </label>

            <label className="grid gap-1 text-sm">
              <span className="text-[var(--muted)]">Version</span>
              <input
                className="rounded-[8px] border border-[var(--line)] bg-[var(--surface-subtle)] px-3 py-2 outline-none"
                onChange={(event) =>
                  updateDraftRule((rule) => ({
                    ...rule,
                    version: event.target.value,
                  }))
                }
                value={draftRule.version}
              />
            </label>
          </div>

          <label className="grid gap-1 text-sm">
            <span className="text-[var(--muted)]">Rationale</span>
            <textarea
              className="min-h-[92px] rounded-[8px] border border-[var(--line)] bg-[var(--surface-subtle)] px-3 py-2 outline-none"
              onChange={(event) =>
                updateDraftRule((rule) => ({
                  ...rule,
                  rationale: event.target.value,
                }))
              }
              value={draftRule.rationale}
            />
          </label>

          <div className="grid gap-2 lg:grid-cols-[minmax(0,1fr)_120px]">
            <label className="grid gap-1 text-sm">
              <span className="text-[var(--muted)]">Freeze threshold</span>
              <input
                className="w-full accent-[var(--accent)]"
                max={90}
                min={75}
                onChange={(event) =>
                  updateDraftRule((rule) => ({
                    ...rule,
                    freezeThreshold: clampFreezeThreshold(Number(event.target.value)),
                  }))
                }
                step={1}
                type="range"
                value={draftRule.freezeThreshold}
              />
            </label>

            <label className="grid gap-1 text-sm">
              <span className="text-[var(--muted)]">Score</span>
              <input
                className="rounded-[8px] border border-[var(--line)] bg-[var(--surface-subtle)] px-3 py-2 outline-none"
                max={90}
                min={75}
                onChange={(event) =>
                  updateDraftRule((rule) => ({
                    ...rule,
                    freezeThreshold: clampFreezeThreshold(Number(event.target.value)),
                  }))
                }
                type="number"
                value={draftRule.freezeThreshold}
              />
            </label>
          </div>

          <div className="grid gap-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="text-sm font-semibold">Conditions</div>
                <div className="text-xs text-[var(--muted)]">
                  Operators and values are constrained by the selected variable type.
                </div>
              </div>

              <button
                className="button-secondary"
                onClick={() =>
                  updateDraftRule((rule) => ({
                    ...rule,
                    conditions: [
                      ...rule.conditions,
                      createConditionDraft(
                        workspaceState,
                        nextClauseId(rule),
                        workspaceState.variableDefinitions[0]?.name,
                      ),
                    ],
                  }))
                }
                type="button"
              >
                <CirclePlus size={14} absoluteStrokeWidth />
                Add clause
              </button>
            </div>

            <div className="grid gap-2">
              {draftRule.conditions.map((condition, index) => {
                const variable = getVariableDefinition(workspaceState, condition.variableName);
                const operatorOptions = getOperatorOptionsForVariable(
                  workspaceState,
                  condition.variableName,
                );
                const isBoolean = variable?.type === "BOOLEAN";

                return (
                  <div
                    key={condition.clauseId}
                    className="rounded-[10px] border border-[var(--line)] bg-[var(--surface-subtle)] px-3 py-3"
                  >
                    <div className="grid gap-2 xl:grid-cols-[minmax(0,1.3fr)_110px_160px_minmax(0,1fr)_44px]">
                      <label className="grid gap-1 text-sm">
                        <span className="text-[var(--muted)]">Variable</span>
                        <select
                          className="w-full rounded-[8px] border border-[var(--line)] bg-[var(--surface)] px-3 py-2 outline-none"
                          onChange={(event) => {
                            const nextVariableName = event.target.value;

                            updateDraftCondition(index, (current) => ({
                              ...current,
                              variableName: nextVariableName,
                              operator:
                                getOperatorOptionsForVariable(workspaceState, nextVariableName)[0] ??
                                "=",
                              value: getDefaultValueForVariable(workspaceState, nextVariableName),
                              hint:
                                getVariableDefinition(workspaceState, nextVariableName)?.description ??
                                current.hint,
                            }));
                          }}
                          value={condition.variableName}
                        >
                          {workspaceState.variableDefinitions.map((variableDefinition) => (
                            <option key={variableDefinition.name} value={variableDefinition.name}>
                              :{variableDefinition.name}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="grid gap-1 text-sm">
                        <span className="text-[var(--muted)]">Operator</span>
                        <select
                          className="w-full rounded-[8px] border border-[var(--line)] bg-[var(--surface)] px-3 py-2 outline-none"
                          onChange={(event) =>
                            updateDraftCondition(index, (current) => ({
                              ...current,
                              operator: event.target.value as RuleCondition["operator"],
                            }))
                          }
                          value={condition.operator}
                        >
                          {operatorOptions.map((operator) => (
                            <option key={operator} value={operator}>
                              {operator}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="grid gap-1 text-sm">
                        <span className="text-[var(--muted)]">Value</span>
                        {isBoolean ? (
                          <select
                            className="w-full rounded-[8px] border border-[var(--line)] bg-[var(--surface)] px-3 py-2 outline-none"
                            onChange={(event) =>
                              updateDraftCondition(index, (current) => ({
                                ...current,
                                value: event.target.value,
                              }))
                            }
                            value={condition.value}
                          >
                            <option value="true">true</option>
                            <option value="false">false</option>
                          </select>
                        ) : (
                          <input
                            className="w-full rounded-[8px] border border-[var(--line)] bg-[var(--surface)] px-3 py-2 outline-none"
                            onChange={(event) =>
                              updateDraftCondition(index, (current) => ({
                                ...current,
                                value: event.target.value,
                              }))
                            }
                            step={variable?.type === "RATIO" ? "0.1" : "1"}
                            type="number"
                            value={condition.value}
                          />
                        )}
                      </label>

                      <div className="grid gap-1 text-sm">
                        <span className="text-[var(--muted)]">Hint</span>
                        <div className="min-h-[44px] rounded-[8px] border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-[var(--muted-strong)]">
                          {condition.hint}
                        </div>
                      </div>

                      <button
                        className="button-ghost mt-6 px-2.5"
                        onClick={() =>
                          updateDraftRule((rule) => ({
                            ...rule,
                            conditions: rule.conditions.filter(
                              (_, conditionIndex) => conditionIndex !== index,
                            ),
                          }))
                        }
                        type="button"
                      >
                        <Trash2 size={14} absoluteStrokeWidth />
                      </button>
                    </div>

                    <div className="mt-2 text-xs text-[var(--muted)]">
                      Type: {variable?.type ?? "Unknown"} | Lookback: {variable?.lookbackWindow ?? "n/a"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[10px] border border-[var(--line)] bg-[var(--surface-subtle)] px-3 py-3">
            <div className="text-[11px] uppercase tracking-[0.08em] text-[var(--muted)]">
              Draft expression
            </div>
            <div className="mono mt-2 text-xs text-[var(--muted-strong)]">
              {buildRuleExpression(draftRule)}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-xs text-[var(--muted)]">
              {savedAt ? `Draft saved ${savedAt}. ` : ""}
              {replayedAt ? `Last replay ${replayedAt}.` : ""}
            </div>

            <div className="flex flex-wrap gap-1.5">
              <button
                className="button-secondary"
                onClick={replayDraft}
                type="button"
                disabled={pendingAction !== null}
              >
                <Play size={14} absoluteStrokeWidth />
                {pendingAction === "replay" ? "Replaying..." : "Replay draft"}
              </button>
              <button
                className="button-primary"
                onClick={saveDraft}
                type="button"
                disabled={pendingAction !== null}
              >
                <Save size={14} absoluteStrokeWidth />
                {pendingAction === "save" ? "Saving..." : "Keep draft"}
              </button>
            </div>
          </div>
        </div>
      </Sheet>
    </div>
  );
}
