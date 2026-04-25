import { riskOpsRepository } from "@/lib/repositories/risk-ops-repository";

export async function getCaseDetail(caseId: string) {
  return riskOpsRepository.getCaseDetail(caseId);
}
