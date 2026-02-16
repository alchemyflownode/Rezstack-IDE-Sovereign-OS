'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Search,
  MessageSquare,
  FolderTree,
  ChevronDown,
  Cpu
} from 'lucide-react';

interface SovereignHeaderProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export function SovereignHeader({ searchQuery = '', onSearchChange }: SovereignHeaderProps) {
  const pathname = usePathname();
  const [workspace, setWorkspace] = useState('Select Workspace');
  const [model, setModel] = useState('llama3.2:latest');

  // Handle workspace selection
  const handleWorkspaceClick = useCallback(() => {
    const event = new CustomEvent('jarvis-command', { 
      detail: '/workspace' 
    });
    window.dispatchEvent(event);
  }, []);

  // Handle model selection
  const handleModelClick = useCallback(() => {
    const event = new CustomEvent('jarvis-command', { 
      detail: '/models' 
    });
    window.dispatchEvent(event);
  }, []);

  // Primary navigation tabs
  const navTabs = [
    { name: 'Workspace', href: '#', icon: FolderTree, action: handleWorkspaceClick },
    { name: 'Chat', href: '/', icon: MessageSquare },
    { name: 'Dashboard', href: '/rez-dashboard', icon: LayoutDashboard },
  ];

  return (
    <header data-testid="header-main" className="border-b border-purple-500/20 bg-gray-950/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 h-16">
        {/* Left: Logo + Navigation */}
        <div className="flex items-center gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-2xl">🦊</span>
            <span className="font-bold text-lg bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent hidden sm:inline">
              RezStack
            </span>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = tab.href !== '#' ? pathname === tab.href : false;
              
              if (tab.href !== '#') {
                return (
                  <Link
                    key={tab.name}
                    href={tab.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      isActive 
                        ? 'bg-purple-500/20 text-purple-400 border-b-2 border-purple-500' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{tab.name}</span>
                  </Link>
                );
              }
              
              return (
                <button
                  key={tab.name}
                  onClick={tab.action}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-gray-400 hover:text-white hover:bg-white/5"
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-3">
          {/* Workspace Selector */}
          <button
            onClick={handleWorkspaceClick}
            className="flex items-center gap-2 px-3 py-1.5 bg-black/40 border border-purple-500/30 rounded-lg text-sm hover:bg-purple-500/10 transition-all"
          >
            <FolderTree className="w-4 h-4 text-purple-400" />
            <span className="hidden sm:inline">{workspace}</span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>

          {/* Model Selector */}
          <button
            onClick={handleModelClick}
            className="flex items-center gap-2 px-3 py-1.5 bg-black/40 border border-purple-500/30 rounded-lg hover:bg-purple-500/10 transition-all"
          >
            <Cpu className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-mono truncate max-w-[150px]">{model}</span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-2 border-t border-purple-500/10">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search commands... (try /scan, /fix, /memory)"
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-black/40 border border-purple-500/30 rounded-lg text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchQuery.startsWith('/')) {
                const event = new CustomEvent('jarvis-command', { 
                  detail: searchQuery 
                });
                window.dispatchEvent(event);
                onSearchChange?.('');
              }
            }}
          />
        </div>
      </div>
    </header>
  );
}

