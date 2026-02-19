"use client";

import { useState, useCallback, useEffect, useRef } from 'react';

export type MatterPhase = 'SOLID' | 'LIQUID' | 'PLASMA';

interface QuantumState {
  phase: MatterPhase;
  phiRatio: number;
  entropy: number;
}

export const useQuantumState = () => {
  const [state, setState] = useState<QuantumState>({
    phase: 'LIQUID',
    phiRatio: 1.618,
    entropy: 0
  });
  
  const [isTransmuting, setIsTransmuting] = useState(false);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => ({
        ...prev,
        entropy: Math.random() * 30 + 10
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const transmute = useCallback(async (targetPhase: MatterPhase) => {
    // Prevent overlapping animations
    if (isTransmuting) {
      console.log('[QUANTUM_ENGINE] Transmutation already in progress');
      return;
    }

    setIsTransmuting(true);
    
    console.log(`[QUANTUM_ENGINE] Initiating transmutation: ${state.phase} â†’ ${targetPhase}`);

    const phaseWeights = { SOLID: 1, LIQUID: 2, PLASMA: 3 };
    const currentWeight = phaseWeights[state.phase];
    const targetWeight = phaseWeights[targetPhase];
    const delta = Math.abs(targetWeight - currentWeight);
    
    const transitionTime = delta * 600;

    const phiValues = {
      SOLID: 1.618,
      LIQUID: 1.918,
      PLASMA: 2.358
    };

    const startTime = Date.now();
    const startPhi = state.phiRatio;
    const targetPhi = phiValues[targetPhase];

    return new Promise<void>((resolve) => {
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / transitionTime, 1);
        
        const eased = 1 - Math.pow(1 - progress, 3);
        const currentPhi = startPhi + (targetPhi - startPhi) * eased;
        
        document.documentElement.style.setProperty('--phi-scale', currentPhi.toString());
        document.documentElement.style.setProperty('--rez-blur', 
          targetPhase === 'SOLID' ? '0px' : 
          targetPhase === 'LIQUID' ? '12px' : '24px'
        );
        
        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animate);
        } else {
          setState(prev => ({
            ...prev,
            phase: targetPhase,
            phiRatio: targetPhi
          }));
          setIsTransmuting(false);
          console.log(`[QUANTUM_ENGINE] Phase stabilized: ${targetPhase}`);
          resolve();
        }
      };
      
      animationFrameRef.current = requestAnimationFrame(animate);
    });
  }, [state, isTransmuting]);

  // Clean up animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    ...state,
    transmute,
    isTransmuting,
    isPlasma: state.phase === 'PLASMA',
    isLiquid: state.phase === 'LIQUID',
    isSolid: state.phase === 'SOLID'
  };
};
