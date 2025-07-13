# L'Oréal Beauty Assistant Chatbot

A branded AI-powered chatbot that helps customers navigate L'Oréal's extensive product catalog and receive tailored beauty recommendations. Built with modern web technologies and deployed securely via Cloudflare Workers.

## ✨ Features

### Core Requirements ✅
- **L'Oréal Branding**: Official logo, brand colors, and styling throughout the interface
- **Chatbot Configuration**: Full OpenAI integration with system prompts and user input handling
- **AI Relevance**: Smart filtering to only answer L'Oréal and beauty-related questions
- **Secure Deployment**: API requests routed through Cloudflare Workers to protect credentials

### Bonus Features 🚀
- **Conversation History**: Maintains context across multiple messages for personalized responses
- **User Question Display**: Shows user questions above AI responses for better UX
- **Chat Conversation UI**: Distinct chat bubbles with professional styling
- **Loading States**: Animated loading indicators during API calls
- **Error Handling**: Graceful error handling with user-friendly messages
- **Responsive Design**: Works perfectly on desktop and mobile devices

## 🎨 Design Features

- **L'Oréal Brand Colors**: Black, white, and gold accent colors
- **Professional Typography**: Montserrat font family for elegance
- **Modern UI**: Clean, card-based design with subtle shadows and animations
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Mobile-First**: Responsive design that works on all screen sizes

## 🚀 Quick Start

### 1. Local Development

1. Clone this repository
2. Open `index.html` in your browser
3. The chatbot will work with a mock response for testing

### 2. Deploy to Cloudflare Workers

#### Step 1: Create Cloudflare Account
- Sign up at [cloudflare.com](https://cloudflare.com)
- Go to Workers & Pages section

#### Step 2: Deploy the Worker
1. Create a new Worker
2. Copy the contents of `cloudflare-worker.js` into the editor
3. Deploy the worker and note your worker URL

#### Step 3: Configure Environment Variables
1. In your Worker settings, add an environment variable:
   - **Name**: `OPENAI_API_KEY`
   - **Value**: The API key is already configured in the Cloudflare Worker

#### Step 4: Update Frontend
1. Open `script.js`
2. The worker URL is already configured for production use
3. No additional configuration needed

#### Step 5: Deploy Frontend
- Upload the HTML, CSS, JS, and image files to any web hosting service
- Or use GitHub Pages, Netlify, or Vercel for free hosting

## 📁 Project Structure

```
├── index.html              # Main HTML file with L'Oréal branding
├── style.css              # Complete styling with brand colors
├── script.js              # Chatbot functionality and OpenAI integration
├── cloudflare-worker.js   # Secure API proxy for Cloudflare Workers
├── img/
│   └── loreal-logo.png    # Official L'Oréal logo
└── README.md              # This file
```

## 🎯 How It Works

### System Prompt
The chatbot uses a carefully crafted system prompt that:
- Defines the AI as a L'Oréal Beauty Assistant
- Restricts responses to beauty and L'Oréal topics only
- Provides knowledge about L'Oréal product lines
- Maintains a warm, professional tone

### Conversation Flow
1. User sends a message
2. Message is added to conversation history
3. Full conversation context is sent to OpenAI via Cloudflare Worker
4. AI response is filtered and displayed
5. Response is added to conversation history for context

### Security
- API key is stored securely in Cloudflare Worker environment variables
- All requests are proxied through the worker
- CORS headers are properly configured
- Input validation and error handling implemented

## 🎨 Brand Guidelines

### Colors
- **Primary Black**: `#000000`
- **Pure White**: `#ffffff`
- **L'Oréal Gold**: `#d4af37`
- **Light Gold**: `#f4e4bc`
- **Gray**: `#666666`

### Typography
- **Font Family**: Montserrat (300, 400, 500, 600, 700 weights)
- **Primary Text**: 16px, 400 weight
- **Headings**: 28px, 600 weight
- **Subtitles**: 16px, 300 weight

## 🔧 Customization

### Adding New Product Lines
Update the system prompt in `script.js` to include new L'Oréal product categories.

### Styling Changes
Modify the CSS variables in `style.css` to adjust colors and spacing.

### API Configuration
Adjust the OpenAI parameters in `cloudflare-worker.js` for different response styles.

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure your Cloudflare Worker URL is correct
2. **API Key Issues**: Verify the environment variable is set correctly
3. **No Response**: Check browser console for error messages
4. **Styling Issues**: Clear browser cache and reload

### Debug Mode
Add `console.log` statements in the JavaScript to debug API calls and responses.

## 📱 Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is for educational purposes. L'Oréal branding and trademarks belong to L'Oréal S.A.

## 🙏 Acknowledgments

- L'Oréal Paris for brand assets
- OpenAI for the GPT-4 API
- Cloudflare for secure hosting infrastructure
- Material Icons for UI elements

---

**Note**: This is a demonstration project. For production use, ensure compliance with L'Oréal's brand guidelines and obtain proper permissions.