# Movies App - Backend

Node.js (ESM) + Express API for the Movies App. PostgreSQL via Drizzle ORM, JWT auth with secure HttpOnly cookies, bcrypt for password hashing, Zod for request validation, and a Groq-powered AI chat assistant.

See the [root README](../README.md) for the full project overview, features and deployment info.

## Tech Stack

- Node.js (JavaScript ESM)
- Express.js
- PostgreSQL
- Drizzle ORM
- JWT authentication (secure HttpOnly cookies)
- bcrypt
- Zod validation
- Groq API (Qwen model) for the AI chat assistant

## Getting Started

```bash
npm install
cp .env.example .env   # fill in DATABASE_URL, JWT_SECRET and GROQ_API_KEY
npm run db:push        # creates the users/movies/ratings tables via Drizzle
npm run db:seed         # (optional) seeds sample movies, users and ratings/reviews
npm run dev             # starts the API on http://localhost:5000
```

Get a free `GROQ_API_KEY` from [console.groq.com/keys](https://console.groq.com/keys) - it powers the AI chat assistant (`GROQ_MODEL` defaults to a Qwen model and can be overridden in `.env`).

`npm run db:seed` creates an `admin@moviesapp.com` account along with sample users, movies and ratings.

## Environment Variables

| Variable         | Description                                              |
| ---------------- | ---------------------------------------------------------|
| `DATABASE_URL`    | PostgreSQL connection string (e.g. a Neon connection string) |
| `JWT_SECRET`      | Secret used to sign JWTs                                  |
| `PORT`            | Port the API listens on (defaults to `5000`)              |
| `CLIENT_ORIGIN`   | Origin allowed by CORS (the frontend's URL)                |
| `GROQ_API_KEY`    | API key for the Groq-powered chat assistant                |
| `GROQ_MODEL`      | Groq model to use (defaults to a Qwen model)               |

## Scripts

- `npm run dev` - start the API with nodemon (auto-restart on changes)
- `npm start` - production start (no nodemon)
- `npm run db:push` - push the Drizzle schema straight to the database
- `npm run db:generate` - generate Drizzle migration files
- `npm run db:migrate` - run Drizzle migrations
- `npm run db:studio` - open Drizzle Studio
- `npm run db:seed` - seed sample users, movies and ratings/reviews

There is no lint or test command in `api/` yet.

## Project Structure

- `src/routes` - Express route definitions
- `src/controllers` - request handlers
- `src/middleware` - auth (`requireAuth`, `requireAdmin`), validation, error handling
- `src/db` - Drizzle schema, client and seed script
- `src/lib` - shared utilities (Zod validators, async handler, etc.)

## Domain Model

- **users** - name, email, password hash, role (`user` or `admin`)
- **movies** - title, description, genre, release date, poster URL
- **ratings** - a user's 1-5 star rating and optional review for a movie (one per user/movie pair)

## API Overview

All routes are mounted under `/api`.

### Auth (`/api/auth`)

| Method | Path              | Auth        | Description                  |
| ------ | ----------------- | ----------- | ----------------------------- |
| POST   | `/register`        | -           | Register a new user            |
| POST   | `/login`           | -           | Log in, sets an HttpOnly cookie |
| POST   | `/logout`          | -           | Log out, clears the cookie      |
| GET    | `/me`              | User        | Get the current user            |
| PATCH  | `/me`              | User        | Update the current user's profile |
| POST   | `/change-password` | User        | Change the current user's password |

### Movies (`/api/movies`)

| Method | Path             | Auth        | Description                       |
| ------ | ---------------- | ----------- | ---------------------------------- |
| GET    | `/`               | -           | List/search movies                  |
| GET    | `/:id`            | -           | Get a movie by id                   |
| POST   | `/`               | Admin       | Create a movie                      |
| PUT    | `/:id`            | Admin       | Update a movie                      |
| DELETE | `/:id`            | Admin       | Delete a movie                      |
| GET    | `/:id/rating`     | User        | Get the current user's rating for a movie |
| PUT    | `/:id/rating`     | User        | Submit/update the current user's rating and review |
| DELETE | `/:id/rating`     | User        | Delete the current user's rating    |
| GET    | `/:id/reviews`    | -           | List all reviews for a movie        |

### Chat (`/api/chat`)

| Method | Path | Auth | Description                                                    |
| ------ | ---- | ---- | ---------------------------------------------------------------|
| POST   | `/`   | -    | Ask the AI chat assistant a question about the catalogue (uses a `search_movies` tool) |
