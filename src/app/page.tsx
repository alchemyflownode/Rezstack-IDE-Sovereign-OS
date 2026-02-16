'use client';

import { useState, useEffect, useRef } from 'react';
import { FileTree } from '@/components/FileTree';
import { AgentInspector } from '@/components/AgentInspector';
import JARVISTerminal from '@/components/JARVISTerminal';
import Link from 'next/link';
import { LayoutDashboard, FolderOpen, ChevronDown, GripVertical } from 'lucide-react';

export default function Home() {
  const [workspace, setWorkspace] = useState('.');
  const [leftWidth, setLeftWidth] = useState(25); // percentage
  const [rightWidth, setRightWidth] = useState(25); // percentage
  const [isDraggingLeft, setIsDraggingLeft] = useState(false);
  const [isDraggingRight, setIsDraggingRight] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleWorkspaceSelect = () => {
    const path = prompt('Enter workspace path (e.g., "." or "src"):', workspace);
    if (path) {
      setWorkspace(path);
      window.dispatchEvent(new CustomEvent('workspace-changed', { detail: path }));
    }
  };

  // Handle left splitter drag
  const handleLeftMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingLeft(true);
  };

  const handleRightMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingRight(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const containerWidth = containerRect.width;

      if (isDraggingLeft) {
        const newLeftWidth = ((e.clientX - containerRect.left) / containerWidth) * 100;
        if (newLeftWidth >= 15 && newLeftWidth <= 40) {
          setLeftWidth(newLeftWidth);
        }
      }

      if (isDraggingRight) {
        const newRightWidth = ((containerRect.right - e.clientX) / containerWidth) * 100;
        if (newRightWidth >= 15 && newRightWidth <= 40) {
          setRightWidth(newRightWidth);
        }
      }
    };

    const handleMouseUp = () => {
      setIsDraggingLeft(false);
      setIsDraggingRight(false);
    };

    if (isDraggingLeft || isDraggingRight) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingLeft, isDraggingRight]);

  const middleWidth = 100 - leftWidth - rightWidth;

  return (
    <div className="h-screen flex flex-col bg-black text-gray-100 overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#38383a] ios-blur flex-shrink-0">
        <div className="flex items-center gap-4">
          <span className="text-xl font-bold text-white">RezStack</span>
          <span className="text-xs px-2 py-1 bg-[#2c2c2e] rounded-md text-[#8e8e93]">v4.2</span>
          
          <button
            onClick={handleWorkspaceSelect}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#2c2c2e] hover:bg-gray-700 rounded-lg text-sm transition-colors ml-4"
          >
            <FolderOpen className="w-4 h-4 text-blue-400" />
            <span className="text-gray-200">Select Workspace</span>
            <ChevronDown className="w-3 h-3 text-[#8e8e93]" />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/rez-dashboard"
            className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
          
          <span className="text-sm text-[#8e8e93]">🔋 25 Models Active</span>
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" title="Online" />
        </div>
      </div>

      {/* 3 Panel Layout with Splitters */}
      <div ref={containerRef} className="flex-1 flex min-h-0 relative">
        {/* Left Panel - Explorer */}
        <div className="h-full overflow-auto" style={{ width: `${leftWidth}%` }}>
          <div className="p-3 text-xs font-medium text-[#8e8e93] uppercase tracking-wider border-b border-[#38383a]">
            EXPLORER
          </div>
          <div className="overflow-auto h-[calc(100%-41px)]">
            <FileTree workspace={workspace} />
          </div>
        </div>

        {/* Left Splitter */}
        <div
          className="w-1 hover:w-2 bg-[#2c2c2e] hover:bg-purple-600 cursor-col-resize transition-all duration-150 flex items-center justify-center group"
          onMouseDown={handleLeftMouseDown}
        >
          <GripVertical className="w-3 h-3 text-gray-600 group-hover:text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Middle Panel - JARVIS CHAT */}
        <div className="h-full flex flex-col" style={{ width: `${middleWidth}%` }}>
          <div className="p-3 text-xs font-medium text-[#8e8e93] uppercase tracking-wider border-b border-[#38383a]">
            JARVIS TERMINAL
          </div>
          <div className="flex-1 overflow-auto">
            <JARVISTerminal />
          </div>
        </div>

        {/* Right Splitter */}
        <div
          className="w-1 hover:w-2 bg-[#2c2c2e] hover:bg-purple-600 cursor-col-resize transition-all duration-150 flex items-center justify-center group"
          onMouseDown={handleRightMouseDown}
        >
          <GripVertical className="w-3 h-3 text-gray-600 group-hover:text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Right Panel - Inspector */}
        <div className="h-full overflow-auto" style={{ width: `${rightWidth}%` }}>
          <div className="p-3 text-xs font-medium text-[#8e8e93] uppercase tracking-wider border-b border-[#38383a]">
            INSPECTOR
          </div>
          <div className="overflow-auto h-[calc(100%-41px)]">
            <AgentInspector />
          </div>
        </div>
      </div>
    </div>
  );
}

