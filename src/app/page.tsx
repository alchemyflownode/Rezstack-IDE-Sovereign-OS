"use client";
import { SovereignLayout } from '@/features/core/SovereignLayout';
import { FileTree } from '@/features/files/FileTree';
import { AgentInspector } from '@/features/agents/AgentInspector';
import { JARVISTerminal } from '@/features/core/JARVISTerminal';
import { ModelSelector } from '@/components/ModelSelector';

export default function HomePage() {
  return (
    <SovereignLayout pageTitle="Dashboard">
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-panel p-4">
          <h3 className="text-xs font-bold mb-2">File Explorer</h3>
          <FileTree />
        </div>
        <div className="glass-panel p-4">
          <h3 className="text-xs font-bold mb-2">Agent Inspector</h3>
          <AgentInspector />
        </div>
        <div className="glass-panel p-4 col-span-2">
          <h3 className="text-xs font-bold mb-2">Model Selector</h3>
          <ModelSelector />
        </div>
      </div>
    </SovereignLayout>
  );
}
