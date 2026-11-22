"use client";

import { useEffect, useState } from "react";

import { publicVoiceMessage, voiceApi, type NativeAppointment } from "@/lib/voice";

export function NativeAppointmentsPanel({ agentId, timezone }: { agentId: string; timezone: string }) {
  const [result, setResult] = useState<{ agentId: string; appointments: NativeAppointment[]; error: string } | null>(null);

  useEffect(() => {
    let active = true;
    void voiceApi.nativeAppointments(agentId)
      .then((response) => { if (active) setResult({ agentId, appointments: response.appointments, error: "" }); })
      .catch((reason: unknown) => { if (active) setResult({ agentId, appointments: [], error: publicVoiceMessage(reason, "Could not load appointments.") }); });
    return () => { active = false; };
  }, [agentId]);

  const current = result?.agentId === agentId ? result : null;
  const loading = current === null;
  const appointments = current?.appointments ?? [];
  const error = current?.error ?? "";

  return (
    <section className="overflow-hidden rounded-xl border border-[#c5ded5] bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#dce7e3] bg-[#f1f9f6] px-4 py-3.5">
        <div>
          <h3 className="app-section-title m-0">Vozon appointments</h3>
          <span className="app-caption">Confirmed bookings created by this agent. API: GET /agents/{agentId}/appointments</span>
        </div>
        <span className="app-label rounded-full border border-[#b8c8c3] bg-white px-2.5 py-1 text-[#0e6f62]">{appointments.length} bookings</span>
      </div>
      {loading ? <p className="p-4 text-sm text-[#71817d]">Loading appointments…</p> : null}
      {error ? <p className="p-4 text-sm text-rose-700">{error}</p> : null}
      {!loading && !error && appointments.length === 0 ? (
        <p className="p-4 text-sm leading-6 text-[#71817d]">No appointments yet. The availability and booking tools are ready for test calls.</p>
      ) : null}
      {appointments.length ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-[#e6ecea] bg-[#fafcfb] text-xs uppercase tracking-wide text-[#71817d]"><tr><th className="px-4 py-3">Patient</th><th className="px-4 py-3">Doctor</th><th className="px-4 py-3">Appointment</th><th className="px-4 py-3">Reference</th><th className="px-4 py-3">Status</th></tr></thead>
            <tbody className="divide-y divide-[#edf0f4]">
              {appointments.map((appointment) => (
                <tr key={appointment._id}>
                  <td className="px-4 py-3"><strong className="block text-[#14231f]">{appointment.patientName}</strong><span className="text-xs text-[#71817d]">{appointment.patientPhone}</span></td>
                  <td className="px-4 py-3 text-[#40564f]">{appointment.provider}</td>
                  <td className="px-4 py-3"><strong className="block text-[#14231f]">{new Intl.DateTimeFormat("en-IN", { timeZone: appointment.timezone || timezone, dateStyle: "medium", timeStyle: "short" }).format(new Date(appointment.startAt))}</strong><span className="text-xs text-[#71817d]">{appointment.appointmentType}</span></td>
                  <td className="px-4 py-3 font-mono text-xs text-[#40564f]">{appointment.bookingReference}</td>
                  <td className="px-4 py-3"><span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">{appointment.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}
