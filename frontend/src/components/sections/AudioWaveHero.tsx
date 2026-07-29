"use client";

import { useEffect, useRef } from "react";

type Particle = { x: number; y: number; radius: number; drift: number; phase: number };

export function AudioWaveHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const particles: Particle[] = Array.from({ length: 90 }, (_, index) => ({
      x: ((index * 67) % 997) / 997,
      y: 0.3 + (((index * 43) % 211) / 211) * 0.45,
      radius: 0.65 + (index % 4) * 0.4,
      drift: 0.22 + (index % 7) * 0.06,
      phase: index * 1.73,
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

    const waveY = (x: number, time: number, layer: number) => {
      const position = x / Math.max(width, 1);
      const envelope = 0.62 + Math.sin(position * Math.PI) * 0.38;
      return height * 0.59
        + Math.sin(position * Math.PI * (3.2 + layer * 0.09) + time * (0.42 + layer * 0.018) + layer * 0.74)
          * height * (0.105 + layer * 0.003) * envelope
        + Math.sin(position * Math.PI * 7.4 - time * 0.28 + layer) * height * 0.025;
    };

    const draw = (timestamp: number) => {
      const time = reducedMotion ? 2.4 : timestamp / 1000;
      context.clearRect(0, 0, width, height);

      const glow = context.createRadialGradient(width * 0.5, height * 0.55, 0, width * 0.5, height * 0.55, width * 0.52);
      glow.addColorStop(0, "rgba(105, 7, 133, .17)");
      glow.addColorStop(0.44, "rgba(0, 194, 221, .08)");
      glow.addColorStop(1, "rgba(0, 0, 0, 0)");
      context.fillStyle = glow;
      context.fillRect(0, 0, width, height);

      [
        { offset: 66, start: "rgba(0, 211, 245, .66)", middle: "rgba(0, 58, 143, .12)", end: "rgba(55, 0, 160, .3)", layer: 1 },
        { offset: 40, start: "rgba(25, 239, 220, .48)", middle: "rgba(56, 24, 170, .2)", end: "rgba(214, 0, 183, .38)", layer: 3 },
        { offset: 54, start: "rgba(56, 0, 145, .12)", middle: "rgba(112, 0, 135, .3)", end: "rgba(255, 0, 111, .74)", layer: 6 },
      ].forEach((ribbon, ribbonIndex) => {
        const gradient = context.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, ribbon.start);
        gradient.addColorStop(0.5, ribbon.middle);
        gradient.addColorStop(1, ribbon.end);
        context.beginPath();
        for (let x = -4; x <= width + 4; x += 7) {
          const y = waveY(x, time, ribbon.layer) + Math.sin(x * 0.012 - time + ribbonIndex) * 15;
          if (x === -4) context.moveTo(x, y - ribbon.offset * 0.5);
          else context.lineTo(x, y - ribbon.offset * 0.5);
        }
        for (let x = width + 4; x >= -4; x -= 7) {
          const y = waveY(x, time, ribbon.layer + 1) + Math.sin(x * 0.01 + time) * 18;
          context.lineTo(x, y + ribbon.offset * 0.5);
        }
        context.closePath();
        context.fillStyle = gradient;
        context.shadowColor = ribbonIndex === 2 ? "rgba(255,0,145,.32)" : "rgba(0,220,255,.25)";
        context.shadowBlur = 24;
        context.fill();
      });
      context.shadowBlur = 0;


      particles.forEach((particle) => {
        const x = particle.x * width + Math.sin(time * particle.drift + particle.phase) * 22;
        const y = particle.y * height + Math.cos(time * particle.drift * 1.4 + particle.phase) * 18;
        const alpha = 0.28 + (Math.sin(time * 1.8 + particle.phase) + 1) * 0.28;
        context.beginPath();
        context.arc(x, y, particle.radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(226, 255, 255, ${alpha})`;
        context.fill();
      });

      if (!reducedMotion) animationFrame = window.requestAnimationFrame(draw);
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

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" />;
}
