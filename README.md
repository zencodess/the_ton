# 🪶 The Ton

> *"Dearest Gentle Reader, you are cordially invited to the most exclusive society in all the land..."*

**The Ton** transforms your daily group chat into an exclusive, highly anticipated ritual of connection and playful mystery — dripping in Regency-era elegance.

## ✨ How It Works

1. **Create a Drawing Room** — invite up to 10 friends via a secret link
2. **Spill the Tea** — submit anonymous Whispers about your day or your friends (sweet or slightly spicy)
3. **Lady Whistledown Delivers** — every morning at 7 AM, an AI-crafted society letter weaves your whispers into cryptic, uplifting prose

## 🎨 The Aesthetic

Think heavy parchment, wax seals, quill-penned elegance, and a color palette of **wisteria purple**, **duck egg blue**, and **gold**.

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router) + TypeScript |
| Styling | Vanilla CSS + Playfair Display & Cormorant Garamond |
| Backend | Supabase (PostgreSQL + Auth + Edge Functions) |
| SMS OTP | Twilio Verify (via Supabase Phone Auth) |
| AI | OpenAI GPT-4o (letter generation + content moderation) |
| PDF Export | @react-pdf/renderer |
| Hosting | Vercel |

## 🚀 Quick Start

```bash
# Clone
git clone https://github.com/YOUR_USERNAME/TheTon.git
cd TheTon

# Install
npm install

# Configure
cp .env.example .env.local
# Edit .env.local with your API keys (see docs/SETUP_GUIDE.md)

# Run
npm run dev
```

## 🔑 API Keys Needed

| Service | What For | Guide |
|---|---|---|
| [Supabase](https://supabase.com) | Database & Auth | [Setup Guide](docs/SETUP_GUIDE.md#1-supabase-database--auth) |
| [Twilio](https://twilio.com) | SMS OTP | [Setup Guide](docs/SETUP_GUIDE.md#2-twilio-sms-otp) |
| [OpenAI](https://platform.openai.com) | AI Letters | [Setup Guide](docs/SETUP_GUIDE.md#3-openai-ai-letter-generation) |

## 📁 Project Structure

```
TheTon/
├── src/
│   ├── app/            # Next.js pages (App Router)
│   ├── components/     # Reusable UI components
│   ├── lib/            # Supabase client, utilities
│   └── styles/         # CSS modules
├── supabase/
│   └── schema.sql      # Database schema
├── docs/
│   └── SETUP_GUIDE.md  # API key setup walkthrough
├── .env.example        # Environment variable template
└── reqs.md             # Product specification
```

## 📄 License

MIT — see [LICENSE](LICENSE)

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

*Yours Truly, Lady Whistledown* 🪶
