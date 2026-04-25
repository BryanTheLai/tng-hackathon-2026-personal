import { describe, expect, test } from "vitest";

import { riskOpsRepository } from "@/lib/repositories/risk-ops-repository";

describe("risk ops repository", () => {
  test("sorts the queue by descending score", async () => {
    const snapshot = await riskOpsRepository.getQueueSnapshot();

    expect(snapshot.rows[0]?.caseId).toBe("CASE-ATO-001");
    expect(snapshot.rows[0]?.score).toBeGreaterThan(snapshot.rows[1]?.score ?? 0);
  });

  test("returns the primary case detail by ID", async () => {
    const record = await riskOpsRepository.getCaseDetail("CASE-ATO-001");

    expect(record?.maskedUserLabel).toBe("A*** H****");
    expect(record?.recommendation.action).toBe("FREEZE_ACCOUNT");
  });
});
