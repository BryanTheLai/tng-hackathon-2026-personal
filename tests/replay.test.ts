import { describe, expect, test } from "vitest";

import { simulateReplay } from "@/lib/replay/simulate";
import { loadDemoData } from "@/lib/seed/loaders";

describe("replay simulation", () => {
  test("tightening the freeze threshold increases catches and friction", () => {
    const data = loadDemoData();
    const baseline = simulateReplay(data.controls, 85);
    const tighter = simulateReplay(data.controls, 78);

    expect(tighter.badCasesCaught).toBeGreaterThanOrEqual(baseline.badCasesCaught);
    expect(tighter.goodUsersDelayed).toBeGreaterThanOrEqual(
      baseline.goodUsersDelayed,
    );
    expect(tighter.analystReviews).toBeGreaterThanOrEqual(
      baseline.analystReviews,
    );
  });
});

