export function SectionCard({
  title,
  subtitle,
  action,
  compact = false,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  compact?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className={`panel panel-strong ${compact ? "p-3 md:p-4" : "p-4 md:p-5"}`}>
      <div
        className={`flex flex-col gap-2 border-b border-[var(--line)] pb-3 md:flex-row md:items-start md:justify-between ${compact ? "mb-3" : "mb-4"}`}
      >
        <div>
          <h2 className={`${compact ? "text-[15px]" : "text-lg"} font-semibold tracking-tight`}>
            {title}
          </h2>
          {subtitle ? <p className="muted mt-1 text-xs md:text-sm">{subtitle}</p> : null}
        </div>
        {action ? <div className="md:pl-4">{action}</div> : null}
      </div>
      {children}
    </section>
  );
}
