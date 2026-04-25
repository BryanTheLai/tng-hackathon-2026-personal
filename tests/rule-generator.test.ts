import { beforeEach, describe, expect, test } from "vitest";

import { resetEnvCacheForTests } from "@/lib/config/env";
import { loadDemoData } from "@/lib/seed/loaders";
import { generateRuleDraft } from "@/lib/services/rule-generator-service";

describe("rule generator", () => {
  beforeEach(() => {
    delete process.env.ALIBABA_MODELSTUDIO_API_KEY;
    resetEnvCacheForTests();
  });

  test("creates a valid fallback draft from plain English", async () => {
    const data = loadDemoData();

    const draft = await generateRuleDraft({
      prompt:
        "Freeze transfer-enabled wallets when the device is new, the PIN was reset, and the amount ratio is above 5.",
      workspace: data.controls,
    });

    expect(draft.status).toBe("DRAFT");
    expect(draft.action).toBe("FREEZE_ACCOUNT");
    expect(draft.freezeThreshold).toBeGreaterThanOrEqual(75);
    expect(draft.freezeThreshold).toBeLessThanOrEqual(90);
    expect(draft.conditions.every((condition) => condition.variableName.length > 0)).toBe(true);
    expect(draft.conditions.some((condition) => condition.variableName === "is_new_device")).toBe(true);
    expect(draft.conditions.some((condition) => condition.variableName === "pin_reset_24h")).toBe(true);
    expect(draft.conditions.some((condition) => condition.variableName === "amount_ratio_30d")).toBe(true);
  });
});
