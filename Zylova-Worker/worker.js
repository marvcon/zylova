/* =============================================
   ZYLOVA — Cloudflare Worker API Proxy
   
   This Worker sits between your website and
   the Anthropic API. Your API key is stored
   as a secret environment variable in Cloudflare
   — never exposed in your browser source code.

   DEPLOY INSTRUCTIONS:
   See README.md in this folder for full steps.
   ============================================= */

export default {
  async fetch(request, env) {

    // ---- CORS headers ----
    // Only allow requests from your own domain
    const ALLOWED_ORIGINS = [
      'https://zylova.ai',
      'https://www.zylova.ai',
      'http://localhost',        // for local testing
      'http://127.0.0.1'        // for local testing
    ];

    const origin = request.headers.get('Origin') || '';
    const allowedOrigin = ALLOWED_ORIGINS.includes(origin)
      ? origin
      : ALLOWED_ORIGINS[0];

    const corsHeaders = {
      'Access-Control-Allow-Origin':  allowedOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age':       '86400',
    };

    // ---- Handle preflight OPTIONS request ----
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // ---- Only allow POST ----
    if (request.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ---- Block requests from unknown origins ----
    if (!ALLOWED_ORIGINS.includes(origin)) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized origin' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    try {
      // ---- Parse the incoming request body ----
      const body = await request.json();

      // ---- Basic validation ----
      if (!body.messages || !Array.isArray(body.messages)) {
        return new Response(
          JSON.stringify({ error: 'Invalid request — messages array required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // ---- Rate limiting (simple — max 20 messages per conversation) ----
      if (body.messages.length > 40) {
        return new Response(
          JSON.stringify({ error: 'Conversation too long — please refresh to start a new chat' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // ---- Forward to Anthropic API ----
      // env.ANTHROPIC_API_KEY is your secret — set in Cloudflare dashboard
      const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type':      'application/json',
          'x-api-key':         env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model:      'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system:     body.system,
          messages:   body.messages,
        }),
      });

      const data = await anthropicResponse.json();

      // ---- Return response to browser ----
      return new Response(JSON.stringify(data), {
        status: anthropicResponse.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } catch (err) {
      console.error('Zylova Worker error:', err);
      return new Response(
        JSON.stringify({ error: 'Internal server error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  }
};
