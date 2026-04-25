import { existsSync, mkdirSync, readFileSync, renameSync, unlinkSync, writeFileSync } from "node:fs";
import path from "node:path";

import { z } from "zod";

import {
  type CaseRecord,
  caseRecordSchema,
  demoDataSchema,
  type DemoData,
} from "@/lib/domain/schema";

const seedFilePath = path.join(process.cwd(), "seed", "demo-core.json");
const runtimeFilePath = path.join(process.cwd(), "seed", "runtime-demo-state.json");

const runtimeStateSchema = z.object({
  demoData: demoDataSchema,
  runtime: z.object({
    processedInboundEventIds: z.array(z.string()),
    processedStatusEventIds: z.array(z.string()),
    countersByPrefix: z.record(z.string(), z.number()),
    lastResetAt: z.string(),
  }),
});

type RuntimeState = z.infer<typeof runtimeStateSchema>;

export function getDemoData(): DemoData {
  return structuredClone(readRuntimeState().demoData);
}

export function replaceDemoData(nextData: DemoData) {
  const parsed = demoDataSchema.parse(nextData);
  const runtimeState = readRuntimeState();
  runtimeState.demoData = parsed;
  syncCountersFromDemoData(runtimeState);
  writeRuntimeState(runtimeState);
  return structuredClone(runtimeState.demoData);
}

export function resetDemoState() {
  const seedData = readSeedData();
  const runtimeState = createRuntimeState(seedData);
  writeRuntimeState(runtimeState);
  return structuredClone(runtimeState.demoData);
}

export function getCaseFromState(caseId: string): CaseRecord | null {
  const record = readRuntimeState().demoData.cases.find((entry) => entry.caseId === caseId);
  return record ? structuredClone(record) : null;
}

export function upsertCaseInState(nextCase: CaseRecord) {
  const runtimeState = readRuntimeState();
  const parsedCase = caseRecordSchema.parse(nextCase);
  const existingIndex = runtimeState.demoData.cases.findIndex(
    (entry) => entry.caseId === parsedCase.caseId,
  );
  const nextCases = [...runtimeState.demoData.cases];

  if (existingIndex >= 0) {
    nextCases[existingIndex] = parsedCase;
  } else {
    nextCases.push(parsedCase);
  }

  runtimeState.demoData.cases = nextCases;
  syncCountersFromCase(runtimeState, parsedCase);
  writeRuntimeState(runtimeState);

  return structuredClone(parsedCase);
}

export function wasInboundProcessed(eventId: string) {
  return readRuntimeState().runtime.processedInboundEventIds.includes(eventId);
}

export function markInboundProcessed(eventId: string) {
  const runtimeState = readRuntimeState();

  if (!runtimeState.runtime.processedInboundEventIds.includes(eventId)) {
    runtimeState.runtime.processedInboundEventIds.push(eventId);
    writeRuntimeState(runtimeState);
  }
}

export function wasStatusProcessed(eventId: string) {
  return readRuntimeState().runtime.processedStatusEventIds.includes(eventId);
}

export function markStatusProcessed(eventId: string) {
  const runtimeState = readRuntimeState();

  if (!runtimeState.runtime.processedStatusEventIds.includes(eventId)) {
    runtimeState.runtime.processedStatusEventIds.push(eventId);
    writeRuntimeState(runtimeState);
  }
}

export function createAuditId(prefix: string) {
  const runtimeState = readRuntimeState();
  const current = runtimeState.runtime.countersByPrefix[prefix] ?? 0;
  const next = current + 1;

  runtimeState.runtime.countersByPrefix[prefix] = next;
  writeRuntimeState(runtimeState);

  return `${prefix}-${String(next).padStart(3, "0")}`;
}

export function nowIso() {
  return new Date().toISOString();
}

function readRuntimeState() {
  ensureRuntimeState();
  return runtimeStateSchema.parse(
    JSON.parse(readFileSync(runtimeFilePath, "utf8")) as unknown,
  );
}

function writeRuntimeState(runtimeState: RuntimeState) {
  mkdirSync(path.dirname(runtimeFilePath), { recursive: true });
  const tempFilePath = `${runtimeFilePath}.tmp`;

  writeFileSync(tempFilePath, `${JSON.stringify(runtimeState, null, 2)}\n`, "utf8");

  try {
    renameSync(tempFilePath, runtimeFilePath);
  } catch (error) {
    if (existsSync(tempFilePath)) {
      unlinkSync(tempFilePath);
    }
    throw error;
  }
}

function ensureRuntimeState() {
  if (!existsSync(runtimeFilePath)) {
    resetDemoState();
    return;
  }

  try {
    runtimeStateSchema.parse(JSON.parse(readFileSync(runtimeFilePath, "utf8")) as unknown);
  } catch {
    resetDemoState();
  }
}

function readSeedData() {
  return demoDataSchema.parse(JSON.parse(readFileSync(seedFilePath, "utf8")) as unknown);
}

function createRuntimeState(seedData: DemoData): RuntimeState {
  const runtimeState: RuntimeState = {
    demoData: seedData,
    runtime: {
      processedInboundEventIds: [],
      processedStatusEventIds: [],
      countersByPrefix: {},
      lastResetAt: nowIso(),
    },
  };

  syncCountersFromDemoData(runtimeState);
  return runtimeState;
}

function syncCountersFromDemoData(runtimeState: RuntimeState) {
  runtimeState.runtime.countersByPrefix = {
    ...runtimeState.runtime.countersByPrefix,
    AE: findMaxSuffix(
      runtimeState.demoData.cases.flatMap((record) =>
        record.auditEvents.map((event) => event.eventId),
      ),
      "AE",
    ),
    TL: findMaxSuffix(
      runtimeState.demoData.cases.flatMap((record) =>
        record.timeline.map((event) => event.eventId),
      ),
      "TL",
    ),
    MSG: findMaxSuffix(
      runtimeState.demoData.cases
        .map((record) => record.prompt.messageSid)
        .filter((value): value is string => Boolean(value)),
      "MSG",
    ),
  };
}

function syncCountersFromCase(runtimeState: RuntimeState, record: CaseRecord) {
  runtimeState.runtime.countersByPrefix.AE = Math.max(
    runtimeState.runtime.countersByPrefix.AE ?? 0,
    findMaxSuffix(record.auditEvents.map((event) => event.eventId), "AE"),
  );
  runtimeState.runtime.countersByPrefix.TL = Math.max(
    runtimeState.runtime.countersByPrefix.TL ?? 0,
    findMaxSuffix(record.timeline.map((event) => event.eventId), "TL"),
  );
  runtimeState.runtime.countersByPrefix.MSG = Math.max(
    runtimeState.runtime.countersByPrefix.MSG ?? 0,
    findMaxSuffix(record.prompt.messageSid ? [record.prompt.messageSid] : [], "MSG"),
  );
}

function findMaxSuffix(values: string[], prefix: string) {
  return values.reduce((maxValue, value) => {
    const match = new RegExp(`^${prefix}-(\\d+)$`).exec(value);
    const numericValue = match ? Number.parseInt(match[1] ?? "0", 10) : 0;
    return Number.isFinite(numericValue) ? Math.max(maxValue, numericValue) : maxValue;
  }, 0);
}
