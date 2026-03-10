# 🔑 The Ton — Setup Guide

🌐 **Live App:** [https://the-ton.vercel.app/login](https://the-ton.vercel.app/login)  
📖 **Medium Story:** [I Built a Bridgerton-Inspired Social App for Friend Groups](https://medium.com/ai-deep-dives-and-developments-in-computer-science/i-built-a-bridgerton-inspired-social-app-for-friend-groups-and-you-can-use-it-b0803c60ec05?postPublishedType=repub)

## 🏗️ Getting Started

To run a local instance of **The Ton**, you will need to configure environment variables for the following services:

1. **Supabase** (Database & Authentication)
2. **Twilio** (SMS OTP)
3. **OpenAI** (Lady Whistledown AI Generation)

### 🔑 API Keys

For security reasons, the detailed instructions for obtaining and configuring these API keys are not included in this repository.

> [!IMPORTANT]
> **Please contact the repository owner for information about the required API keys and configuration settings.**

## ⚙️ Environment Configuration

Once you have the necessary credentials, create a `.env.local` file in the project root based on `.env.example`:

```bash
cp .env.example .env.local
```

Edit the file to include your specific keys. This file is ignored by Git to keep your credentials secure.

---

> **Live App:** [the-ton.vercel.app/login](https://the-ton.vercel.app/login)  
> **Medium Post:** [Read the full story here](https://medium.com/ai-deep-dives-and-developments-in-computer-science/i-built-a-bridgerton-inspired-social-app-for-friend-groups-and-you-can-use-it-b0803c60ec05?postPublishedType=repub)
