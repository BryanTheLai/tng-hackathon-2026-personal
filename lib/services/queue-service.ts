import { riskOpsRepository } from "@/lib/repositories/risk-ops-repository";

export async function getQueueSnapshot() {
  return riskOpsRepository.getQueueSnapshot();
}
