import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string | number;
  hint?: string;
  icon?: LucideIcon;
  tone?: "default" | "warning" | "positive";
};

const TONE: Record<NonNullable<StatCardProps["tone"]>, string> = {
  default: "text-navyCore",
  warning: "text-accentRed",
  positive: "text-emerald-600",
};

export default function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "default",
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-hairlineDivider bg-white p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-wide text-captionGray">
          {label}
        </p>
        {Icon ? <Icon className={`h-5 w-5 ${TONE[tone]}`} aria-hidden="true" /> : null}
      </div>
      <p className={`mt-2 text-3xl font-bold ${TONE[tone]}`}>{value}</p>
      {hint ? <p className="mt-1 text-xs text-captionGray">{hint}</p> : null}
    </div>
  );
}
