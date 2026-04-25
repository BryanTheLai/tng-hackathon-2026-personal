import { AppShell } from "@/components/app-shell";
import { QueueScreen } from "@/components/screens/queue-screen";
import { riskOpsRepository } from "@/lib/repositories/risk-ops-repository";

export default async function QueuePage() {
  const snapshot = await riskOpsRepository.getQueueSnapshot();

  return (
    <AppShell currentPath="/queue">
      <QueueScreen snapshot={snapshot} />
    </AppShell>
  );
}

