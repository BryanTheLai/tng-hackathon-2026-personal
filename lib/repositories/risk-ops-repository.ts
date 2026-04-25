import type { CaseRecord, ControlsWorkspace, QueueBanner, QueueMetrics } from "@/lib/domain/schema";
import { getCaseFromState, getDemoData } from "@/lib/demo-state/store";

export interface QueueRow {
  caseId: string;
  scenarioType: CaseRecord["scenarioType"];
  maskedUserLabel: string;
  score: number;
  riskLevel: CaseRecord["riskLevel"];
  reasonChips: string[];
  currentControlState: string;
  proposedAction: CaseRecord["recommendation"]["action"];
  status: CaseRecord["status"];
  resolutionState: CaseRecord["resolutionState"];
}

export interface QueueSnapshot {
  banner: QueueBanner;
  metrics: QueueMetrics;
  rows: QueueRow[];
}

export interface RiskOpsRepository {
  getQueueSnapshot(): Promise<QueueSnapshot>;
  getCaseDetail(caseId: string): Promise<CaseRecord | null>;
  getControlsWorkspace(): Promise<ControlsWorkspace>;
}

class SeedRiskOpsRepository implements RiskOpsRepository {
  async getQueueSnapshot(): Promise<QueueSnapshot> {
    const data = getDemoData();
    const metrics = deriveQueueMetrics(data.cases);

    return {
      banner: data.queueBanner,
      metrics,
      rows: [...data.cases]
        .sort((left, right) => right.score - left.score)
        .map((record) => ({
          caseId: record.caseId,
          scenarioType: record.scenarioType,
          maskedUserLabel: record.maskedUserLabel,
          score: record.score,
          riskLevel: record.riskLevel,
          reasonChips: record.reasonChips,
          currentControlState: record.currentControlState,
          proposedAction: record.recommendation.action,
          status: record.status,
          resolutionState: record.resolutionState,
        })),
    };
  }

  async getCaseDetail(caseId: string) {
    return getCaseFromState(caseId);
  }

  async getControlsWorkspace() {
    const data = getDemoData();
    return data.controls;
  }
}

export const riskOpsRepository: RiskOpsRepository = new SeedRiskOpsRepository();

function deriveQueueMetrics(cases: CaseRecord[]): QueueMetrics {
  return {
    openCases: cases.filter((record) => record.status !== "RESOLVED" && record.status !== "CLOSED").length,
    autoActionReady: cases.filter((record) =>
      record.recommendation.action === "FREEZE_ACCOUNT" ||
      record.recommendation.action === "STEP_UP_VERIFICATION",
    ).length,
    pendingUser: cases.filter((record) => record.resolutionState === "PENDING_USER").length,
    preventedTransfers: cases.reduce((count, record) => {
      return (
        count +
        record.suspiciousActions.filter((action) => action.succeeded === false).length
      );
    }, 0),
  };
}
