// Cloudflare Worker for L'Oréal Beauty Assistant
// Deploy this to Cloudflare Workers and set OPENAI_API_KEY as an environment variable

export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    };

    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Only allow POST requests
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: corsHeaders
      });
    }

    try {
      const apiKey = env.OPENAI_API_KEY;
      if (!apiKey) {
        return new Response(JSON.stringify({ error: 'API key not configured' }), {
          status: 500,
          headers: corsHeaders
        });
      }
      
      const apiUrl = 'https://api.openai.com/v1/chat/completions';
      
      const requestBody = await request.json();
      const { messages } = requestBody;

      if (!messages || !Array.isArray(messages)) {
        return new Response(JSON.stringify({ error: 'Invalid request: messages array required' }), {
          status: 400,
          headers: corsHeaders
        });
      }

      const openAIRequestBody = {
        model: 'gpt-4o',
        messages: messages,
        max_tokens: 300,
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(openAIRequestBody)
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('OpenAI API error:', data);
        return new Response(JSON.stringify({ 
          error: data.error?.message || 'OpenAI API request failed',
          details: data
        }), {
          status: response.status,
          headers: corsHeaders
        });
      }

      return new Response(JSON.stringify(data), { headers: corsHeaders });

    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }), {
        status: 500,
        headers: corsHeaders
      });
    }
  }
}; 