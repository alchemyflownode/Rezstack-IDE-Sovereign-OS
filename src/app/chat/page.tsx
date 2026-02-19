"use client";
import { SovereignLayout } from '@/features/core/SovereignLayout';
import { ChatMessage } from '@/features/chat/ChatMessage';
import { useState } from 'react';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { text: input, sender: 'user' }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { text: 'AI response coming soon...', sender: 'bot' }]);
    }, 1000);
  };

  return (
    <SovereignLayout pageTitle="Chat">
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <ChatMessage key={i} message={msg.text} sender={msg.sender} />
          ))}
        </div>
        <div className="p-4 border-t border-[#333]">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1 bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-sm text-white"
              placeholder="Type a message..."
            />
            <button onClick={sendMessage} className="px-4 py-2 bg-[#8b5cf6] text-white rounded hover:bg-[#7c4dff]">
              Send
            </button>
          </div>
        </div>
      </div>
    </SovereignLayout>
  );
}
