import { NextResponse } from "next/server";

import { getCaseDetail } from "@/lib/services/case-service";

export async function GET(
  _request: Request,
  context: { params: Promise<{ caseId: string }> },
) {
  const { caseId } = await context.params;
  const record = await getCaseDetail(caseId);

  if (!record) {
    return NextResponse.json({ message: "Case not found." }, { status: 404 });
  }

  return NextResponse.json(record);
}
