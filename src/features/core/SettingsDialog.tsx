"use client";
import React, { useState } from "react";
import { X } from "lucide-react";

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("constitution");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#1a1a1a] border border-[#333] rounded-lg w-[700px] max-w-[90vw] max-h-[80vh] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#333]">
          <h2 className="text-sm font-semibold text-white">Settings</h2>
          <button onClick={onClose} className="text-[#888] hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="flex border-b border-[#333] bg-[#151515]">
          <Tab icon="🛡️" label="Constitution" active={activeTab === "constitution"} onClick={() => setActiveTab("constitution")} />
          <Tab icon="🎨" label="Appearance" active={activeTab === "appearance"} onClick={() => setActiveTab("appearance")} />
          <Tab icon="🔌" label="MCP Servers" active={activeTab === "mcp"} onClick={() => setActiveTab("mcp")} />
          <Tab icon="💾" label="Memory" active={activeTab === "memory"} onClick={() => setActiveTab("memory")} />
          <Tab icon="⌨️" label="Shortcuts" active={activeTab === "shortcuts"} onClick={() => setActiveTab("shortcuts")} />
        </div>

        <div className="p-4 overflow-y-auto max-h-[calc(80vh-120px)]">
          {activeTab === "constitution" && <ConstitutionSettings />}
          {activeTab === "appearance" && <AppearanceSettings />}
          {activeTab === "mcp" && <MCPSettings />}
          {activeTab === "memory" && <MemorySettings />}
          {activeTab === "shortcuts" && <ShortcutsSettings />}
        </div>

        <div className="flex justify-end gap-2 px-4 py-3 border-t border-[#333] bg-[#151515]">
          <button onClick={onClose} className="px-3 py-1.5 text-xs bg-[#252525] text-white rounded hover:bg-[#333]">Cancel</button>
          <button onClick={onClose} className="px-3 py-1.5 text-xs bg-[#8b5cf6] text-white rounded hover:bg-[#7c4dff]">Save Changes</button>
        </div>
      </div>
    </div>
  );
};

const Tab: React.FC<{ icon: string; label: string; active: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-4 py-2 text-xs border-b-2 transition-colors ${active ? "border-[#8b5cf6] text-white" : "border-transparent text-[#888]"}`}>
    <span>{icon}</span> {label}
  </button>
);

const ConstitutionSettings = () => (
  <div className="space-y-3">
    <h3 className="text-xs font-bold text-white mb-2">Constitutional Rules</h3>
    {[1,2,3,4,5].map(i => (
      <div key={i} className="flex items-center justify-between p-2 bg-[#0f0f0f] rounded">
        <div><div className="text-xs text-white">Rule {i}</div><div className="text-[9px] text-[#666]">Enforcement: Blocking</div></div>
        <input type="checkbox" defaultChecked className="accent-[#8b5cf6]" />
      </div>
    ))}
  </div>
);

const AppearanceSettings = () => (
  <div className="space-y-4">
    <div><label className="text-xs text-white block mb-1">Theme</label><select className="w-full bg-[#0f0f0f] border border-[#333] rounded p-2 text-xs text-white"><option>Dark (Default)</option><option>Light</option><option>System</option></select></div>
    <div><label className="text-xs text-white block mb-1">Accent Color</label><div className="flex gap-2">{["#8b5cf6", "#ec4899", "#3b82f6", "#10b981", "#f59e0b"].map(c => <button key={c} className="w-6 h-6 rounded-full border-2 border-transparent hover:border-white" style={{backgroundColor:c}} />)}</div></div>
  </div>
);

const MCPSettings = () => (
  <div className="space-y-2">
    {["Executive", "System Control", "Spotify", "Filesystem", "Email", "Chat"].map(mcp => (
      <div key={mcp} className="flex items-center justify-between p-2 bg-[#0f0f0f] rounded">
        <span className="text-xs text-white">{mcp} MCP</span>
        <span className="text-[9px] text-[#30d158]">● Running</span>
      </div>
    ))}
  </div>
);

const MemorySettings = () => (
  <div className="space-y-3">
    <div className="p-3 bg-[#0f0f0f] rounded">
      <div className="text-xs text-white mb-1">Storage Used</div>
      <div className="h-2 bg-[#252525] rounded-full overflow-hidden"><div className="h-full w-3/5 bg-[#8b5cf6] rounded-full" /></div>
      <div className="text-[9px] text-[#888] mt-1">124 crystals • 45.2 MB</div>
    </div>
    <button className="w-full p-2 text-xs bg-red-500/10 text-red-400 rounded hover:bg-red-500/20">Clear All Memory Crystals</button>
  </div>
);

const ShortcutsSettings = () => (
  <div className="space-y-2">
    {[
      { action: "Toggle Sidebar", key: "Ctrl+B" },
      { action: "Toggle Terminal", key: "Ctrl+`" },
      { action: "Toggle Feed", key: "Ctrl+Shift+F" },
      { action: "Open Settings", key: "Ctrl+," },
      { action: "Command Palette", key: "Ctrl+K" },
      { action: "Fullscreen", key: "F11" },
    ].map(({ action, key }) => (
      <div key={action} className="flex items-center justify-between p-2 bg-[#0f0f0f] rounded">
        <span className="text-xs text-white">{action}</span>
        <span className="text-[9px] bg-[#252525] px-2 py-1 rounded text-[#888]">{key}</span>
      </div>
    ))}
  </div>
);
