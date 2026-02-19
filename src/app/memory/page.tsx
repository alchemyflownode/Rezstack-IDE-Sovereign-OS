"use client";
import { SovereignLayout } from '@/features/core/SovereignLayout';
import { MemoryCrystals } from '@/features/memory/MemoryCrystals';

export default function MemoryPage() {
  return (
    <SovereignLayout pageTitle="Memory Crystals">
      <MemoryCrystals />
    </SovereignLayout>
  );
}
