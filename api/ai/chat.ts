export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { 
      status: 405, 
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const apiKey = process.env.API_LLM_AI || '';
  const apiEndpoint = process.env.API_LLM_ENDPOINT || '';
  const apiModel = process.env.API_LLM_MODEL || 'claudible/claude-haiku-4-5';

  if (!apiKey || !apiEndpoint) {
    return new Response(JSON.stringify({ error: 'AI service not configured on server.' }), { 
      status: 503, 
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = await req.json();

    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: body.model || apiModel,
        messages: body.messages,
        stream: body.stream ?? true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(JSON.stringify({ error: `Server error: ${response.status}`, detail: errorText }), { 
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (body.stream !== false) {
      return new Response(response.body, {
        status: 200,
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    } else {
      const data = await response.json();
      return new Response(JSON.stringify(data), { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'Failed to reach AI backend', detail: err.message }), { 
      status: 502,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
