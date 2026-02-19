"use client";
import React, { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MacWindow } from './MacWindow';
import { QuantumOrb } from './QuantumOrb';
import { CausalityFeed } from './CausalityFeed';
import { JARVISTerminal } from './JARVISTerminal';
import { WelcomeBanner } from './WelcomeBanner';
import { MenuBar } from './MenuBar';
import { StatusBar } from './StatusBar';
import { SettingsDialog } from './SettingsDialog';
import { CommandPalette } from './CommandPalette';

// Types
interface CausalityEvent {
  id: string;
  timestamp: Date;
  action: string;
  success: boolean;
  phase: string;
}

export const SovereignLayout = ({ children, pageTitle }: { children: React.ReactNode; pageTitle: string }) => {
  const pathname = usePathname();
  const [phase, setPhase] = useState<'SOLID' | 'LIQUID' | 'PLASMA'>('SOLID');
  const [events, setEvents] = useState<CausalityEvent[]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleGlobalKeys = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === ',') {
        e.preventDefault();
        setSettingsOpen(true);
      }
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', handleGlobalKeys);
    return () => window.removeEventListener('keydown', handleGlobalKeys);
  }, []);

  const navItems = [
    { id: 'dashboard', icon: '🏠', label: 'Home', path: '/' },
    { id: 'system', icon: '🖥️', label: 'System', path: '/system' },
    { id: 'security', icon: '🛡️', label: 'Security', path: '/security' },
    { id: 'memory', icon: '💎', label: 'Memory', path: '/memory' },
    { id: 'agents', icon: '🤖', label: 'Agents', path: '/agents' },
    { id: 'mail', icon: '✉️', label: 'Mail', path: '/mail' },
    { id: 'chat', icon: '💬', label: 'Chat', path: '/chat' },
    { id: 'files', icon: '📁', label: 'Files', path: '/files' },
    { id: 'research', icon: '🔍', label: 'Research', path: '/research' },
  ];

  return (
    <MacWindow title={`RezStack • ${pageTitle}`}>
      <div className="flex h-full bg-[#0a0a0a] text-white overflow-hidden font-sans flex-col">
        
        {/* Top Menu Bar */}
        <MenuBar />

        <div className="flex flex-1 overflow-hidden">
          {/* LEFT SIDEBAR */}
          <aside className="w-64 bg-[#141414] border-r border-[#252525] flex flex-col p-4 shrink-0">
            <div className="flex flex-col items-center mb-6">
              <QuantumOrb phase={phase} phiRatio={1.618} size={96} />
              <div className="text-[11px] text-[#555] font-mono mt-2">PHI = 1.618</div>
            </div>

            <nav className="flex-1 space-y-1">
              {navItems.map(item => (
                <Link
                  key={item.id}
                  href={item.path}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-all text-left text-[11px] ${
                    pathname === item.path 
                      ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
                      : 'text-[#858585] hover:bg-[#252525] hover:text-white'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>

            <div className="mt-auto space-y-4">
              <div>
                <div className="text-[11px] text-[#555] uppercase font-bold mb-2 tracking-wider">Phase</div>
                <div className="flex gap-1">
                  {(['SOLID', 'LIQUID', 'PLASMA'] as const).map(p => (
                    <button 
                      key={p} 
                      onClick={() => setPhase(p)} 
                      className={`flex-1 py-1.5 text-[11px] font-bold rounded transition-all ${
                        phase === p 
                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                          : 'bg-[#1a1a1a] text-[#555] hover:bg-[#252525]'
                      }`}
                    >
                      {p.slice(0,3)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <main className="flex-1 flex flex-col overflow-hidden min-w-0">
            <header className="h-12 border-b border-[#252525] bg-[#0b0b0b]/80 backdrop-blur-md flex items-center px-6 justify-between shrink-0">
              <h1 className="text-xs font-bold uppercase tracking-widest text-white">
                {pageTitle} <span className="text-[#555]">// {phase}</span>
              </h1>
            </header>

            <div className="flex-1 overflow-y-auto p-6">
              <WelcomeBanner />
              {children}
            </div>

            <div className="h-48 border-t border-[#252525] bg-[#141414]/50 backdrop-blur shrink-0">
              <JARVISTerminal compact={true} onCommand={() => {}} />
            </div>
          </main>

          <CausalityFeed events={events} compact={true} />
        </div>
        
        {/* Bottom Status Bar */}
        <StatusBar />

        {/* Global Overlays */}
        <SettingsDialog isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
        <CommandPalette isOpen={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
      </div>
    </MacWindow>
  );
};
