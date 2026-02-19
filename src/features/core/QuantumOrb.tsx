"use client";

import React, { useEffect, useRef } from 'react';

interface QuantumOrbProps {
  phase: 'SOLID' | 'LIQUID' | 'PLASMA';
  phiRatio: number;
  size?: number;
}

export const QuantumOrb: React.FC<QuantumOrbProps> = ({ 
  phase, phiRatio, size = 120 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrame: number;
    let time = 0;

    const render = () => {
      time += 0.01;
      ctx.clearRect(0, 0, size, size);

      const noiseScale = phase === 'PLASMA' ? 3.0 : phase === 'LIQUID' ? 1.5 : 0.8;
      const rotationSpeed = phase === 'PLASMA' ? 0.02 : phase === 'LIQUID' ? 0.01 : 0.005;
      const glowIntensity = phase === 'PLASMA' ? 0.8 : phase === 'LIQUID' ? 0.5 : 0.2;

      const gradient = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
      const colors: Record<typeof phase, [string, string]> = {
        SOLID: ['#8b5cf6', '#4c1d95'],
        LIQUID: ['#3b82f6', '#1e3a8a'],
        PLASMA: ['#ec4899', '#831843']
      };
      const [c1, c2] = colors[phase];

      gradient.addColorStop(0, c1);
      gradient.addColorStop(0.5, c2);
      gradient.addColorStop(1, '#0f0f0f');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(size/2, size/2, size/2 * 0.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = `rgba(255,255,255,${glowIntensity})`;
      ctx.lineWidth = 1;
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2 + time * rotationSpeed;
        const x = size/2 + Math.cos(angle) * size/2 * 0.6;
        const y = size/2 + Math.sin(angle) * size/2 * 0.6;
        ctx.beginPath();
        ctx.moveTo(size/2, size/2);
        ctx.lineTo(x, y);
        ctx.stroke();
      }

      ctx.font = '10px monospace';
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.textAlign = 'center';
      ctx.fillText(`φ = ${phiRatio.toFixed(3)}`, size/2, size - 20);

      animationFrame = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animationFrame);
  }, [phase, phiRatio, size]);

  return (
    <canvas 
      ref={canvasRef} 
      width={size} 
      height={size}
      style={{
        filter: `blur(${phase === 'PLASMA' ? 2 : 0}px)`,
        transition: 'filter 1s cubic-bezier(0.22, 1, 0.36, 1)',
        borderRadius: '50%',
        boxShadow: `0 0 ${phase === 'PLASMA' ? 50 : 20}px ${phase === 'PLASMA' ? '#ec4899' : '#8b5cf6'}40`
      }}
    />
  );
};
