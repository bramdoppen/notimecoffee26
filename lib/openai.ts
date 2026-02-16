import OpenAI from 'openai';

/**
 * OpenAI client singleton.
 *
 * Used for:
 * - Property analysis / scoring (Phase 2)
 * - Description summarization
 * - Search profile matching
 *
 * Requires OPENAI_API_KEY environment variable.
 */

function createOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      'Missing environment variable: OPENAI_API_KEY. ' +
        'Set it in .env.local or your deployment environment.'
    );
  }
  return new OpenAI({ apiKey });
}

// Lazy singleton — only created when first accessed
let _client: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  if (!_client) {
    _client = createOpenAIClient();
  }
  return _client;
}

/**
 * Default model for property analysis.
 * GPT-4o for structured output with good reasoning.
 */
export const ANALYSIS_MODEL = 'gpt-4o' as const;

/**
 * Default model for quick tasks (summarization, extraction).
 * GPT-4o-mini for cost efficiency.
 */
export const FAST_MODEL = 'gpt-4o-mini' as const;
