import { useEffect, useRef } from "react";
import styled from "styled-components";

export function SpaceBackground({ fixed = false }) {
  const canvasRef = useRef(null);
  const frameRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    const pointer = { x: 0, y: 0, active: false };
    let width = 0;
    let height = 0;
    let particles = [];

    const resize = () => {
      const parent = fixed ? window : canvas.parentElement;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = fixed ? window.innerWidth : parent?.getBoundingClientRect().width || 0;
      height = fixed ? window.innerHeight : parent?.getBoundingClientRect().height || 0;

      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      const particleCount = Math.min(Math.floor((width * height) / (fixed ? 13000 : 9500)), fixed ? 90 : 120);
      particles = Array.from({ length: particleCount }, () => {
        const depth = 0.35 + Math.random() * 0.9;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          originX: Math.random() * width,
          originY: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.18,
          radius: 0.8 + Math.random() * 1.8,
          depth,
          hue: Math.random() > 0.45 ? 184 : 216,
          twinkle: Math.random() * Math.PI * 2,
        };
      });
    };

    const handlePointerMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
    };

    const handlePointerLeave = () => {
      pointer.active = false;
    };

    const render = () => {
      context.clearRect(0, 0, width, height);

      const glowX = pointer.active ? pointer.x : width * 0.5;
      const glowY = pointer.active ? pointer.y : height * 0.48;
      const glow = context.createRadialGradient(glowX, glowY, 0, glowX, glowY, Math.max(width, height) * 0.55);
      glow.addColorStop(0, "rgba(96, 165, 250, 0.22)");
      glow.addColorStop(0.35, "rgba(20, 184, 166, 0.11)");
      glow.addColorStop(1, "rgba(15, 23, 42, 0)");
      context.fillStyle = glow;
      context.fillRect(0, 0, width, height);

      particles.forEach((particle, index) => {
        particle.twinkle += 0.018 + particle.depth * 0.006;
        particle.x += particle.vx + Math.cos(particle.twinkle * 0.35) * particle.depth * 0.18;
        particle.y += particle.vy + Math.sin(particle.twinkle * 0.42) * particle.depth * 0.18;

        if (pointer.active) {
          const dx = particle.x - pointer.x;
          const dy = particle.y - pointer.y;
          const distance = Math.hypot(dx, dy);
          const influence = 170;

          if (distance < influence && distance > 0) {
            const force = (1 - distance / influence) * particle.depth;
            particle.x += (dx / distance) * force * 2.8;
            particle.y += (dy / distance) * force * 2.8;
          }
        }

        particle.x += (particle.originX - particle.x) * 0.003;
        particle.y += (particle.originY - particle.y) * 0.003;

        if (particle.x < -20) particle.x = width + 20;
        if (particle.x > width + 20) particle.x = -20;
        if (particle.y < -20) particle.y = height + 20;
        if (particle.y > height + 20) particle.y = -20;

        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius * particle.depth, 0, Math.PI * 2);
        context.fillStyle = `hsla(${particle.hue}, 92%, 78%, ${0.45 + Math.sin(particle.twinkle) * 0.28})`;
        context.fill();

        for (let nextIndex = index + 1; nextIndex < particles.length; nextIndex += 1) {
          const next = particles[nextIndex];
          const distance = Math.hypot(particle.x - next.x, particle.y - next.y);
          if (distance < 108) {
            context.beginPath();
            context.moveTo(particle.x, particle.y);
            context.lineTo(next.x, next.y);
            context.strokeStyle = `rgba(147, 197, 253, ${0.12 * (1 - distance / 108)})`;
            context.lineWidth = 0.7;
            context.stroke();
          }
        }
      });

      frameRef.current = window.requestAnimationFrame(render);
    };

    resize();
    render();

    const pointerTarget = fixed ? window : canvas.parentElement;
    window.addEventListener("resize", resize);
    pointerTarget?.addEventListener("pointermove", handlePointerMove);
    pointerTarget?.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      window.cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
      pointerTarget?.removeEventListener("pointermove", handlePointerMove);
      pointerTarget?.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [fixed]);

  return <Canvas $fixed={fixed} aria-hidden="true" ref={canvasRef} />;
}

const Canvas = styled.canvas`
  position: ${({ $fixed }) => ($fixed ? "fixed" : "absolute")};
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: ${({ $fixed }) => ($fixed ? 0 : 0)};
`;
