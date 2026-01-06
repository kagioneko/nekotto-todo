import { GoogleGenAI } from '@google/genai';

// Initialize the Google Gen AI Client
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey || apiKey === 'YOUR_API_KEY') {
  console.error('API Key is missing or invalid. Please check your .env file.');
  // Ideally, show a UI error here.
  addSystemMessage('CRITICAL ERROR: API KEY MISSING. SYSTEM SHUTDOWN INITIATED.');
}

const ai = new GoogleGenAI({ apiKey });

// Initialize Chat Session State
let chatSession;

// DOM Elements
const messagesContainer = document.getElementById('messages-container');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const loadingIndicator = document.getElementById('loading-indicator');
const chatViewport = document.getElementById('chat-viewport');

// State
let isComposing = false; // For IME fix
let isProcessing = false;

// Initialize Chat
async function initChat() {
  try {
    chatSession = ai.chats.create({
      model: 'gemini-3-flash-preview',
    });
    console.log('System Initialized: Gemini 3 Flash Preview Online');
  } catch (error) {
    console.error('Initialization Error:', error);
    addSystemMessage('SYSTEM BOOT FAILURE. CHECK CONSOLE FOR LOGS.');
  }
}

// Helper: Get formatted JST time
function getJSTTime() {
  return new Intl.DateTimeFormat('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Tokyo',
    hour12: false
  }).format(new Date());
}

// Helper: Add Message to UI
function addMessage(text, type) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', type);

  const contentDiv = document.createElement('div');
  contentDiv.classList.add('message-content');
  contentDiv.innerText = text; // innerText handles basic text safely

  // Create timestamp element
  const timeDiv = document.createElement('div');
  timeDiv.classList.add('timestamp');
  timeDiv.innerText = getJSTTime();

  messageDiv.appendChild(contentDiv);
  messageDiv.appendChild(timeDiv);

  messagesContainer.appendChild(messageDiv);
  scrollToBottom();
}

// Helper: Add System Message
function addSystemMessage(text) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', 'system-message');

  const contentDiv = document.createElement('div');
  contentDiv.classList.add('message-content');
  contentDiv.innerText = text;

  // System messages also get a timestamp
  const timeDiv = document.createElement('div');
  timeDiv.classList.add('timestamp');
  timeDiv.style.textAlign = 'center'; // Force center for system
  timeDiv.innerText = getJSTTime();

  messageDiv.appendChild(contentDiv);
  messageDiv.appendChild(timeDiv);

  messagesContainer.appendChild(messageDiv);
  scrollToBottom();
}

// Helper: Scroll to bottom
function scrollToBottom() {
  chatViewport.scrollTop = chatViewport.scrollHeight;
}

// Logic: Send Message
async function handleSendMessage() {
  const text = messageInput.value.trim();
  if (!text || isProcessing) return;

  // 1. Add User Message
  addMessage(text, 'user');
  messageInput.value = '';
  // Reset height
  messageInput.style.height = 'auto';

  // 2. Set Loading State
  isProcessing = true;
  sendButton.disabled = true;
  loadingIndicator.classList.remove('hidden');
  scrollToBottom();

  try {
    // 3. Send to Gemini
    const result = await chatSession.sendMessage({
      message: text,
    });

    const responseText = result.text;

    // 4. Add Model Response
    addMessage(responseText, 'model');

  } catch (error) {
    console.error('Generation Error:', error);
    addSystemMessage('COMMUNICATION ERROR. RETRY COMMAND.');
  } finally {
    // 5. Reset State
    isProcessing = false;
    sendButton.disabled = false;
    loadingIndicator.classList.add('hidden');
    scrollToBottom();
    messageInput.focus();
  }
}

// Event Listeners

// IME Composition Start
messageInput.addEventListener('compositionstart', () => {
  isComposing = true;
});

// IME Composition End
messageInput.addEventListener('compositionend', () => {
  isComposing = false;
});

// Keydown (Enter to send, Shift+Enter for newline)
messageInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    if (isComposing) {
      // Do nothing if IME is active (let it confirm text)
      return;
    }
    if (!e.shiftKey) {
      e.preventDefault(); // Prevent newline
      handleSendMessage();
    }
  }
});

// Auto-resize Textarea
messageInput.addEventListener('input', () => {
  messageInput.style.height = 'auto';
  messageInput.style.height = messageInput.scrollHeight + 'px';
});

// Click Send Button
sendButton.addEventListener('click', handleSendMessage);

// Initialize on load
initChat();
