# No Time Coffee ☕

Coffee brand website — Amsterdam, Arnhem & Den Haag.

## Stack

- **Framework:** Next.js 16 (App Router)
- **CMS:** Sanity v3 (embedded Studio at `/studio`)
- **Styling:** Tailwind CSS v4
- **Language:** TypeScript (strict)
- **Hosting:** Vercel

## Getting Started

```bash
pnpm install

# Copy env and fill in Sanity credentials
cp .env.example .env.local

pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Sanity Studio: [http://localhost:3000/studio](http://localhost:3000/studio).

## Project Structure

```
app/
  (site)/          # Public website routes
  studio/          # Embedded Sanity Studio
components/
  ui/              # Design system primitives
  layout/          # Header, Footer, Navigation
  sections/        # Page section components
  sanity/          # Sanity-specific components
sanity/
  schemas/         # Content type schemas
  lib/             # Client, queries, fetch, image utils
lib/               # Shared utilities
```

## Team

Built by the notimecoffee team, Feb 2026.
