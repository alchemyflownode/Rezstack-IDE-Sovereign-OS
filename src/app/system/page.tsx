"use client";
import { SovereignLayout } from '@/features/core/SovereignLayout';
import { SystemCore } from '@/features/system/SystemCore';

export default function SystemPage() {
  return (
    <SovereignLayout pageTitle="System Core">
      <SystemCore />
    </SovereignLayout>
  );
}
