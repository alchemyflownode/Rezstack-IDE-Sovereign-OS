'use client';

import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Terminal, Send, Zap } from 'lucide-react';

interface JARVISTerminalProps {
  workspace: string;
  currentPath: string;
  onPathChange: (path: string) => void;
}

const JARVISTerminal = forwardRef<{ executeCommand: (cmd: string) => void }, JARVISTerminalProps>(({ 
  workspace, 
  currentPath, 
  onPathChange 
}, ref) => {
  const [command, setCommand] = useState('');
  const [output, setOutput] = useState<string[]>([
    '╔════════════════════════════════════════════════════════════════╗',
    '║              SOVEREIGN TERMINAL v3.5 - REZ DNA               ║',
    '║        ✅ CAT • LS • SCAN • FIX • STATUS • PREDICT • VIBE     ║',
    '║              Nine-Tailed Resonator • MEI 0.99p               ║',
    '╚════════════════════════════════════════════════════════════════╝',
    '',
    '🦊 Type "help" - show all commands',
    '🦊 Type "vibe" - check your mastery XP',
    '🦊 Type "status" - verify ecosystem services',
    '🦊 Type "scan" - constitutional violation scan',
    '🦊 Type "fix" - auto-remediate issues',
    '🦊 Type "ls" - list files',
    '🦊 Type "cat <file>" - view file contents',
    '🦊 Type "cd <dir>" - change directory',
    ''
  ]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [workspaceDisplay, setWorkspaceDisplay] = useState(workspace.split("\\").pop() || workspace.split("/").pop() || workspace);

  // Listen for workspace changes
  useEffect(() => {
    const handleWorkspaceChange = (e: CustomEvent) => {
      const newPath = e.detail?.path;
      if (newPath) {
        setWorkspaceDisplay(newPath.split("\\").pop() || newPath.split("/").pop() || newPath);
      }
    };

    window.addEventListener('workspace:changed', handleWorkspaceChange as EventListener);
    return () => window.removeEventListener('workspace:changed', handleWorkspaceChange as EventListener);
  }, []);

  useImperativeHandle(ref, () => ({
    executeCommand: (cmd: string) => {
      setCommand(cmd);
      setTimeout(() => {
        const input = document.querySelector('input[placeholder*="cat"]') as HTMLInputElement;
        if (input) {
          input.value = cmd;
          handleExecute();
        }
      }, 50);
    }
  }));

  const handleExecute = async () => {
    if (!command.trim()) return;
    
    const fullCmd = command.trim();
    
    setOutput(prev => [...prev, 
      `🦊 JARVIS@${workspaceDisplay}:${currentPath === '.' ? '~' : currentPath}$ ${fullCmd}`
    ]);
    setCommand('');
    setIsProcessing(true);

    try {
      const response = await fetch('/api/terminal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          command: fullCmd,
          workspace: workspace
        })
      });
      
      const data = await response.json();
      setOutput(prev => [...prev, data.output, '']);
    } catch (error) {
      setOutput(prev => [...prev, `❌ Error: ${error instanceof Error ? error.message : 'Command failed'}`, '']);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="mt-4 border border-purple-500/30 rounded-xl overflow-hidden bg-gray-950 shadow-lg shadow-purple-500/10">
      <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-purple-900/40 via-gray-900 to-cyan-900/20 border-b border-purple-500/30">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Terminal className="w-5 h-5 text-purple-400" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          </div>
          <div>
            <span className="text-xs font-mono text-purple-300 font-bold flex items-center gap-2">
              🦊 JARVIS@{workspaceDisplay}
              <span className="bg-purple-500/20 px-2 py-0.5 rounded-full text-[10px] text-purple-300 border border-purple-500/30">
                REZ DNA v3.5
              </span>
            </span>
            <span className="text-[10px] text-gray-500 block">
              {currentPath === '.' ? '~' : currentPath}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 bg-emerald-500/10 px-2 py-1 rounded-full">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] text-emerald-400 font-medium">ONLINE</span>
          </span>
          <span className="flex items-center gap-1.5 bg-amber-500/10 px-2 py-1 rounded-full">
            <Zap className="w-3 h-3 text-amber-400" />
            <span className="text-[10px] text-amber-400 font-medium">MEI 0.99p</span>
          </span>
        </div>
      </div>
      
      <div className="h-72 overflow-y-auto p-4 font-mono text-xs bg-gradient-to-b from-gray-950 to-gray-900">
        {output.map((line, i) => {
          if (line.includes('🦊')) 
            return <div key={i} className="text-purple-400 whitespace-pre-wrap">{line}</div>;
          if (line.includes('✅')) 
            return <div key={i} className="text-emerald-400 whitespace-pre-wrap">✓ {line}</div>;
          if (line.includes('❌')) 
            return <div key={i} className="text-red-400 whitespace-pre-wrap">✗ {line}</div>;
          if (line.includes('╔') || line.includes('║') || line.includes('╚')) 
            return <div key={i} className="text-purple-500 whitespace-pre-wrap">{line}</div>;
          return <div key={i} className="text-gray-300 whitespace-pre-wrap">{line}</div>;
        })}
        {isProcessing && (
          <div className="flex items-center gap-2 text-purple-400 mt-2">
            <div className="animate-spin">⚡</div>
            <span>Processing...</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center px-4 py-3 bg-gray-900/90 border-t border-purple-500/30">
        <span className="text-purple-400 mr-2 text-xs font-bold">🦊</span>
        <span className="text-purple-400 mr-2 text-xs font-mono">$</span>
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleExecute()}
          placeholder="Try: scan • fix • ls • cat package.json"
          className="flex-1 bg-transparent border-none outline-none text-xs text-gray-200 placeholder-gray-600 font-mono"
          autoFocus
          disabled={isProcessing}
        />
        <button 
          onClick={handleExecute} 
          disabled={isProcessing || !command.trim()}
          className="ml-2 px-4 py-1.5 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-xs font-medium transition-all duration-200 shadow-lg shadow-purple-500/20"
        >
          RUN
        </button>
      </div>
    </div>
  );
});

export default JARVISTerminal;
