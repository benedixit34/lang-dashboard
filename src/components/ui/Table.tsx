import type { ReactNode } from "react";
import { MoreHorizontal } from "lucide-react";

interface ThProps {
  children?: ReactNode;
  className?: string;
}

export function Th({ children, className = "" }: ThProps) {
  return (
    <th
      className={`border-b border-neutral-200 px-4 py-2.5 text-left text-[12px] font-medium text-neutral-500 ${className}`}
    >
      {children}
    </th>
  );
}

interface TdProps {
  children: ReactNode;
  className?: string;
}

export function Td({ children, className = "" }: TdProps) {
  return (
    <td className={`px-4 py-3 text-[13px] text-neutral-800 ${className}`}>
      {children}
    </td>
  );
}

interface RowProps {
  children: ReactNode;
}

export function Row({ children }: RowProps) {
  return (
    <tr className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50/70">
      {children}
    </tr>
  );
}

export function RowMenu() {
  return (
    <button
      type="button"
      className="rounded-md p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
    >
      <MoreHorizontal size={16} />
    </button>
  );
}