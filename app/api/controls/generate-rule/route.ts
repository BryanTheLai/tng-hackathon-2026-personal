import { NextResponse } from "next/server";
import { z } from "zod";

import { riskOpsRepository } from "@/lib/repositories/risk-ops-repository";
import { generateRuleDraft } from "@/lib/services/rule-generator-service";

const generateRuleSchema = z.object({
  prompt: z.string().min(8),
  baseRuleId: z.string().optional(),
});

export async function POST(request: Request) {
  const body = generateRuleSchema.parse(await request.json());
  const workspace = await riskOpsRepository.getControlsWorkspace();
  const baseRule =
    body.baseRuleId == null
      ? null
      : workspace.rules.find((rule) => rule.ruleId === body.baseRuleId) ?? null;

  const rule = await generateRuleDraft({
    prompt: body.prompt,
    workspace,
    baseRule,
  });

  return NextResponse.json({ rule });
}
