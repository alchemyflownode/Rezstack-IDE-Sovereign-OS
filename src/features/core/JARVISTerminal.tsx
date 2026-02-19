"use client";
import React, { useState, useRef, useEffect } from 'react';

interface JARVISTerminalProps {
  compact?: boolean;
  onCommand?: (cmd: any) => void;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'jarvis';
  timestamp: Date;
}

export const JARVISTerminal: React.FC<JARVISTerminalProps> = ({ compact = false, onCommand }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '# 🦊 JARVIS Terminal v2.1 • Sovereign Mode\n\n**Constitutional Guard: ACTIVE**\n\nTry commands like:\n- "remember that the meaning of life is 42"\n- "add task: check GPU temperatures"\n- "remind me in 2 minutes to take a break"\n- "what are my tasks?"\n- "overclock" or "stabilize"\n- "search notes for quantum"',
      sender: 'jarvis',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Client-only timestamp for display
  const [currentTime, setCurrentTime] = useState('');
  
  useEffect(() => {
    // Update timestamp only on client
    setCurrentTime(new Date().toLocaleTimeString());
    
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);

    // Simulate JARVIS response
    setTimeout(() => {
      const jarvisResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: `✅ Command processed: "${input.substring(0, 30)}..."`,
        sender: 'jarvis',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, jarvisResponse]);
      setIsProcessing(false);
      onCommand?.({ type: 'command', payload: input });
    }, 500);
  };

  return (
    <div className="h-full flex flex-col bg-[#0f0f0f] text-white">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-3 py-1 border-b border-[#252525] bg-[#0a0a0a]">
        <div className="flex items-center gap-2">
          <span className="text-[#8b5cf6] text-xs">🦊 JARVIS</span>
          <span className="text-[8px] text-[#555] font-mono">• {currentTime || '...'}</span>
        </div>
        {!compact && (
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-[#30d158] rounded-full animate-pulse" />
            <span className="text-[8px] text-[#30d158] font-bold">ACTIVE</span>
          </div>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2 font-mono text-[11px]">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded px-2 py-1 ${
              msg.sender === 'user' 
                ? 'bg-[#8b5cf6]/20 text-[#8b5cf6]' 
                : 'text-[#ccc]'
            }`}>
              <div className="whitespace-pre-wrap">{msg.content}</div>
              <div className="text-[6px] text-[#555] mt-1">
                {msg.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-[#252525] rounded px-2 py-1">
              <span className="text-[#888] animate-pulse">● ● ●</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-[#252525] p-2 bg-[#0a0a0a]">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Command JARVIS..."
            className="flex-1 bg-[#1a1a1a] border border-[#333] rounded px-3 py-1.5 text-xs text-white placeholder:text-[#555] outline-none focus:border-[#8b5cf6]"
            disabled={isProcessing}
          />
          <button
            onClick={handleSend}
            disabled={isProcessing}
            className={`px-4 py-1.5 rounded text-xs font-medium ${
              isProcessing 
                ? 'bg-[#333] text-[#666] cursor-not-allowed' 
                : 'bg-[#8b5cf6] text-white hover:bg-[#7c4dff]'
            }`}
          >
            Send
          </button>
        </div>
        {!compact && (
          <div className="flex gap-2 mt-1 text-[8px] text-[#555]">
            <span>↑↓ history</span>
            <span>•</span>
            <span>Tab to complete</span>
            <span>•</span>
            <span>Ctrl+C to cancel</span>
          </div>
        )}
      </div>
    </div>
  );
};
