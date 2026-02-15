'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Bot, User, Settings, MoreVertical, Paperclip, Loader } from 'lucide-react';

// Premium glass morphism styles
const glassStyle = {
  background: 'rgba(20, 20, 30, 0.7)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
};

// Message bubble with Framer Motion
const MessageBubble = ({ message, isUser, timestamp }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ type: "spring", stiffness: 500, damping: 30 }}
    className={`flex gap-3 mb-6 ${isUser ? 'flex-row-reverse' : ''}`}
  >
    {/* Avatar */}
    <motion.div
      whileHover={{ scale: 1.1, rotate: 5 }}
      className={`w-8 h-8 rounded-full flex items-center justify-center ${
        isUser ? 'bg-cyan-500/20' : 'bg-purple-500/20'
      }`}
    >
      {isUser ? 
        <User className="w-4 h-4 text-cyan-400" /> : 
        <Bot className="w-4 h-4 text-purple-400" />
      }
    </motion.div>

    {/* Message Content */}
    <div className={`flex-1 max-w-[80%] ${isUser ? 'items-end' : ''}`}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs font-medium text-white/60">
          {isUser ? 'You' : 'DeepSeek AI'}
        </span>
        <span className="text-[10px] text-white/30">{timestamp}</span>
      </div>
      <motion.div
        whileHover={{ scale: 1.01 }}
        className={`p-4 rounded-2xl ${
          isUser 
            ? 'bg-cyan-500/10 border border-cyan-500/20' 
            : 'bg-purple-500/10 border border-purple-500/20'
        }`}
        style={glassStyle}
      >
        <p className="text-sm text-white/90 leading-relaxed">{message}</p>
      </motion.div>
    </div>
  </motion.div>
);

// Typing indicator with Framer Motion
const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex gap-3 mb-6"
  >
    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
      <Bot className="w-4 h-4 text-purple-400" />
    </div>
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-medium text-white/60">DeepSeek AI</span>
      </div>
      <div className="p-4 rounded-2xl bg-purple-500/5 border border-purple-500/20 w-24">
        <div className="flex gap-1">
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
            className="w-2 h-2 bg-purple-400 rounded-full"
          />
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
            className="w-2 h-2 bg-purple-400 rounded-full"
          />
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
            className="w-2 h-2 bg-purple-400 rounded-full"
          />
        </div>
      </div>
    </div>
  </motion.div>
);

// Splitter handle with Framer Motion
const SplitterHandle = ({ onDrag }: any) => (
  <motion.div
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    className="w-1 h-full bg-purple-500/30 hover:bg-purple-500/50 cursor-col-resize transition-colors"
    drag="x"
    dragConstraints={{ left: 0, right: 0 }}
    dragElastic={0}
    onDrag={onDrag}
  />
);

export default function PremiumChat() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your AI pair programmer. How can I help?", isUser: false, timestamp: '2:34 PM' },
    { id: 2, text: "How do I implement a splitter layout with Framer Motion?", isUser: true, timestamp: '2:35 PM' },
    { id: 3, text: "Here's an example:\n\n```tsx\n<motion.div\n  drag=\"x\"\n  dragConstraints={{ left: 0, right: 0 }}\n  whileHover={{ scale: 1.1 }}\n/>\n```", isUser: false, timestamp: 'Just now' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const newMessage = {
      id: messages.length + 1,
      text: input,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        text: "That's a great question! Here's how you can implement that...",
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setIsTyping(false);
    }, 2000);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white overflow-hidden">
      {/* Premium Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="h-14 border-b border-white/10 flex items-center justify-between px-6"
        style={glassStyle}
      >
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center"
          >
            <span className="text-lg">🦊</span>
          </motion.div>
          <div>
            <h1 className="text-sm font-semibold text-white/90">Sovereign AI</h1>
            <p className="text-[10px] text-white/40">DeepSeek Coder • Online</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center"
          >
            <Settings className="w-4 h-4 text-white/60" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center"
          >
            <MoreVertical className="w-4 h-4 text-white/60" />
          </motion.button>
        </div>
      </motion.div>

      {/* Main Content with Splitter */}
      <div className="flex h-[calc(100vh-3.5rem)]">
        {/* Left Panel - Conversation History */}
        <motion.div 
          className="h-full border-r border-white/10 overflow-hidden"
          style={{ width: sidebarWidth, ...glassStyle }}
          animate={{ width: sidebarWidth }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="p-4 border-b border-white/10">
            <h2 className="text-xs font-medium text-white/60 uppercase tracking-wider">Conversations</h2>
          </div>
          <div className="p-2 space-y-1">
            {['Today', 'Yesterday', 'Last Week'].map(section => (
              <div key={section} className="mb-4">
                <p className="text-[10px] text-white/30 px-2 mb-2">{section}</p>
                {[1, 2, 3].map(i => (
                  <motion.div
                    key={i}
                    whileHover={{ x: 4 }}
                    className="p-2 rounded-lg hover:bg-white/5 cursor-pointer mb-1"
                  >
                    <p className="text-xs text-white/80 truncate">Chat about splitter layout</p>
                    <p className="text-[10px] text-white/30">2:34 PM</p>
                  </motion.div>
                ))}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Splitter Handle */}
        <SplitterHandle onDrag={(e: any, info: any) => {
          setSidebarWidth(prev => Math.max(240, Math.min(480, prev + info.delta.x)));
        }} />

        {/* Right Panel - Main Chat */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6">
            <AnimatePresence>
              {messages.map(message => (
                <MessageBubble 
                  key={message.id}
                  message={message.text}
                  isUser={message.isUser}
                  timestamp={message.timestamp}
                />
              ))}
            </AnimatePresence>
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <motion.div 
            className="p-6 border-t border-white/10"
            style={glassStyle}
          >
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center"
              >
                <Paperclip className="w-4 h-4 text-white/60" />
              </motion.button>
              
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask anything..."
                  className="w-full h-10 bg-white/5 border border-white/10 rounded-xl px-4 pr-12 text-sm text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 transition-colors"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  className="absolute right-1 top-1 w-8 h-8 bg-purple-500 hover:bg-purple-600 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Send className="w-4 h-4 text-white" />
                </motion.button>
              </div>

              <motion.button
                whileHover={{ scale: 1.05, rotate: 180 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center"
              >
                <Sparkles className="w-4 h-4 text-white" />
              </motion.button>
            </div>
            
            {/* Quick Actions */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-2 mt-3"
            >
              {['Explain code', 'Fix bug', 'Add feature', 'Optimize'].map(action => (
                <motion.button
                  key={action}
                  whileHover={{ y: -2 }}
                  className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-full text-[10px] text-white/60 transition-all"
                  onClick={() => setInput(action)}
                >
                  {action}
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
