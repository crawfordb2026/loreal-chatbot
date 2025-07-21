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
3. Only use the redirect message if the user's question is clearly unrelated to beauty, skincare, makeup, hair care, or L'Oréal products. Otherwise, answer normally and do not repeat the redirect message.
4. Be knowledgeable about L'Oréal's product lines including:
   - Skincare: Revitalift, Age Perfect, Pure Clay, Hydra Genius
   - Makeup: True Match, Infallible, Voluminous, Color Riche
   - Hair Care: Elvive, EverPure, EverSleek, Feria
   - Men's: Men Expert
5. Provide specific product recommendations when appropriate
6. Give helpful beauty tips and advice
7. Be warm, professional, and encouraging
8. Keep responses concise but informative (max 2-3 sentences)
9. Always maintain a positive, empowering tone about beauty and self-care

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
  
  // Check if we should include selected products
  const includeProducts = document.getElementById('includeProductsCheckbox').checked;
  let fullPrompt = userMessage;
  if (includeProducts && selectedProductIds.length > 0) {
    const selectedProducts = allProducts.filter(p => selectedProductIds.includes(p.id));
    const productNames = selectedProducts.map(p => p.name).join(', ');
    fullPrompt += `\n\n(Selected products: ${productNames})`;
  }
  
  // Add user message to chat
  addMessage("user", userMessage);
  
  // Add to conversation history
  conversationHistory.push({
    role: "user",
    content: fullPrompt
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

/************ PRODUCT ROUTINE BUILDER LOGIC ************/

const PRODUCT_JSON_PATH = 'products.json';
let allProducts = [];
let selectedProductIds = [];

// Load selected products from localStorage
function loadSelectedProducts() {
  try {
    const saved = localStorage.getItem('selectedProducts');
    selectedProductIds = saved ? JSON.parse(saved) : [];
  } catch {
    selectedProductIds = [];
  }
}

// Save selected products to localStorage
function saveSelectedProducts() {
  localStorage.setItem('selectedProducts', JSON.stringify(selectedProductIds));
}

// Render product grid
function renderProductGrid() {
  const grid = document.getElementById('productGrid');
  grid.innerHTML = '';
  allProducts.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card' + (selectedProductIds.includes(product.id) ? ' selected' : '');
    card.tabIndex = 0;
    card.setAttribute('data-id', product.id);
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <div class="product-name">${product.name}</div>
      <div class="product-brand">${product.brand}</div>
      <div class="product-category">${product.category}</div>
      <button class="product-desc-toggle" type="button">Description</button>
      <div class="product-description">${product.description}</div>
    `;
    // Selection logic
    card.addEventListener('click', (e) => {
      if (e.target.classList.contains('product-desc-toggle')) return;
      toggleProductSelection(product.id);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleProductSelection(product.id);
      }
    });
    // Description toggle
    card.querySelector('.product-desc-toggle').addEventListener('click', (e) => {
      e.stopPropagation();
      card.classList.toggle('show-desc');
    });
    grid.appendChild(card);
  });
}

// Toggle product selection
function toggleProductSelection(productId) {
  const idx = selectedProductIds.indexOf(productId);
  if (idx === -1) {
    selectedProductIds.push(productId);
  } else {
    selectedProductIds.splice(idx, 1);
  }
  saveSelectedProducts();
  renderProductGrid();
  renderSelectedProducts();
}

// Render selected products list
function renderSelectedProducts() {
  const section = document.getElementById('selectedProductsSection');
  const list = document.getElementById('selectedProductsList');
  list.innerHTML = '';
  if (selectedProductIds.length === 0) {
    section.style.display = 'none';
    return;
  }
  section.style.display = '';
  selectedProductIds.forEach(id => {
    const product = allProducts.find(p => p.id === id);
    if (!product) return;
    const chip = document.createElement('div');
    chip.className = 'selected-product-chip';
    chip.innerHTML = `
      <span>${product.name}</span>
      <button class="remove-chip-btn" title="Remove" type="button">&times;</button>
    `;
    chip.querySelector('.remove-chip-btn').addEventListener('click', () => {
      toggleProductSelection(id);
    });
    list.appendChild(chip);
  });
}

// Clear all selected products
function clearSelectedProducts() {
  selectedProductIds = [];
  saveSelectedProducts();
  renderProductGrid();
  renderSelectedProducts();
}

// Generate Routine button logic
function setupGenerateRoutine() {
  const btn = document.getElementById('generateRoutineBtn');
  btn.addEventListener('click', async () => {
    if (selectedProductIds.length === 0) {
      alert('Please select at least one product to generate a routine.');
      return;
    }
    // Add a message to the chat window
    const selectedProducts = allProducts.filter(p => selectedProductIds.includes(p.id));
    const productNames = selectedProducts.map(p => p.name).join(', ');
    addMessage('user', `Generate a skincare/beauty routine using: ${productNames}`);
    // Add to conversation history
    conversationHistory.push({
      role: 'user',
      content: `Generate a skincare/beauty routine using: ${productNames}`
    });
    // Show loading
    showLoading();
    try {
      const aiResponse = await sendToOpenAI(conversationHistory);
      conversationHistory.push({ role: 'assistant', content: aiResponse });
      hideLoading();
      addMessage('ai', aiResponse, `Generate a skincare/beauty routine using: ${productNames}`);
    } catch (error) {
      hideLoading();
      addMessage('ai', 'Sorry, there was an error generating your routine. Please try again.');
    }
  });
}

// Setup clear button
function setupClearButton() {
  document.getElementById('clearSelectedBtn').addEventListener('click', clearSelectedProducts);
}

// Load products and initialize UI
async function initializeProductUI() {
  loadSelectedProducts();
  const res = await fetch(PRODUCT_JSON_PATH);
  const data = await res.json();
  allProducts = data.products;
  renderProductGrid();
  renderSelectedProducts();
  setupGenerateRoutine();
  setupClearButton();
}

document.addEventListener('DOMContentLoaded', () => {
  initializeProductUI();
});

// Format AI response as HTML list if it looks like a list
function formatAIResponse(content) {
  // Numbered list
  if (/\n\d+\./.test(content)) {
    const items = content.split(/\n(?=\d+\.)/).filter(Boolean);
    if (items.length > 1) {
      return '<ol>' + items.map(item => `<li>${item.replace(/^\d+\.\s*/, '')}</li>`).join('') + '</ol>';
    }
  }
  // Bulleted list
  if (/\n[-*]\s/.test(content)) {
    const items = content.split(/\n(?=[-*]\s)/).filter(Boolean);
    if (items.length > 1) {
      return '<ul>' + items.map(item => `<li>${item.replace(/^[-*]\s*/, '')}</li>`).join('') + '</ul>';
    }
  }
  // Otherwise, return as paragraph
  return `<p>${content.replace(/\n/g, '<br>')}</p>`;
}

// Override addMessage to use formatted AI responses
function addMessage(sender, content, userQuestion = null) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${sender}`;
  let messageHTML = "";
  if (userQuestion && sender === "ai") {
    messageHTML += `<div class="user-question">"${userQuestion}"</div>`;
  }
  if (sender === 'ai') {
    messageHTML += `<div class="message-bubble">${formatAIResponse(content)}</div>`;
  } else {
    messageHTML += `<div class="message-bubble">${content}</div>`;
  }
  messageDiv.innerHTML = messageHTML;
  chatWindow.appendChild(messageDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}
