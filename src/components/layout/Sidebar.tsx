import { NAV } from "../../lib/nav";
import type { Section } from "../../types"

interface SidebarProps {
  active: Section;
  onSelect: (key: Section) => void;
}

export default function Sidebar({
  active,
  onSelect,
}: SidebarProps) {
  return (
    <div className="flex w-56 shrink-0 flex-col border-r border-neutral-200 bg-white px-3 py-4">
      <nav className="space-y-0.5">
        {NAV.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.key;

          return (
            <button
              key={item.key}
              onClick={() => onSelect(item.key)}
              className={`flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-[13px] transition-colors ${
                isActive
                  ? "bg-neutral-100 font-medium text-neutral-900"
                  : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800"
              }`}
            >
              <Icon
                size={15}
                strokeWidth={isActive ? 2.2 : 1.8}
              />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto rounded-md border border-neutral-200 bg-neutral-50 p-3">
        <div className="text-[12px] font-medium text-neutral-800">
          Content coverage
        </div>

        <div className="mt-1 text-[11px] text-neutral-500">
          850 of ~1,000 planned words added
        </div>

        <div className="mt-2 h-1.5 w-full rounded-full bg-neutral-200">
          <div className="h-1.5 w-[85%] rounded-full bg-neutral-900" />
        </div>
      </div>
    </div>
  );
}