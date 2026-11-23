"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type {
  CampaignResultFunnel,
  CampaignResultTimelinePoint,
} from "@/lib/voice";

export function CampaignResultsCharts({
  funnel,
  timeline,
}: {
  funnel: CampaignResultFunnel;
  timeline: CampaignResultTimelinePoint[];
}) {
  const funnelData = [
    { name: "Contacts", value: funnel.contacts },
    { name: "Attempted", value: funnel.attempted },
    { name: "Connected", value: funnel.connected },
    { name: "Classified", value: funnel.classified },
    { name: "Goals", value: funnel.goals },
    { name: "Verified", value: funnel.verifiedConversions },
  ];
  return (
    <div className="grid gap-3 xl:grid-cols-2">
      <section className="rounded-lg border border-[#eaeaea] bg-white p-4">
        <h3 className="m-0 text-[13px] font-semibold text-[#171717]">Conversion funnel</h3>
        <p className="mt-0.5 text-[11.5px] text-[#71717a]">
          From uploaded contacts to verified business results.
        </p>
        <div className="mt-4 h-60" aria-label="Campaign conversion funnel chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={funnelData} margin={{ left: -18, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eaeaea" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#71717a" }} interval={0} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#71717a" }} />
              <Tooltip cursor={{ fill: "#f4f4f5" }} />
              <Bar dataKey="value" fill="#171717" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
      <section className="rounded-lg border border-[#eaeaea] bg-white p-4">
        <h3 className="m-0 text-[13px] font-semibold text-[#171717]">Campaign trend</h3>
        <p className="mt-0.5 text-[11.5px] text-[#71717a]">
          Daily attempts, connections, and achieved goals.
        </p>
        <div className="mt-4 h-60" aria-label="Campaign results over time chart">
          {timeline.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeline} margin={{ left: -18, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eaeaea" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#71717a" }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#71717a" }} />
                <Tooltip />
                <Line type="monotone" dataKey="attempts" stroke="#a1a1aa" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="connected" stroke="#52525b" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="goals" stroke="#171717" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="grid h-full place-items-center text-[12px] text-[#71717a]">
              Trend data appears after the first call.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
