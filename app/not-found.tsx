import Link from "next/link";

import { AppShell } from "@/components/app-shell";

export default function NotFound() {
  return (
    <AppShell currentPath="/queue">
      <div className="panel panel-strong p-8 text-center">
        <p className="eyebrow mb-2">Missing case</p>
        <h2 className="text-2xl font-semibold">That route is not in the seeded dataset.</h2>
        <p className="muted mt-3">
          The repo is running in seeded mode. Use one of the known case IDs from the queue.
        </p>
        <Link href="/queue" className="button-primary mt-6 inline-flex">
          Back to queue
        </Link>
      </div>
    </AppShell>
  );
}

