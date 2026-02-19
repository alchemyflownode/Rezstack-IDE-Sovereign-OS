"use client";
import { SovereignLayout } from '@/features/core/SovereignLayout';
import { SecurityCenter } from '@/features/security/SecurityCenter';

export default function SecurityPage() {
  return (
    <SovereignLayout pageTitle="Security Center">
      <SecurityCenter />
    </SovereignLayout>
  );
}
