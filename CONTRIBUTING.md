# Contributing to The Ton

Thank you for your interest in contributing to The Ton! 🪶

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- A [Supabase](https://supabase.com) account (for Database & Auth)
- An [OpenAI](https://platform.openai.com) API key (for letter generation)

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
