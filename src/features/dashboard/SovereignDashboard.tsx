"use client";

import React, { useState, useCallback } from 'react';
import { useQuantumState } from '@/hooks/useQuantumState';
import { QuantumOrb } from "@/features/core/QuantumOrb";
import { InertialProgressBar } from "@/features/core/InertialProgressBar";
import { CausalityFeed } from "@/features/core/CausalityFeed";
import { JARVISTerminal } from "@/features/core/JARVISTerminal";
import { MacWindow } from "@/features/core/MacWindow";
import '@/styles/quantum.css';

interface CausalityEvent {
  id: string;
  timestamp: Date;
  action: string;
  phase: 'SOLID' | 'LIQUID' | 'PLASMA';
  constitutional: boolean;
}

interface UICommand {
  type: 'toggle_module' | 'start_clean' | 'show_tab' | 'transmute' | 'highlight';
  payload: any;
}

export const SovereignDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isProcessing, setIsProcessing] = useState(false);
  const [causalityEvents, setCausalityEvents] = useState<CausalityEvent[]>([]);
  const { phase, phiRatio, transmute, isPlasma } = useQuantumState();

  const logCausality = useCallback((action: string, constitutional = true) => {
    const event: CausalityEvent = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      action,
      phase,
      constitutional
    };
    setCausalityEvents(prev => [...prev.slice(-49), event]); // Keep last 50
  }, [phase]);

  const handleJARVISCommand = useCallback(async (cmd: UICommand) => {
    logCausality(`Command received: ${cmd.type}`);
    
    switch (cmd.type) {
      case 'transmute':
        setIsProcessing(true);
        await transmute(cmd.payload.phase);
        logCausality(`Phase transmuted: ${cmd.payload.phase}`);
        setIsProcessing(false);
        break;
      case 'start_clean':
        setIsProcessing(true);
        logCausality('Constitutional purge initiated', true);
        // Simulate work
        setTimeout(() => {
          logCausality('Purge complete. Audit log updated.', true);
          setIsProcessing(false);
        }, 2000);
        break;
      case 'toggle_module':
        logCausality(`Module toggle: ${cmd.payload.id} → ${cmd.payload.enabled}`);
        break;
      case 'show_tab':
        setActiveTab(cmd.payload.tab);
        logCausality(`Navigation: ${cmd.payload.tab}`);
        break;
    }
  }, [transmute, logCausality]);

  return (
    <MacWindow title={`RezStack Sovereign OS • ${phase} PHASE`}>
      <InertialProgressBar isProcessing={isProcessing} phase={phase} />
      
      <div className="flex h-full bg-[#0b0b0b] font-sans selection:bg-purple-500/30">
        {/* Sidebar */}
        <nav className="w-64 bg-[#141414] border-r border-[#252525] flex flex-col p-4">
          <div className="flex flex-col items-center">
            <QuantumOrb phase={phase} phiRatio={phiRatio} size={100} />
            <div className="rez-mono" style={{ color: '#555', marginTop: 8, fontSize: 9 }}>
              φ = {phiRatio.toFixed(3)}
            </div>
          </div>

          <div className="mt-6 space-y-1">
            <SidebarItem label="Dashboard" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
            <SidebarItem label="System Core" active={activeTab === 'system'} onClick={() => setActiveTab('system')} />
            <SidebarItem label="Security" active={activeTab === 'security'} onClick={() => setActiveTab('security')} />
          </div>

          <div className="mt-auto">
            <div className="rez-mono" style={{ color: '#555', fontSize: 9, marginBottom: 4 }}>PHASE CONTROL</div>
            <div className="flex gap-1">
              {(['SOLID', 'LIQUID', 'PLASMA'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => handleJARVISCommand({ type: 'transmute', payload: { phase: p } })}
                  className={`flex-1 py-1.5 text-[9px] font-bold rounded transition-colors ${
                    phase === p 
                      ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                      : 'bg-[#1a1a1a] text-[#555] hover:bg-[#252525]'
                  }`}
                >
                  {p.slice(0,3)}
                </button>
              ))}
            </div>
            <div className="mt-4 p-3 bg-[#1a1a1a] rounded-lg border border-[#252525]">
              <div className="rez-mono" style={{ color: '#555', fontSize: 9, marginBottom: 2 }}>CONSTITUTIONAL GUARD</div>
              <div className="flex items-center gap-2" style={{ color: '#30d158', fontSize: 10 }}>
                <div className="w-1.5 h-1.5 bg-[#30d158] rounded-full animate-pulse" />
                ACTIVE
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="h-12 border-b border-[#252525] bg-[#0b0b0b]/80 backdrop-blur-md flex items-center px-6 justify-between">
            <h1 className="text-[12px] font-bold uppercase tracking-widest text-white">
              Sovereign Cleaner <span className="rez-mono" style={{color:'#555'}}>// {phase}</span>
            </h1>
            <div className="flex items-center gap-4">
              <span className="rez-mono" style={{color:'#555',fontSize:9}}>BUILD: 2026.02.19</span>
              <span className={`w-2 h-2 rounded-full ${isPlasma ? 'bg-[#ec4899] animate-pulse' : 'bg-[#30d158]'}`} />
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <CleanerModule name="Browser Engine Cache" desc="Chromium/Gecko buffers" size="245.8 MB" status="warning" />
                <CleanerModule name="System Entropy" desc="Temp files, dangling symlinks" size="1.2 GB" status="critical" />
                <button 
                  className="rez-btn w-full mt-8"
                  onClick={() => handleJARVISCommand({ type: 'start_clean', payload: {} })}
                >
                  Initialize Constitutional Purge
                </button>
              </div>
            )}
            {activeTab === 'system' && <div className="text-[#858585]">System Core view placeholder</div>}
            {activeTab === 'security' && <div className="text-[#858585]">Security view placeholder</div>}
          </div>

          {/* JARVIS Terminal - Bottom Panel */}
          <div className="h-48 border-t border-[#252525] bg-[#141414]/50 backdrop-blur">
            <JARVISTerminal compact={true} onCommand={handleJARVISCommand} />
          </div>
        </main>

        {/* Causality Feed */}
        <CausalityFeed events={causalityEvents} compact={true} />
      </div>
    </MacWindow>
  );
};

const SidebarItem = ({ label, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all ${
      active ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'text-[#858585] hover:bg-[#252525] hover:text-white'
    }`}
    style={{ fontSize: 11 }}
  >
    <span>{label}</span>
  </button>
);

const CleanerModule = ({ name, desc, size, status }: any) => (
  <div className="quantum-card flex items-center justify-between group">
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
        status === 'critical' ? 'bg-red-500/10 text-red-500' : 'bg-orange-500/10 text-orange-500'
      }`}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
        </svg>
      </div>
      <div>
        <h3 className="text-[12px] font-bold text-white mb-0.5">{name}</h3>
        <p className="rez-mono" style={{color:'#555',fontSize:9}}>{desc}</p>
      </div>
    </div>
    <div className="text-right">
      <div className="rez-mono" style={{color:'#fff',fontSize:11}}>{size}</div>
      <div className={`rez-mono text-[9px] font-bold uppercase ${
        status === 'critical' ? 'text-red-500' : 'text-orange-500'
      }`}>{status}</div>
    </div>
  </div>
);
