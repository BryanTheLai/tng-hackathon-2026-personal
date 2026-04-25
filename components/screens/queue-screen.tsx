"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  KeyRound,
  RotateCcw,
  Search,
  ShieldAlert,
  Smartphone,
  UserRoundPlus,
  Wallet,
} from "lucide-react";

import { SectionCard } from "@/components/ui/section-card";
import { StatusBadge } from "@/components/ui/status-badge";
import type { QueueSnapshot } from "@/lib/repositories/risk-ops-repository";

const filterModes = ["ALL", "CRITICAL", "AUTO_ACTION"] as const;

function formatLabel(value: string) {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function signalIcon(signal: string) {
  const normalized = signal.toLowerCase();

  if (normalized.includes("device")) {
    return Smartphone;
  }

  if (normalized.includes("pin")) {
    return KeyRound;
  }

  if (normalized.includes("beneficiary") || normalized.includes("payee")) {
    return UserRoundPlus;
  }

  return Wallet;
}

export function QueueScreen({ snapshot }: { snapshot: QueueSnapshot }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof filterModes)[number]>("ALL");
  const [isResetting, setIsResetting] = useState(false);

  const rows = useMemo(() => {
    return snapshot.rows.filter((row) => {
      const matchesQuery =
        query.length === 0 ||
        row.maskedUserLabel.toLowerCase().includes(query.toLowerCase()) ||
        row.caseId.toLowerCase().includes(query.toLowerCase());

      const matchesFilter =
        filter === "ALL" ||
        (filter === "CRITICAL" && row.riskLevel === "CRITICAL") ||
        (filter === "AUTO_ACTION" &&
          (row.proposedAction === "FREEZE_ACCOUNT" ||
            row.proposedAction === "STEP_UP_VERIFICATION"));

      return matchesQuery && matchesFilter;
    });
  }, [filter, query, snapshot.rows]);

  const handleResetDemoState = async () => {
    const confirmed = window.confirm(
      "Reset the demo queue back to the seeded baseline? This clears stale prompt and reply state.",
    );

    if (!confirmed) {
      return;
    }

    setIsResetting(true);

    try {
      const response = await fetch("/api/demo/reset", { method: "POST" });
      const payload = (await response.json().catch(() => null)) as { message?: string } | null;

      if (!response.ok) {
        throw new Error(payload?.message ?? "Demo reset failed.");
      }

      router.refresh();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Demo reset failed.");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="flex min-w-0 flex-col gap-3">
        <SectionCard
          compact
          title="Live ATO cluster"
          subtitle="This is an operator surface. Scan the signal, rank the queue, open the case."
          action={
            <div className="flex flex-wrap items-center gap-2">
              <span className="pill mono">
                {snapshot.banner.numerator}/{snapshot.banner.denominator} expected
              </span>
              <span className="pill">
                <ShieldAlert size={13} />
                {snapshot.banner.windowMinutes} min window
              </span>
            </div>
          }
        >
          <div className="grid gap-3 lg:grid-cols-[220px_minmax(0,1fr)]">
            <div className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-contrast)] px-4 py-4 text-white">
              <div className="text-xs uppercase tracking-[0.08em] text-white/70">
                Cluster lift
              </div>
              <div className="mt-2 text-4xl font-semibold tracking-tight">
                {snapshot.banner.multiplier}x
              </div>
              <div className="mt-2 text-sm text-white/80">{snapshot.banner.segmentLabel}</div>
            </div>

            <div className="grid gap-2 md:grid-cols-3">
              {snapshot.banner.signals.map((signal) => {
                const Icon = signalIcon(signal);

                return (
                  <div
                    key={signal}
                    className="rounded-[10px] border border-[var(--line)] bg-[var(--surface-subtle)] px-3 py-3"
                  >
                    <div className="flex items-center gap-2 text-[var(--muted-strong)]">
                      <Icon size={15} absoluteStrokeWidth />
                      <span className="text-sm font-semibold">{signal}</span>
                    </div>
                    <div className="mt-2 text-xs text-[var(--muted)]">
                      Signal is visible in ranking only. Final action still follows evidence and policy.
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </SectionCard>

        <SectionCard
          compact
          title="Investigation queue"
          subtitle="Dense rows, less chrome, stronger hierarchy."
          action={<span className="pill mono">{rows.length} visible</span>}
        >
          <div className="mb-3 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <label className="flex min-w-0 flex-1 items-center gap-2 rounded-[8px] border border-[var(--line)] bg-[var(--surface-subtle)] px-3 py-2">
              <Search size={14} className="text-[var(--muted)]" />
              <input
                aria-label="Search cases"
                className="w-full bg-transparent text-sm outline-none"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search case ID or masked user"
                value={query}
              />
            </label>

            <div className="flex flex-wrap gap-1.5">
              {filterModes.map((mode) => (
                <button
                  key={mode}
                  type="button"
                  className={mode === filter ? "button-primary" : "button-secondary"}
                  onClick={() => setFilter(mode)}
                >
                  {mode === "ALL"
                    ? "All"
                    : mode === "CRITICAL"
                      ? "Critical only"
                      : "Auto-action"}
                </button>
              ))}
            </div>
          </div>

          <div className="panel overflow-hidden">
            <div className="overflow-x-auto">
              <table className="dense-table min-w-[1040px]">
                <thead>
                  <tr>
                    <th>Case</th>
                    <th>User</th>
                    <th>Signals</th>
                    <th>State</th>
                    <th>Score</th>
                    <th>Next action</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.caseId}>
                      <td>
                        <div className="flex items-start gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-[var(--line)] bg-[var(--surface-subtle)] text-[var(--muted-strong)]">
                            <ShieldAlert size={16} absoluteStrokeWidth />
                          </div>
                          <div>
                            <div className="mono text-xs font-semibold text-[var(--muted)]">
                              {row.caseId}
                            </div>
                            <div className="mt-1 text-sm font-semibold">
                              {formatLabel(row.scenarioType)}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="text-sm font-semibold">{row.maskedUserLabel}</div>
                        <div className="mt-1 text-xs text-[var(--muted)]">{row.status.replaceAll("_", " ")}</div>
                      </td>

                      <td>
                        <div className="flex flex-wrap gap-1.5">
                          {row.reasonChips.slice(0, 3).map((reason) => {
                            const Icon = signalIcon(reason);

                            return (
                              <span
                                key={reason}
                                className="inline-flex items-center gap-1 rounded-[7px] border border-[var(--line)] bg-[var(--surface-subtle)] px-2 py-1 text-xs font-medium text-[var(--muted-strong)]"
                              >
                                <Icon size={12} absoluteStrokeWidth />
                                {reason}
                              </span>
                            );
                          })}
                        </div>
                      </td>

                      <td>
                        <div className="space-y-1.5">
                          <StatusBadge label={row.riskLevel} tone={row.riskLevel} />
                          <div className="text-xs text-[var(--muted)]">
                            {formatLabel(row.currentControlState)}
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="text-2xl font-semibold tracking-tight">{row.score}</div>
                        <div className="mt-1 text-xs text-[var(--muted)]">
                          {row.resolutionState.replaceAll("_", " ")}
                        </div>
                      </td>

                      <td>
                        <Link
                          href={`/cases/${row.caseId}`}
                          className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--line-strong)] bg-[var(--surface-strong)] px-3 py-2 text-sm font-semibold text-[var(--text)] transition-colors hover:bg-[var(--surface-hover)]"
                        >
                          <StatusBadge
                            label={formatLabel(row.proposedAction)}
                            tone={row.proposedAction}
                          />
                          <span className="inline-flex items-center gap-1">
                            Open
                            <ArrowUpRight size={14} absoluteStrokeWidth />
                          </span>
                        </Link>
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
        <SectionCard compact title="Queue summary" subtitle="Keep the right rail useful, not decorative.">
          <div className="grid gap-2">
            {[
              ["Open cases", snapshot.metrics.openCases],
              ["Auto-actions ready", snapshot.metrics.autoActionReady],
              ["Pending user", snapshot.metrics.pendingUser],
              ["Transfers stopped", snapshot.metrics.preventedTransfers],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-[8px] border border-[var(--line)] bg-[var(--surface-subtle)] px-3 py-2"
              >
                <span className="text-sm text-[var(--muted-strong)]">{label}</span>
                <span className="mono text-sm font-semibold">{value}</span>
              </div>
            ))}
            <button
              type="button"
              className="button-secondary justify-between"
              onClick={handleResetDemoState}
              disabled={isResetting}
            >
              <span>{isResetting ? "Resetting demo state..." : "Reset demo state"}</span>
              <RotateCcw size={14} absoluteStrokeWidth />
            </button>
            <div className="text-xs text-[var(--muted)]">
              Restores the seeded queue and clears stale Twilio/demo runtime state.
            </div>
          </div>
        </SectionCard>

        <SectionCard compact title="Action ladder" subtitle="Users should understand the consequence of the score immediately.">
          <div className="panel overflow-hidden">
            <table className="dense-table">
              <thead>
                <tr>
                  <th>Band</th>
                  <th>Outcome</th>
                  <th>Meaning</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["0-69", "ALLOW", "No hold"],
                  ["70-84", "STEP_UP_VERIFICATION", "Pause and verify"],
                  ["85-100", "FREEZE_ACCOUNT", "Stop movement"],
                ].map(([band, action, note]) => (
                  <tr key={band}>
                    <td className="mono text-xs">{band}</td>
                    <td>
                      <StatusBadge label={formatLabel(action)} tone={action as "ALLOW"} />
                    </td>
                    <td className="text-sm text-[var(--muted)]">{note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
