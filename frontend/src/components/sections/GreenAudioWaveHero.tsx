"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

const disableAnimationQuery = "(max-width: 640px), (prefers-reduced-motion: reduce)";

function subscribeToAnimationPreference(onChange: () => void) {
  const query = window.matchMedia(disableAnimationQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function animationDisabled() {
  return window.matchMedia(disableAnimationQuery).matches;
}

function serverAnimationDisabled() {
  return false;
}

type Particle = {
  u: number;
  offsetY: number;
  radius: number;
  speed: number;
  phase: number;
  color: string;
};

export function GreenAudioWaveHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const disabled = useSyncExternalStore(
    subscribeToAnimationPreference,
    animationDisabled,
    serverAnimationDisabled,
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    // Glowing audio particles matching the Vozon logo teal palette (#0D776E)
    const particleCount = 48;
    const particleColors = [
      "rgba(13, 119, 110, ",  // exact Vozon logo teal #0D776E
      "rgba(17, 135, 120, ",  // primary brand teal #118778
      "rgba(14, 111, 98, ",   // deep brand pine #0e6f62
      "rgba(20, 184, 166, ",  // luminous mint teal #14b8a6
      "rgba(45, 212, 191, ",  // soft cyan teal #2dd4bf
    ];

    const particles: Particle[] = Array.from({ length: particleCount }, (_, i) => ({
      u: 0.05 + (i / particleCount) * 0.9 + Math.sin(i * 5.7) * 0.03,
      offsetY: Math.sin(i * 4.3) * 55 + Math.cos(i * 2.7) * 25,
      radius: 1.2 + (i % 4) * 0.6 + (i % 7 === 0 ? 1.0 : 0),
      speed: 1.4 + (i % 5) * 0.35,
      phase: i * 1.618,
      color: particleColors[i % particleColors.length],
    }));

    let width = 0;
    let height = 0;
    let animationFrame = 0;
    let isDisposed = false;

    const resize = () => {
      const parent = canvas.parentElement;
      const parentRect = parent?.getBoundingClientRect();
      const bounds = canvas.getBoundingClientRect();

      const measuredWidth = bounds.width || parentRect?.width || window.innerWidth || 1200;
      const measuredHeight = bounds.height || parentRect?.height || 780;

      width = Math.max(measuredWidth, 320);
      height = Math.max(measuredHeight, 400);

      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    // Density of wireframe strands across the ribbon
    const STRAND_COUNT = 38;
    const U_STEPS = 128;

    // Compute 3D coordinate on the undulating ribbon mesh
    const computePoint = (u: number, v: number, time: number) => {
      // u: 0 to 1 (left to right across viewport)
      // v: -1 to 1 (across ribbon width)

      // Smooth envelope that arches across the hero
      const envelope = Math.pow(Math.sin(u * Math.PI), 0.78);

      // Spine vertical position: positioned gracefully across the buttons/lower hero to let text breathe
      const centerY = height * 0.60;

      // Primary travelling harmonic wave (ribbon spine)
      const w1 = Math.sin(u * Math.PI * 3.2 - time * 1.35);
      const w2 = Math.sin(u * Math.PI * 6.4 - time * 2.0 + 0.9) * 0.38;
      const w3 = Math.sin(u * Math.PI * 9.8 - time * 2.7 + 1.8) * 0.16;
      const spineY = centerY + (w1 + w2 + w3) * (height * 0.10) * envelope;

      // 3D Depth displacement of the spine
      const spineZ = Math.sin(u * Math.PI * 2.6 - time * 1.05 + 0.6) * 140 * envelope;

      // Ribbon width and dynamic 3D twisting angle
      const ribbonWidth = (height * 0.17) * envelope;
      const twistAngle = u * Math.PI * 3.4 - time * 0.88 + Math.sin(u * Math.PI * 2.0 - time * 0.48) * 0.65;

      // Surface ripples across the ribbon width (silk cloth undulation)
      const ripple = Math.sin(u * Math.PI * 8.0 + v * Math.PI * 2.2 - time * 2.1) * (14 * envelope);

      const localDist = v * ribbonWidth + ripple;
      const dY = localDist * Math.cos(twistAngle);
      const dZ = localDist * Math.sin(twistAngle);

      const px = u * width;
      const py = spineY + dY;
      const pz = spineZ + dZ;

      // 3D perspective projection
      const cameraFocal = 650;
      const scale = cameraFocal / (cameraFocal + pz);

      const screenX = px;
      const screenY = centerY + (py - centerY) * scale;

      return { screenX, screenY, pz, scale };
    };

    let lastTimestamp = 0;
    let simTime = 0;

    const draw = (timestamp: number) => {
      if (isDisposed) return;

      if (!lastTimestamp) lastTimestamp = timestamp;
      const dt = Math.min((timestamp - lastTimestamp) / 1000, 0.08);
      lastTimestamp = timestamp;
      simTime += dt;

      if (width <= 0 || height <= 0) {
        resize();
      }

      context.clearRect(0, 0, width, height);

      // 0. Draw subtle ambient radial glow matching logo teal #0D776E
      const radialGlow = context.createRadialGradient(
        width * 0.5,
        height * 0.60,
        20,
        width * 0.5,
        height * 0.60,
        Math.max(width * 0.5, 380)
      );
      radialGlow.addColorStop(0, "rgba(13, 119, 110, 0.08)");
      radialGlow.addColorStop(0.5, "rgba(17, 135, 120, 0.03)");
      radialGlow.addColorStop(1, "rgba(255, 255, 255, 0)");
      context.fillStyle = radialGlow;
      context.fillRect(0, 0, width, height);

      // 1. Draw Transverse Mesh Ribs (subtle cross-grid harmonics softened in center)
      const ribStep = 8;
      for (let i = 6; i <= U_STEPS - 6; i += ribStep) {
        const u = i / U_STEPS;
        const distFromCenter = Math.abs(u - 0.5) * 2;
        const centerTextFade = 0.35 + 0.65 * Math.pow(distFromCenter, 0.75);

        context.beginPath();
        for (let j = 0; j < STRAND_COUNT; j += 2) {
          const v = -1 + (2 * j) / (STRAND_COUNT - 1);
          const pt = computePoint(u, v, simTime);
          if (j === 0) context.moveTo(pt.screenX, pt.screenY);
          else context.lineTo(pt.screenX, pt.screenY);
        }
        context.strokeStyle = `rgba(13, 119, 110, ${(0.18 * centerTextFade).toFixed(3)})`;
        context.lineWidth = 0.65;
        context.stroke();
      }

      // 2. Draw Longitudinal Flowing Wave Strands in Logo Teal
      for (let j = 0; j < STRAND_COUNT; j++) {
        const v = -1 + (2 * j) / (STRAND_COUNT - 1);
        const isRim = j === 0 || j === STRAND_COUNT - 1 || j === Math.floor(STRAND_COUNT / 2);

        context.beginPath();
        for (let i = 0; i <= U_STEPS; i++) {
          const u = i / U_STEPS;
          const pt = computePoint(u, v, simTime);
          if (i === 0) {
            context.moveTo(pt.screenX, pt.screenY);
          } else {
            context.lineTo(pt.screenX, pt.screenY);
          }
        }

        // Color & line weight matching logo teal #0D776E with central text attenuation
        const peakAlpha = isRim
          ? (j === Math.floor(STRAND_COUNT / 2) ? 0.88 : 0.72)
          : (0.28 + Math.sin((j / STRAND_COUNT) * Math.PI) * 0.32);

        const strandGrad = context.createLinearGradient(0, 0, width, 0);
        const rgb = isRim
          ? (j === Math.floor(STRAND_COUNT / 2) ? "13, 119, 110" : "17, 135, 120")
          : "14, 111, 98";

        strandGrad.addColorStop(0, `rgba(${rgb}, 0)`);
        strandGrad.addColorStop(0.12, `rgba(${rgb}, ${(peakAlpha * 0.9).toFixed(3)})`);
        strandGrad.addColorStop(0.32, `rgba(${rgb}, ${(peakAlpha * 0.65).toFixed(3)})`);
        strandGrad.addColorStop(0.50, `rgba(${rgb}, ${(peakAlpha * 0.20).toFixed(3)})`); // softened behind text
        strandGrad.addColorStop(0.68, `rgba(${rgb}, ${(peakAlpha * 0.65).toFixed(3)})`);
        strandGrad.addColorStop(0.88, `rgba(${rgb}, ${(peakAlpha * 0.9).toFixed(3)})`);
        strandGrad.addColorStop(1, `rgba(${rgb}, 0)`);

        context.strokeStyle = strandGrad;
        context.lineWidth = isRim ? 1.35 : 0.95;
        context.stroke();
      }

      // 3. Draw Ambient Audio Particles Orbiting the 3D Wave
      particles.forEach((p) => {
        const pt = computePoint(p.u, 0, simTime);

        const floatY = Math.sin(simTime * p.speed + p.phase) * 18;
        const floatX = Math.cos(simTime * 0.3 + p.phase) * 14;
        const x = pt.screenX + floatX;
        const y = pt.screenY + p.offsetY + floatY;

        const shimmer = 0.4 + 0.58 * ((Math.sin(simTime * p.speed * 1.3 + p.phase) + 1) * 0.5);

        context.shadowColor = "rgba(13, 119, 110, 0.70)";
        context.shadowBlur = 8;

        context.beginPath();
        context.arc(x, y, p.radius, 0, Math.PI * 2);
        context.fillStyle = `${p.color}${shimmer.toFixed(2)})`;
        context.fill();

        if (p.radius > 1.6) {
          context.beginPath();
          context.arc(x, y, p.radius * 0.45, 0, Math.PI * 2);
          context.fillStyle = `rgba(255, 255, 255, ${(shimmer * 0.95).toFixed(2)})`;
          context.fill();
        }
      });
      context.shadowBlur = 0;

      animationFrame = window.requestAnimationFrame(draw);
    };

    const handleResize = () => {
      resize();
      draw(performance.now());
    };

    const observer = new ResizeObserver(handleResize);
    if (canvas.parentElement) observer.observe(canvas.parentElement);
    observer.observe(canvas);
    window.addEventListener("resize", handleResize);

    resize();
    animationFrame = window.requestAnimationFrame(draw);

    return () => {
      isDisposed = true;
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  if (disabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "block",
        pointerEvents: "none",
        zIndex: 1,
      }}
      aria-hidden="true"
    />
  );
}
