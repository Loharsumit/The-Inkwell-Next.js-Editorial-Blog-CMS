# The Inkwell ✒️

> A premium editorial blog platform and content management system built with Next.js 14, Supabase, and Tailwind CSS.

**Live Demo → [nextjs-blog-cms-gamma.vercel.app](https://nextjs-blog-cms-gamma.vercel.app)**

---

## Overview

The Inkwell is a full-stack editorial platform designed for writers and publishers who value aesthetics as much as functionality. It combines a beautiful reading experience with a robust CMS — enabling authors to write, manage, and publish articles through a protected admin dashboard.

---

## Features

### Design & UI
- **Premium literary aesthetic** — Handpicked typography (`Inter` + `Newsreader`) with a muted, sophisticated color palette
- **Dynamic theme switcher** — Full light/dark mode support via `next-themes`, responding to both system preferences and manual toggles
- **Responsive layout** — Mobile-first design optimized for phones, tablets, and desktops

### Authentication & Security
- **OAuth providers** — One-click login with GitHub and Google via Supabase Auth
- **Admin protection** — The `/admin` route is middleware-protected; only authenticated authors can create or edit posts
- **Custom login UI** — Dark-mode compatible login screen with official provider logos and hover effects

### Content Management
- **Markdown editor** — Write and format posts using Markdown with live preview
- **Role-based access** — Public readers and authenticated authors have separate access levels
- **Pre-seeded content** — Database includes 15 detailed articles on Sanatana Dharma and Hindu philosophy

### Infrastructure
- **Vercel Edge Network** — Globally distributed deployment for fast load times
- **Keep-alive strategy** — A `/api/keep-alive` route pinged every 3 days via Vercel Cron Jobs prevents Supabase free-tier projects from pausing

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| Authentication | Supabase Auth (GitHub & Google OAuth) |
| Deployment | Vercel |
| Language | JavaScript / TypeScript |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- A [Vercel](https://vercel.com) account (for deployment)
- GitHub and/or Google OAuth credentials

### 1. Clone the repository

```bash
https://github.com/
git clone https://github.com/Loharsumit/The-Inkwell-Next.js-Editorial-Blog-CMS.git
cd The-Inkwell-Next.js-Editorial-Blog-CMS
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Configure OAuth providers

In your Supabase dashboard:
1. Go to **Authentication → Providers**
2. Enable **GitHub** and **Google**
3. Add the OAuth credentials from [GitHub Developer Settings](https://github.com/settings/developers) and [Google Cloud Console](https://console.cloud.google.com)
4. Set the redirect URL to: `https://your-project.supabase.co/auth/v1/callback`

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

---

## Project Structure

```
the-inkwell/
├── app/
│   ├── (public)/           # Public-facing blog pages
│   │   ├── page.tsx        # Homepage / article feed
│   │   └── [slug]/         # Individual article pages
│   ├── admin/              # Protected CMS dashboard
│   │   ├── page.tsx        # Post management
│   │   └── new/            # Markdown editor
│   ├── api/
│   │   └── keep-alive/     # Supabase ping route
│   └── login/              # OAuth login page
├── components/             # Reusable UI components
├── lib/
│   └── supabase/           # Supabase client & helpers
├── middleware.ts            # Route protection logic
├── vercel.json             # Cron job configuration
└── tailwind.config.ts
```

---

## Deployment

### Deploy to Vercel

1. Push your code to a GitHub repository
2. Import the repository in the [Vercel Dashboard](https://vercel.com/dashboard)
3. Add the environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
4. Deploy — Vercel auto-detects Next.js and configures the build

### Cron Job (Keep-Alive)

The `vercel.json` file configures a cron job that pings `/api/keep-alive` every 3 days to prevent the Supabase free-tier project from pausing due to inactivity:

```json
{
  "crons": [
    {
      "path": "/api/keep-alive",
      "schedule": "0 0 */3 * *"
    }
  ]
}
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous public key |

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## Acknowledgements

- [Next.js](https://nextjs.org) — React framework
- [Supabase](https://supabase.com) — Backend as a service
- [Tailwind CSS](https://tailwindcss.com) — Utility-first CSS
- [Vercel](https://vercel.com) — Deployment platform
- [next-themes](https://github.com/pacocoursey/next-themes) — Theme management
