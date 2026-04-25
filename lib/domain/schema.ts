import { z } from "zod";

export const recommendationActionSchema = z.enum([
  "ALLOW",
  "REVIEW",
  "STEP_UP_VERIFICATION",
  "FREEZE_ACCOUNT",
  "ESCALATE",
]);

export const evidenceKindSchema = z.enum([
  "FACT",
  "INFERENCE",
  "POLICY",
  "CONTROL_STATE",
]);

export const promptStateSchema = z.enum([
  "PENDING_SEND",
  "SENT",
  "DELIVERED",
  "FAILED",
  "SIMULATED",
  "USER_REPLIED_OTHER",
  "USER_REPLIED_TNG_LOGIN",
  "EXPIRED",
]);

export const resolutionStateSchema = z.enum([
  "REACTIVATED",
  "BLOCKED",
  "ESCALATED",
  "PENDING_USER",
]);

export const variableTypeSchema = z.enum([
  "BOOLEAN",
  "NUMBER",
  "RATIO",
  "COUNT",
  "DURATION_HOURS",
]);

export const ruleOperatorSchema = z.enum([
  "=",
  "!=",
  "<",
  ">",
  "<=",
  ">=",
  "IN",
  "INCLUDES",
]);

export const ruleStatusSchema = z.enum(["ACTIVE", "DRAFT", "SHADOW"]);

export const queueBannerSchema = z.object({
  clusterId: z.string(),
  title: z.string(),
  numerator: z.number(),
  denominator: z.number(),
  multiplier: z.number(),
  windowMinutes: z.number(),
  segmentLabel: z.string(),
  signals: z.array(z.string()),
  summary: z.string(),
});

export const scoreComponentSchema = z.object({
  code: z.string(),
  label: z.string(),
  points: z.number(),
  evidenceIds: z.array(z.string()),
});

export const linkedEntitySchema = z.object({
  entityId: z.string(),
  entityType: z.string(),
  label: z.string(),
  relationship: z.string(),
  riskNote: z.string(),
});

export const networkObservationSchema = z.object({
  observationId: z.string(),
  ipAddress: z.string(),
  label: z.string(),
  geoLabel: z.string(),
  asnLabel: z.string(),
  reputation: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  disposition: z.enum(["WATCH", "BLOCKED", "ALLOWLISTED"]),
  firstSeenAt: z.string(),
  lastSeenAt: z.string(),
  linkedCaseIds: z.array(z.string()),
  note: z.string(),
});

export const suspiciousActionSchema = z.object({
  actionId: z.string(),
  label: z.string(),
  amountLabel: z.string(),
  succeeded: z.boolean(),
  note: z.string(),
});

export const timelineEventSchema = z.object({
  eventId: z.string(),
  occurredAt: z.string(),
  type: z.string(),
  label: z.string(),
  details: z.string(),
  succeeded: z.boolean().optional(),
});

export const evidenceItemSchema = z.object({
  evidenceId: z.string(),
  kind: evidenceKindSchema,
  title: z.string(),
  summary: z.string(),
  source: z.string(),
  observedAt: z.string(),
  confidence: z.number().optional(),
  policyIds: z.array(z.string()),
});

export const policyHitSchema = z.object({
  policyId: z.string(),
  title: z.string(),
  explanation: z.string(),
  actionAllowList: z.array(recommendationActionSchema),
});

export const auditEventSchema = z.object({
  eventId: z.string(),
  actorType: z.enum(["SYSTEM", "ANALYST", "WEBHOOK", "SCHEDULER"]),
  actorName: z.string(),
  eventType: z.string(),
  summary: z.string(),
  createdAt: z.string(),
});

export const promptSchema = z.object({
  promptId: z.string(),
  state: promptStateSchema,
  channel: z.literal("WHATSAPP"),
  templateName: z.string(),
  messagePreview: z.string(),
  messageSid: z.string().optional(),
  sentAt: z.string().optional(),
  deliveredAt: z.string().optional(),
  expiredAt: z.string().optional(),
  lastInboundBody: z.string().optional(),
  lastInboundAt: z.string().optional(),
  lastInboundMessageSid: z.string().optional(),
});

export const recommendationSchema = z.object({
  recommendationId: z.string(),
  action: recommendationActionSchema,
  confidence: z.number(),
  rationale: z.string(),
  evidenceIds: z.array(z.string()),
  policyIds: z.array(z.string()),
  humanOverrideOptions: z.array(recommendationActionSchema),
});

export const queueMetricsSchema = z.object({
  openCases: z.number(),
  autoActionReady: z.number(),
  pendingUser: z.number(),
  preventedTransfers: z.number(),
});

export const caseRecordSchema = z.object({
  caseId: z.string(),
  scenarioType: z.enum([
    "ACCOUNT_TAKEOVER",
    "UNAUTHORIZED_TRANSACTION",
    "MULE_ACCOUNT_ABUSE",
  ]),
  status: z.enum([
    "NEW_ALERT",
    "INVESTIGATING",
    "ACTION_APPLIED",
    "PENDING_USER",
    "RESOLVED",
    "CLOSED",
    "ERROR",
  ]),
  resolutionState: resolutionStateSchema,
  maskedUserLabel: z.string(),
  maskedPhone: z.string(),
  segmentLabel: z.string(),
  walletLabel: z.string(),
  regionLabel: z.string(),
  currentControlState: z.string(),
  score: z.number(),
  riskLevel: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  reasonChips: z.array(z.string()),
  scoreComponents: z.array(scoreComponentSchema),
  facts: z.array(z.string()),
  aiInferences: z.array(z.string()),
  missingData: z.array(z.string()),
  accountChanges: z.array(z.string()),
  deviceChanges: z.array(z.string()),
  networkObservations: z.array(networkObservationSchema),
  linkedEntities: z.array(linkedEntitySchema),
  suspiciousActions: z.array(suspiciousActionSchema),
  timeline: z.array(timelineEventSchema),
  evidenceItems: z.array(evidenceItemSchema),
  policyHits: z.array(policyHitSchema),
  recommendation: recommendationSchema,
  prompt: promptSchema,
  auditEvents: z.array(auditEventSchema),
  exportNote: z.string(),
});

export const variableDefinitionSchema = z.object({
  name: z.string(),
  type: variableTypeSchema,
  sourceFields: z.array(z.string()),
  lookbackWindow: z.string(),
  transform: z.string(),
  description: z.string(),
});

export const replayScenarioSchema = z.object({
  scenarioId: z.string(),
  label: z.string(),
  beforeAction: recommendationActionSchema,
  afterAction: recommendationActionSchema,
  impact: z.string(),
});

export const ruleConditionSchema = z.object({
  clauseId: z.string(),
  variableName: z.string(),
  operator: ruleOperatorSchema,
  value: z.string(),
  hint: z.string(),
});

export const ruleDefinitionSchema = z.object({
  ruleId: z.string(),
  name: z.string(),
  status: ruleStatusSchema,
  appliesTo: z.string(),
  action: recommendationActionSchema,
  version: z.string(),
  owner: z.string(),
  lastEditedAt: z.string(),
  freezeThreshold: z.number(),
  rationale: z.string(),
  conditions: z.array(ruleConditionSchema),
});

export const controlsWorkspaceSchema = z.object({
  actionBands: z.array(
    z.object({
      minScore: z.number(),
      maxScore: z.number(),
      action: recommendationActionSchema,
    }),
  ),
  variableDefinitions: z.array(variableDefinitionSchema),
  promptTemplate: z.string(),
  draftRule: z.string(),
  replaySummary: z.object({
    evaluatedCases: z.number(),
    before: z.object({
      badCasesCaught: z.number(),
      goodUsersDelayed: z.number(),
      analystReviews: z.number(),
    }),
    after: z.object({
      badCasesCaught: z.number(),
      goodUsersDelayed: z.number(),
      analystReviews: z.number(),
    }),
  }),
  replayScenarios: z.array(replayScenarioSchema),
  rules: z.array(ruleDefinitionSchema),
});

export const demoDataSchema = z.object({
  metadata: z.object({
    generatedAt: z.string(),
    datasetVersion: z.string(),
    notes: z.array(z.string()),
  }),
  queueBanner: queueBannerSchema,
  queueMetrics: queueMetricsSchema,
  cases: z.array(caseRecordSchema),
  controls: controlsWorkspaceSchema,
});

export type DemoData = z.infer<typeof demoDataSchema>;
export type QueueBanner = z.infer<typeof queueBannerSchema>;
export type QueueMetrics = z.infer<typeof queueMetricsSchema>;
export type CaseRecord = z.infer<typeof caseRecordSchema>;
export type ControlsWorkspace = z.infer<typeof controlsWorkspaceSchema>;
export type RuleDefinition = z.infer<typeof ruleDefinitionSchema>;
export type RuleCondition = z.infer<typeof ruleConditionSchema>;
export type NetworkObservation = z.infer<typeof networkObservationSchema>;
