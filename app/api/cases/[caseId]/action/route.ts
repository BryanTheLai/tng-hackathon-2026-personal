import { NextResponse } from "next/server";
import { z } from "zod";

import { recommendationActionSchema } from "@/lib/domain/schema";
import { applyCaseAction } from "@/lib/services/action-orchestrator";

const applyActionSchema = z.object({
  action: recommendationActionSchema.optional(),
  actor: z.string().default("Analyst"),
  reason: z.string().optional(),
});

export async function POST(
  request: Request,
  context: { params: Promise<{ caseId: string }> },
) {
  const { caseId } = await context.params;
  const body = applyActionSchema.parse(await request.json());
  const record = await applyCaseAction({
    caseId,
    action: body.action ?? "FREEZE_ACCOUNT",
    actorName: body.actor,
    actorType: "ANALYST",
    reason: body.reason,
  });

  if (!record) {
    return NextResponse.json({ message: "Case not found." }, { status: 404 });
  }

  return NextResponse.json(record);
}
