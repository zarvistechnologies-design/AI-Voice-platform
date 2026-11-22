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
      <section className="rounded-xl border border-[#dbe4e1] bg-white p-4">
        <h3 className="m-0 text-sm font-semibold text-slate-900">Conversion funnel</h3>
        <p className="mt-1 text-xs text-slate-500">From uploaded contacts to verified business results.</p>
        <div className="mt-4 h-64" aria-label="Campaign conversion funnel chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={funnelData} margin={{ left: -18, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip cursor={{ fill: "#f1f5f9" }} />
              <Bar dataKey="value" fill="#118778" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
      <section className="rounded-xl border border-[#dbe4e1] bg-white p-4">
        <h3 className="m-0 text-sm font-semibold text-slate-900">Campaign trend</h3>
        <p className="mt-1 text-xs text-slate-500">Daily attempts, connections, and achieved goals.</p>
        <div className="mt-4 h-64" aria-label="Campaign results over time chart">
          {timeline.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeline} margin={{ left: -18, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="attempts" stroke="#64748b" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="connected" stroke="#118778" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="goals" stroke="#2563eb" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="grid h-full place-items-center text-sm text-slate-400">Trend data appears after the first call.</div>
          )}
        </div>
      </section>
    </div>
  );
}
