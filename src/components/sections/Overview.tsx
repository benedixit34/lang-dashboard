import React from "react";
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from "recharts";
import Card from "../ui/Card";
import StatCard from "../ui/StatCard";
import { SectionHeader } from "../ui/SectionHeader";
import { Dot, Pill } from "../ui/Badges";
import { CITIES, ACTIVITY } from "../../data/mockData";

export default function Overview() {
  return (
    <div>
      <SectionHeader title="Overview" description="A snapshot of your content and learner activity." />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Cities" value="12" delta="2 this month" positive />
        <StatCard label="Vocabulary words" value="850" delta="64 this month" positive />
        <StatCard label="Users" value="2,500" delta="180 this month" positive />
        <StatCard label="Completed levels" value="320" delta="12 this week" positive />
      </div>

      <Card className="mt-4 p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-[13px] font-medium text-neutral-900">Active learners</div>
            <div className="text-[12px] text-neutral-500">Last 7 days</div>
          </div>
          <Pill>+14.2% vs last week</Pill>
        </div>
        <div className="h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={ACTIVITY} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="fillLearners" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#171717" stopOpacity={0.18} />
                  <stop offset="100%" stopColor="#171717" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#a3a3a3" }} />
              <Tooltip
                cursor={{ stroke: "#e5e5e5" }}
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid #eaeaea",
                  fontSize: 12,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                }}
              />
              <Area type="monotone" dataKey="learners" stroke="#171717" strokeWidth={2} fill="url(#fillLearners)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card className="p-5">
          <div className="mb-3 text-[13px] font-medium text-neutral-900">Recently updated cities</div>
          <ul className="space-y-3">
            {CITIES.slice(0, 4).map((c) => (
              <li key={c.id} className="flex items-center justify-between text-[13px]">
                <span className="text-neutral-700">Level {c.level} — {c.name}</span>
                <Dot status={c.status} />
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-5">
          <div className="mb-3 text-[13px] font-medium text-neutral-900">Content checklist</div>
          <ul className="space-y-2.5 text-[13px] text-neutral-600">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> City name and cover image required before publish
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Vocabulary needs an image and audio file
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" /> 3 words in Hamburg are missing audio
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
