/* =============================================
   ZYLOVA — Live AI Agent  v4
   Direct API method for immediate testing.
   Replace YOUR_API_KEY_HERE with your key.
   ============================================= */

const ANTHROPIC_API_KEY = "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";

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
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-request-proxy': 'true'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
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
