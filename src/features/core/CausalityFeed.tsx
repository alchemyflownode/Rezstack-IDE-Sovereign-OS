"use client";

import React, { useRef, useEffect } from 'react';

interface CausalityEvent {
  id: string;
  timestamp: Date;
  action: string;
  phase: 'SOLID' | 'LIQUID' | 'PLASMA';
  constitutional: boolean;
}

interface CausalityFeedProps {
  events: CausalityEvent[];
  compact?: boolean;
}

export const CausalityFeed: React.FC<CausalityFeedProps> = ({ events, compact = false }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [events]);

  if (compact) {
    return (
      <div className="rez-density" style={{ 
        width: 200, padding: 12, background: '#141414', borderLeft: '1px solid #252525',
        overflowY: 'auto', maxHeight: '100%'
      }}>
        <div className="rez-mono" style={{ color: '#555', marginBottom: 8, fontSize: 9, textTransform: 'uppercase' }}>
          Causality Feed
        </div>
        <div ref={scrollRef} style={{ spaceY: 4 }}>
          {events.slice(-5).reverse().map((e) => (
            <div key={e.id} style={{ 
              padding: '4px 0', borderBottom: '1px solid #1a1a1a', fontSize: 10 
            }}>
              <div style={{ color: '#858585' }}>{e.timestamp.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</div>
              <div style={{ color: e.phase === 'PLASMA' ? '#ec4899' : e.phase === 'LIQUID' ? '#3b82f6' : '#8b5cf6' }}>
                {e.action}
              </div>
              {e.constitutional && <span style={{color:'#30d158',fontSize:9}}>🛡️</span>}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel rez-density" style={{ 
      width: 280, padding: 16, background: '#141414', borderLeft: '1px solid #252525' 
    }}>
      <div className="rez-mono" style={{ color: '#555', marginBottom: 12, fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        🏛️ Causality Feed
      </div>
      <div ref={scrollRef} style={{ maxHeight: 400, overflowY: 'auto', spaceY: 8 }}>
        {events.length === 0 ? (
          <div style={{ color: '#555', fontSize: 10, fontStyle: 'italic' }}>Awaiting causal events...</div>
        ) : (
          events.slice().reverse().map((e) => (
            <div key={e.id} style={{ 
              padding: 8, background: '#1a1a1a', borderRadius: 6, marginBottom: 4,
              borderLeft: `2px solid ${e.phase === 'PLASMA' ? '#ec4899' : e.phase === 'LIQUID' ? '#3b82f6' : '#8b5cf6'}`
            }}>
              <div className="rez-mono" style={{ color: '#555', fontSize: 9 }}>{e.timestamp.toLocaleTimeString()}</div>
              <div style={{ color: '#fff', fontSize: 11, marginTop: 2 }}>{e.action}</div>
              {e.constitutional && (
                <div style={{ color: '#30d158', fontSize: 9, marginTop: 2 }}>🛡️ Constitutional Guard: Verified</div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
