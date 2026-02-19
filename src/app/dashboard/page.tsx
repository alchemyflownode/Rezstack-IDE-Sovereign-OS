"use client";
import { SovereignLayout } from '@/features/core/SovereignLayout';
import { VisualHome } from '@/features/dashboard';

export default function DashboardPage() {
  return (
    <SovereignLayout pageTitle="Dashboard">
      <VisualHome />
    </SovereignLayout>
  );
}
