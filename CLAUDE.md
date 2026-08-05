# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

Implemented: user registration/login/logout, movie browsing + search, admin movie CRUD (poster is a URL field for now), and user ratings/reviews (submit, edit and delete your own 1–5 star rating with an optional review). There is no automated test suite yet.

## Architecture

Full-stack movie catalogue app with two independent halves:

- **`api/`** — Node.js (ESM) + Express backend. PostgreSQL via Drizzle ORM. JWT auth using secure HttpOnly cookies, bcrypt for password hashing, Zod for request validation.
  - `src/routes`, `src/controllers`, `src/middleware`, `src/db`, `src/lib`
- **`app/`** — React (JS) frontend built with Vite. React Router for routing, shadcn/ui (Radix + Tailwind) for components, Axios for HTTP, React Hook Form + Zod for form handling/validation.
  - `src/pages` (incl. `src/pages/admin`), `src/components` (incl. `src/components/ui`), `src/context`, `src/lib`

### Domain model

- **Users**: register (name/email/password), login/logout, browse and search movies, view movie details, submit 1–5 star ratings, write/edit/delete reviews.
- **Administrators**: separate secure login, full CRUD on movies, poster image uploads (URL field for now), role-based access control gating admin-only actions.

## Commands

### Backend (`api/`)

```bash
cd api
npm install
cp .env.example .env   # fill in DATABASE_URL (e.g. a Neon connection string) and JWT_SECRET
npm run db:push        # creates the users/movies/ratings tables via Drizzle
npm run db:seed        # (optional) seeds sample movies, users and ratings/reviews
npm run dev            # starts the API on http://localhost:5000
```

`npm run db:seed` creates an `admin@moviesapp.com` account along with sample users, movies and ratings.

Other useful scripts: `npm run db:generate` / `npm run db:migrate` (Drizzle migrations), `npm run db:studio` (Drizzle Studio), `npm start` (production start, no nodemon).

There is no lint or test command in `api/` yet.

### Frontend (`app/`)

```bash
cd app
npm install
cp .env.example .env   # VITE_API_URL defaults to http://localhost:5000/api
npm run dev             # starts Vite on http://localhost:5173
```

Other scripts: `npm run build` (Vite build), `npm run preview` (preview built app), `npm run lint` (oxlint).

There is no test command in `app/` yet.

## Deployment

| Component | Platform        | URL                                                                          |
| --------- | --------------- | ----------------------------------------------------------------------------|
| Frontend  | Vercel          | https://movies-app-six-zeta.vercel.app                                      |
| Backend   | Render          | https://movies-api-bc6e.onrender.com/api                                    |
| Database  | Neon PostgreSQL | —                                                                            |

Frontend and backend are deployed and configured as separate services.
