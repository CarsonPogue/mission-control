"use client";

import { useEffect, useRef } from "react";

interface LiquidProps {
  isHovered: boolean;
  colors: Record<string, string>;
  buttonType?: boolean;
}

function Liquid({ isHovered, colors, buttonType = false }: LiquidProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
    };
    resize();

    const colorArr = Object.values(colors);

    const draw = () => {
      timeRef.current += isHovered ? 0.025 : 0.012;
      const t = timeRef.current;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      const numBlobs = buttonType ? 8 : 12;
      for (let i = 0; i < numBlobs; i++) {
        const color = colorArr[i % colorArr.length];
        const phase = (i / numBlobs) * Math.PI * 2;
        const speed = 0.3 + (i % 5) * 0.15;
        const radius = (buttonType ? 0.25 : 0.2) * Math.min(w, h) + Math.sin(t * speed + phase) * 20;

        const cx = w * (0.2 + 0.6 * ((Math.sin(t * speed * 0.7 + phase) + 1) / 2));
        const cy = h * (0.2 + 0.6 * ((Math.cos(t * speed * 0.5 + phase * 1.3) + 1) / 2));

        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        gradient.addColorStop(0, color + (buttonType ? "60" : "40"));
        gradient.addColorStop(0.5, color + "20");
        gradient.addColorStop(1, color + "00");

        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(animRef.current);
      ro.disconnect();
    };
  }, [isHovered, colors, buttonType]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ mixBlendMode: buttonType ? "screen" : "normal" }}
    />
  );
}

export { Liquid };
