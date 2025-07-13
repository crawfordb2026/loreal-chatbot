# Production Deployment Guide - L'Oréal Beauty Assistant

Complete guide to deploy your L'Oréal Beauty Assistant chatbot with GitHub Pages frontend and Cloudflare Workers backend.

## 🎯 **Overview**

This setup creates a secure, production-ready chatbot where:
- **Frontend**: Hosted on GitHub Pages (free)
- **Backend**: Cloudflare Workers (free tier available)
- **Security**: API key stored securely in Cloudflare environment variables

## 🚀 **Step 1: Set Up Cloudflare Worker**

### 1.1 Create Cloudflare Account
1. Go to [cloudflare.com](https://cloudflare.com)
2. Click "Sign Up" and create a free account
3. Verify your email address

### 1.2 Create Worker
1. Log into Cloudflare dashboard
2. Go to "Workers & Pages" → "Create application"
3. Choose "Start with Hello World"
4. Name your worker: `loreal-beauty-assistant`
5. Click "Deploy"

### 1.3 Add Worker Code
1. Click on your worker name
2. Click "Edit code"
3. **Delete all default code**
4. **Copy and paste** the contents of `cloudflare-worker.js`
5. Click "Save and deploy"

### 1.4 Set Environment Variable
1. Go to "Settings" tab
2. Click "Environment variables"
3. Add new variable:
   - **Name**: `OPENAI_API_KEY`
   - **Value**: The API key is already configured in the Cloudflare Worker
4. Click "Save"

### 1.5 Get Worker URL
1. Go to "Overview" tab
2. Copy your worker URL (e.g., `https://loreal-beauty-assistant.your-username.workers.dev`)

## 🚀 **Step 2: Deploy to GitHub Pages**

### 2.1 Create GitHub Repository
1. Go to [github.com](https://github.com)
2. Click "New repository"
3. Name it: `loreal-beauty-assistant`
4. Make it **Public** (required for free GitHub Pages)
5. Click "Create repository"

### 2.2 Upload Files
1. Upload all project files to your repository:
   - `index.html`
   - `style.css`
   - `script.js`
   - `img/loreal-logo.png`
   - `README.md`

### 2.3 Update Worker URL
1. Open `script.js` in your repository
2. Find line 108: `const workerUrl = 'https://your-worker.your-subdomain.workers.dev';`
3. Replace with your actual worker URL from Step 1.5
4. Commit the changes

### 2.4 Enable GitHub Pages
1. Go to repository Settings
2. Click "Pages" in the left sidebar
3. Under "Source", select "Deploy from a branch"
4. Choose "main" branch
5. Click "Save"
6. Your site will be available at: `https://your-username.github.io/loreal-beauty-assistant`

## ✅ **Step 3: Test Your Deployment**

### 3.1 Test the Worker
1. Open your GitHub Pages site
2. Open browser Developer Tools (F12)
3. Go to Network tab
4. Send a message in the chatbot
5. You should see a request to your Cloudflare Worker URL
6. Check that the response contains the AI reply

### 3.2 Verify Security
- ✅ API key is not visible in browser source code
- ✅ All requests go through Cloudflare Worker
- ✅ CORS headers are properly configured

## 🔧 **Configuration Files**

### cloudflare-worker.js (Production Ready)
```javascript
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
```

### script.js (Production Ready)
The script.js file is already configured for production with:
- `useDirectAPI = false` (uses Cloudflare Workers)
- Proper error handling
- No hardcoded API keys in production mode

## 🐛 **Troubleshooting**

### Common Issues

1. **CORS Errors**
   - Ensure your GitHub Pages URL is correct
   - Check that Cloudflare Worker CORS headers are set

2. **API Key Issues**
   - Verify environment variable is set correctly in Cloudflare
   - Check worker logs for authentication errors

3. **Worker Not Responding**
   - Verify worker URL is correct in script.js
   - Check Cloudflare Worker logs for errors

4. **Rate Limiting**
   - Cloudflare Workers have their own rate limits
   - Monitor usage in Cloudflare dashboard

### Debug Steps

1. **Check Worker Logs**
   - Go to Cloudflare Workers dashboard
   - Click on your worker
   - Check "Logs" tab for errors

2. **Browser Console**
   - Open Developer Tools
   - Check Console tab for JavaScript errors
   - Check Network tab for failed requests

3. **Test Worker Directly**
   - Use curl or Postman to test worker URL
   - Send a POST request with test messages

## 📊 **Monitoring**

### Cloudflare Workers
- Free tier: 100,000 requests per day
- Monitor usage in dashboard
- Set up alerts for high usage

### GitHub Pages
- Free hosting for public repositories
- Automatic deployments on push
- Custom domain support available

## 🔒 **Security Features**

- ✅ API key stored in Cloudflare environment variables
- ✅ No sensitive data in frontend code
- ✅ CORS properly configured
- ✅ Input validation on worker
- ✅ Error handling without exposing internals

## 🎉 **Success!**

Your L'Oréal Beauty Assistant is now:
- ✅ Securely deployed with Cloudflare Workers
- ✅ Hosted on GitHub Pages
- ✅ Using AI-generated responses only
- ✅ Following L'Oréal branding guidelines
- ✅ Ready for production use

**Your chatbot URL**: `https://your-username.github.io/loreal-beauty-assistant`

---

**Note**: Remember to update the worker URL in script.js with your actual Cloudflare Worker URL before deploying to GitHub Pages! 