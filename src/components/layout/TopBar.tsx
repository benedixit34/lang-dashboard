import React from "react";
import { ChevronDown, Search, Bell } from "lucide-react";

export default function TopBar() {
  return (
    <div className="flex h-12 shrink-0 items-center justify-between border-b border-neutral-800 bg-neutral-950 px-4">
      <div className="flex items-center gap-3">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white text-[13px] font-bold text-neutral-950">
          C
        </div>
        <span className="text-[13px] font-medium text-white">City Language</span>
        <ChevronDown size={13} className="text-neutral-500" />
        <span className="ml-2 rounded-full bg-neutral-800 px-2 py-0.5 text-[11px] text-neutral-300">
          Admin
        </span>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-md border border-neutral-800 bg-neutral-900 px-2.5 py-1 text-[12px] text-neutral-500 sm:flex">
          <Search size={13} />
          <span>Search</span>
          <span className="ml-6 rounded border border-neutral-700 px-1 text-[10px]">⌘K</span>
        </div>
        <Bell size={15} className="text-neutral-400" />
        <div className="h-6 w-6 rounded-full bg-gradient-to-br from-neutral-500 to-neutral-700" />
      </div>
    </div>
  );
}
