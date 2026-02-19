"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface Command {
  id: string;
  name: string;
  category: string;
  icon: string;
  shortcut?: string;
  action: () => void;
}

export const CommandPalette: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const commands: Command[] = [
    { id: "1", name: "Dashboard", category: "Navigation", icon: "📊", shortcut: "G D", action: () => router.push("/dashboard") },
    { id: "2", name: "System Core", category: "Navigation", icon: "🖥️", shortcut: "G S", action: () => router.push("/system") },
    { id: "3", name: "Security Center", category: "Navigation", icon: "🛡️", shortcut: "G C", action: () => router.push("/security") },
    { id: "4", name: "Notes", category: "Navigation", icon: "📝", shortcut: "G N", action: () => router.push("/notes") },
    { id: "5", name: "Mail", category: "Navigation", icon: "📧", shortcut: "G M", action: () => router.push("/mail") },
    { id: "6", name: "Chat", category: "Navigation", icon: "💬", shortcut: "G H", action: () => router.push("/chat") },
    { id: "7", name: "Files", category: "Navigation", icon: "📁", shortcut: "G F", action: () => router.push("/files") },
    { id: "8", name: "Research", category: "Navigation", icon: "🔍", shortcut: "G R", action: () => router.push("/research") },
    { id: "9", name: "Toggle Sidebar", category: "View", icon: "📌", shortcut: "CMD B", action: () => {} },
    { id: "10", name: "Toggle Terminal", category: "View", icon: "💻", shortcut: "Ctrl+`", action: () => {} },
    { id: "11", name: "Toggle Feed", category: "View", icon: "📋", shortcut: "CMD SHIFT F", action: () => {} },
    { id: "12", name: "Settings", category: "System", icon: "⚙️", shortcut: "CMD ,", action: () => {} },
  ];

  const filtered = commands.filter(cmd => 
    cmd.name.toLowerCase().includes(search.toLowerCase()) ||
    cmd.category.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setSearch("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIndex(i => Math.min(i + 1, filtered.length - 1)); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIndex(i => Math.max(i - 1, 0)); }
      else if (e.key === "Enter" && filtered[selectedIndex]) { filtered[selectedIndex].action(); onClose(); }
      else if (e.key === "Escape") { onClose(); }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-start justify-center pt-[15vh] z-[100]" onClick={onClose}>
      <div className="bg-[#0f0f0f] border border-[#252525] rounded-xl w-[640px] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center border-b border-[#252525] px-4">
          <span className="text-purple-500">⚡</span>
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Sovereign Terminal..."
            className="flex-1 bg-transparent py-4 px-3 text-sm text-white outline-none"
          />
        </div>
        <div ref={listRef} className="max-h-[420px] overflow-y-auto p-2">
          {filtered.map((cmd, index) => (
            <button
              key={cmd.id}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-left transition-all"
              onClick={() => { cmd.action(); onClose(); }}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <span className="text-xl">{cmd.icon}</span>
              <div className="flex-1">
                <div className="text-sm font-medium text-white">{cmd.name}</div>
                <div className="text-[10px] text-gray-500 uppercase tracking-widest">{cmd.category}</div>
              </div>
              {cmd.shortcut && <kbd className="text-[10px] bg-[#252525] px-2 py-1 rounded text-gray-400 font-mono">{cmd.shortcut}</kbd>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};




