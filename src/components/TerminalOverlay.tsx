"use client";

import React, { useState, useEffect, useRef } from 'react';
import { X, Terminal, Zap, Shield } from 'lucide-react';
import { useQuantumState } from '@/hooks/useQuantumState';
import { useRezSwarm } from '@/hooks/useRezSwarm';
import { JarvisParser } from '@/lib/JarvisParser';

interface TerminalOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TerminalOverlay: React.FC<TerminalOverlayProps> = ({ isOpen, onClose }) => {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  
  const { phase, phiRatio, transmute } = useQuantumState();
  const { executeCommand, history, isProcessing } = useRezSwarm();

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (overlayRef.current && !overlayRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (input.length < 2) {
      setSuggestions([]);
      return;
    }

    const intent = JarvisParser.parse(input);
    if (intent.type !== 'REJECTED') {
      setSuggestions([`${intent.action} â€“ ${intent.explanation}`]);
    } else {
      setSuggestions([]);
    }
  }, [input]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const intent = await executeCommand(input);

    if (intent.type === 'TRANSMUTE') {
      await transmute(intent.payload);
    }

    setInput('');
    onClose();
  };

  if (!isOpen) return null;

  const glowColor = phase === 'PLASMA' ? '#ec4899' : 
                    phase === 'LIQUID' ? '#3b82f6' : 
                    '#8b5cf6';

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(8px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div
        ref={overlayRef}
        style={{
          width: '600px',
          maxWidth: '90vw',
          background: '#0f0f0f',
          border: `1px solid ${glowColor}40`,
          borderRadius: 16,
          boxShadow: `0 25px 50px -12px ${glowColor}30`,
          transform: `scale(${1 + (phiRatio - 1.618) * 0.1})`,
          transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
          overflow: 'hidden'
        }}
      >
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #252525',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#0a0a0a'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Terminal size={18} color={glowColor} />
            <span style={{ 
              fontSize: 12, 
              fontWeight: 600, 
              color: '#fff',
              letterSpacing: '0.05em',
              textTransform: 'uppercase'
            }}>
              JARVIS TERMINAL
            </span>
            <span style={{
              fontSize: 10,
              padding: '2px 6px',
              background: '#1a1a1a',
              borderRadius: 4,
              color: glowColor,
              fontFamily: 'monospace'
            }}>
              âŒ˜K
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#555',
              cursor: 'pointer',
              padding: 4,
              borderRadius: 4
            }}
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            background: '#0a0a0a',
            border: `1px solid ${glowColor}30`,
            borderRadius: 8,
            padding: '4px 4px 4px 16px'
          }}>
            <span style={{ color: glowColor, fontSize: 14 }}>ðŸ¦Š</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask JARVIS... (e.g., 'power mode', 'clean system')"
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#fff',
                fontSize: 14,
                padding: '12px 0'
              }}
              disabled={isProcessing}
            />
            <button
              type="submit"
              disabled={!input.trim() || isProcessing}
              style={{
                background: glowColor,
                border: 'none',
                borderRadius: 6,
                padding: '8px 16px',
                color: '#fff',
                fontSize: 12,
                fontWeight: 600,
                cursor: input.trim() && !isProcessing ? 'pointer' : 'not-allowed',
                opacity: input.trim() && !isProcessing ? 1 : 0.5
              }}
            >
              {isProcessing ? '...' : 'SEND'}
            </button>
          </div>

          {suggestions.length > 0 && (
            <div style={{
              marginTop: 12,
              padding: '12px 16px',
              background: '#0a0a0a',
              border: '1px solid #252525',
              borderRadius: 8,
              fontSize: 12,
              color: '#aaa'
            }}>
              {suggestions[0]}
            </div>
          )}

          <div style={{
            marginTop: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            fontSize: 11,
            color: '#555'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Zap size={12} color={phase === 'PLASMA' ? glowColor : '#555'} />
              <span>PHASE: {phase}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Shield size={12} color="#30d158" />
              <span>CONSTITUTIONAL</span>
            </div>
            <div style={{ flex: 1 }} />
            <span style={{ fontFamily: 'monospace' }}>Ï† = {phiRatio.toFixed(3)}</span>
          </div>
        </form>

        {history.length > 0 && (
          <div style={{
            borderTop: '1px solid #252525',
            padding: '16px 20px',
            background: '#0a0a0a'
          }}>
            <div style={{
              fontSize: 10,
              fontWeight: 600,
              color: '#555',
              marginBottom: 8,
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Recent
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {history.slice(-3).map((event) => (
                <div key={event.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 11,
                  fontFamily: 'monospace'
                }}>
                  <span style={{ color: '#555' }}>[{event.timestamp}]</span>
                  <span style={{ color: '#8b5cf6' }}>{event.action}:</span>
                  <span style={{ color: '#aaa' }}>{event.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
