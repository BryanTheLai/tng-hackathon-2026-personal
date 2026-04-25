import { describe, expect, test } from "vitest";

import { loadDemoData } from "@/lib/seed/loaders";

describe("seed contract", () => {
  test("loads the seeded dataset with required top-level sections", () => {
    const data = loadDemoData();

    expect(data.metadata.datasetVersion).toBe("demo-core-v2");
    expect(data.queueBanner.title).toContain("ATO precursor cluster");
    expect(data.cases.length).toBeGreaterThanOrEqual(3);
    expect(data.controls.variableDefinitions.length).toBeGreaterThan(0);
  });

  test("ensures every case includes export note, prompt, policy, evidence, and network coverage", () => {
    const data = loadDemoData();

    for (const record of data.cases) {
      expect(record.exportNote.length).toBeGreaterThan(20);
      expect(record.prompt.templateName.length).toBeGreaterThan(0);
      expect(record.policyHits.length).toBeGreaterThan(0);
      expect(record.evidenceItems.length).toBeGreaterThan(0);
      expect(record.networkObservations.length).toBeGreaterThan(0);
      expect(record.scoreComponents.length).toBeGreaterThan(0);
    }
  });
});
