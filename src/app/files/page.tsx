"use client";
import { SovereignLayout } from '@/features/core/SovereignLayout';
import { FileTree } from '@/features/files/FileTree';

export default function FilesPage() {
  return (
    <SovereignLayout pageTitle="Files">
      <FileTree />
    </SovereignLayout>
  );
}
