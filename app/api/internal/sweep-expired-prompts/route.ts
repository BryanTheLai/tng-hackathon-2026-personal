import { NextResponse } from "next/server";

import { getEnv } from "@/lib/config/env";
import { getDemoData } from "@/lib/demo-state/store";
import { expirePromptForCase } from "@/lib/services/resolution-service";

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  const expected = `Bearer ${getEnv().APP_INTERNAL_TOKEN}`;

  if (authHeader !== expected) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const updatedCases = getDemoData().cases
    .filter((record) =>
      record.prompt.state === "PENDING_SEND" ||
      record.prompt.state === "SENT" ||
      record.prompt.state === "DELIVERED" ||
      record.prompt.state === "SIMULATED"
    )
    .map((record) => expirePromptForCase(record.caseId))
    .filter(Boolean);

  return NextResponse.json({
    swept: updatedCases.length,
    caseIds: updatedCases.map((record) => record?.caseId),
  });
}
