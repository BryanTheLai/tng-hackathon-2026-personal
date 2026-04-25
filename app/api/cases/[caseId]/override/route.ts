import { NextResponse } from "next/server";
import { z } from "zod";

import { recommendationActionSchema } from "@/lib/domain/schema";
import { applyCaseAction } from "@/lib/services/action-orchestrator";

const overrideSchema = z.object({
  overrideAction: recommendationActionSchema,
  overrideReason: z.string().min(3),
  actor: z.string().default("Analyst"),
});

export async function POST(
  request: Request,
  context: { params: Promise<{ caseId: string }> },
) {
  const { caseId } = await context.params;
  const body = overrideSchema.parse(await request.json());
  const record = await applyCaseAction({
    caseId,
    action: body.overrideAction,
    actorName: body.actor,
    actorType: "ANALYST",
    reason: body.overrideReason,
    override: true,
  });

  if (!record) {
    return NextResponse.json({ message: "Case not found." }, { status: 404 });
  }

  return NextResponse.json(record);
}
