import Link from "next/link";
import {
  BellDot,
  FileWarning,
  LayoutList,
  Shield,
  SlidersHorizontal,
} from "lucide-react";

import { cn } from "@/lib/utils";

const navItems = [
  { href: "/queue", label: "Queue", icon: LayoutList },
  { href: "/cases/CASE-ATO-001", label: "Primary case", icon: FileWarning },
  { href: "/controls", label: "Rules", icon: SlidersHorizontal },
];

export function AppShell({
  currentPath,
  children,
}: {
  currentPath: string;
  children: React.ReactNode;
}) {
  return (
    <div className="app-shell">
      <header className="panel mb-3 overflow-hidden">
        <div className="flex flex-col gap-4 px-4 py-3 md:px-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] bg-[var(--surface-contrast)] text-white">
                <Shield size={18} absoluteStrokeWidth />
              </div>

              <div>
                <p className="text-[15px] font-semibold tracking-tight">TNG RiskOps Agent</p>
                <p className="text-sm text-[var(--muted-strong)]">
                  Account takeover operations workspace
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="pill">
                <BellDot size={13} />
                21 active investigations
              </span>
              <span className="pill">Seeded environment</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-[var(--line)] pt-3 lg:flex-row lg:items-center lg:justify-between">
            <nav className="flex flex-wrap gap-2">
              {navItems.map((item) => {
                const isActive = currentPath.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-[var(--radius-md)] border px-3 py-2 text-sm font-semibold transition-colors",
                      isActive
                        ? "border-[var(--line-strong)] bg-[var(--surface-subtle)] text-[var(--text)]"
                        : "border-transparent text-[var(--muted)] hover:border-[var(--line)] hover:bg-[var(--surface-subtle)] hover:text-[var(--text)]",
                    )}
                  >
                    <Icon size={15} absoluteStrokeWidth />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--muted-strong)]">
              <span className="mono">seed demo-core-v2</span>
              <span>Seeded demo. Analyst override stays available.</span>
            </div>
          </div>
        </div>
      </header>

      {children}
    </div>
  );
}
