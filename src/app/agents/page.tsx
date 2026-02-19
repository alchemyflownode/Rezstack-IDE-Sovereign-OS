"use client";
import { SovereignLayout } from '@/features/core/SovereignLayout';
import { AgentInspector } from '@/features/agents/AgentInspector';

export default function AgentsPage() {
  return (
    <SovereignLayout pageTitle="Agents">
      <AgentInspector />
    </SovereignLayout>
  );
}
