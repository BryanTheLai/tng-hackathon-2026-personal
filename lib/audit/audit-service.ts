import type { CaseRecord } from "@/lib/domain/schema";
import { createAuditId, nowIso } from "@/lib/demo-state/store";

export function appendAuditEvent(
  record: CaseRecord,
  actorType: "SYSTEM" | "ANALYST" | "WEBHOOK" | "SCHEDULER",
  actorName: string,
  eventType: string,
  summary: string,
) {
  record.auditEvents.unshift({
    eventId: createAuditId("AE"),
    actorType,
    actorName,
    eventType,
    summary,
    createdAt: nowIso(),
  });
}

export function appendTimelineEvent(
  record: CaseRecord,
  type: string,
  label: string,
  details: string,
  succeeded = true,
) {
  record.timeline.push({
    eventId: createAuditId("TL"),
    occurredAt: new Intl.DateTimeFormat("en-MY", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date()),
    type,
    label,
    details,
    succeeded,
  });
}
