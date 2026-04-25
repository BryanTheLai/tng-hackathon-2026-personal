import { NextResponse } from "next/server";
import { z } from "zod";

import { getCaseDetail } from "@/lib/services/case-service";
import { buildCaseReport } from "@/lib/services/report-service";

const reportSchema = z.object({
  format: z.enum(["MARKDOWN", "JSON"]).default("MARKDOWN"),
});

export async function POST(
  request: Request,
  context: { params: Promise<{ caseId: string }> },
) {
  const { caseId } = await context.params;
  const body = reportSchema.parse(await request.json());
  const record = await getCaseDetail(caseId);

  if (!record) {
    return NextResponse.json({ message: "Case not found." }, { status: 404 });
  }

  return NextResponse.json({
    format: body.format,
    content: buildCaseReport(record, body.format),
  });
}
