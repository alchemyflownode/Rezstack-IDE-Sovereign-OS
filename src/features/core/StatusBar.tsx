"use client";
import React, { useState, useEffect } from "react";

export const StatusBar: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [cpu, setCpu] = useState(23);
  const [memory, setMemory] = useState(4.2);
  const [totalMemory] = useState(16);
  const [activeMcps, setActiveMcps] = useState(6);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-5 bg-[#0f0f0f] border-t border-[#252525] flex items-center px-3 text-[9px] text-[#888] select-none">
      <div className="flex items-center gap-3 flex-1">
        <StatusItem icon="🖥️" label={`CPU ${cpu}%`} />
        <StatusItem icon="💾" label={`RAM ${memory.toFixed(1)}/${totalMemory}GB`} />
        <StatusItem icon="🔌" label={`MCP ${activeMcps} active`} />
        <StatusItem icon="🛡️" label="Guard Active" className="text-[#30d158]" />
      </div>

      <div className="flex items-center gap-3">
        <StatusItem icon="🔒" label="Offline Mode" />
        <StatusItem icon="🦊" label="Sovereign OS" />
        <span className="font-mono">{time.toLocaleTimeString()}</span>
      </div>
    </div>
  );
};

const StatusItem: React.FC<{ icon: string; label: string; className?: string }> = ({ icon, label, className }) => (
  <div className="flex items-center gap-1">
    <span>{icon}</span>
    <span className={className}>{label}</span>
  </div>
);
