"use client";

import React, { useState, useRef, useEffect } from "react";
import { API_URL } from "@/lib/apiBase";
import styles from "./TalkToAgentWidget.module.css";

const SCENARIOS = [
  { id: "real_estate", label: "Real Estate", persona: "Amisha", role: "Property Advisor", icon: "🏢" },
  { id: "car_dealership", label: "Car Dealership", persona: "Pooja", role: "Auto Consultant", icon: "🚗" },
  { id: "school_admission", label: "School Admission", persona: "Priya", role: "Admissions Head", icon: "🎓" },
  { id: "restaurant", label: "Restaurant", persona: "Simran", role: "Reservation Host", icon: "🍽️" },
  { id: "hotel_reservation", label: "Hotel Reservation", persona: "Maya", role: "Front Desk Concierge", icon: "🏨" },
  { id: "school_franchise", label: "School Franchise", persona: "Sneha", role: "Franchise Manager", icon: "🏫" },
] as const;

const COUNTRY_CODES = [
  { code: "+91", label: "+91", flag: "🇮🇳" },
  { code: "+1", label: "+1", flag: "🇺🇸" },
  { code: "+971", label: "+971", flag: "🇦🇪" },
  { code: "+44", label: "+44", flag: "🇬🇧" },
  { code: "+65", label: "+65", flag: "🇸🇬" },
  { code: "+61", label: "+61", flag: "🇦🇺" },
] as const;

const LANGUAGES = [
  { code: "English", label: "English" },
  { code: "Hindi", label: "हिन्दी (Hindi)" },
  { code: "Gujarati", label: "ગુજરાતી (Gujarati)" },
  { code: "Marathi", label: "मराठी (Marathi)" },
  { code: "Tamil", label: "தமிழ் (Tamil)" },
  { code: "Telugu", label: "తెలుగు (Telugu)" },
  { code: "Bengali", label: "বাংলা (Bengali)" },
  { code: "Kannada", label: "ಕನ್ನಡ (Kannada)" },
  { code: "Punjabi", label: "ਪੰਜਾਬੀ (Punjabi)" },
] as const;

export function TalkToAgentWidget() {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<(typeof COUNTRY_CODES)[number]>(COUNTRY_CODES[0]);
  const [selectedScenario, setSelectedScenario] = useState<(typeof SCENARIOS)[number]>(SCENARIOS[0]); // Default: Real Estate (Amisha)
  const [selectedLanguage, setSelectedLanguage] = useState<string>(LANGUAGES[0].code);

  const [scenarioOpen, setScenarioOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);

  // Call states
  const [callingState, setCallingState] = useState<"idle" | "dialing" | "ringing" | "connected" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setScenarioOpen(false);
        setCountryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle Outbound Phone Call "Initiate call"
  const handleInitiateCall = async () => {
    let clean = phoneNumber.trim().replace(/[^\d+]/g, "");
    if (!clean) {
      setCallingState("error");
      setStatusMessage("Please enter your phone number.");
      return;
    }

    let fullPhoneNumber = clean;
    if (clean.startsWith("+")) {
      fullPhoneNumber = clean;
    } else {
      const countryDigits = selectedCountry.code.replace(/\D/g, "");
      if (clean.startsWith(countryDigits) && clean.length > 10) {
        fullPhoneNumber = `+${clean}`;
      } else {
        fullPhoneNumber = `${selectedCountry.code}${clean.replace(/^0+/, "")}`;
      }
    }

    const digitsOnly = fullPhoneNumber.replace(/\D/g, "");
    if (digitsOnly.length < 10) {
      setCallingState("error");
      setStatusMessage("Please enter a valid 10-digit number.");
      return;
    }

    setCallingState("dialing");
    setStatusMessage(`Dialing ${fullPhoneNumber}…`);

    try {
      const response = await fetch(`${API_URL}/api/public/demo/call`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phoneNumber: fullPhoneNumber,
          scenarioId: selectedScenario.id,
          language: selectedLanguage,
          gender: "female",
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to initiate call right now.");
      }

      setCallingState("ringing");
      setStatusMessage(`Calling ${fullPhoneNumber}! Your phone will ring shortly from +918044318955.`);
    } catch (err) {
      setCallingState("error");
      setStatusMessage(err instanceof Error ? err.message : "Call failed. Please try again.");
    }
  };

  return (
    <div className={styles.phoneScreenWrapper} ref={dropdownRef}>
      {/* Top Phone Status & Dynamic Island */}
      <div className={styles.phoneTopBar}>
        <span className={styles.phoneTime}>9:41</span>
        <div className={styles.dynamicIsland}>
          <span className={styles.islandCamera} />
          <span className={styles.islandWave} />
        </div>
        <div className={styles.phoneIcons}>
          <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
            <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 19.5c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l1.89-1.89C9.28 19.68 10.59 20 12 20c4.97 0 9-4.03 9-9s-4.03-9-9-9z"/>
          </svg>
          <span className={styles.batteryPill}><i /></span>
        </div>
      </div>

      {/* Brand Header */}
      <div className={styles.deviceHeader}>
        <div className={styles.brandRow}>
          <span className={styles.brandName}>Vozon</span>
          <span className={styles.liveTag}>
            <span className={styles.liveDot} />
            Live Call
          </span>
        </div>
        <h3 className={styles.deviceTitle}>Talk to your AI agent</h3>
        <p className={styles.deviceSubtitle}>Experience a live phone call in your preferred language</p>
      </div>

      {/* Active Persona Badge */}
      <div className={styles.personaBanner}>
        <div className={styles.personaAvatar}>
          <span className={styles.avatarEmoji}>{selectedScenario.icon}</span>
          <span className={styles.avatarOnlineDot} />
        </div>
        <div className={styles.personaInfo}>
          <span className={styles.personaName}>{selectedScenario.persona}</span>
          <span className={styles.personaRole}>{selectedScenario.label} • {selectedScenario.role}</span>
        </div>
        <span className={styles.personaFemaleBadge}>Female Persona</span>
      </div>

      {/* Form Container */}
      <div className={styles.formContainer}>
        {/* Industry / Scenario Dropdown */}
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>Choose industry</label>
          <button
            type="button"
            className={styles.scenarioButton}
            onClick={() => {
              setScenarioOpen(!scenarioOpen);
              setCountryOpen(false);
            }}
          >
            <span className={styles.scenarioButtonText}>
              <span className={styles.fieldIcon}>{selectedScenario.icon}</span>
              {selectedScenario.label}
            </span>
            <svg
              viewBox="0 0 24 24"
              className={`${styles.dropdownChevron} ${scenarioOpen ? styles.dropdownChevronOpen : ""}`}
              stroke="currentColor"
              strokeWidth="2.5"
              fill="none"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {scenarioOpen && (
            <ul className={styles.scenarioDropdown}>
              {SCENARIOS.map((scenario) => (
                <li
                  key={scenario.id}
                  className={`${styles.scenarioItem} ${
                    selectedScenario.id === scenario.id ? styles.scenarioItemSelected : ""
                  }`}
                  onClick={() => {
                    setSelectedScenario(scenario);
                    setScenarioOpen(false);
                  }}
                >
                  <span className={styles.scenarioItemIcon}>{scenario.icon}</span>
                  <div className={styles.scenarioItemText}>
                    <span className={styles.scenarioItemLabel}>{scenario.label}</span>
                    <span className={styles.scenarioItemPersona}>{scenario.persona}</span>
                  </div>
                  {selectedScenario.id === scenario.id && (
                    <svg viewBox="0 0 24 24" className={styles.checkIcon} stroke="currentColor" strokeWidth="3" fill="none">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Language Selection */}
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>Conversation Language</label>
          <div className={styles.languageWrapper}>
            <span className={styles.langIcon}>🌐</span>
            <select
              className={styles.languageSelect}
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Name Input */}
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>Your name</label>
          <input
            type="text"
            className={styles.textInput}
            placeholder="e.g. Rahul Sharma"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={60}
          />
        </div>

        {/* Phone Number Input */}
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>Phone number</label>
          <div className={styles.phoneInputRow}>
            {/* Country Selector */}
            <div className={styles.countryPicker}>
              <button
                type="button"
                className={styles.countryBtn}
                onClick={() => {
                  setCountryOpen(!countryOpen);
                  setScenarioOpen(false);
                }}
              >
                <span>{selectedCountry.flag}</span>
                <span className={styles.countryDigits}>{selectedCountry.code}</span>
                <svg viewBox="0 0 24 24" width="10" height="10" stroke="currentColor" strokeWidth="2.5" fill="none">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {countryOpen && (
                <ul className={styles.countryDropdown}>
                  {COUNTRY_CODES.map((c) => (
                    <li
                      key={c.code}
                      className={styles.countryItem}
                      onClick={() => {
                        setSelectedCountry(c);
                        setCountryOpen(false);
                      }}
                    >
                      <span>{c.flag}</span>
                      <span>{c.label}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <input
              type="tel"
              className={styles.phoneField}
              placeholder="98765 43210"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleInitiateCall();
              }}
            />
          </div>
        </div>

        {/* Status Feedback Message */}
        {statusMessage && (
          <div
            className={`${styles.statusBanner} ${
              callingState === "error"
                ? styles.statusError
                : callingState === "ringing"
                ? styles.statusRinging
                : styles.statusDialing
            }`}
          >
            {callingState === "dialing" && <span className={styles.statusSpinner} />}
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Single Primary Call Button - NO RECORD AUDIO */}
        <button
          type="button"
          className={`${styles.initiateButton} ${
            callingState === "dialing" || callingState === "ringing" ? styles.initiateButtonActive : ""
          }`}
          onClick={handleInitiateCall}
          disabled={callingState === "dialing"}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.2" fill="none">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          <span>
            {callingState === "dialing"
              ? "Connecting call…"
              : callingState === "ringing"
              ? "Ringing your phone…"
              : "Initiate call"}
          </span>
        </button>

        {/* Caller ID Info Badge */}
        <p className={styles.callerIdNote}>
          Incoming call from <strong>+918044318955</strong> • Zero spam
        </p>
      </div>

      {/* iPhone Home Indicator */}
      <div className={styles.homeBar} />
    </div>
  );
}
