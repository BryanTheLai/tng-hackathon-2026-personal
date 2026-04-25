"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCheck,
  FileText,
  Files,
  MessageCircleReply,
  Lock,
  MessageSquareShare,
  Scale,
  Send,
  ShieldAlert,
  Timer,
} from "lucide-react";

import { SectionCard } from "@/components/ui/section-card";
import { MarkdownContent } from "@/components/ui/markdown-content";
import { Sheet } from "@/components/ui/sheet";
import { StatusBadge } from "@/components/ui/status-badge";
import type { CaseRecord } from "@/lib/domain/schema";
import { cn } from "@/lib/utils";

type SheetKind = "score" | "evidence" | "policy" | "note" | null;
type PendingAction =
  | "apply"
  | "override"
  | "export"
  | "generate-explanation"
  | "draft-note"
  | "send-live-prompt"
  | "simulate-reply"
  | null;

function formatLabel(value: string) {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDisposition(value: string) {
  return value.toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatPromptStateLabel(value: CaseRecord["prompt"]["state"]) {
  if (value === "USER_REPLIED_OTHER") {
    return "Reply received";
  }

  if (value === "USER_REPLIED_TNG_LOGIN") {
    return "/tng-login received";
  }

  return formatLabel(value);
}

function formatReplyTimestamp(value?: string) {
  if (!value) {
    return null;
  }

  return new Intl.DateTimeFormat("en-MY", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(value));
}

export function CaseScreen({ record: initialRecord }: { record: CaseRecord }) {
  const router = useRouter();
  const [record, setRecord] = useState(initialRecord);
  const [sheet, setSheet] = useState<SheetKind>(null);
  const [reportContent, setReportContent] = useState(initialRecord.exportNote);
  const [generatedExplanation, setGeneratedExplanation] = useState<string | null>(null);
  const [generatedNote, setGeneratedNote] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [isPromptReplyFlash, setIsPromptReplyFlash] = useState(false);
  const previousInboundMarkerRef = useRef(
    initialRecord.prompt.lastInboundMessageSid ?? initialRecord.prompt.lastInboundAt ?? "__none__",
  );
  const hasInitializedInboundWatcherRef = useRef(false);
  const replyFlashTimeoutRef = useRef<number | null>(null);
  const confidence = Math.round(record.recommendation.confidence * 100);
  const isSeededPrompt =
    record.prompt.state === "SIMULATED" ||
    record.prompt.messageSid?.startsWith("SIM-MSG") === true;
  const latestAuditEvents = [...record.auditEvents].slice(-3).reverse();
  const hasInboundReply = Boolean(record.prompt.lastInboundAt && record.prompt.lastInboundBody);
  const isAwaitingReply = record.resolutionState === "PENDING_USER" && !hasInboundReply;

  useEffect(() => {
    let isActive = true;

    const refreshCase = async () => {
      try {
        const response = await fetch(`/api/cases/${initialRecord.caseId}`, { cache: "no-store" });

        if (!response.ok || !isActive) {
          return;
        }

        const nextRecord = (await response.json()) as CaseRecord;
        setRecord(nextRecord);
        setReportContent(nextRecord.exportNote);
      } catch {
        // Ignore transient polling failures in the seeded demo.
      }
    };

    const intervalId = window.setInterval(() => {
      void refreshCase();
    }, 3000);

    return () => {
      isActive = false;
      window.clearInterval(intervalId);
    };
  }, [initialRecord.caseId]);

  useEffect(() => {
    const inboundMarker =
      record.prompt.lastInboundMessageSid ?? record.prompt.lastInboundAt ?? "__none__";

    if (!hasInitializedInboundWatcherRef.current) {
      hasInitializedInboundWatcherRef.current = true;
      previousInboundMarkerRef.current = inboundMarker;
      return;
    }

    if (previousInboundMarkerRef.current !== inboundMarker && inboundMarker !== "__none__") {
      setIsPromptReplyFlash(true);

      if (replyFlashTimeoutRef.current) {
        window.clearTimeout(replyFlashTimeoutRef.current);
      }

      replyFlashTimeoutRef.current = window.setTimeout(() => {
        setIsPromptReplyFlash(false);
        replyFlashTimeoutRef.current = null;
      }, 8000);
    }

    previousInboundMarkerRef.current = inboundMarker;
  }, [record.prompt.lastInboundAt, record.prompt.lastInboundMessageSid]);

  useEffect(() => {
    return () => {
      if (replyFlashTimeoutRef.current) {
        window.clearTimeout(replyFlashTimeoutRef.current);
      }
    };
  }, []);

  const mutateCase = async (url: string, payload?: unknown) => {
    const response = await fetch(url, {
      method: "POST",
      headers: payload ? { "Content-Type": "application/json" } : undefined,
      body: payload ? JSON.stringify(payload) : undefined,
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  };

  const handleApplyRecommended = async () => {
    setPendingAction("apply");

    try {
      const nextRecord = await mutateCase(`/api/cases/${record.caseId}/action`, {
        action: record.recommendation.action,
        actor: "Fraud analyst",
      });
      setRecord(nextRecord);
      setReportContent(nextRecord.exportNote);
      router.refresh();
    } finally {
      setPendingAction(null);
    }
  };

  const handleOverride = async (option: CaseRecord["recommendation"]["humanOverrideOptions"][number]) => {
    const overrideReason = window.prompt(`Why override to ${formatLabel(option)}?`);

    if (!overrideReason) {
      return;
    }

    setPendingAction("override");

    try {
      const nextRecord = await mutateCase(`/api/cases/${record.caseId}/override`, {
        overrideAction: option,
        overrideReason,
        actor: "Fraud analyst",
      });
      setRecord(nextRecord);
      setReportContent(nextRecord.exportNote);
      router.refresh();
    } finally {
      setPendingAction(null);
    }
  };

  const handleExportReport = async () => {
    setPendingAction("export");

    try {
      const result = await mutateCase(`/api/cases/${record.caseId}/report`, {
        format: "MARKDOWN",
      });
      setReportContent(result.content);
      setSheet("note");
    } finally {
      setPendingAction(null);
    }
  };

  const handleGenerateExplanation = async () => {
    setPendingAction("generate-explanation");

    try {
      const result = await mutateCase(`/api/cases/${record.caseId}/generate-explanation`);
      setGeneratedExplanation(result.explanation);
      setSheet("evidence");
    } finally {
      setPendingAction(null);
    }
  };

  const handleDraftNote = async () => {
    setPendingAction("draft-note");

    try {
      const result = await mutateCase(`/api/cases/${record.caseId}/draft-note`);
      setGeneratedNote(result.note);
      setReportContent(result.note);
      setSheet("note");
    } finally {
      setPendingAction(null);
    }
  };

  const handleSimulateReply = async () => {
    const inboundBody = window.prompt(
      "Customer reply body",
      record.prompt.lastInboundBody ?? "/tng-login",
    );

    if (inboundBody === null) {
      return;
    }

    const trimmedInboundBody = inboundBody.trim();

    if (!trimmedInboundBody) {
      window.alert("Reply body cannot be empty.");
      return;
    }

    setPendingAction("simulate-reply");

    try {
      const formData = new FormData();
      formData.set("MessageSid", `SIM-IN-${Date.now()}`);
      formData.set("Body", trimmedInboundBody);
      formData.set("CaseId", record.caseId);
      const response = await fetch("/api/webhooks/twilio/inbound", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const refreshed = await fetch(`/api/cases/${record.caseId}`, { cache: "no-store" });
      const nextRecord = await refreshed.json();
      setRecord(nextRecord);
      setReportContent(nextRecord.exportNote);
      router.refresh();
    } finally {
      setPendingAction(null);
    }
  };

  const handleSendLivePrompt = async () => {
    setPendingAction("send-live-prompt");

    try {
      const response = await fetch(`/api/cases/${record.caseId}/prompt/live`, {
        method: "POST",
      });

      if (!response.ok) {
        const message =
          ((await response.json().catch(async () => ({ message: await response.text() }))) as {
            message?: string;
          }).message ?? "Live WhatsApp resend failed.";

        const refreshed = await fetch(`/api/cases/${record.caseId}`, { cache: "no-store" });
        if (refreshed.ok) {
          const nextRecord = await refreshed.json();
          setRecord(nextRecord);
          setReportContent(nextRecord.exportNote);
        }

        throw new Error(message);
      }

      const nextRecord = await response.json();
      setRecord(nextRecord);
      setReportContent(nextRecord.exportNote);
      router.refresh();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Live WhatsApp resend failed.");
    } finally {
      setPendingAction(null);
    }
  };

  return (
    <div className="grid gap-3 xl:grid-cols-[minmax(0,1.18fr)_360px]">
      <div className="flex min-w-0 flex-col gap-3">
        <SectionCard
          compact
          title={`${record.caseId} | ${record.maskedUserLabel}`}
          subtitle={`${record.segmentLabel} | ${record.walletLabel} | ${record.regionLabel}`}
          action={
            <div className="flex flex-wrap gap-1.5">
              <button
                className="button-secondary"
                onClick={() => setSheet("score")}
                type="button"
                disabled={pendingAction !== null}
              >
                <Scale size={14} absoluteStrokeWidth />
                Score logic
              </button>
              <button
                className="button-secondary"
                onClick={() => setSheet("evidence")}
                type="button"
                disabled={pendingAction !== null}
              >
                <Files size={14} absoluteStrokeWidth />
                Evidence pack
              </button>
              <button
                className="button-secondary"
                onClick={() => setSheet("policy")}
                type="button"
                disabled={pendingAction !== null}
              >
                <Lock size={14} absoluteStrokeWidth />
                Policy basis
              </button>
              <button
                className="button-secondary"
                onClick={handleGenerateExplanation}
                type="button"
                disabled={pendingAction !== null}
              >
                <Files size={14} absoluteStrokeWidth />
                {pendingAction === "generate-explanation"
                  ? "Generating analyst brief..."
                  : "Generate analyst brief"}
              </button>
            </div>
          }
        >
          <div className="grid gap-2 md:grid-cols-4">
            <div className="rounded-[10px] border border-[var(--line)] bg-[var(--surface-contrast)] px-3 py-3 text-white">
              <div className="text-[11px] uppercase tracking-[0.08em] text-white/70">Score</div>
              <div className="mt-2 text-3xl font-semibold tracking-tight">{record.score}</div>
            </div>
            <div className="rounded-[10px] border border-[var(--line)] bg-[var(--surface-subtle)] px-3 py-3">
              <div className="text-[11px] uppercase tracking-[0.08em] text-[var(--muted)]">
                Recommendation
              </div>
              <div className="mt-2">
                <StatusBadge
                  label={formatLabel(record.recommendation.action)}
                  tone={record.recommendation.action}
                />
              </div>
            </div>
            <div className="rounded-[10px] border border-[var(--line)] bg-[var(--surface-subtle)] px-3 py-3">
              <div className="text-[11px] uppercase tracking-[0.08em] text-[var(--muted)]">
                Prompt
              </div>
              <div className="mt-2">
                <StatusBadge label={formatLabel(record.prompt.state)} tone={record.prompt.state} />
              </div>
            </div>
            <div className="rounded-[10px] border border-[var(--line)] bg-[var(--surface-subtle)] px-3 py-3">
              <div className="text-[11px] uppercase tracking-[0.08em] text-[var(--muted)]">
                Resolution
              </div>
              <div className="mt-2">
                <StatusBadge
                  label={formatLabel(record.resolutionState)}
                  tone={record.resolutionState}
                />
              </div>
            </div>
          </div>
        </SectionCard>

        <div className="grid gap-3 lg:grid-cols-[minmax(0,1.06fr)_minmax(0,0.94fr)]">
          <SectionCard
            compact
            title="What happened"
            subtitle="Timeline first. Then what was attempted. Then what is still missing."
          >
            <div className="panel overflow-hidden">
              <table className="dense-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Event</th>
                    <th>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {record.timeline.map((event) => (
                    <tr key={event.eventId}>
                      <td className="mono text-xs">{event.occurredAt}</td>
                      <td>
                        <div className="text-sm font-semibold">{event.label}</div>
                        <div className="mt-1 text-xs text-[var(--muted)]">{event.details}</div>
                      </td>
                      <td>
                        <StatusBadge
                          label={event.succeeded === false ? "Blocked" : "Completed"}
                          tone={event.succeeded === false ? "BLOCKED" : "REACTIVATED"}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-3 grid gap-2 md:grid-cols-2">
              <div className="rounded-[10px] border border-[var(--line)] bg-[var(--surface-subtle)] px-3 py-3">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                  <ShieldAlert size={15} absoluteStrokeWidth />
                  Suspicious actions
                </div>
                <div className="space-y-2">
                  {record.suspiciousActions.map((action) => (
                    <div key={action.actionId}>
                      <div className="text-sm font-semibold">
                        {action.label} | {action.amountLabel}
                      </div>
                      <div className="text-xs text-[var(--muted)]">{action.note}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[10px] border border-[var(--line)] bg-[var(--surface-subtle)] px-3 py-3">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                  <Timer size={15} absoluteStrokeWidth />
                  Missing data
                </div>
                <div className="space-y-2">
                  {record.missingData.map((item) => (
                    <div key={item} className="text-sm text-[var(--muted-strong)]">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            compact
            title="Why this case is high-risk"
            subtitle="Keep the proof tight. Facts first, interpretation second, network signals after that."
          >
            <div className="grid gap-2">
              <div className="grid gap-2 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
                <div className="grid gap-2">
                  <div className="rounded-[10px] border border-[var(--line)] bg-[var(--surface-subtle)] px-3 py-3">
                    <div className="text-[11px] uppercase tracking-[0.08em] text-[var(--muted)]">
                      Facts
                    </div>
                    <div className="mt-2 space-y-2 text-sm">
                      {record.facts.map((fact) => (
                        <div key={fact}>{fact}</div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[10px] border border-[var(--line)] bg-[var(--surface-subtle)] px-3 py-3">
                    <div className="text-[11px] uppercase tracking-[0.08em] text-[var(--muted)]">
                      Analyst assessment
                    </div>
                    <div className="mt-2 space-y-2 text-sm">
                      {record.aiInferences.map((item) => (
                        <div key={item}>{item}</div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="rounded-[10px] border border-[var(--line)] bg-[var(--surface-subtle)] px-3 py-3">
                  <div className="text-[11px] uppercase tracking-[0.08em] text-[var(--muted)]">
                    Session changes
                  </div>
                  <div className="mt-2 grid gap-2 md:grid-cols-2">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
                        Account
                      </div>
                      <div className="mt-2 space-y-2 text-sm text-[var(--muted-strong)]">
                        {record.accountChanges.map((item) => (
                          <div key={item}>{item}</div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
                        Device
                      </div>
                      <div className="mt-2 space-y-2 text-sm text-[var(--muted-strong)]">
                        {record.deviceChanges.map((item) => (
                          <div key={item}>{item}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="panel overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="dense-table min-w-[760px]">
                    <thead>
                      <tr>
                        <th>IP signal</th>
                        <th>Geo / ASN</th>
                        <th>Flags</th>
                        <th>Linked cases</th>
                      </tr>
                    </thead>
                    <tbody>
                      {record.networkObservations.map((observation) => (
                        <tr key={observation.observationId}>
                          <td className="w-[30%]">
                            <div className="mono text-sm font-semibold">{observation.ipAddress}</div>
                            <div className="mt-1 text-xs text-[var(--muted)]">{observation.label}</div>
                            <div className="mt-2 text-xs text-[var(--muted-strong)]">{observation.note}</div>
                          </td>
                          <td className="w-[24%]">
                            <div className="text-sm">{observation.geoLabel}</div>
                            <div className="mt-1 text-xs text-[var(--muted)]">{observation.asnLabel}</div>
                          </td>
                          <td className="w-[22%]">
                            <div className="flex flex-wrap gap-1.5">
                              <StatusBadge label={observation.reputation} tone={observation.reputation} />
                              <StatusBadge
                                label={formatDisposition(observation.disposition)}
                                tone={
                                  observation.disposition === "BLOCKED"
                                    ? "BLOCKED"
                                    : observation.disposition === "WATCH"
                                      ? "PENDING_USER"
                                      : "ALLOW"
                                }
                              />
                            </div>
                          </td>
                          <td className="w-[24%] text-sm text-[var(--muted-strong)]">
                            {observation.linkedCaseIds.join(", ")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {record.linkedEntities.length > 0 ? (
                <div className="panel overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="dense-table min-w-[680px]">
                      <thead>
                        <tr>
                          <th>Linked entity</th>
                          <th>Relationship</th>
                          <th>Risk note</th>
                        </tr>
                      </thead>
                      <tbody>
                        {record.linkedEntities.map((entity) => (
                          <tr key={entity.entityId}>
                            <td>
                              <div className="text-sm font-semibold">{entity.label}</div>
                              <div className="mt-1 text-xs text-[var(--muted)]">
                                {entity.entityType}
                              </div>
                            </td>
                            <td className="text-sm">{entity.relationship}</td>
                            <td className="text-sm text-[var(--muted)]">{entity.riskNote}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : null}
            </div>
          </SectionCard>
        </div>

        <SectionCard
          compact
          title="Evidence register"
          subtitle="Move the bulky cards into a proper table so operators can scan source and policy coverage faster."
        >
          <div className="panel overflow-hidden">
            <div className="overflow-x-auto">
              <table className="dense-table min-w-[900px]">
                <thead>
                  <tr>
                    <th>Evidence</th>
                    <th>Kind</th>
                    <th>Source</th>
                    <th>Policy</th>
                  </tr>
                </thead>
                <tbody>
                  {record.evidenceItems.map((item) => (
                    <tr key={item.evidenceId}>
                      <td>
                        <div className="text-sm font-semibold">{item.title}</div>
                        <div className="mt-1 text-xs text-[var(--muted)]">{item.summary}</div>
                      </td>
                      <td>
                        <StatusBadge label={item.kind} tone={item.kind === "POLICY" ? "REVIEW" : "MEDIUM"} />
                      </td>
                      <td>
                        <div className="mono text-xs">{item.source}</div>
                        <div className="mt-1 text-xs text-[var(--muted)]">{item.observedAt}</div>
                      </td>
                      <td className="text-sm text-[var(--muted-strong)]">
                        {item.policyIds.join(", ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="flex flex-col gap-3 xl:sticky xl:top-3 xl:self-start">
        <SectionCard
          compact
          title="Decision rail"
        >
          <div className="grid gap-2">
            <div className="rounded-[10px] border border-[var(--line)] bg-[var(--surface-contrast)] px-3 py-3 text-white">
              <div className="text-[11px] uppercase tracking-[0.08em] text-white/70">
                Recommended action
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="mt-2 text-sm font-semibold">
                  {formatLabel(record.recommendation.action)}
                </div>
                <div className="mt-2 mono text-xs">{confidence}%</div>
              </div>
              <div className="mt-3 h-1.5 bg-white/10">
                <div
                  className="h-full bg-[var(--tng-orange)]"
                  style={{ width: `${confidence}%` }}
                />
              </div>
              <div className="mt-3 text-xs leading-5 text-white/78">
                {record.recommendation.rationale}
              </div>
            </div>

            <div className="grid gap-2">
              <button
                className="button-primary justify-between"
                onClick={() => void handleApplyRecommended()}
                type="button"
                disabled={pendingAction !== null}
              >
                <span>{pendingAction === "apply" ? "Applying..." : "Apply recommendation"}</span>
                <CheckCheck size={14} absoluteStrokeWidth />
              </button>
              <button
                className="button-secondary justify-between"
                onClick={() => void handleExportReport()}
                type="button"
                disabled={pendingAction !== null}
              >
                <span>{pendingAction === "export" ? "Exporting..." : "Export note"}</span>
                <FileText size={14} absoluteStrokeWidth />
              </button>
              <button
                className="button-danger justify-between"
                onClick={() => void handleDraftNote()}
                type="button"
                disabled={pendingAction !== null}
              >
                <span>{pendingAction === "draft-note" ? "Drafting note..." : "Draft note with AI"}</span>
                <MessageSquareShare size={14} absoluteStrokeWidth />
              </button>
            </div>

            <div
              className={cn(
                "rounded-[10px] border border-[var(--line)] bg-[var(--surface-subtle)] px-3 py-3 transition-[border-color,box-shadow] duration-[3000ms]",
                isPromptReplyFlash && "reply-received-flash",
              )}
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <div className="text-[11px] uppercase tracking-[0.08em] text-[var(--muted)]">
                  Customer prompt
                </div>
                <Send size={13} className="text-[var(--muted)]" absoluteStrokeWidth />
              </div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <StatusBadge
                  label={formatPromptStateLabel(record.prompt.state)}
                  tone={record.prompt.state}
                />
                {isAwaitingReply ? (
                  <StatusBadge label="Awaiting reply" tone="PENDING_USER" />
                ) : null}
                {record.resolutionState === "PENDING_USER" && hasInboundReply ? (
                  <StatusBadge label="Reply logged" tone="USER_REPLIED_OTHER" />
                ) : null}
                {isSeededPrompt ? (
                  <StatusBadge label="Seeded demo prompt" tone="SIMULATED" />
                ) : null}
              </div>
              {isSeededPrompt ? (
                <div className="mb-2 text-xs text-[var(--muted-strong)]">
                  This case is still carrying a seeded demo prompt. Twilio did not send that original
                  message.
                </div>
              ) : null}
              <div className="text-sm">{record.prompt.messagePreview}</div>
              {hasInboundReply ? (
                <div className="mt-3 rounded-[8px] border border-[#ddd6fe] bg-[#faf5ff] px-3 py-3">
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <div className="text-[11px] uppercase tracking-[0.08em] text-[#6d28d9]">
                      Latest customer reply
                    </div>
                    <div className="text-xs font-medium text-[#7c3aed]">
                      {formatReplyTimestamp(record.prompt.lastInboundAt)}
                    </div>
                  </div>
                  <div className="mono text-sm font-semibold text-[#4c1d95]">
                    {record.prompt.lastInboundBody}
                  </div>
                </div>
              ) : null}
              {record.resolutionState === "PENDING_USER" && isSeededPrompt ? (
                <div className="mt-3">
                  <button
                    className="button-primary mb-2 w-full justify-between"
                    onClick={handleSendLivePrompt}
                    type="button"
                    disabled={pendingAction !== null}
                  >
                    <span>
                      {pendingAction === "send-live-prompt"
                        ? "Sending live WhatsApp..."
                        : "Send live WhatsApp now"}
                    </span>
                    <Send size={14} absoluteStrokeWidth />
                  </button>
                  <button
                    className="button-secondary w-full justify-between"
                    onClick={handleSimulateReply}
                    type="button"
                    disabled={pendingAction !== null}
                  >
                    <span>
                      {pendingAction === "simulate-reply"
                        ? "Simulating reply..."
                        : "Simulate customer reply"}
                    </span>
                    <MessageCircleReply size={14} absoluteStrokeWidth />
                  </button>
                </div>
              ) : null}
            </div>

            <div className="rounded-[10px] border border-[var(--line)] bg-[var(--surface-subtle)] px-3 py-3">
              <div className="mb-2 text-[11px] uppercase tracking-[0.08em] text-[var(--muted)]">
                Latest audit
              </div>
              <div className="space-y-3">
                {latestAuditEvents.map((event) => (
                  <div key={event.eventId}>
                    <div className="text-sm font-semibold">{event.summary}</div>
                    <div className="mt-1 text-xs text-[var(--muted)]">
                      {event.actorName} | {event.createdAt}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[10px] border border-[var(--line)] bg-[var(--surface-subtle)] px-3 py-3">
              <div className="mb-2 text-[11px] uppercase tracking-[0.08em] text-[var(--muted)]">
                Human override
              </div>
              <div className="grid gap-2">
                {record.recommendation.humanOverrideOptions.map((option) => (
                  <button
                    key={option}
                    className="button-secondary justify-between"
                    onClick={() => void handleOverride(option)}
                    type="button"
                    disabled={pendingAction !== null}
                  >
                    <span>{formatLabel(option)}</span>
                    <span className="text-[11px] text-[var(--muted)]">reason required</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      <Sheet
        open={sheet === "score"}
        onClose={() => setSheet(null)}
        title="Score breakdown"
        subtitle="Deterministic inputs only. Every score component maps back to explicit evidence."
      >
        <div className="space-y-2">
          {record.scoreComponents.map((component) => (
            <div
              key={component.code}
              className="rounded-[10px] border border-[var(--line)] bg-[var(--surface-subtle)] p-3"
            >
              <div className="mb-1 flex items-center justify-between gap-2">
                <strong className="text-sm">{component.label}</strong>
                <span className="mono text-xs">+{component.points}</span>
              </div>
              <div className="text-xs text-[var(--muted)]">
                Evidence IDs: {component.evidenceIds.join(", ")}
              </div>
            </div>
          ))}
        </div>
      </Sheet>

      <Sheet
        open={sheet === "evidence"}
        onClose={() => setSheet(null)}
        title="Evidence pack"
        subtitle="Inspectable inputs behind the recommendation. The AI brief is a short summary of current facts, not new evidence."
      >
        {generatedExplanation ? (
          <div className="mb-3 rounded-[10px] border border-[var(--line)] bg-[var(--surface-subtle)] p-3 text-sm">
            <div className="mb-2 text-[11px] uppercase tracking-[0.08em] text-[var(--muted)]">
              AI analyst brief
            </div>
            <div className="mb-3 text-xs text-[var(--muted)]">
              Generated from the current case record, policy hits, and network signals.
            </div>
            <MarkdownContent content={generatedExplanation} />
          </div>
        ) : null}
        <div className="space-y-2">
          {record.evidenceItems.map((item) => (
            <div
              key={item.evidenceId}
              className="rounded-[10px] border border-[var(--line)] bg-[var(--surface-subtle)] p-3"
            >
              <div className="mb-1 flex items-center justify-between gap-2">
                <strong className="text-sm">{item.title}</strong>
                <span className="text-[11px] uppercase tracking-[0.08em] text-[var(--muted)]">
                  {item.kind}
                </span>
              </div>
              <div className="text-sm">{item.summary}</div>
              <div className="mt-2 text-xs text-[var(--muted)]">
                {item.evidenceId} | {item.source}
              </div>
            </div>
          ))}
        </div>
      </Sheet>

      <Sheet
        open={sheet === "policy"}
        onClose={() => setSheet(null)}
        title="Policy basis"
        subtitle="Explicit control basis. Nothing here should require reverse-engineering."
      >
        <div className="space-y-2">
          {record.policyHits.map((hit) => (
            <div
              key={hit.policyId}
              className="rounded-[10px] border border-[var(--line)] bg-[var(--surface-subtle)] p-3"
            >
              <div className="text-sm font-semibold">{hit.policyId}</div>
              <div className="mt-1 text-sm">{hit.title}</div>
              <div className="mt-1 text-xs text-[var(--muted)]">{hit.explanation}</div>
            </div>
          ))}
        </div>
      </Sheet>

      <Sheet
        open={sheet === "note"}
        onClose={() => setSheet(null)}
        title="Export note"
        subtitle="Support and compliance handoff text."
      >
        <div className="rounded-[10px] border border-[var(--line)] bg-[var(--surface-subtle)] p-3">
          <MarkdownContent content={generatedNote ?? reportContent} />
        </div>
      </Sheet>
    </div>
  );
}
