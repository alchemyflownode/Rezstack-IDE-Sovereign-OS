"use client";

import { useState, useCallback } from 'react';
import { JarvisParser } from '@/lib/JarvisParser';

interface SwarmEvent {
  id: string;
  timestamp: string;
  action: string;
  status: string;
}

export const useRezSwarm = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [history, setHistory] = useState<SwarmEvent[]>([]);

  const addEvent = (action: string, status: string) => {
    const newEvent: SwarmEvent = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString('en-GB', { hour12: false }),
      action,
      status,
    };
    setHistory((prev) => [...prev.slice(-15), newEvent]);
  };

  const executeCommand = useCallback(async (input: string) => {
    setIsProcessing(true);
    
    // Parse intent
    const intent = JarvisParser.parse(input);
    
    // Log to causality feed
    addEvent("PARSER_INTENT", intent.type);
    addEvent("CONSTITUTIONAL_CHECK", intent.confidence > 0.5 ? "PASSED" : "LOW_CONFIDENCE");

    if (intent.type === 'REJECTED') {
      addEvent("SWARM_REJECTION", intent.explanation || "AMBIGUOUS");
      setIsProcessing(false);
      return intent;
    }

    // Simulate processing with staggered delays
    if (intent.type === 'SWARM') {
      if (intent.action === 'PURGE_ENTROPY') {
        addEvent("ENTROPY_SCAN", "CALCULATING_DRIFT...");
        await new Promise(r => setTimeout(r, 800));
        addEvent("CLEANER_ENGAGED", "DELETING_TEMP_BUFFERS");
        await new Promise(r => setTimeout(r, 600));
        addEvent("SYSTEM_STATE", "OPTIMAL_COHERENCE");
      } else if (intent.action === 'RESOURCE_ALCHEMY') {
        addEvent("RESOURCE_ALCHEMY", "PRIORITIZING_GPU_CORES");
        await new Promise(r => setTimeout(r, 1000));
        addEvent("TASK_PURGE", "NON_ESSENTIAL_BG_KILLED");
        addEvent("POWER_DIST", "RTX_3060_MAX_VOLTAGE");
      }
    }

    setIsProcessing(false);
    return intent;
  }, []);

  return { executeCommand, history, isProcessing, addEvent };
};
