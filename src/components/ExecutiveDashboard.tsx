"use client";

import React, { useState, useEffect } from 'react';
import { CheckSquare, Clock, FileText, Search } from 'lucide-react';

export const ExecutiveDashboard: React.FC = () => {
  const [notes, setNotes] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [reminders, setReminders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [noteInput, setNoteInput] = useState('');

  const takeNote = async () => {
    if (!noteInput.trim()) return;
    
    // Dispatch event for MacWindow causality feed
    window.dispatchEvent(new CustomEvent('agent-event', {
      detail: { agent: 'executive', action: 'taking note', status: 'active' }
    }));

    // In a real implementation, this would call the MCP server
    setNotes(prev => [{
      content: noteInput,
      timestamp: new Date().toLocaleString()
    }, ...prev]);
    
    setNoteInput('');
    
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('agent-event', {
        detail: { agent: 'executive', action: 'note saved', status: 'idle' }
      }));
    }, 500);
  };

  return (
    <div style={{ padding: 24, height: '100%', overflow: 'auto' }}>
      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>Sovereign Executive</h2>
      
      {/* Quick Note Input */}
      <div style={{ marginBottom: 30 }}>
        <h3 style={{ fontSize: 14, color: '#888', marginBottom: 8 }}>📝 Quick Note</h3>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="text"
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && takeNote()}
            placeholder="Write something to remember..."
            style={{
              flex: 1,
              padding: '10px 12px',
              background: '#0a0a0a',
              border: '1px solid #252525',
              borderRadius: 6,
              color: '#fff'
            }}
          />
          <button
            onClick={takeNote}
            style={{
              padding: '10px 20px',
              background: '#8b5cf6',
              border: 'none',
              borderRadius: 6,
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            Save
          </button>
        </div>
      </div>

      {/* Recent Notes */}
      <div style={{ marginBottom: 30 }}>
        <h3 style={{ fontSize: 14, color: '#888', marginBottom: 8 }}>📚 Recent Notes</h3>
        {notes.length === 0 ? (
          <div style={{ color: '#444', textAlign: 'center', padding: 20 }}>
            No notes yet. Tell JARVIS "remember this" or type above.
          </div>
        ) : (
          notes.map((note, i) => (
            <div key={i} style={{
              padding: 12,
              background: '#0a0a0a',
              border: '1px solid #252525',
              borderRadius: 6,
              marginBottom: 8
            }}>
              <div style={{ fontSize: 12, color: '#aaa', marginBottom: 4 }}>{note.timestamp}</div>
              <div style={{ fontSize: 13 }}>{note.content}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
