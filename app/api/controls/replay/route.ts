import { NextResponse } from "next/server";
import { z } from "zod";

import { ruleDefinitionSchema } from "@/lib/domain/schema";
import { riskOpsRepository } from "@/lib/repositories/risk-ops-repository";
import { replayRule } from "@/lib/services/replay-service";

const replaySchema = z.object({
  rule: ruleDefinitionSchema,
});

export async function POST(request: Request) {
  const body = replaySchema.parse(await request.json());
  const workspace = await riskOpsRepository.getControlsWorkspace();
  const preview = replayRule(workspace, body.rule);
  return NextResponse.json(preview);
}
