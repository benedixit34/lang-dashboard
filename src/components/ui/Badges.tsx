import type { ReactNode } from "react";

interface DotProps {
  status: string;
}

export function Dot({ status }: DotProps) {
  const on = status === "Published";

  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          on ? "bg-emerald-500" : "bg-neutral-300"
        }`}
      />
      <span className={on ? "text-neutral-700" : "text-neutral-400"}>
        {status}
      </span>
    </span>
  );
}

interface PillProps {
  children: ReactNode;
  tone?: "neutral" | "easy" | "medium";
}

export function Pill({
  children,
  tone = "neutral",
}: PillProps) {
  const tones = {
    neutral: "bg-neutral-100 text-neutral-600",
    easy: "bg-emerald-50 text-emerald-700",
    medium: "bg-amber-50 text-amber-700",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}