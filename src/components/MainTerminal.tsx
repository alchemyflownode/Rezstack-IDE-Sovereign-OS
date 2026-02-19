'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Send, Loader } from 'lucide-react';

interface MainTerminalProps {
  workspace?: string;
  currentPath?: string;
  onPlanStart?: (plan: unknown[]) => void;
  onStepUpdate?: (index: number, status: string) => void;
  onShardCreate?: (shard: unknown) => void;
}

export default function MainTerminal({ 
  workspace = '', 
  currentPath = '.',
  onPlanStart = () => {},
  onStepUpdate = () => {},
  onShardCreate = () => {}
}: MainTerminalProps) {
  const [command, setCommand] = useState('');
  const [output, setOutput] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedModel, setSelectedModel] = useState('llama3.2:latest');
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial welcome message - NO TEST DATA
    setOutput([
      'JARVIS Terminal v4.2',
      'Type /help for available commands',
      ''
    ]);
  }, []);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  const handleExecute = async () => {
    if (!command.trim()) return;

    const fullCmd = command.trim();
    setOutput(prev => [...prev, `> ${fullCmd}`]);
    setCommand('');
    setIsProcessing(true);

    try {
      // Handle special commands
      if (fullCmd === '/help') {
        setOutput(prev => [...prev, 
          'Available commands:',
          '  /help     - Show this message',
          '  /scan     - Run constitutional scan',
          '  /status   - Check system status',
          '  /memory   - Query memory crystals',
          '  /clear    - Clear terminal',
          ''
        ]);
        setIsProcessing(false);
        return;
      }

      if (fullCmd === '/clear') {
        setOutput([]);
        setIsProcessing(false);
        return;
      }

      // Forward to API
      const response = await fetch('/api/terminal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: fullCmd, workspace })
      });

      const data = await response.json();
      const lines = data.output?.split('\n') || [`Command '${fullCmd}' executed`];
      setOutput(prev => [...prev, ...lines, '']);
    } catch (error) {
      setOutput(prev => [...prev, 
        `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        ''
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-950 border border-purple-500/30 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-purple-900/40 via-gray-900 to-cyan-900/20 border-b border-purple-500/30">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-mono text-purple-300 font-bold">JARVIS TERMINAL</span>
        </div>
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="bg-purple-500/10 border border-purple-500/30 rounded px-2 py-1 text-[10px] text-purple-300 font-mono"
        >
          <option value="llama3.2:latest">Llama 3.2</option>
          <option value="phi4:latest">Phi-4</option>
        </select>
      </div>

      <div 
        ref={outputRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-sm bg-gray-950"
      >
        {output.map((line, i) => (
          <div key={i} className="text-gray-300 whitespace-pre-wrap font-mono">{line}</div>
        ))}
      </div>

      <div className="p-3 border-t border-purple-500/30 bg-gray-900">
        <div className="flex gap-2">
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleExecute()}
            placeholder="Enter command..."
            className="flex-1 bg-gray-950 border border-purple-500/30 rounded px-3 py-2 text-sm text-purple-300 font-mono focus:outline-none focus:border-purple-500"
            disabled={isProcessing}
          />
          <button
            onClick={handleExecute}
            disabled={isProcessing}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white font-mono text-sm transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isProcessing ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>Run</span>
          </button>
        </div>
      </div>
    </div>
  );
}

