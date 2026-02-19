"use client";
import { SovereignLayout } from '@/features/core/SovereignLayout';
import { EmailDashboard } from '@/features/email/EmailDashboard';

export default function MailPage() {
  return (
    <SovereignLayout pageTitle="Mail">
      <EmailDashboard />
    </SovereignLayout>
  );
}
