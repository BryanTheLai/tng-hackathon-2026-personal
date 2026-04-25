import { NextResponse } from "next/server";

import { getCaseDetail } from "@/lib/services/case-service";
import { generateCaseExplanation } from "@/lib/services/ai-explanation-service";

export async function POST(
  _request: Request,
  context: { params: Promise<{ caseId: string }> },
) {
  const { caseId } = await context.params;
  const record = await getCaseDetail(caseId);

  if (!record) {
    return NextResponse.json({ message: "Case not found." }, { status: 404 });
  }

  const explanation = await generateCaseExplanation(record);
  return NextResponse.json({ explanation });
}
