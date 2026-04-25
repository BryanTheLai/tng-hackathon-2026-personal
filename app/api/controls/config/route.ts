import { NextResponse } from "next/server";
import { z } from "zod";

import { riskOpsRepository } from "@/lib/repositories/risk-ops-repository";
import { ruleDefinitionSchema } from "@/lib/domain/schema";
import { saveRuleDraft } from "@/lib/services/replay-service";

const saveRuleSchema = z.object({
  ruleId: z.string(),
  rule: ruleDefinitionSchema,
});

export async function GET() {
  const workspace = await riskOpsRepository.getControlsWorkspace();
  return NextResponse.json(workspace);
}

export async function POST(request: Request) {
  const body = saveRuleSchema.parse(await request.json());
  const workspace = saveRuleDraft(body.ruleId, body.rule);
  return NextResponse.json(workspace);
}
