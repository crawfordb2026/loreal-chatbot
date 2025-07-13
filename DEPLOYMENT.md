# Deployment Guide for L'Oréal Beauty Assistant

This guide will walk you through deploying the L'Oréal Beauty Assistant chatbot using Cloudflare Workers.

## Prerequisites

- A Cloudflare account (free tier works)
- The OpenAI API key provided in the project
- Basic familiarity with web development

## Step 1: Set Up Cloudflare Workers

### 1.1 Create Cloudflare Account
1. Go to [cloudflare.com](https://cloudflare.com)
2. Click "Sign Up" and create a free account
3. Verify your email address

### 1.2 Access Workers Dashboard
1. Log into your Cloudflare dashboard
2. In the left sidebar, click "Workers & Pages"
3. Click "Create application"

### 1.3 Create a New Worker
1. Choose "Create Worker"
2. Give your worker a name (e.g., "loreal-beauty-assistant")
3. Click "Deploy"

## Step 2: Configure the Worker

### 2.1 Add Worker Code
1. In your worker dashboard, click on your worker name
2. Click "Edit code"
3. Replace the default code with the contents of `cloudflare-worker.js`
4. Click "Save and deploy"

### 2.2 Set Environment Variables
1. In your worker dashboard, go to "Settings" tab
2. Click "Environment variables"
3. Add a new variable:
   - **Variable name**: `OPENAI_API_KEY`
   - **Value**: The API key is already configured in the Cloudflare Worker
4. Click "Save"

### 2.3 Get Your Worker URL
1. In the "Overview" tab, you'll see your worker URL
2. It will look like: `https://loreal-beauty-assistant.your-username.workers.dev`
3. Copy this URL - you'll need it for the next step

## Step 3: Update Frontend Code

### 3.1 Update Worker URL
1. Open `script.js` in your code editor
2. Find this line:
   ```javascript
   const workerUrl = 'https://your-worker.your-subdomain.workers.dev';
   ```
3. Replace it with your actual worker URL:
   ```javascript
   const workerUrl = 'https://loreal-beauty-assistant.your-username.workers.dev';
   ```

## Step 4: Deploy Frontend

### Option A: GitHub Pages (Recommended)
1. Create a new GitHub repository
2. Upload all project files to the repository
3. Go to repository Settings > Pages
4. Select "Deploy from a branch" and choose "main"
5. Your site will be available at `https://your-username.github.io/repository-name`

### Option B: Netlify
1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub
3. Click "New site from Git"
4. Choose your repository
5. Deploy

### Option C: Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Import your repository
4. Deploy

### Option D: Traditional Web Hosting
1. Upload all files to your web hosting provider
2. Ensure the files are in the public directory
3. Access via your domain

## Step 5: Test Your Deployment

### 5.1 Test the Worker
1. Open your browser's developer tools
2. Go to the Network tab
3. Send a message in the chatbot
4. You should see a request to your Cloudflare Worker URL
5. Check that the response contains the AI reply

### 5.2 Common Issues and Solutions

#### CORS Errors
- **Problem**: Browser blocks requests to the worker
- **Solution**: The worker code already includes CORS headers, but make sure your frontend URL is correct

#### API Key Issues
- **Problem**: "Authentication failed" errors
- **Solution**: Double-check the environment variable name and value in Cloudflare

#### No Response
- **Problem**: Chatbot doesn't respond
- **Solution**: Check browser console for errors and verify the worker URL

## Step 6: Customization (Optional)

### 6.1 Custom Domain
1. In Cloudflare Workers, go to "Custom domains"
2. Add your domain
3. Update the worker URL in your frontend code

### 6.2 Analytics
1. In Cloudflare Workers, enable "Analytics"
2. Monitor your worker's performance and usage

### 6.3 Rate Limiting
1. Consider adding rate limiting to prevent abuse
2. Cloudflare Workers can handle this automatically

## Security Considerations

### API Key Protection
- ✅ API key is stored in Cloudflare environment variables
- ✅ Never exposed in frontend code
- ✅ Worker acts as a secure proxy

### CORS Configuration
- ✅ Proper CORS headers implemented
- ✅ Only allows necessary HTTP methods
- ✅ Validates request format

### Input Validation
- ✅ Worker validates message format
- ✅ Error handling for malformed requests
- ✅ Graceful error responses

## Monitoring and Maintenance

### 1. Check Worker Logs
- Go to Cloudflare Workers dashboard
- Click on your worker
- Check "Logs" tab for any errors

### 2. Monitor Usage
- Free tier includes 100,000 requests per day
- Monitor usage in the dashboard
- Upgrade if needed

### 3. Update Dependencies
- Keep your worker code updated
- Monitor OpenAI API changes
- Update system prompts as needed

## Troubleshooting Checklist

- [ ] Cloudflare account created and verified
- [ ] Worker deployed successfully
- [ ] Environment variable set correctly
- [ ] Worker URL updated in frontend code
- [ ] Frontend deployed and accessible
- [ ] CORS headers working
- [ ] API key valid and working
- [ ] No console errors in browser
- [ ] Chatbot responds to messages

## Support

If you encounter issues:
1. Check the Cloudflare Workers documentation
2. Review the troubleshooting section in README.md
3. Check browser console for error messages
4. Verify all URLs and API keys are correct

---

**Congratulations!** Your L'Oréal Beauty Assistant is now live and ready to help customers discover beauty products! 🎉 