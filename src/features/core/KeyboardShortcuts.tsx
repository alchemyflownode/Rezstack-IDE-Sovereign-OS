"use client";
import React, { useState, useEffect } from "react";

export const KeyboardShortcuts: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "?" && !e.ctrlKey && !e.metaKey) { e.preventDefault(); setVisible(true); }
      if (e.key === "Escape" && visible) { setVisible(false); }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-[200]" onClick={() => setVisible(false)}>
      <div className="bg-[#0f0f0f] border border-purple-500/30 rounded-2xl p-8 w-[600px] shadow-2xl" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <span className="text-purple-500">⌨</span> Protocol Shortcuts
        </h2>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="text-purple-400 text-[10px] font-bold uppercase tracking-tighter mb-4">Core Controls</h3>
            <ShortcutItem keys={["CMD", "K"]} desc="Command Palette" />
            <ShortcutItem keys={["CMD", "B"]} desc="Toggle Sidebar" />
            <ShortcutItem keys={["CMD", "BACKTICK"]} desc="Terminal" />
          </div>
          <div>
            <h3 className="text-purple-400 text-[10px] font-bold uppercase tracking-tighter mb-4">Navigation</h3>
            <ShortcutItem keys={["G", "D"]} desc="Go to Dashboard" />
            <ShortcutItem keys={["G", "S"]} desc="Go to System" />
          </div>
        </div>
      </div>
    </div>
  );
};

const ShortcutItem = ({ keys, desc }: any) => (
  <div className="flex justify-between items-center mb-3">
    <span className="text-sm text-gray-400">{desc}</span>
    <div className="flex gap-1">
      {keys.map((k: string) => <kbd key={k} className="bg-[#252525] px-2 py-1 rounded text-[10px] text-white border border-[#333] font-mono">{k}</kbd>)}
    </div>
  </div>
);
