import { NextRequest, NextResponse } from 'next/server';
import { SovereignClient } from '@/lib/sovereign-config';

export async function POST(request: NextRequest) {
  try {
    const { prompt, mode = 'ollama' } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    let result;
    
    switch (mode) {
      case 'swarm':
        const swarmResult = await SovereignClient.callSwarm(prompt);
        return NextResponse.json({
          code: swarmResult.response,
          mode: 'swarm',
          success: true,
        });
      
      case 'council':
        const councilResult = await SovereignClient.consultCouncil(prompt);
        return NextResponse.json({
          verdict: councilResult,
          mode: 'council',
          success: true,
        });
      
      default:
        result = await SovereignClient.generateCode(prompt);
        
        // Optional: Validate with Constitutional Bridge
        if (process.env.NEXT_PUBLIC_ENABLE_CONSTITUTIONAL === 'true') {
          try {
            const validation = await SovereignClient.validateCode(result.code);
            result.validation = validation;
          } catch (e) {
            console.warn('Constitutional validation skipped:', e);
          }
        }
        
        // Optional: Scan with JARVIS API
        if (process.env.NEXT_PUBLIC_ENABLE_JARVIS === 'true') {
          try {
            const scan = await SovereignClient.scanCode(result.code);
            result.scan = scan;
          } catch (e) {
            console.warn('JARVIS scan skipped:', e);
          }
        }
        
        return NextResponse.json({
          ...result,
          mode: 'ollama',
          success: true,
        });
    }
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate code',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  const health = await SovereignClient.checkHealth();
  return NextResponse.json({
    sovereign: 'ACTIVE',
    ...health,
    message: 'Sovereign AI Ecosystem Connected',
  });
}
