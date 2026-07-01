"use client";

import type { Bucket } from "@/lib/dashboardMetrics";

// Dependency-free chart primitives (CSS/SVG) to avoid extra packages.

const PALETTE = [
  "#1B3D6D",
  "#2A5694",
  "#3E6FB0",
  "#5C86C2",
  "#7FA0D0",
  "#A7C0E0",
  "#C0392B",
  "#E0A93E",
];

export function ChartCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-hairlineDivider bg-white p-5 shadow-card">
      <h3 className="text-sm font-bold text-headlineBlack">{title}</h3>
      {description ? (
        <p className="mt-1 text-xs text-captionGray">{description}</p>
      ) : null}
      <div className="mt-4">{children}</div>
    </div>
  );
}

export function BarChart({ data }: { data: Bucket[] }) {
  if (data.length === 0) {
    return <p className="text-sm text-captionGray">Belum ada data.</p>;
  }
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <ul className="space-y-2.5">
      {data.map((d, i) => (
        <li key={d.label}>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="truncate pr-2 text-bodyTextGray">{d.label}</span>
            <span className="font-semibold text-headlineBlack">{d.value}</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-offWhiteSection">
            <div
              className="h-full rounded-full"
              style={{
                width: `${(d.value / max) * 100}%`,
                backgroundColor: PALETTE[i % PALETTE.length],
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function DonutChart({ data }: { data: Bucket[] }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  if (total === 0) {
    return <p className="text-sm text-captionGray">Belum ada data.</p>;
  }

  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex flex-wrap items-center gap-5">
      <svg width="140" height="140" viewBox="0 0 140 140" role="img">
        <g transform="translate(70,70)">
          {data.map((d, i) => {
            const fraction = d.value / total;
            const dash = fraction * circumference;
            const seg = (
              <circle
                key={d.label}
                r={radius}
                cx="0"
                cy="0"
                fill="transparent"
                stroke={PALETTE[i % PALETTE.length]}
                strokeWidth="20"
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-offset}
                transform="rotate(-90)"
              />
            );
            offset += dash;
            return seg;
          })}
          <text
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-headlineBlack"
            style={{ fontSize: "18px", fontWeight: 700 }}
          >
            {total}
          </text>
        </g>
      </svg>
      <ul className="space-y-1.5 text-xs">
        {data.map((d, i) => (
          <li key={d.label} className="flex items-center gap-2">
            <span
              className="inline-block h-2.5 w-2.5 rounded-sm"
              style={{ backgroundColor: PALETTE[i % PALETTE.length] }}
            />
            <span className="text-bodyTextGray">{d.label}</span>
            <span className="font-semibold text-headlineBlack">{d.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function LineChart({ data }: { data: Bucket[] }) {
  if (data.length === 0) {
    return <p className="text-sm text-captionGray">Belum ada data.</p>;
  }
  const width = 520;
  const height = 160;
  const pad = 24;
  const max = Math.max(...data.map((d) => d.value), 1);
  const stepX =
    data.length > 1 ? (width - pad * 2) / (data.length - 1) : 0;

  const points = data.map((d, i) => {
    const x = pad + i * stepX;
    const y = height - pad - (d.value / max) * (height - pad * 2);
    return { x, y, ...d };
  });

  const path = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-40 w-full"
      role="img"
      preserveAspectRatio="none"
    >
      <line
        x1={pad}
        y1={height - pad}
        x2={width - pad}
        y2={height - pad}
        stroke="#E0E0E0"
      />
      <polyline
        fill="none"
        stroke="#1B3D6D"
        strokeWidth="2.5"
        points={path}
      />
      {points.map((p) => (
        <circle key={p.label} cx={p.x} cy={p.y} r="3" fill="#1B3D6D" />
      ))}
      {points.map((p, i) =>
        i % 2 === 0 ? (
          <text
            key={`t-${p.label}`}
            x={p.x}
            y={height - 6}
            textAnchor="middle"
            style={{ fontSize: "9px" }}
            fill="#8A8A8A"
          >
            {p.label}
          </text>
        ) : null
      )}
    </svg>
  );
}
