
// Robust path extractor for Windows (handles spaces)
function extractFileSystemPath(input: string): string | null {
  // Match "in/path/from [PATH]" until end of string or unsafe char
  const match = input.match(/(?:list|read|in|from|path)\s+(.+?)(?:\s+and|\s*$)/i);
  if (match && match[1]) {
    return match[1].trim().replace(/^["']|["']$/g, ''); // Strip quotes
  }
  return null;
}
export interface CommandIntent {
  type: 'TRANSMUTE' | 'SWARM' | 'EXECUTIVE' | 'QUERY' | 'REJECTED';
  action: string;
  payload?: any;
  confidence: number;
  explanation?: string;
}

export function parse(input: string): CommandIntent {
  const lower = input.toLowerCase().trim();

  if (lower.includes('remember') || lower.includes('note')) {
    const content = lower.replace(/remember|that|note/g, '').trim();
    return {
      type: 'EXECUTIVE',
      action: 'take_note',
      payload: { content },
      confidence: 0.9,
      explanation: `📝 Remembering: "${content}"`
    };
  }
  if (lower.includes('add task') || lower.includes('task:')) {
    const title = lower.replace(/add task|task:/g, '').trim();
    return {
      type: 'EXECUTIVE',
      action: 'create_task',
      payload: { title },
      confidence: 0.9,
      explanation: `✅ Task added: "${title}"`
    };
  }
  if (lower.includes('what are my tasks') || lower.includes('list tasks')) {
    return {
      type: 'EXECUTIVE',
      action: 'list_tasks',
      confidence: 0.9,
      explanation: '📋 Fetching your tasks...'
    };
  }
  if (lower.includes('kill') || lower.includes('terminate')) {
    const proc = lower.replace(/kill|terminate/g, '').trim();
    return {
      type: 'SWARM',
      action: 'terminate_process',
      payload: { name: proc },
      confidence: 0.8,
      explanation: `🛑 Attempting to terminate "${proc}" (constitutional guard active)`
    };
  }
  if (lower.includes('launch') || lower.includes('open')) {
    const app = lower.replace(/launch|open/g, '').trim();
    return {
      type: 'SWARM',
      action: 'launch_app',
      payload: { path: app },
      confidence: 0.7,
      explanation: `🚀 Launching "${app}"`
    };
  }
  if (lower.includes('play') || lower.includes('spotify')) {
    return {
      type: 'SWARM',
      action: 'play_music',
      confidence: 0.8,
      explanation: '🎵 Playing (mock)'
    };
  }
  if (lower.includes('pause')) {
    return {
      type: 'SWARM',
      action: 'pause_music',
      confidence: 0.8,
      explanation: '⏸️ Paused'
    };
  }
  if (lower.includes('overclock') || lower.includes('plasma')) {
    return {
      type: 'TRANSMUTE',
      action: 'PLASMA',
      confidence: 0.9,
      explanation: '⚡ Overclocking to PLASMA'
    };
  }
  if (lower.includes('stabilize') || lower.includes('solid')) {
    return {
      type: 'TRANSMUTE',
      action: 'SOLID',
      confidence: 0.9,
      explanation: '🛡️ Stabilizing to SOLID'
    };
  }
  return {
    type: 'QUERY',
    action: 'chat',
    payload: { text: input },
    confidence: 0.5,
    explanation: '🦊 Processing...'
  };
}


