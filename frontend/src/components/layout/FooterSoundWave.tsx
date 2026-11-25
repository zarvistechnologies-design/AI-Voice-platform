"use client";

import { useEffect, useRef } from "react";

export function FooterSoundWave({ variant = "footer" }: { variant?: "footer" | "hero" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0;
    let height = 0;
    let visible = false;
    let frame = 0;
    let lastFrameAt = 0;
    const frameInterval = 1000 / 30;

    const draw = (seconds: number) => {
      if (!width || !height) return;
      context.clearRect(0, 0, width, height);

      const fade = context.createLinearGradient(0, 0, width, 0);
      const waveColor = variant === "hero" ? "92,92,92" : "255,255,255";
      fade.addColorStop(0, `rgba(${waveColor},0)`);
      fade.addColorStop(0.06, `rgba(${waveColor},1)`);
      fade.addColorStop(0.88, `rgba(${waveColor},1)`);
      fade.addColorStop(1, `rgba(${waveColor},0)`);
      context.strokeStyle = fade;
      context.lineCap = "round";

      const amplitude = Math.min(height * 0.4, 105);
      // The wave is decorative. Keep the path count modest so it stays cheap
      // on lower-powered devices while preserving the same visual treatment.
      const step = Math.max(3, width / 180);
      const time = seconds * 0.66;

      for (let layer = 0; layer < 2; layer += 1) {
        for (let strand = 0; strand < 20; strand += 1) {
          const offset = (strand - 9.5) / 9.5;
          context.beginPath();
          context.lineWidth = strand % 9 === 0 ? 1.1 : 0.7;
          context.globalAlpha = strand % 9 === 0 ? 0.42 : 0.19;

          for (let x = 0; x <= width + step; x += step) {
            const progress = x / width;
            const phase = progress * 16.8 - time;
            const carrier =
              Math.sin(phase + layer * 0.4) * 0.42 +
              Math.sin(phase * 1.92 + time * 0.55 + layer) * 0.18 +
              Math.sin(phase * 0.58 - time * 0.4) * 0.16;
            const fold = Math.sin(phase * 0.82 + offset * 2.4 + layer * 0.8);
            const mesh = Math.sin(phase * 1.48 - time * 0.55 + offset * 3.1);
            const y =
              height / 2 +
              carrier * amplitude +
              offset * (20 + 32 * fold) +
              mesh * (9 + Math.abs(offset) * 18) +
              (layer === 0 ? -5 : 5);

            if (x === 0) context.moveTo(x, y);
            else context.lineTo(x, y);
          }
          context.stroke();
        }
      }

      context.globalAlpha = 1;
    };

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      draw(0);
    };

    const animate = (now: number) => {
      if (!document.hidden && now - lastFrameAt >= frameInterval) {
        draw(now / 1000);
        lastFrameAt = now;
      }
      frame = window.requestAnimationFrame(animate);
    };

    const syncAnimation = () => {
      window.cancelAnimationFrame(frame);
      if (visible && !document.hidden && !motionPreference.matches) {
        lastFrameAt = 0;
        frame = window.requestAnimationFrame(animate);
      } else {
        draw(0);
      }
    };

    const resizeObserver = new ResizeObserver(resize);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncAnimation();
    });
    resizeObserver.observe(canvas);
    visibilityObserver.observe(canvas);
    motionPreference.addEventListener("change", syncAnimation);
    document.addEventListener("visibilitychange", syncAnimation);
    resize();

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      motionPreference.removeEventListener("change", syncAnimation);
      document.removeEventListener("visibilitychange", syncAnimation);
    };
  }, [variant]);

  return <canvas className={variant === "hero" ? "agentvoice-footer-wave" : "design-four-footer-wave"} ref={canvasRef} aria-hidden="true" />;
}
