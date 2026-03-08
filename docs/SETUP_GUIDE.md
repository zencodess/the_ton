# 🔑 The Ton — Setup Guide: Getting Your API Keys

This guide walks you through getting all the API keys you need to run The Ton.

---

## 1. Supabase (Database + Auth)

**What it does:** Hosts your database, handles phone authentication, and provides real-time APIs.

**Cost:** Free tier (generous — 50,000 monthly active users, 500 MB database).

### Steps:

1. Go to [supabase.com](https://supabase.com) and sign up (GitHub login works)
2. Click **"New Project"**
3. Choose:
   - **Organization:** Create one or use existing
   - **Project name:** `the-ton`
   - **Database password:** Save this somewhere safe!
   - **Region:** `EU West (London)` recommended
4. Once created, go to **Project Settings → API**
5. Copy:
   - **Project URL** → paste into `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / public key** → paste into `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → paste into `SUPABASE_SERVICE_ROLE_KEY`

> ⚠️ The `service_role` key bypasses Row Level Security. NEVER expose it to the browser.

### Enable Phone Auth with Twilio:

1. In Supabase Dashboard → **Authentication → Providers → Phone**
2. Toggle it **ON**
3. Select **Twilio** as the SMS provider
4. Enter your Twilio credentials (see below)

---

## 2. Twilio (SMS OTP)

**What it does:** Sends the actual SMS text message with the OTP code to users' phones.

**Cost:** Pay-as-you-go (~$0.05 per SMS). You get some free trial credits to start.

### Steps:

1. Go to [twilio.com](https://www.twilio.com) and sign up
2. You'll get **trial credits** (~$15) to test with
3. From the **Console Dashboard**, copy:
   - **Account SID**
   - **Auth Token**
4. Go to **Verify → Services → Create a new Service**
   - Name it `the-ton-otp`
   - Copy the **Service SID**
5. Enter all three values in Supabase's Phone Auth settings (step above)

### For India:
- Twilio works in India but SMS delivery can be slower
- For production, you'll need to register DLT templates (Twilio guides you through this)

---

## 3. OpenAI (AI Letter Generation)

**What it does:** Powers Lady Whistledown — generates the daily society letter from whispers.

**Cost:** Pay-as-you-go. GPT-4o costs ~$0.01-0.03 per letter (very cheap).

### Steps:

1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up / log in
3. Go to **API Keys** (left sidebar or [direct link](https://platform.openai.com/api-keys))
4. Click **"Create new secret key"**
5. Name it `the-ton`
6. Copy the key → paste into `OPENAI_API_KEY` in your `.env.local`

> ⚠️ You'll need to add billing info and load at least $5 of credits.

---

## 4. Where to Put Your Keys

All keys go in a single file: **`.env.local`** in the project root.

```bash
# Create it by copying the template:
cp .env.example .env.local

# Then edit it:
open .env.local
```

This file is:
- ✅ Read by Next.js automatically
- ✅ Listed in `.gitignore` (never committed to git)
- ✅ Safe for open source — other devs create their own `.env.local`

### For Vercel deployment:
Go to **Vercel Dashboard → Project → Settings → Environment Variables** and add each key there.

---

## Quick Reference

| Variable | Where to get it | Public? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API | Yes (safe) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API | Yes (safe, RLS protects data) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API | ❌ Server only |
| `OPENAI_API_KEY` | OpenAI → API Keys | ❌ Server only |
