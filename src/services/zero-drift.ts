// src/services/zero-drift.ts - Constitutional AI with Bypass

// ========== BYPASS CONTROL ==========
let constitutionalMode = true;

export function setConstitutionalMode(enabled: boolean) {
  constitutionalMode = enabled;
  console.log(`🦊 Constitutional mode: ${enabled ? 'ON (strict)' : 'OFF (free)'}`);
}

export function isConstitutionalMode(): boolean {
  return constitutionalMode;
}

// ========== TYPES ==========
export interface CurationResult {
  correctedCode: string;
  vibeScore: number;
  status: 'STABLE' | 'DRIFTING' | 'CRITICAL' | 'BYPASSED';
  violations: string[];
  fixesApplied: string[];
}

// ========== MAIN SERVICE ==========
export const zeroDriftAI = {
  /**
   * Curate code with constitutional rules (unless bypassed)
   */
  curate: (rawContent: string): CurationResult => {
    // BYPASS MODE - Return original without checks
    if (!constitutionalMode) {
      return {
        correctedCode: rawContent,
        vibeScore: 100,
        status: 'BYPASSED',
        violations: ['⚠️ Constitutional safeguards BYPASSED'],
        fixesApplied: []
      };
    }

    // CONSTITUTIONAL MODE - Apply all rules
    let content = rawContent;
    const violations: string[] = [];
    const fixesApplied: string[] = [];
    let score = 100;

    // Rule 1: No 'any' types
    if (content.includes(': any') || content.includes(':any')) {
      violations.push("CONSTITUTIONAL VIOLATION: 'any' type detected");
      score -= 15;
      content = content.replace(/: ?any/g, ': unknown');
      fixesApplied.push("Replaced 'any' with 'unknown'");
    }

    // Rule 2: No external dependencies for core functions
    if (content.includes('cloneDeep') || content.includes('lodash')) {
      violations.push("CONSTITUTIONAL VIOLATION: External dependency detected");
      score -= 20;
      content = content.replace(/cloneDeep/g, 'structuredClone');
      fixesApplied.push("Replaced lodash with native methods");
    }

    // Rule 3: No debug logs in production
    if (content.includes('console.log')) {
      violations.push("CONSTITUTIONAL VIOLATION: Debug logging detected");
      score -= 10;
      content = content.replace(/console\.log\([^;]*\);?/g, '// Log removed');
      fixesApplied.push("Removed console.log statements");
    }

    // Calculate status
    const status = score >= 90 ? 'STABLE' : score >= 70 ? 'DRIFTING' : 'CRITICAL';

    return {
      correctedCode: content,
      vibeScore: Math.max(0, score),
      status,
      violations,
      fixesApplied
    };
  },

  /**
   * Build system prompt with current mode
   */
  buildSystemPrompt: (): string => {
    if (!constitutionalMode) {
      return "You are a helpful AI assistant. Answer freely without constitutional restrictions.";
    }

    return `You are the RezStack Sovereign Constitutional AI.
You must obey these immutable laws:

LAW 1: No 'any' types - Always use specific types
LAW 2: No external dependencies - Use native methods
LAW 3: No debug logs in production
LAW 4: Handle all errors with try/catch

Return ONLY code. No explanations.`;
  },

  /**
   * Get current mode status
   */
  getStatus: () => ({
    mode: constitutionalMode ? 'constitutional' : 'bypassed',
    constitutional: constitutionalMode
  })
};

export default zeroDriftAI;
