/* eslint-disable */
// src/services/NLUBridge.ts
import { ecosystem } from './EcosystemBridge';

export interface NLUResponse {
  intent: 'scan' | 'fix' | 'memory' | 'status' | 'models' | 'agents' | 'skills' | 'search' | 'help' | 'unknown';
  confidence: number;
  entities: Record<string, any>;
  response: string;
}

class NLUBridge {
  private static instance: NLUBridge;
  private ollamaModel = 'llama3.2:latest';
  
  static getInstance() {
    if (!NLUBridge.instance) {
      NLUBridge.instance = new NLUBridge();
    }
    return NLUBridge.instance;
  }

  async process(input: string): Promise<NLUResponse> {
    const lower = input.toLowerCase();
    
    if (lower.includes('/scan') || lower.includes('scan') || lower.includes('audit')) {
      return {
        intent: 'scan',
        confidence: 0.9,
        entities: { type: 'constitutional' },
        response: await this.callSwarmScan()
      };
    }
    
    if (lower.includes('/status') || lower.includes('status') || lower.includes('health')) {
      return {
        intent: 'status',
        confidence: 0.9,
        entities: {},
        response: await this.checkAllServices()
      };
    }
    
    if (lower.includes('/help') || lower.includes('help') || lower.includes('?')) {
      return {
        intent: 'help',
        confidence: 1.0,
        entities: {},
        response: this.getHelp()
      };
    }
    
    return {
      intent: 'unknown',
      confidence: 0.7,
      entities: {},
      response: "I'm not sure how to help. Try /help"
    };
  }

  private async callSwarmScan(): Promise<string> {
    try {
      const response = await fetch('http://localhost:8000/scan', {
        signal: AbortSignal.timeout(3000)
      });
      if (response.ok) {
        const data = await response.json();
        return `Scan complete: ${data.violationsFound || 0} violations`;
      }
    } catch (error) {
      console.warn('Swarm scan failed:', error);
    }
    return "Swarm API not available";
  }

  private async checkAllServices(): Promise<string> {
    const services = [
      { name: 'Swarm API', port: 8000 },
      { name: 'Constitutional Bridge', port: 8001 },
      { name: 'JARVIS API', port: 8002 },
      { name: 'Ollama', port: 11434 }
    ];
    
    let status = "System Status:\n";
    for (const svc of services) {
      try {
        const response = await fetch(`http://localhost:${svc.port}/health`, {
          signal: AbortSignal.timeout(1000)
        });
        status += response.ok ? `✅ ${svc.name}: ONLINE\n` : `⚠️ ${svc.name}: ERROR\n`;
      } catch {
        status += `❌ ${svc.name}: OFFLINE\n`;
      }
    }
    return status;
  }

  private getHelp(): string {
    return "Commands:\n/scan - Constitutional scan\n/status - System health\n/help - This message";
  }
}

export const nlu = NLUBridge.getInstance();
