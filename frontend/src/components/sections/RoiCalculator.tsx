"use client";

import { useId, useState } from "react";
import Link from "next/link";
import styles from "./RoiCalculator.module.css";

export function RoiCalculator() {
  const [callVolume, setCallVolume] = useState<number>(25000);
  const [callDuration, setCallDuration] = useState<number>(3); // minutes
  const volumeInputId = useId();
  const durationInputId = useId();

  // Financial Constants
  const humanCostPerCallInr = 48; // Typical BPO / call center cost per handled call in INR
  const vozonCostPerMinuteInr = 2.8; // All-inclusive Vozon Realtime AI + carrier telephony rate

  // Calculations
  const humanMonthlyTotalInr = callVolume * humanCostPerCallInr;
  const totalMinutes = callVolume * callDuration;
  const vozonMonthlyTotalInr = totalMinutes * vozonCostPerMinuteInr;
  const monthlySavingsInr = Math.max(0, humanMonthlyTotalInr - vozonMonthlyTotalInr);
  const savingsPercentage = Math.round((monthlySavingsInr / humanMonthlyTotalInr) * 100);
  const annualSavingsInr = monthlySavingsInr * 12;

  const formatCurrency = (val: number) => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    }
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)} Lakh`;
    }
    return `₹${val.toLocaleString("en-IN")}`;
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.eyebrow}>Enterprise Economic Impact</span>
        <h2>Calculate Your Real-Time Voice AI ROI</h2>
        <p>Compare traditional human call center staffing costs with autonomous Vozon AI Agents.</p>
      </div>

      <div className={styles.card}>
        <div className={styles.controlsCol}>
          {/* Slider 1: Monthly Calls */}
          <div className={styles.sliderGroup}>
            <div className={styles.sliderLabelRow}>
              <label htmlFor={volumeInputId}>Monthly Call Volume</label>
              <span className={styles.sliderValue}>{callVolume.toLocaleString("en-IN")} calls</span>
            </div>
            <input
              id={volumeInputId}
              type="range"
              min="2000"
              max="200000"
              step="1000"
              value={callVolume}
              onChange={(e) => setCallVolume(Number(e.target.value))}
              className={styles.rangeInput}
            />
            <div className={styles.sliderTicks}>
              <span>2K</span>
              <span>50K</span>
              <span>100K</span>
              <span>200K+</span>
            </div>
          </div>

          {/* Slider 2: Average Duration */}
          <div className={styles.sliderGroup}>
            <div className={styles.sliderLabelRow}>
              <label htmlFor={durationInputId}>Average Call Duration</label>
              <span className={styles.sliderValue}>{callDuration} minutes</span>
            </div>
            <input
              id={durationInputId}
              type="range"
              min="1"
              max="8"
              step="0.5"
              value={callDuration}
              onChange={(e) => setCallDuration(Number(e.target.value))}
              className={styles.rangeInput}
            />
            <div className={styles.sliderTicks}>
              <span>1 min</span>
              <span>3 mins</span>
              <span>5 mins</span>
              <span>8 mins</span>
            </div>
          </div>

          {/* Key Advantages Checklist */}
          <div className={styles.advantagesList}>
            <div className={styles.advantageItem}>
              <span className={styles.checkIcon}>✓</span>
              <div>
                <strong>Zero Queue / Instant Pickups</strong>
                <small>Scales to 10,000+ simultaneous calls instantly</small>
              </div>
            </div>
            <div className={styles.advantageItem}>
              <span className={styles.checkIcon}>✓</span>
              <div>
                <strong>100% CRM & Calendar Sync</strong>
                <small>Autonomous data capture without manual human error</small>
              </div>
            </div>
            <div className={styles.advantageItem}>
              <span className={styles.checkIcon}>✓</span>
              <div>
                <strong>30+ Native Languages & Accents</strong>
                <small>Flawless multilingual support with zero extra hiring</small>
              </div>
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className={styles.resultsCol}>
          <div className={styles.resultsCardInner}>
            <div className={styles.savingsHero}>
              <span className={styles.savingsTag}>Projected Cost Reduction</span>
              <div className={styles.savingsBig}>{savingsPercentage}% Saved</div>
              <div className={styles.savingsAmount}>
                {formatCurrency(monthlySavingsInr)} <span>/ month</span>
              </div>
              <div className={styles.annualBadge}>
                💰 Annualized Savings: <strong>{formatCurrency(annualSavingsInr)} / year</strong>
              </div>
            </div>

            {/* Comparison Breakdown Bar */}
            <div className={styles.comparisonGrid}>
              <div className={styles.comparisonBox}>
                <small>Traditional Call Center</small>
                <strong>{formatCurrency(humanMonthlyTotalInr)}</strong>
                <span>~₹48 / handled call</span>
              </div>
              <div className={`${styles.comparisonBox} ${styles.vozonBox}`}>
                <small>Vozon Autonomous AI</small>
                <strong>{formatCurrency(vozonMonthlyTotalInr)}</strong>
                <span>₹2.80 / active minute</span>
              </div>
            </div>

            <Link href="/signup" className={styles.ctaButton}>
              Deploy AI Agent & Start Saving →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
