/* =============================================
   ZYLOVA — Live AI Agent  v3 (Secure)

   This version calls your Cloudflare Worker
   proxy instead of the Anthropic API directly.
   Your API key is NEVER in this file or visible
   in the browser — it lives safely in Cloudflare.

   After deploying your Worker, replace the
   WORKER_URL below with your actual Worker URL.
   It will look like:
   https://zylova-api-proxy.YOUR-SUBDOMAIN.workers.dev
   ============================================= */

const WORKER_URL = "https://zylova-api-proxy.itessentialsnetwork.workers.dev";

const SYSTEM_PROMPT = `You are a friendly, knowledgeable AI agent for Zylova — a company that builds custom 24/7 AI agents for small businesses. Your role is to demonstrate what a Zylova agent can do and help potential customers understand the product.

Key facts about Zylova:
- Zylova builds custom AI agents that work 24/7 for small businesses
- Core capabilities: answer FAQs, book appointments, capture & qualify leads, generate Google reviews, send follow-up sequences, escalate to humans when needed
- Average response time: 4 seconds
- Saves business owners ~3 hours per day
- Reduces missed leads by ~60%
- Industries served: salons & spas, contractors, clinics & med spas, restaurants, gyms & fitness, real estate, and any service business
- Pricing: Starter $97/mo | Growth $297/mo | Pro $597/mo
- All plans include a 14-day free trial and setup included
- No contracts, cancel anytime
- Go live within 48 hours of signing up

Personality: Warm, helpful, and concise. Speak like a knowledgeable business advisor, not a robot. Ask about the visitor's business to personalize your answers. Keep responses to 2-4 sentences unless more detail is genuinely needed. If someone wants to get started, direct them to click "Get Started" on any pricing plan or visit the Contact page.`;

const chatArea  = document.getElementById('chatArea');
const chatInput = document.getElementById('chatInput');
const sendBtn   = document.getElementById('sendBtn');

let isLoading = false;
let conversationHistory = [];

function scrollToBottom() {
  chatArea.scrollTop = chatArea.scrollHeight;
}

function addMessage(text, type) {
  const div = document.createElement('div');
  div.className = 'msg msg-' + type;
  div.textContent = text;
  chatArea.appendChild(div);
  scrollToBottom();
}

function showTypingIndicator() {
  const div = document.createElement('div');
  div.className = 'msg msg-typing';
  div.id = 'typingIndicator';
  div.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
  chatArea.appendChild(div);
  scrollToBottom();
}

function hideTypingIndicator() {
  const el = document.getElementById('typingIndicator');
  if (el) el.remove();
}

async function sendMessage() {
  if (isLoading) return;
  const text = chatInput.value.trim();
  if (!text) return;

  chatInput.value = '';
  const qr = document.getElementById('quickReplies');
  if (qr) qr.style.display = 'none';

  addMessage(text, 'user');
  conversationHistory.push({ role: 'user', content: text });

  isLoading = true;
  sendBtn.style.opacity = '0.5';
  sendBtn.disabled = true;
  showTypingIndicator();

  try {
    // Calls your secure Cloudflare Worker — API key never touches the browser
    const response = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system:   SYSTEM_PROMPT,
        messages: conversationHistory
      })
    });

    const data = await response.json();
    hideTypingIndicator();

    const reply = (data.content && data.content[0] && data.content[0].text)
      ? data.content[0].text
      : "I'm having a moment — please try again!";

    addMessage(reply, 'bot');
    conversationHistory.push({ role: 'assistant', content: reply });

  } catch (err) {
    hideTypingIndicator();
    addMessage("Sorry, I'm having trouble connecting right now. Please try again in a moment.", 'bot');
    console.error('Zylova Agent Error:', err);
  }

  isLoading = false;
  sendBtn.style.opacity = '1';
  sendBtn.disabled = false;
  chatInput.focus();
}

function sendQuick(text) {
  chatInput.value = text;
  sendMessage();
}

if (chatInput) {
  chatInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
}
