"use client";
import React from "react";

interface ChatMessageProps {
  message: string;
  sender: "user" | "bot";
  timestamp?: Date;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, sender, timestamp }) => {
  return (
    <div className={`flex ${sender === 'user' ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`max-w-[70%] rounded-lg px-3 py-2 ${
        sender === 'user' 
          ? 'bg-[#8b5cf6] text-white' 
          : 'bg-[#252525] text-[#ccc]'
      }`}>
        <p className="text-xs">{message}</p>
        {timestamp && (
          <p className="text-[8px] opacity-70 mt-1">
            {timestamp.toLocaleTimeString()}
          </p>
        )}
      </div>
    </div>
  );
};
