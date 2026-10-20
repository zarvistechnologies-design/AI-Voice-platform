"use client";

import React, { useState } from "react";

const serviceOptions = [
  "Inbound Receptionist & Support",
  "Outbound Dialer & Lead Qualification",
  "Multilingual Indic (Hindi / Tamil / etc.)",
  "Custom API / MCP Server Integration",
];

const volumeOptions = [
  "Under 10k mins / month",
  "10k - 50k mins / month",
  "50k - 200k mins / month",
  "Enterprise Scale (200k+ mins)",
];

interface NexStudioDiscoveryCallProps {
  theme?: "dark" | "light";
}

export function NexStudioDiscoveryCall({ theme = "dark" }: NexStudioDiscoveryCallProps) {
  const [selectedServices, setSelectedServices] = useState<string[]>(["Inbound Receptionist & Support"]);
  const [selectedVolume, setSelectedVolume] = useState<string>("10k - 50k mins / month");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const isDark = theme !== "light";

  const toggleService = (srv: string) => {
    if (selectedServices.includes(srv)) {
      if (selectedServices.length > 1) {
        setSelectedServices(selectedServices.filter((s) => s !== srv));
      }
    } else {
      setSelectedServices([...selectedServices, srv]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email) {
      setSubmitted(true);
    }
  };

  return (
    <section
      className={`py-20 lg:py-28 transition-colors duration-300 border-t ${
        isDark ? "bg-transparent border-white/5" : "bg-white border-gray-100"
      }`}
    >
      <div className="max-w-5xl mx-auto px-6">
        <div
          className={`rounded-3xl p-8 sm:p-14 transition-all duration-300 ${
            isDark
              ? "bg-[#0e0e14]/80 border border-white/10 text-white backdrop-blur-xl shadow-2xl"
              : "bg-gray-50/60 border border-gray-200 text-black shadow-sm"
          }`}
        >
          {/* Eyebrow */}
          <div className="mb-4">
            <span className="text-xs nexstudio-mono uppercase tracking-widest text-[#FF5500] font-semibold">
              SCHEDULE A DISCOVERY CALL
            </span>
          </div>

          <h2 className={`text-3xl sm:text-5xl font-normal tracking-tight mb-4 leading-tight ${isDark ? "text-white" : "text-black"}`}>
            Ready to Automate Your{" "}
            <span className={`nexstudio-italic-serif italic font-serif ${isDark ? "text-white" : "text-black"}`}>
              Voice Operations
            </span>
            ?
          </h2>
          <p className={`text-sm sm:text-base leading-relaxed max-w-xl mb-10 ${isDark ? "text-neutral-400" : "text-gray-600"}`}>
            During this 20-minute discovery call, our solution engineers review your telecom requirements, model latency specs, and set up a custom voice agent sandbox for your brand.
          </p>

          {submitted ? (
            <div
              className={`p-8 rounded-2xl border ${
                isDark
                  ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-200"
                  : "bg-emerald-50 border-emerald-200 text-emerald-900"
              }`}
            >
              <h3 className="text-xl font-semibold mb-2">✓ Discovery Call Confirmed!</h3>
              <p className="text-sm">
                Thank you, {name}. Our enterprise voice engineer has received your specs and will connect with you at{" "}
                <strong className={isDark ? "text-emerald-100" : "text-emerald-950"}>{email}</strong> within 1 business hour.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              {/* Service Selection */}
              <div>
                <label
                  className={`block text-xs nexstudio-mono uppercase tracking-wider font-semibold mb-3 ${
                    isDark ? "text-neutral-300" : "text-gray-700"
                  }`}
                >
                  What services do you need?
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {serviceOptions.map((srv) => (
                    <button
                      key={srv}
                      type="button"
                      onClick={() => toggleService(srv)}
                      className={`px-4 py-2 rounded-full text-xs nexstudio-mono transition-all duration-200 ${
                        selectedServices.includes(srv)
                          ? isDark
                            ? "bg-white text-black font-semibold shadow"
                            : "bg-black text-white font-medium"
                          : isDark
                          ? "bg-white/5 border border-white/10 text-neutral-300 hover:border-white/30"
                          : "bg-white border border-gray-200 text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      {srv}
                    </button>
                  ))}
                </div>
              </div>

              {/* Volume Selection */}
              <div>
                <label
                  className={`block text-xs nexstudio-mono uppercase tracking-wider font-semibold mb-3 ${
                    isDark ? "text-neutral-300" : "text-gray-700"
                  }`}
                >
                  Estimated monthly calling volume
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {volumeOptions.map((vol) => (
                    <button
                      key={vol}
                      type="button"
                      onClick={() => setSelectedVolume(vol)}
                      className={`px-4 py-2 rounded-full text-xs nexstudio-mono transition-all duration-200 ${
                        selectedVolume === vol
                          ? "bg-[#FF5500] text-white font-semibold shadow-md shadow-[#FF5500]/30"
                          : isDark
                          ? "bg-white/5 border border-white/10 text-neutral-300 hover:border-white/30"
                          : "bg-white border border-gray-200 text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      {vol}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Input Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={`block text-xs nexstudio-mono mb-1.5 uppercase ${isDark ? "text-neutral-400" : "text-gray-600"}`}>
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Verma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full h-12 px-4 rounded-xl text-sm outline-none transition-colors ${
                      isDark
                        ? "bg-black/50 border border-white/15 text-white placeholder-neutral-500 focus:border-[#FF5500]"
                        : "border border-gray-200 bg-white text-black focus:border-black"
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-xs nexstudio-mono mb-1.5 uppercase ${isDark ? "text-neutral-400" : "text-gray-600"}`}>
                    Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="rahul@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full h-12 px-4 rounded-xl text-sm outline-none transition-colors ${
                      isDark
                        ? "bg-black/50 border border-white/15 text-white placeholder-neutral-500 focus:border-[#FF5500]"
                        : "border border-gray-200 bg-white text-black focus:border-black"
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-xs nexstudio-mono mb-1.5 uppercase ${isDark ? "text-neutral-400" : "text-gray-600"}`}>
                    Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full h-12 px-4 rounded-xl text-sm outline-none transition-colors ${
                      isDark
                        ? "bg-black/50 border border-white/15 text-white placeholder-neutral-500 focus:border-[#FF5500]"
                        : "border border-gray-200 bg-white text-black focus:border-black"
                    }`}
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-4 bg-[#FF5500] hover:bg-[#ff6a1a] text-white rounded-full text-xs nexstudio-mono uppercase font-semibold tracking-wider transition-all duration-200 shadow-lg shadow-[#FF5500]/25 hover:shadow-xl hover:shadow-[#FF5500]/40 flex items-center justify-center gap-2"
                >
                  <span>CONFIRM DISCOVERY CALL</span>
                  <span>→</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

export default NexStudioDiscoveryCall;
