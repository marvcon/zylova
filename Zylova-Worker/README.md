# Zylova — Secure API Proxy (Cloudflare Worker)
Hides your Anthropic API key safely on the server.
Your key is NEVER visible in browser source code.


## FILES IN THIS FOLDER

  worker.js          The Cloudflare Worker (your secure proxy)
  wrangler.toml      Worker configuration file
  agent-secure.js    Drop-in replacement for js/agent.js on your website
  README.md          This setup guide


## HOW IT WORKS

  Browser → Cloudflare Worker (key hidden here) → Anthropic API

  Your website sends messages to the Worker.
  The Worker adds your secret API key and forwards to Anthropic.
  The reply comes back through the Worker to the browser.
  Your API key never appears anywhere in the browser.


## SETUP — STEP BY STEP (15 minutes total)


STEP 1 — Create the Worker in Cloudflare (5 min)

  1. Go to dash.cloudflare.com
  2. Click "Workers & Pages" in the left sidebar
  3. Click "Create" → "Create Worker"
  4. Name it exactly: zylova-api-proxy
  5. Click "Deploy" (ignore the default code for now)
  6. Click "Edit Code"
  7. Delete ALL the default code in the editor
  8. Copy and paste the entire contents of worker.js into the editor
  9. Click "Deploy" again
  10. Note your Worker URL — it will look like:
      https://zylova-api-proxy.YOUR-SUBDOMAIN.workers.dev


STEP 2 — Add Your API Key as a Secret (3 min)

  IMPORTANT: Never paste your API key into the worker code itself.
  Use Cloudflare's secret system instead — it encrypts the key.

  Method A (Dashboard — easiest):
  1. In your Worker page, click "Settings" tab
  2. Click "Variables and Secrets"
  3. Click "Add variable"
  4. Set Type to "Secret"
  5. Name: ANTHROPIC_API_KEY
  6. Value: your key from console.anthropic.com (starts with sk-ant-)
  7. Click "Deploy"

  Method B (Wrangler CLI — for developers):
  1. Install Node.js from nodejs.org
  2. Run: npm install -g wrangler
  3. Run: wrangler login
  4. Run: wrangler secret put ANTHROPIC_API_KEY
  5. Paste your key when prompted
  6. Run: wrangler deploy


STEP 3 — Update Your Website (5 min)

  1. Open agent-secure.js from this folder
  2. Find this line near the top:
       const WORKER_URL = "https://zylova-api-proxy.YOUR-SUBDOMAIN.workers.dev";
  3. Replace YOUR-SUBDOMAIN with your actual Cloudflare subdomain
     (You can find this in your Worker URL from Step 1)
  4. Save the file
  5. Rename agent-secure.js to agent.js
  6. Copy it into your Zylova website folder at js/agent.js
     (Replace the old agent.js)
  7. Redeploy your site to Netlify
     - Log into netlify.com
     - Go to your Zylova site → Deploys tab
     - Drag and drop your updated Zylova folder
     - Wait 30 seconds for deploy


STEP 4 — Test It

  1. Go to zylova.ai
  2. Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
  3. Type something in the demo agent chat
  4. It should respond within a few seconds
  5. Right-click → View Page Source → search for "sk-ant"
     You should NOT find your API key anywhere — that means it's secure!


## SECURITY FEATURES BUILT INTO THE WORKER

  Origin blocking      Only accepts requests from zylova.ai
  Method restriction   Only accepts POST requests
  Rate limiting        Max 40 messages per conversation
  Input validation     Checks for valid message format
  Error handling       Never exposes internal errors to the browser


## YOUR WORKER URL

After deploying, your Worker URL will be:
  https://zylova-api-proxy.YOUR-SUBDOMAIN.workers.dev

You can also add a custom route like:
  https://api.zylova.ai/chat
  (Set this up in Cloudflare Workers → Triggers → Custom Domains)


## COST

Cloudflare Workers free plan includes:
  100,000 requests per day
  10ms CPU time per request

For a demo agent on a marketing site this is more than enough.
If you scale to thousands of daily users, the paid plan is $5/month
for 10 million requests — essentially free at any realistic scale.


## TROUBLESHOOTING

Agent says "trouble connecting":
  - Check your WORKER_URL in agent.js matches your actual Worker URL
  - Make sure ANTHROPIC_API_KEY secret is set in Cloudflare
  - Check the Worker logs in dash.cloudflare.com → Workers → your worker → Logs

CORS error in browser console:
  - Make sure your domain (zylova.ai) is in the ALLOWED_ORIGINS list in worker.js
  - Redeploy the worker after any changes

401 Unauthorized from Anthropic:
  - Your API key is wrong or expired
  - Go to console.anthropic.com and create a new key
  - Update the secret in Cloudflare (Step 2)


Zylova Secure Proxy v1.0 — 2026
