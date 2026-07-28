import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import Card from "./Card";

interface StatCardProps {
  label: string;
  value: string | number;
  delta: string;
  positive: boolean;
}

export default function StatCard({
  label,
  value,
  delta,
  positive,
}: StatCardProps) {
  return (
    <Card className="p-5">
      <div className="text-[13px] text-neutral-500">{label}</div>

      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-semibold tracking-tight text-neutral-900">
          {value}
        </span>

        <span
          className={`flex items-center gap-0.5 text-[12px] font-medium ${
            positive ? "text-emerald-600" : "text-neutral-400"
          }`}
        >
          {positive ? (
            <ArrowUpRight size={13} />
          ) : (
            <ArrowDownRight size={13} />
          )}
          {delta}
        </span>
      </div>
    </Card>
  );
}