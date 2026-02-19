export interface SCE {
  meta: SCEMeta;
  segments: SCESegment[];
  creative_policy?: SCECreativePolicy;
}

export interface SCEMeta {
  version: string;
  domain: string;
  topic: string;
  drift_lock: 'STRICT' | 'LOOSE' | 'NONE';
  invariants: string[];
  length?: string;
}

export interface SCESegment {
  id: number;
  title: string;
  start: number;
  end: number;
  duration: number;
  audio_bytecode: AudioBytecode;
  video_bytecode: VideoBytecode;
  exitState: ExitState;
}

export interface AudioBytecode {
  engine: string;
  instruction: string;
  target_bpm?: number;
  narration_text: string;
  validation_cue: string;
}

export interface VideoBytecode {
  engine: string;
  cam: string;
  act: string;
  subject: string;
  light: string;
  style: string;
  invariant_ref?: string[];
}

export interface ExitState {
  desc: string;
  validation_cue: {
    cue_id: string;
    threshold: number;
  };
  state_hash: string;
}

export interface SCECreativePolicy {
  freedom: 'UNBOUNDED' | 'BOUNDED' | 'STRICT';
  constraint_scope: string;
  chaos_level?: number;
  allowed_distortions?: string[];
  forbidden?: string[];
}
