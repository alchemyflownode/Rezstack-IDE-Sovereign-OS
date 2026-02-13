'use client';

import React, { useState, useRef } from 'react';
import { SovereignHeader } from '@/components/SovereignHeader';
import { EnhancedResizableLayout } from '@/components/EnhancedResizableLayout';
import { CommandSidebar } from '@/components/CommandSidebar';
import JARVISTerminal from '@/components/JARVISTerminal';

export default function ChatPage() {
  const [workspace, setWorkspace] = useState('/');
  const [currentPath, setCurrentPath] = useState('.');
  const terminalRef = useRef<any>(null);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <SovereignHeader
        searchQuery=""
        onSearchChange={() => {}}
        categoryFilter="ALL"
        onCategoryChange={() => {}}
        workspace={workspace}
        onWorkspaceChange={setWorkspace}
      />
      
      <div className="flex-1 overflow-hidden">
        <EnhancedResizableLayout
          left={
            <div className="p-4">
              <CommandSidebar
                selectedCategory={null}
                onCategorySelect={() => {}}
                selectedDifficulty="ALL"
              />
            </div>
          }
          right={
            <div className="h-full p-4">
              <h1 className="text-2xl font-bold text-purple-400 mb-4">Chat</h1>
              <JARVISTerminal
                ref={terminalRef}
                workspace={workspace}
                currentPath={currentPath}
                onPathChange={setCurrentPath}
              />
            </div>
          }
          leftConfig={{ id: 'chat-sidebar', defaultSize: 20, minSize: 15, maxSize: 30 }}
          bottomConfig={{ id: 'chat-terminal', defaultSize: 40, minSize: 20, maxSize: 70 }}
        />
      </div>
    </div>
  );
}