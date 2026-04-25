import { NextResponse } from "next/server";

import { isSeedMode } from "@/lib/config/env";
import { getDemoData, resetDemoState } from "@/lib/demo-state/store";

export async function POST() {
  if (!isSeedMode()) {
    return NextResponse.json(
      { message: "Demo reset is only available while the app is running in seeded mode." },
      { status: 409 },
    );
  }

  const data = resetDemoState();
  const refreshed = getDemoData();

  return NextResponse.json({
    ok: true,
    datasetVersion: data.metadata.datasetVersion,
    generatedAt: data.metadata.generatedAt,
    cases: refreshed.cases.length,
  });
}
