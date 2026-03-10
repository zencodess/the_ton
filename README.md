# 🪶 The Ton

> *"Dearest Gentle Reader, you are cordially invited to the most exclusive society in all the land..."*

**The Ton** transforms your daily group chat into an exclusive, highly anticipated ritual of connection and playful mystery — dripping in Regency-era elegance.

🌐 **Live App:** [https://theton.vercel.app](https://theton.vercel.app) *(replace with your deployed URL)*

---

## ✨ How It Works

1. **Create a Drawing Room** — invite up to 10 friends via a secret link
2. **Spill the Tea** — submit anonymous Whispers about your day or your friends (sweet or slightly spicy)
3. **Lady Whistledown Delivers** — every night, an AI-crafted society letter weaves your whispers into cryptic, elegant prose
4. **Read Your Letters** — each member receives a personal delivery in their Foyer

## 🎨 The Aesthetic

Think heavy parchment, wax seals, quill-penned elegance, and a color palette of **wisteria purple**, **duck egg blue**, and **gold**. Every screen feels like a page torn from a Regency novel.

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router) + TypeScript |
| Styling | Vanilla CSS + Playfair Display & Cormorant Garamond |
| Backend | Supabase (PostgreSQL + Auth + RLS) |
| AI | OpenAI GPT-4o (Lady Whistledown letter generation) |
| Hosting | Vercel |

## 🚀 Quick Start (for developers)

```bash
# Clone
git clone https://github.com/zencodess/TheTon.git
cd TheTon

# Install
npm install

# Configure
cp .env.example .env.local
# Fill in your keys — see "API Keys Needed" below

# Run
npm run dev
```

## 🔑 API Keys Needed

Create a `.env.local` file with:

```
NEXT_PUBLIC_SUPABASE_URL=...        # Supabase → Settings → API
NEXT_PUBLIC_SUPABASE_ANON_KEY=...   # Supabase → Settings → API
OPENAI_API_KEY=...                  # platform.openai.com → API Keys
ADMIN_EMAIL=your@email.com          # Email that can trigger letter generation
```

## 📁 Project Structure

```
TheTon/
├── src/
│   ├── app/                # Next.js pages (App Router)
│   │   ├── page.tsx        # Foyer — letter feed
│   │   ├── groups/         # Societies list + detail
│   │   ├── whispers/       # Submit & view your whispers
│   │   ├── invite/[code]/  # Join via invite link
│   │   ├── letters/[id]/   # Read a letter
│   │   └── profile/        # Calling Card (profile)
│   └── components/
│       ├── Navbar.tsx
│       └── CreateGroupModal.tsx
├── public/aesthetics/      # Background images & avatars
├── .env.example
└── LICENSE
```

## 👩‍💻 For Users

You don't need to run any code! Just:

1. **Visit the live app** at the link above
2. **Register** with your email
3. **Complete your Calling Card** — set your name, title (Lord/Lady/etc), and gender
4. **Create or join a Society** — share the invite link with your circle
5. **Pen a Whisper** — your secrets are completely anonymous to other members
6. **Check your Letters** — Lady Whistledown's Society Papers arrive nightly

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for full guidelines.

**Quick contribution steps:**
1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Make your changes and test locally (`npm run dev`)
4. Commit with a clear message: `git commit -m "feat: describe your change"`
5. Open a Pull Request against `main`

**Good first issues:**
- Adding new Society themes/dynamics
- Improving Lady Whistledown's prompt creativity
- Adding new Regency-era UI elements
- Mobile responsiveness improvements

> **Attribution required** — if you use this code or assets, you must credit  
> **Sathya Sravya Vallabhajyosyula** per the [LICENSE](LICENSE).

## 📄 License

[CC BY 4.0](LICENSE) © 2026 Sathya Sravya Vallabhajyosyula — Attribution required for any use.

---

*Yours Truly, Lady Whistledown* 🪶
