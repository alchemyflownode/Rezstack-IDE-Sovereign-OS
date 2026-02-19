'use client';
import React, { useState, useEffect } from 'react';
import { stateLogger } from '@/store/stateLogger';
import { StateTransaction } from '@/types/state';

export const StateDebugPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [transactions, setTransactions] = useState<StateTransaction[]>([]);
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState<StateTransaction | null>(null);

  const refresh = () => setTransactions(stateLogger.export());
  useEffect(() => { refresh(); const i = setInterval(refresh, 2000); return () => clearInterval(i); }, []);

  if (!isOpen) return (
    <button onClick={() => setIsOpen(true)} style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 9999, background: '#8b5cf6', color: '#fff', border: 'none', borderRadius: '50%', width: 48, height: 48, fontSize: 20, cursor: 'pointer', boxShadow: '0 4px 12px rgba(139,92,246,0.5)' }}>🐛</button>
  );

  const filtered = filter ? transactions.filter(t => t.type.toLowerCase().includes(filter.toLowerCase()) || t.component.toLowerCase().includes(filter.toLowerCase())) : transactions;
  const fmt = (ts: number) => new Date(ts).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 });
  const color = (t: string) => {
    switch(t) {
      case 'WORKSPACE_CHANGE': return '#8b5cf6';
      case 'FILE_UPDATE': return '#10b981';
      case 'USER_ACTION': return '#f59e0b';
      case 'ERROR': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div style={{ position: 'fixed', top: 20, right: 20, bottom: 20, width: 500, background: '#1e1e1e', border: '1px solid #333', borderRadius: 12, zIndex: 9999, display: 'flex', flexDirection: 'column', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
      <div style={{ padding: 16, borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between' }}>
        <h3 style={{ margin: 0, color: '#8b5cf6' }}>🐛 State Transaction Log</h3>
        <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: '#888', fontSize: 20, cursor: 'pointer' }}>✕</button>
      </div>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #333' }}>
        <input placeholder="Filter by type or component..." value={filter} onChange={(e) => setFilter(e.target.value)} style={{ width: '100%', padding: 8, background: '#2a2a2a', border: '1px solid #444', borderRadius: 6, color: '#fff', fontSize: 13 }} />
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 8 }}>
        {filtered.length === 0 ? 
          <div style={{ textAlign: 'center', padding: 32, color: '#666' }}>No transactions yet</div> :
          filtered.map(t => (
            <div key={t.id} onClick={() => setSelected(t)} style={{ padding: 8, marginBottom: 4, background: selected?.id === t.id ? '#2a2a2a' : 'transparent', borderRadius: 6, cursor: 'pointer', border: '1px solid', borderColor: color(t.type) + '30' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ color: color(t.type), fontSize: 11, fontWeight: 600, textTransform: 'uppercase' }}>{t.type}</span>
                <span style={{ color: '#888', fontSize: 10 }}>{fmt(t.timestamp)}</span>
              </div>
              <div style={{ fontSize: 11, color: '#ccc' }}>{t.component}</div>
              {t.duration && <div style={{ fontSize: 10, color: '#888' }}>⏱️ {t.duration.toFixed(2)}ms</div>}
            </div>
          ))}
      </div>
      {selected && 
        <div style={{ padding: 16, borderTop: '1px solid #333', background: '#0a0a0a' }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#8b5cf6', fontSize: 12 }}>Transaction Details</h4>
          <pre style={{ fontSize: 10, color: '#888', overflowX: 'auto', margin: 0 }}>{JSON.stringify(selected, null, 2)}</pre>
        </div>
      }
      <div style={{ padding: '12px 16px', borderTop: '1px solid #333', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button onClick={() => stateLogger.clear()} style={{ padding: '4px 12px', background: '#2a2a2a', border: '1px solid #444', borderRadius: 4, color: '#888', fontSize: 11, cursor: 'pointer' }}>Clear</button>
        <button onClick={refresh} style={{ padding: '4px 12px', background: '#8b5cf6', border: 'none', borderRadius: 4, color: '#fff', fontSize: 11, cursor: 'pointer' }}>Refresh</button>
      </div>
    </div>
  );
};
