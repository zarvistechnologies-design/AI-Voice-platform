"use client";

import { useEffect, useRef } from "react";

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

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Glowing audio particles floating around the 3D wave mesh
    const particleCount = 42;
    const particleColors = [
      "rgba(16, 185, 129, ", // emerald
      "rgba(5, 150, 105, ",  // deep emerald
      "rgba(52, 211, 153, ", // bright mint
      "rgba(16, 141, 130, ", // brand teal
    ];

    const particles: Particle[] = Array.from({ length: particleCount }, (_, i) => ({
      u: 0.08 + (i / particleCount) * 0.84 + (Math.sin(i * 5.7) * 0.03),
      offsetY: (Math.sin(i * 4.3) * 50) + (Math.cos(i * 2.7) * 22),
      radius: 0.9 + (i % 4) * 0.4 + (i % 7 === 0 ? 0.8 : 0),
      speed: 1.3 + (i % 5) * 0.35,
      phase: i * 1.618,
      color: particleColors[i % particleColors.length],
    }));

    let width = 0;
    let height = 0;
    let animationFrame = 0;

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    // Density of wireframe strands across the ribbon
    const STRAND_COUNT = 36;
    const U_STEPS = 120;

    // Compute 3D coordinate on the undulating ribbon mesh
    const computePoint = (u: number, v: number, time: number) => {
      // u: 0 to 1 (left to right across viewport)
      // v: -1 to 1 (across ribbon width)

      // Envelope anchors smoothly at the edges and blooms across the center
      const envelope = Math.pow(Math.sin(u * Math.PI), 0.78);

      // Spine vertical position
      const centerY = height * 0.52;

      // Primary travelling harmonic wave (ribbon spine)
      const w1 = Math.sin(u * Math.PI * 3.2 - time * 1.4);
      const w2 = Math.sin(u * Math.PI * 6.4 - time * 2.1 + 0.9) * 0.38;
      const w3 = Math.sin(u * Math.PI * 9.8 - time * 2.8 + 1.8) * 0.16;
      const spineY = centerY + (w1 + w2 + w3) * (height * 0.125) * envelope;

      // 3D Depth displacement of the spine
      const spineZ = Math.sin(u * Math.PI * 2.6 - time * 1.1 + 0.6) * 140 * envelope;

      // Ribbon width and dynamic 3D twisting angle
      const ribbonWidth = (height * 0.22) * envelope;
      const twistAngle = u * Math.PI * 3.4 - time * 0.9 + Math.sin(u * Math.PI * 2.0 - time * 0.5) * 0.65;

      // Surface ripples across the ribbon width (silk cloth undulation)
      const ripple = Math.sin(u * Math.PI * 8.0 + v * Math.PI * 2.2 - time * 2.2) * (14 * envelope);

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

    const draw = (timestamp: number) => {
      const time = reducedMotion ? 2.5 : timestamp / 1000;
      context.clearRect(0, 0, width, height);

      if (width <= 0 || height <= 0) {
        if (!reducedMotion) animationFrame = window.requestAnimationFrame(draw);
        return;
      }

      // 1. Draw Transverse Mesh Ribs (subtle cross-grid wireframe as in reference photo)
      const ribStep = 7; // draw transverse ribs every 7th u step
      for (let i = 6; i <= U_STEPS - 6; i += ribStep) {
        const u = i / U_STEPS;
        context.beginPath();
        for (let j = 0; j < STRAND_COUNT; j += 2) {
          const v = -1 + (2 * j) / (STRAND_COUNT - 1);
          const pt = computePoint(u, v, time);
          if (j === 0) context.moveTo(pt.screenX, pt.screenY);
          else context.lineTo(pt.screenX, pt.screenY);
        }
        context.strokeStyle = "rgba(16, 185, 129, 0.22)";
        context.lineWidth = 0.6;
        context.stroke();
      }

      // 2. Draw Longitudinal Flowing Wave Strands (the parallel wavy lines)
      for (let j = 0; j < STRAND_COUNT; j++) {
        const v = -1 + (2 * j) / (STRAND_COUNT - 1);
        const isRim = j === 0 || j === STRAND_COUNT - 1 || j === Math.floor(STRAND_COUNT / 2);

        context.beginPath();
        for (let i = 0; i <= U_STEPS; i++) {
          const u = i / U_STEPS;
          const pt = computePoint(u, v, time);
          if (i === 0) {
            context.moveTo(pt.screenX, pt.screenY);
          } else {
            context.lineTo(pt.screenX, pt.screenY);
          }
        }

        // Color & line weight:
        // Rim lines are slightly crisper, interior lines are delicate wireframe threads
        if (isRim) {
          context.strokeStyle = j === Math.floor(STRAND_COUNT / 2)
            ? "rgba(5, 150, 105, 0.85)"
            : "rgba(16, 185, 129, 0.7)";
          context.lineWidth = 1.3;
        } else {
          // Gradient of green intensity across strands
          const strandAlpha = 0.32 + Math.sin((j / STRAND_COUNT) * Math.PI) * 0.35;
          context.strokeStyle = `rgba(16, 141, 130, ${strandAlpha})`;
          context.lineWidth = 0.85;
        }

        context.stroke();
      }

      // 3. Draw Ambient Audio Particles Orbiting the 3D Wave
      particles.forEach((p) => {
        const pt = computePoint(p.u, 0, time);

        // Fluid floating motion around wave path
        const floatY = Math.sin(time * p.speed + p.phase) * 16;
        const floatX = Math.cos(time * 0.2 + p.phase) * 12;
        const x = pt.screenX + floatX;
        const y = pt.screenY + p.offsetY + floatY;

        // Dynamic pulsing shimmer
        const shimmer = 0.28 + 0.65 * ((Math.sin(time * p.speed * 1.3 + p.phase) + 1) * 0.5);

        context.shadowColor = "rgba(16, 185, 129, 0.65)";
        context.shadowBlur = 6;

        context.beginPath();
        context.arc(x, y, p.radius, 0, Math.PI * 2);
        context.fillStyle = `${p.color}${shimmer})`;
        context.fill();

        if (p.radius > 1.5) {
          context.beginPath();
          context.arc(x, y, p.radius * 0.45, 0, Math.PI * 2);
          context.fillStyle = `rgba(255, 255, 255, ${shimmer * 0.9})`;
          context.fill();
        }
      });
      context.shadowBlur = 0;

      if (!reducedMotion) {
        animationFrame = window.requestAnimationFrame(draw);
      }
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    draw(0);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
