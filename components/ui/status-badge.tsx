import { cn } from "@/lib/utils";

const toneMap = {
  CRITICAL:              "border-[#fda29b] bg-[#fef3f2] text-[#b42318]",
  HIGH:                  "border-[#fdba74] bg-[#fff7ed] text-[#c2410c]",
  MEDIUM:                "border-[#bae6fd] bg-[#f0f9ff] text-[#0369a1]",
  LOW:                   "border-[#bbf7d0] bg-[#f0fdf4] text-[#15803d]",
  FREEZE_ACCOUNT:        "border-[#fda29b] bg-[#fef3f2] text-[#b42318]",
  STEP_UP_VERIFICATION:  "border-[#fde68a] bg-[#fffbeb] text-[#b45309]",
  ESCALATE:              "border-[#ddd6fe] bg-[#f5f3ff] text-[#6d28d9]",
  REVIEW:                "border-[#bae6fd] bg-[#f0f9ff] text-[#0369a1]",
  ALLOW:                 "border-[#bbf7d0] bg-[#f0fdf4] text-[#15803d]",
  DELIVERED:             "border-[#bbf7d0] bg-[#f0fdf4] text-[#15803d]",
  SENT:                  "border-[#bae6fd] bg-[#f0f9ff] text-[#0369a1]",
  PENDING_SEND:          "border-[#cbd5e1] bg-[#f8fafc] text-[#475569]",
  FAILED:                "border-[#fda29b] bg-[#fef3f2] text-[#b42318]",
  SIMULATED:             "border-[#e5e7eb] bg-[#f8fafc] text-[#475569]",
  USER_REPLIED_OTHER:    "border-[#ddd6fe] bg-[#f5f3ff] text-[#6d28d9]",
  USER_REPLIED_TNG_LOGIN:"border-[#bbf7d0] bg-[#f0fdf4] text-[#15803d]",
  EXPIRED:               "border-[#fecaca] bg-[#fef2f2] text-[#b91c1c]",
  PENDING_USER:          "border-[#fde68a] bg-[#fffbeb] text-[#b45309]",
  ESCALATED:             "border-[#ddd6fe] bg-[#f5f3ff] text-[#6d28d9]",
  REACTIVATED:           "border-[#bbf7d0] bg-[#f0fdf4] text-[#15803d]",
  BLOCKED:               "border-[#fecaca] bg-[#fef2f2] text-[#b91c1c]",
} as const;

export function StatusBadge({
  label,
  tone,
}: {
  label: string;
  tone: keyof typeof toneMap;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-[7px] border px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.04em]",
        toneMap[tone],
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {label}
    </span>
  );
}
