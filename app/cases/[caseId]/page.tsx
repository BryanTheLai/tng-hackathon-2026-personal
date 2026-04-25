import { notFound } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { CaseScreen } from "@/components/screens/case-screen";
import { riskOpsRepository } from "@/lib/repositories/risk-ops-repository";

export default async function CasePage({
  params,
}: {
  params: Promise<{ caseId: string }>;
}) {
  const { caseId } = await params;
  const record = await riskOpsRepository.getCaseDetail(caseId);

  if (!record) {
    notFound();
  }

  return (
    <AppShell currentPath="/cases">
      <CaseScreen record={record} />
    </AppShell>
  );
}

