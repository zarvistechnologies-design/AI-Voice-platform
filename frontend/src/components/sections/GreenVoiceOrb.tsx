"use client";

import { useEffect, useRef } from "react";

export function GreenVoiceOrb({ isSpeaking, language }: { isSpeaking: boolean; language: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const speakingRef = useRef(isSpeaking);

  useEffect(() => {
    speakingRef.current = isSpeaking;
  }, [isSpeaking]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let size = 0;
    let frame = 0;

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      size = Math.min(bounds.width, bounds.height);
      canvas.width = Math.round(bounds.width * dpr);
      canvas.height = Math.round(bounds.height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawWisp = (time: number, index: number, radius: number, centerX: number, centerY: number) => {
      const phase = index * 0.83;
      const speed = speakingRef.current ? 1.75 : 0.58;
      const vertical = index % 3 === 0;
      const amplitude = radius * (0.28 + (index % 5) * 0.045);
      const offset = ((index % 7) - 3) * radius * 0.12;

      context.beginPath();
      for (let point = 0; point <= 84; point += 1) {
        const progress = point / 84;
        const primary = (progress - 0.5) * radius * 2.25;
        const curl =
          Math.sin(progress * Math.PI * (1.8 + (index % 4) * 0.42) + time * speed + phase) * amplitude +
          Math.sin(progress * Math.PI * 5.4 - time * speed * 0.54 + phase) * radius * 0.045;
        const drift = Math.sin(time * speed * 0.38 + phase) * radius * 0.16;
        const x = vertical ? centerX + curl + offset : centerX + primary;
        const y = vertical ? centerY + primary : centerY + curl + offset + drift;
        if (point === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      }

      const tone = index % 4;
      context.strokeStyle =
        tone === 0 ? "rgba(184,255,218,0.40)" :
        tone === 1 ? "rgba(55,255,151,0.31)" :
        tone === 2 ? "rgba(13,191,108,0.28)" :
        "rgba(111,255,188,0.34)";
      context.lineWidth = 2.4 + (index % 5) * 1.15;
      context.shadowColor = "rgba(53,255,153,0.48)";
      context.shadowBlur = 10 + (index % 3) * 5;
      context.stroke();
    };

    const draw = (timestamp: number) => {
      const bounds = canvas.getBoundingClientRect();
      const width = bounds.width;
      const height = bounds.height;
      const time = reducedMotion ? 2 : timestamp / 1000;
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = size * 0.37;
      const speakingScale = speakingRef.current ? 1 + Math.sin(time * 5.2) * 0.025 : 1;
      context.clearRect(0, 0, width, height);

      const halo = context.createRadialGradient(centerX, centerY, radius * 0.35, centerX, centerY, radius * 1.45);
      halo.addColorStop(0, speakingRef.current ? "rgba(50,255,153,0.24)" : "rgba(37,221,133,0.14)");
      halo.addColorStop(0.52, "rgba(20,156,91,0.10)");
      halo.addColorStop(1, "rgba(0,0,0,0)");
      context.fillStyle = halo;
      context.beginPath();
      context.arc(centerX, centerY, radius * 1.48, 0, Math.PI * 2);
      context.fill();

      context.save();
      context.translate(centerX, centerY);
      context.scale(speakingScale, speakingScale);
      context.translate(-centerX, -centerY);
      context.beginPath();
      context.arc(centerX, centerY, radius, 0, Math.PI * 2);
      context.clip();

      const sphere = context.createRadialGradient(centerX - radius * 0.3, centerY - radius * 0.34, radius * 0.05, centerX, centerY, radius);
      sphere.addColorStop(0, "rgba(93,255,175,0.40)");
      sphere.addColorStop(0.35, "rgba(12,126,73,0.22)");
      sphere.addColorStop(0.72, "rgba(2,45,28,0.42)");
      sphere.addColorStop(1, "rgba(0,10,7,0.94)");
      context.fillStyle = sphere;
      context.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);

      context.globalCompositeOperation = "screen";
      for (let index = 0; index < 14; index += 1) drawWisp(time, index, radius, centerX, centerY);

      for (let index = 0; index < 7; index += 1) {
        const angle = time * (speakingRef.current ? 0.95 : 0.3) + index * 2.1;
        const orbit = radius * (0.25 + (index % 3) * 0.18);
        const x = centerX + Math.cos(angle) * orbit;
        const y = centerY + Math.sin(angle * 1.27) * orbit;
        const light = context.createRadialGradient(x, y, 0, x, y, radius * 0.22);
        light.addColorStop(0, "rgba(125,255,190,0.22)");
        light.addColorStop(1, "rgba(23,207,116,0)");
        context.fillStyle = light;
        context.fillRect(x - radius * 0.24, y - radius * 0.24, radius * 0.48, radius * 0.48);
      }
      context.restore();

      context.beginPath();
      context.arc(centerX, centerY, radius, 0, Math.PI * 2);
      context.strokeStyle = speakingRef.current ? "rgba(112,255,184,0.62)" : "rgba(99,238,169,0.42)";
      context.lineWidth = 1;
      context.shadowColor = "rgba(48,255,151,0.55)";
      context.shadowBlur = speakingRef.current ? 15 : 8;
      context.stroke();
      context.shadowBlur = 0;

      if (!reducedMotion) frame = window.requestAnimationFrame(draw);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    draw(0);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-label={`Vozon voice assistant${isSpeaking ? ` speaking ${language}` : ""}`}
      className="mt-1 size-56 shrink-0 max-sm:size-48"
      role="img"
    />
  );
}
