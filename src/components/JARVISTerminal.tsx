import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
}

export default function JARVISTerminal() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 'welcome', type: 'system', content: '🦊 JARVIS Terminal - Connected to Sovereign AI', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setMessages(prev => [...prev, { 
      id: Date.now().toString(), 
      type: 'user', 
      content: userMessage,
      timestamp: new Date()
    }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8001/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: userMessage,
          sender: 'jarvis',
          constitutional: true,
          workspace: localStorage.getItem('rezstack-workspace') || '.'
        })
      });

      const data = await response.json();
      
      if (data.responses && data.responses.length > 0) {
        setMessages(prev => [...prev, { 
          id: Date.now().toString() + 'ai', 
          type: 'ai', 
          content: data.responses[0].content,
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        id: Date.now().toString() + 'error', 
        type: 'system', 
        content: '❌ Error connecting to AI',
        timestamp: new Date()
      }]);
    }

    setIsLoading(false);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: '#1a1a1a',
      border: '1px solid #333',
      borderRadius: '8px',
      overflow: 'hidden'
    }}>
      <div style={{
        padding: '8px 12px',
        backgroundColor: '#2a2a2a',
        borderBottom: '1px solid #333',
        color: '#8b5cf6',
        fontSize: '12px',
        fontWeight: 'bold'
      }}>
        🦊 JARVIS Terminal v2.0
      </div>
      
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '12px',
        fontFamily: 'monospace',
        fontSize: '13px'
      }}>
        {messages.map(msg => (
          <div key={msg.id} style={{
            marginBottom: '8px',
            padding: '4px 8px',
            backgroundColor: msg.type === 'user' ? '#2a2a2a' : msg.type === 'ai' ? '#1a2a1a' : 'transparent',
            borderRadius: '4px',
            color: msg.type === 'user' ? '#8b5cf6' : msg.type === 'ai' ? '#10b981' : '#888',
            textAlign: msg.type === 'user' ? 'right' : 'left'
          }}>
            {msg.content}
          </div>
        ))}
        {isLoading && <div style={{ color: '#888', padding: '4px' }}>🤔 Thinking...</div>}
        <div ref={messagesEndRef} />
      </div>

      <div style={{
        padding: '8px',
        borderTop: '1px solid #333',
        backgroundColor: '#2a2a2a',
        display: 'flex',
        gap: '8px'
      }}>
        <span style={{ color: '#8b5cf6', padding: '4px' }}>$</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          style={{
            flex: 1,
            padding: '6px',
            backgroundColor: '#1a1a1a',
            border: '1px solid #333',
            borderRadius: '4px',
            color: '#fff',
            fontFamily: 'monospace'
          }}
          placeholder="Ask me anything..."
          disabled={isLoading}
        />
        <button
          onClick={sendMessage}
          disabled={isLoading}
          style={{
            padding: '6px 12px',
            backgroundColor: '#8b5cf6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.5 : 1
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
