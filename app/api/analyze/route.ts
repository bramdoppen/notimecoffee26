import { NextRequest, NextResponse } from 'next/server';
import { getOpenAIClient, ANALYSIS_MODEL } from '@/lib/openai';

/**
 * POST /api/analyze
 *
 * Analyze a property using OpenAI.
 * Phase 1: Basic skeleton — returns a placeholder analysis.
 * Phase 2: Full scoring model integration with analyst's data contract.
 *
 * Body: { propertyId: string }
 * Returns: { analysis: PropertyAnalysis } (shape TBD by data contract)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { propertyId } = body;

    if (!propertyId || typeof propertyId !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid propertyId' },
        { status: 400 }
      );
    }

    // TODO Phase 2: Fetch property from Sanity, run through scoring model
    // For now, verify OpenAI connectivity
    const openai = getOpenAIClient();

    const completion = await openai.chat.completions.create({
      model: ANALYSIS_MODEL,
      messages: [
        {
          role: 'system',
          content:
            'Je bent een Nederlandse aankoopmakelaar-assistent. ' +
            'Analyseer woningen op basis van de gegeven data.',
        },
        {
          role: 'user',
          content: `Analyseer woning met ID: ${propertyId}. Dit is een test-aanroep — bevestig dat de verbinding werkt.`,
        },
      ],
      max_tokens: 100,
    });

    return NextResponse.json({
      status: 'ok',
      message: 'OpenAI integration working. Full analysis coming in Phase 2.',
      test_response: completion.choices[0]?.message?.content,
      propertyId,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('OPENAI_API_KEY')) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 503 }
      );
    }

    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
