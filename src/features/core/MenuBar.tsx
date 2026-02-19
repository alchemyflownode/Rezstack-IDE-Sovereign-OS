"use client";
import React, { useState } from "react";

export const MenuBar: React.FC = () => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  return (
    <div className="h-7 bg-[#1a1a1a] border-b border-[#333] flex items-center px-2 text-[11px] text-white/80 select-none">
      <MenuItem label="File" open={openMenu === "file"} onOpen={() => setOpenMenu("file")} onClose={() => setOpenMenu(null)}>
        <div className="absolute top-full left-0 mt-1 bg-[#252525] border border-[#333] rounded shadow-xl py-1 min-w-[200px] z-50">
          <SubItem label="New Window" shortcut="Ctrl+N" onClick={() => {}} />
          <SubItem label="Open..." shortcut="Ctrl+O" onClick={() => {}} />
          <div className="h-px bg-[#333] my-1" />
          <SubItem label="Settings" shortcut="Ctrl+," onClick={() => {}} />
          <div className="h-px bg-[#333] my-1" />
          <SubItem label="Exit" shortcut="Alt+F4" onClick={() => window.close()} />
        </div>
      </MenuItem>
      
      <MenuItem label="Edit" open={openMenu === "edit"} onOpen={() => setOpenMenu("edit")} onClose={() => setOpenMenu(null)}>
        <div className="absolute top-full left-0 mt-1 bg-[#252525] border border-[#333] rounded shadow-xl py-1 min-w-[200px] z-50">
          <SubItem label="Undo" shortcut="Ctrl+Z" onClick={() => {}} />
          <SubItem label="Redo" shortcut="Ctrl+Y" onClick={() => {}} />
          <div className="h-px bg-[#333] my-1" />
          <SubItem label="Cut" shortcut="Ctrl+X" onClick={() => {}} />
          <SubItem label="Copy" shortcut="Ctrl+C" onClick={() => {}} />
          <SubItem label="Paste" shortcut="Ctrl+V" onClick={() => {}} />
        </div>
      </MenuItem>
      
      <MenuItem label="View" open={openMenu === "view"} onOpen={() => setOpenMenu("view")} onClose={() => setOpenMenu(null)}>
        <div className="absolute top-full left-0 mt-1 bg-[#252525] border border-[#333] rounded shadow-xl py-1 min-w-[200px] z-50">
          <SubItem label="Toggle Sidebar" shortcut="Ctrl+B" onClick={() => {}} />
          <SubItem label="Toggle Terminal" shortcut="Ctrl+`" onClick={() => {}} />
          <SubItem label="Toggle Feed" shortcut="Ctrl+Shift+F" onClick={() => {}} />
          <div className="h-px bg-[#333] my-1" />
          <SubItem label="Fullscreen" shortcut="F11" onClick={() => {}} />
        </div>
      </MenuItem>
      
      <MenuItem label="Help" open={openMenu === "help"} onOpen={() => setOpenMenu("help")} onClose={() => setOpenMenu(null)}>
        <div className="absolute top-full left-0 mt-1 bg-[#252525] border border-[#333] rounded shadow-xl py-1 min-w-[200px] z-50">
          <SubItem label="Documentation" onClick={() => window.open("https://rezstack.io/docs")} />
          <SubItem label="Keyboard Shortcuts" onClick={() => {}} />
          <div className="h-px bg-[#333] my-1" />
          <SubItem label="About RezStack" onClick={() => {}} />
        </div>
      </MenuItem>
    </div>
  );
};

const MenuItem: React.FC<{ label: string; open: boolean; onOpen: () => void; onClose: () => void; children: React.ReactNode }> = ({ 
  label, open, onOpen, onClose, children 
}) => {
  return (
    <div className="relative" onMouseEnter={onOpen} onMouseLeave={onClose}>
      <button 
        className={`px-3 py-1 rounded hover:bg-[#333] transition-colors ${open ? "bg-[#333]" : ""}`}
        onClick={onOpen}
      >
        {label}
      </button>
      {open && children}
    </div>
  );
};

const SubItem: React.FC<{ label: string; shortcut?: string; onClick: () => void }> = ({ label, shortcut, onClick }) => (
  <button 
    className="w-full px-3 py-1.5 text-left text-[11px] hover:bg-[#333] flex items-center justify-between group"
    onClick={onClick}
  >
    <span>{label}</span>
    {shortcut && <span className="text-[9px] text-[#666] group-hover:text-[#888]">{shortcut}</span>}
  </button>
);
