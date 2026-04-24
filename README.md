# Zylova — Complete Website Package v2
Your 24/7 AI Employee for Small Business


## WHAT'S INCLUDED

Zylova/
  index.html              Homepage with live AI demo agent
  contact.html            Contact form (Formspree-ready)
  get-started.html        Pricing + Stripe checkout page
  privacy.html            Privacy Policy
  terms.html              Terms of Service
  README.md               This file

  css/
    style.css             All styles for every page

  js/
    agent.js              Live AI agent (Claude API)
    main.js               Nav, animations, Formspree form

  industries/
    salons.html           Salons & Spas landing page
    contractors.html      Contractors landing page
    clinics.html          Clinics & Med Spas landing page
    restaurants.html      Restaurants landing page
    gyms.html             Gyms & Fitness landing page
    realestate.html       Real Estate landing page

  dashboard/
    index.html            Client dashboard (overview)
    dashboard.css         Dashboard styles
    dashboard.js          Dashboard animations

  agents/
    README.md             Agent template guide
    salon-agent.md        Salon & Spa system prompt
    contractor-agent.md   Contractor system prompt
    clinic-agent.md       Clinic & Med Spa system prompt
    restaurant-agent.md   Restaurant system prompt
    gym-agent.md          Gym & Fitness system prompt
    realestate-agent.md   Real Estate system prompt


## SETUP CHECKLIST

Complete these 4 steps to go fully live:


STEP 1 — Anthropic API Key (for the live demo agent)
  1. Go to https://console.anthropic.com
  2. Create an API key
  3. Open js/agent.js
  4. Replace YOUR_ANTHROPIC_API_KEY with your key
  NOTE: For production, use a backend proxy so your key
        is never exposed in the browser. See deployment tips below.


STEP 2 — Formspree (for the contact form)
  1. Go to https://formspree.io and create a free account
  2. Create a new form — you get an ID like "xpwzrjkq"
  3. Open js/main.js
  4. Replace YOUR_FORMSPREE_ID with your actual form ID
  5. Formspree sends you an email for every submission


STEP 3 — Stripe (for taking payments)
  1. Go to https://dashboard.stripe.com
  2. Create 3 products: Starter ($97), Growth ($297), Pro ($597)
  3. For each, create a Payment Link under Products > Payment Links
  4. Open get-started.html
  5. Replace the 3 YOUR_*_LINK values with your actual Stripe URLs
  NOTE: Stripe Payment Links handle checkout, subscriptions,
        and billing — no code required.


STEP 4 — Deploy (go live)
  Netlify (recommended — free plan works):
    1. Go to https://netlify.com
    2. Drag and drop the Zylova folder onto the dashboard
    3. Your site is live in 60 seconds
    4. Add a custom domain in Site Settings > Domain Management

  Vercel:
    1. Push the folder to a GitHub repo
    2. Connect the repo at https://vercel.com
    3. Auto-deploys on every push


## CUSTOMIZING YOUR AGENT TEMPLATES

Each industry has a ready-to-use agent template in the /agents folder.
To use one:
  1. Open the relevant .md file (e.g. agents/salon-agent.md)
  2. Copy the SYSTEM PROMPT
  3. Open js/agent.js
  4. Replace the SYSTEM_PROMPT content with your customized version
  5. Fill in all [PLACEHOLDER] values with your real business info


## BRAND COLORS

  Navy background   #0a0f1e
  Navy cards        #111827
  Teal accent       #00d4aa
  Teal hover        #00b891
  White             #ffffff
  Muted text        #8892a4


## FONTS (Google Fonts — loaded automatically)

  Headings   Syne
  Body       DM Sans


## SUPPORT

For questions or customization help:
  Email:   hello@zylova.ai
  Website: https://zylova.ai


Built for Zylova. 2026. All rights reserved.
