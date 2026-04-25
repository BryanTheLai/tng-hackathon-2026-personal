import { AppShell } from "@/components/app-shell";
import { ControlsScreen } from "@/components/screens/controls-screen";
import { riskOpsRepository } from "@/lib/repositories/risk-ops-repository";

export default async function ControlsPage() {
  const workspace = await riskOpsRepository.getControlsWorkspace();

  return (
    <AppShell currentPath="/controls">
      <ControlsScreen workspace={workspace} />
    </AppShell>
  );
}

