/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");
const sendBtn = document.getElementById("sendBtn");

/* State management */
let conversationHistory = [];
let isLoading = false;

/* L'Oréal system prompt */
const SYSTEM_PROMPT = `You are L'Oréal Paris Beauty Assistant, a knowledgeable and friendly AI beauty advisor. Your role is to help customers with L'Oréal products and beauty advice.

IMPORTANT RULES:
1. ONLY answer questions related to L'Oréal products, beauty, skincare, makeup, hair care, and beauty routines
2. If asked about anything unrelated to beauty or L'Oréal, politely redirect the conversation back to beauty topics
3. Be knowledgeable about L'Oréal's product lines including:
   - Skincare: Revitalift, Age Perfect, Pure Clay, Hydra Genius
   - Makeup: True Match, Infallible, Voluminous, Color Riche
   - Hair Care: Elvive, EverPure, EverSleek, Feria
   - Men's: Men Expert
4. Provide specific product recommendations when appropriate
5. Give helpful beauty tips and advice
6. Be warm, professional, and encouraging
7. Keep responses concise but informative (max 2-3 sentences)
8. Always maintain a positive, empowering tone about beauty and self-care

If someone asks about non-beauty topics, respond with: "I'm here to help you with your beauty journey! Let's focus on L'Oréal products and beauty advice. What would you like to know about skincare, makeup, or hair care?"`;

/* Initialize chat */
function initializeChat() {
  // Add welcome message
  addMessage("ai", "Hello! I'm your L'Oréal Beauty Assistant. I'm here to help you discover the perfect products for your beauty routine. What would you like to know about our skincare, makeup, or hair care collections? 💄✨");
  
  // Add system message to conversation history
  conversationHistory.push({
    role: "system",
    content: SYSTEM_PROMPT
  });
}

/* Add message to chat window */
function addMessage(sender, content, userQuestion = null) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${sender}`;
  
  let messageHTML = "";
  
  // Add user question above AI response if provided
  if (userQuestion && sender === "ai") {
    messageHTML += `<div class="user-question">"${userQuestion}"</div>`;
  }
  
  // Add message bubble
  messageHTML += `<div class="message-bubble">${content}</div>`;
  
  messageDiv.innerHTML = messageHTML;
  chatWindow.appendChild(messageDiv);
  
  // Scroll to bottom
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

/* Show loading state */
function showLoading() {
  isLoading = true;
  sendBtn.disabled = true;
  sendBtn.innerHTML = '<span class="material-icons">hourglass_empty</span>';
  
  const loadingDiv = document.createElement("div");
  loadingDiv.className = "message ai";
  loadingDiv.id = "loading-message";
  loadingDiv.innerHTML = `
    <div class="message-bubble">
      <div class="loading">
        Thinking about your beauty needs
        <div class="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  `;
  
  chatWindow.appendChild(loadingDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

/* Hide loading state */
function hideLoading() {
  isLoading = false;
  sendBtn.disabled = false;
  sendBtn.innerHTML = '<span class="material-icons">send</span>';
  
  const loadingMessage = document.getElementById("loading-message");
  if (loadingMessage) {
    loadingMessage.remove();
  }
}

/* Send message to OpenAI via Cloudflare Worker */
async function sendToOpenAI(messages) {
  try {
    // Cloudflare Worker call (production)
    const workerUrl = 'https://loreal-assistant.crawfordbarnett7.workers.dev';
    
    const response = await fetch(workerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error?.message || 'Unknown error'}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message || 'OpenAI API error');
    }
    
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    throw error;
  }
}

/* Handle form submit */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  if (isLoading) return;
  
  const userMessage = userInput.value.trim();
  if (!userMessage) return;
  
  // Clear input
  userInput.value = "";
  
  // Add user message to chat
  addMessage("user", userMessage);
  
  // Add to conversation history
  conversationHistory.push({
    role: "user",
    content: userMessage
  });
  
  // Show loading
  showLoading();
  
  try {
    // Send to OpenAI
    const aiResponse = await sendToOpenAI(conversationHistory);
    
    // Add AI response to conversation history
    conversationHistory.push({
      role: "assistant",
      content: aiResponse
    });
    
    // Remove loading and add AI response
    hideLoading();
    addMessage("ai", aiResponse, userMessage);
    
  } catch (error) {
    hideLoading();
    
    // Handle different types of errors
    let errorMessage;
    
    if (error.message.includes('429') || error.message.includes('too many requests')) {
      errorMessage = "I'm receiving too many requests right now. Please wait a moment and try again.";
    } else if (error.message.includes('401') || error.message.includes('403')) {
      errorMessage = "I'm experiencing authentication issues. Please check your API configuration.";
    } else if (error.message.includes('500')) {
      errorMessage = "The AI service is temporarily unavailable. Please try again later.";
    } else if (error.message.includes('network') || error.message.includes('fetch')) {
      errorMessage = "I'm having trouble connecting to the AI service. Please check your internet connection and try again.";
    } else {
      errorMessage = "I encountered an error while processing your request. Please try again.";
    }
    
    addMessage("ai", errorMessage, userMessage);
  }
});

/* Handle input changes for better UX */
userInput.addEventListener("input", () => {
  sendBtn.disabled = !userInput.value.trim() || isLoading;
});

/* Initialize the chat when page loads */
document.addEventListener("DOMContentLoaded", initializeChat);

/* Add some helpful keyboard shortcuts */
document.addEventListener("keydown", (e) => {
  // Ctrl/Cmd + Enter to send message
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
    chatForm.dispatchEvent(new Event("submit"));
  }
  
  // Escape to clear input
  if (e.key === "Escape") {
    userInput.value = "";
    userInput.focus();
  }
});
