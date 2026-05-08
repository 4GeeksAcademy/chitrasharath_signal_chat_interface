# Signal Foundry Chat Interface

Proof-of-concept Next.js chat interface for a consultancy-style workflow with visible model telemetry and usage KPIs.

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Groq Chat Completions API

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create your environment file:

```bash
cp .env.example .env
```

3. Add your key in `.env`:

```env
GROQ_API_KEY=your_key_here
```

4. Start development server:

```bash
npm run dev
```

5. Build for production:

```bash
npm run build
```
