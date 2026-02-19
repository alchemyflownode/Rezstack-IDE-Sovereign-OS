"use client";
import { SovereignLayout } from "@/features/core/SovereignLayout";
import { useState } from 'react';

export default function NotesPage() {
  const [note, setNote] = useState('');
  return (
    <SovereignLayout pageTitle="Notes">
      <div className="glass-panel p-4">
        <h3 className="text-[12px] font-bold mb-2">📝 Sovereign Notes</h3>
        <textarea 
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Type a note... it stays on your machine."
          className="w-full bg-[#0b0b0b] border border-[#252525] rounded p-2 text-[11px] h-32 resize-none focus:outline-none focus:border-purple-500"
        />
        <button className="rez-btn mt-2">💾 Save to Memory Crystal</button>
      </div>
    </SovereignLayout>
  );
}
