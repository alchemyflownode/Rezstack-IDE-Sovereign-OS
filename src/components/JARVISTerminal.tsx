'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Terminal, ChevronRight } from 'lucide-react';

interface TerminalLine {
  id: string;
  type: 'command' | 'response' | 'error';
  content: string;
}

interface JARVISTerminalProps {
  initialHistory?: TerminalLine[];
}

const defaultHistory: TerminalLine[] = [
  { id: '1', type: 'command', content: '$ scan G:\\okiru\\app builder\\RezStackFinal2\\RezStackFinal' },
  { id: '2', type: 'response', content: 'Command received' },
  { id: '3', type: 'command', content: '$ scan --critical G:\\okiru\\app builder\\RezStackFinal2\\RezStackFinal' },
  { id: '4', type: 'response', content: 'Command received' },
];

export function JARVISTerminal({ initialHistory = defaultHistory }: JARVISTerminalProps) {
  const [history, setHistory] = useState<TerminalLine[]>(initialHistory);
  const [currentInput, setCurrentInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const processCommand = (command: string): string => {
    const cmd = command.trim().toLowerCase();
    
    if (cmd === 'help') {
      return `Available commands:
  scan [path]        - Scan directory for analysis
  scan --critical    - Focus on high-risk vulnerabilities
  analyze            - Deep system analysis
  tutorial           - Start interactive tutorial
  clear              - Clear terminal
  help               - Show this help message`;
    }
    
    if (cmd === 'clear') {
      return '__CLEAR__';
    }
    
    if (cmd.startsWith('scan')) {
      return 'Command received';
    }
    
    if (cmd === 'analyze') {
      return 'Initiating deep analysis... Neural engine engaged.';
    }
    
    if (cmd === 'tutorial') {
      return 'Starting Sovereign Tutorial module... Welcome, Apprentice!';
    }
    
    return `Command not recognized: "${command}". Type "help" for available commands.`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentInput.trim()) return;

    const newCommand: TerminalLine = {
      id: Date.now().toString(),
      type: 'command',
      content: `$ ${currentInput}`,
    };

    const response = processCommand(currentInput);
    
    if (response === '__CLEAR__') {
      setHistory([]);
    } else {
      const newResponse: TerminalLine = {
        id: (Date.now() + 1).toString(),
        type: 'response',
        content: response,
      };
      setHistory((prev) => [...prev, newCommand, newResponse]);
    }
    
    setCurrentInput('');
  };

  return (
    <Card className="glass-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Terminal className="w-5 h-5 text-orange-500" />
            JARVIS Terminal
          </CardTitle>
          <Badge className="badge-warning text-xs">
            Sovereign Terminal v3.1
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-black/60 rounded-lg border border-primary/20 overflow-hidden">
          {/* Terminal Output */}
          <div
            ref={scrollRef}
            className="h-40 overflow-y-auto p-4 font-mono text-sm space-y-1"
          >
            <p className="text-muted-foreground text-xs mb-3">
              Type "help" for commands
            </p>
            {history.map((line) => (
              <div
                key={line.id}
                className={`${
                  line.type === 'command' ? 'terminal-prompt' : 'terminal-output'
                }`}
              >
                {line.content}
              </div>
            ))}
          </div>
          
          {/* Terminal Input */}
          <form onSubmit={handleSubmit} className="flex items-center p-3 border-t border-primary/20">
            <ChevronRight className="w-4 h-4 text-primary mr-2" />
            <Input
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              placeholder="Enter command..."
              className="flex-1 bg-transparent border-none outline-none text-cyan-400 placeholder-muted-foreground font-mono text-sm focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
              autoFocus
            />
            <span className="w-2 h-5 bg-cyan-400 cursor-blink ml-1" />
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
