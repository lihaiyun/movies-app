# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

This repository is currently a bare scaffold: only `README.md` and `LICENSE` have content. The `api/` and `app/` directories exist but are empty — no `package.json`, source files, or build tooling have been created yet for either. There are no build/lint/test commands to run yet because no toolchain has been initialized.

When starting implementation, set up `api/` and `app/` as the backend and frontend per the intended stack below, and update this file with real commands (install, dev server, lint, test, single-test invocation) once they exist.

## Intended architecture (from README.md)

This is planned as a full-stack movie catalogue app with two independent halves:

- **`api/`** — Node.js (ESM) + Express backend. PostgreSQL via Drizzle ORM. JWT auth using secure HttpOnly cookies, bcrypt for password hashing, Zod for request validation.
- **`app/`** — React frontend built with Vite. React Router for routing, shadcn/ui for components, Axios for HTTP, React Hook Form + Zod for form handling/validation.

### Domain model (planned features)

- **Users**: register (name/email/password), login/logout, browse and search movies, view movie details, submit 1–5 star ratings, write/edit/delete reviews.
- **Administrators**: separate secure login, full CRUD on movies, poster image uploads, role-based access control gating admin-only actions.

### Deployment targets (from README.md)

| Component | Platform |
| --------- | -------- |
| Frontend | Vercel |
| Backend | Render |
| Database | Neon PostgreSQL |

This implies the backend and frontend are deployed and configured as separate services.
