# Contributing to The Ton

🌐 **Live App:** [https://the-ton.vercel.app/login](https://the-ton.vercel.app/login)  
📖 **Medium Story:** [I Built a Bridgerton-Inspired Social App for Friend Groups](https://medium.com/ai-deep-dives-and-developments-in-computer-science/i-built-a-bridgerton-inspired-social-app-for-friend-groups-and-you-can-use-it-b0803c60ec05?postPublishedType=repub)

Thank you for your interest in contributing to The Ton! 🪶

## Getting Started

- Node.js 18+
- npm 9+
- Access to project-specific API keys (Supabase, OpenAI, etc.)

> [!IMPORTANT]
> **Please contact the repository owner for information about the required API keys and configuration settings.**

### Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/TheTon.git
   cd TheTon
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   Then fill in your keys in `.env.local` (see below).

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

See `.env.example` for the full list. Never commit `.env.local` — it's in `.gitignore`.

## Code Style

- TypeScript everywhere
- Vanilla CSS (no Tailwind)
- Components in `src/components/`
- Pages in `src/app/`

## Pull Requests

1. Fork the repo and create a feature branch
2. Make your changes
3. Ensure `npm run build` passes
4. Submit a PR with a clear description

This project is licensed under the [CC BY 4.0](LICENSE) License.

**Attribution required** — if you use this code or assets, you must credit **Sathya Sravya Vallabhajyosyula**.
