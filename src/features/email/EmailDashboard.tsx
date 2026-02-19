"use client";
import React, { useState, useEffect } from 'react';
import { Mail, Send, RefreshCw, Shield } from 'lucide-react';

interface Email {
  id: string;
  from: string;
  subject: string;
  body: string;
  timestamp: Date;
  flags?: string[];
}

export const EmailDashboard = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [selected, setSelected] = useState<Email | null>(null);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    fetchEmails();
  }, []);
  
  const fetchEmails = async () => {
    setLoading(true);
    setTimeout(() => {
      setEmails([
        {
          id: '1',
          from: 'user@example.com',
          subject: 'Test Email',
          body: 'This is a test email body',
          timestamp: new Date()
        }
      ]);
      setLoading(false);
    }, 1000);
  };
  
  const handleSelect = (email: Email) => {
    setSelected(email);
    setDraft(`Thank you for your email regarding "${email.subject}"...`);
  };
  
  const handleSend = async () => {
    alert('Send with BCC to you (Article 2.2)');
  };
  
  return (
    <div className="h-full flex flex-col bg-gray-950 text-white">
      <div className="h-12 shrink-0 flex items-center justify-between px-4 border-b border-purple-500/30">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-bold text-purple-300">Email Sovereign</span>
          <Shield className="w-3 h-3 text-emerald-400 ml-2" />
        </div>
        <button onClick={fetchEmails} className="p-1 hover:bg-purple-500/20 rounded">
          <RefreshCw className="w-4 h-4 text-gray-500" />
        </button>
      </div>
      
      <div className="flex-1 min-h-0 flex">
        <div className="w-1/3 border-r border-purple-500/20 overflow-y-auto">
          {emails.map(email => (
            <div
              key={email.id}
              onClick={() => handleSelect(email)}
              className={`p-3 border-b border-purple-500/10 cursor-pointer hover:bg-purple-500/5 ${
                selected?.id === email.id ? 'bg-purple-500/10' : ''
              }`}
            >
              <div className="text-xs font-medium text-purple-300">{email.from}</div>
              <div className="text-xs font-bold mt-1">{email.subject}</div>
            </div>
          ))}
        </div>
        
        {selected ? (
          <div className="flex-1 flex flex-col p-4">
            <div className="flex-1 overflow-y-auto">
              <div className="text-xs text-gray-500">From: {selected.from}</div>
              <div className="text-sm font-bold mt-2">{selected.subject}</div>
              <div className="text-sm mt-4 whitespace-pre-wrap">{selected.body}</div>
            </div>
            
            <div className="shrink-0 mt-4">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className="w-full h-32 bg-gray-900 border border-purple-500/30 rounded p-2 text-sm"
                placeholder="Draft response..."
              />
              <button
                onClick={handleSend}
                className="mt-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm flex items-center gap-2"
              >
                <Send className="w-4 h-4" /> Send (with BCC)
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select an email to respond
          </div>
        )}
      </div>
    </div>
  );
};
