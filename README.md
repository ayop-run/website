# AYOP — At Your Own Pace

Community website for [AYOP](https://ayop.run), a Berlin running community.

## Stack

- **Next.js 16** (App Router) + **Pages Router** for `/api/*` and dev-only `/edit`
- **React 19**, **TypeScript**, **Tailwind CSS 4**
- **shadcn/ui** (Radix) + **Framer Motion**
- **Supabase** — photo archive
- **next-themes** — dark mode (default dark)

## Getting started

```bash
git clone git@github.com:sujinleeme/ayop.git
cd ayop
yarn install
cp .env.example .env.local   # fill in Supabase + admin password
yarn dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (server only) |
| `ADMIN_PASSWORD` | Photo admin unlock + edit APIs |

## Routes

| Route | Description |
| --- | --- |
| `/` | Home |
| `/about` | Community + team (from `data/en.json`) |
| `/activities` | Event schedule |
| `/photos` | Supabase photo gallery |
| `/photos/new` | Add album (admin) |
| `/photos/[id]/edit` | Edit album (admin) |
| `/projects` | Projects showcase |
| `/manifesto` | Manifesto |
| `/admin` | Admin hub |
| `/edit` | Dev-only site content editor (Pages Router) |

## Content

- Marketing copy & team: [`data/en.json`](data/en.json)
- Design nav / mock projects: [`lib/data.ts`](lib/data.ts)
- Photos API: [`pages/api/photos/`](pages/api/photos/)

## Scripts

| Command | Description |
| --- | --- |
| `yarn dev` | Development server |
| `yarn build` | Production build |
| `yarn start` | Run production build |
| `yarn lint` | ESLint |

## Deployment

Deploy as a standard Next.js app on Vercel. Set **Root Directory** to the repo root and add the same env vars as `.env.local`.

If Turbopack reports a wrong workspace root, `turbopack.root` is set in [`next.config.mjs`](next.config.mjs).

## License

Private and proprietary to AYOP.
