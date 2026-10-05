# Christian Family Social Media Association (CFSMCCA)

Bilingual (English/Amharic) website for the Christian Family Social Media Association, based in Addis Ababa, Ethiopia.

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Framer Motion, React Query, i18next, react-hook-form, zod
- **Backend:** Express, Prisma (PostgreSQL), JWT auth, Multer file uploads

## Project Structure

```
├── frontend/          # React SPA
│   ├── src/
│   │   ├── components/    # Reusable UI components (layout, sections, ui)
│   │   ├── pages/         # Route pages (public + admin)
│   │   ├── context/       # React context (AdminAuth)
│   │   ├── services/      # API client & data services
│   │   ├── i18n/          # English & Amharic translations
│   │   ├── hooks/         # Custom hooks
│   │   └── lib/           # Utilities
│   └── public/            # Static assets, photos
├── backend/           # Express API
│   ├── src/
│   │   ├── routes/        # API routes (auth, news, registrations, messages, team, media, uploads)
│   │   ├── middleware/    # Auth & error middleware
│   │   ├── utils/         # Password hashing & validators
│   │   └── env.ts         # Environment config
│   └── prisma/
│       └── schema.prisma  # Database schema
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Backend Setup

```bash
cd backend
cp .env.example .env        # Edit with your DATABASE_URL, JWT_SECRET, etc.
npm install
npx prisma migrate dev      # Create database tables
npx prisma generate         # Generate Prisma client
npm run dev                 # Start on http://localhost:5050
```

### Frontend Setup

```bash
cd frontend
cp .env.example .env        # Edit VITE_API_BASE_URL if needed
npm install
npm run dev                 # Start on http://localhost:8080
```

### Production Build

```bash
cd frontend
npm run build               # Output to frontend/dist/
npm run preview             # Preview the build locally
```

## Features

### Public Site
- **Home** — Hero, core values, news preview, leadership team marquee, CTA
- **About** — Mission/vision, intro text, video
- **News** — Article list & detail pages
- **Gallery** — Photo/video gallery with lightbox
- **Register** — 5-step registration wizard with validation
- **Contact** — Contact form with admin messaging
- **Bilingual** — Full English & Amharic support with language switcher

### Admin Panel (`/admin`)
- **Dashboard** — Stats overview (members, pending registrations, news, unread messages)
- **Messages** — Manage contact form submissions
- **Registrations** — Review & approve/reject member applications
- **News** — CRUD for news articles with image upload
- **Team** — CRUD for leadership team members
- **Gallery/Media** — CRUD for photos and videos

## Configuration

### Backend Environment Variables (`.env`)

```
DATABASE_URL=postgresql://user:password@localhost:5432/cfsmcca
JWT_SECRET=your-secret-key
PORT=5050
CORS_ORIGIN=http://localhost:8080
```

### Frontend Environment Variables (`.env`)

```
VITE_API_BASE_URL=http://localhost:5050
```

## Customization Guide

| What to change | Where |
|---|---|
| Text content (EN) | `frontend/src/i18n/en.json` |
| Text content (AM) | `frontend/src/i18n/am.json` |
| Colors / theme | `frontend/src/index.css` (CSS variables) + `frontend/tailwind.config.ts` |
| Team member photos | `frontend/public/photos/` |
| Logo | `frontend/public/photos/LOGO.jpeg` |
| Social media links | `frontend/src/components/layout/Footer.tsx` |
| Contact info | `frontend/src/i18n/en.json` & `am.json` → `contact` section |
| Database schema | `backend/prisma/schema.prisma` |

## License

All rights reserved.
