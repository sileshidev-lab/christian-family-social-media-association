# CFSMCCA Backend

Node + Express + Prisma (PostgreSQL) API for the CFSMCCA website.

## Setup
1. Copy `.env.example` to `.env` and update values.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Generate Prisma client and run migrations:
   ```bash
   npm run generate
   npm run migrate
   ```
4. Start the dev server:
   ```bash
   npm run dev
   ```

## Auth
- `POST /api/admin/setup` (one-time)  
- `POST /api/admin/login`  
- `GET /api/admin/me` (Bearer token)

## Public Endpoints
- `GET /api/news`
- `GET /api/news/:id`
- `POST /api/registrations`
- `POST /api/messages`
- `GET /api/team`
- `GET /api/media?type=photo|video`

## Admin Endpoints (Bearer token)
- `GET /api/news/admin/all?status=published|draft`
- `POST /api/news/admin`
- `PUT /api/news/admin/:id`
- `DELETE /api/news/admin/:id`

- `GET /api/registrations/admin`
- `GET /api/registrations/admin/:id`
- `PATCH /api/registrations/admin/:id/status`
- `DELETE /api/registrations/admin/:id`

- `GET /api/messages/admin`
- `PATCH /api/messages/admin/:id/read`
- `DELETE /api/messages/admin/:id`

- `POST /api/team/admin`
- `PUT /api/team/admin/:id`
- `DELETE /api/team/admin/:id`

- `POST /api/media/admin`
- `PUT /api/media/admin/:id`
- `DELETE /api/media/admin/:id`

- `POST /api/uploads` (multipart form, `file` field)
