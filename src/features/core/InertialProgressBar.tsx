"use client";

import React, { useEffect, useState } from 'react';

interface InertialProgressBarProps {
  isProcessing: boolean;
  phase?: 'SOLID' | 'LIQUID' | 'PLASMA';
  height?: number;
}

export const InertialProgressBar: React.FC<InertialProgressBarProps> = ({
  isProcessing,
  phase = 'LIQUID',
  height = 1
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isProcessing) {
      setProgress(0);
      return;
    }

    const interval = setInterval(() => {
      setProgress(prev => {
        const increment = phase === 'PLASMA' ? 3 : 
                         phase === 'LIQUID' ? 2 : 1;
        const next = prev + increment * (Math.random() * 0.5 + 0.5);
        return next > 100 ? 0 : next;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isProcessing, phase]);

  if (!isProcessing) return null;

  const colors = {
    SOLID: '#8b5cf6',
    LIQUID: '#3b82f6',
    PLASMA: '#ec4899'
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height,
      background: 'transparent',
      zIndex: 9999
    }}>
      <div 
        className={phase === 'PLASMA' ? 'plasma-progress' : ''}
        style={{
          height: '100%',
          width: `${progress}%`,
          background: colors[phase],
          boxShadow: `0 0 ${phase === 'PLASMA' ? 20 : 10}px ${colors[phase]}`,
          transition: 'width 0.05s linear',
          opacity: phase === 'PLASMA' ? 0.8 : 0.5
        }}
      />
      
      {phase === 'PLASMA' && (
        <style>{`
          @keyframes glitch {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(1px); }
            75% { transform: translateX(-1px); }
          }
          .plasma-progress {
            animation: glitch 0.1s infinite;
          }
        `}</style>
      )}
    </div>
  );
};
