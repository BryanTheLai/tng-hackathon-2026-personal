import type { ControlsWorkspace } from "@/lib/domain/schema";

export interface ReplayPreview {
  freezeThreshold: number;
  badCasesCaught: number;
  goodUsersDelayed: number;
  analystReviews: number;
}

export function simulateReplay(
  workspace: ControlsWorkspace,
  freezeThreshold: number,
): ReplayPreview {
  const baseline = workspace.replaySummary.after;
  const delta = Math.max(0, 85 - freezeThreshold);

  return {
    freezeThreshold,
    badCasesCaught: baseline.badCasesCaught + Math.min(2, Math.floor(delta / 3)),
    goodUsersDelayed: baseline.goodUsersDelayed + Math.min(2, Math.ceil(delta / 5)),
    analystReviews: baseline.analystReviews + Math.min(3, Math.ceil(delta / 4)),
  };
}

