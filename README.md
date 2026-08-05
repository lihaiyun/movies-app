# 🎬 Movies App

A modern full stack application built with **Node.js** and **React**.

Users can browse movies, submit ratings and reviews, while administrators can manage the movie catalogue.

---

# Features

## User

* Register with name, email and password
* Login and logout
* Browse movies
* Search movies
* View movie details
* Submit ratings (1–5 stars)
* Write, edit and delete reviews

## Administrator

* Secure administrator login
* Create, update and delete movies
* Upload movie poster images
* Role-based access control

---

# Tech Stack

## Backend

* Node.js (JavaScript ESM)
* Express.js
* PostgreSQL
* Drizzle ORM
* JWT Authentication (Secure HttpOnly Cookies)
* bcrypt
* Zod Validation

## Frontend

* React (JavaScript)
* Vite
* React Router
* shadcn/ui
* Axios
* React Hook Form
* Zod Validation

---

# Deployment

| Component | Platform        |
| --------- | --------------- |
| Frontend  | Vercel          |
| Backend   | Render          |
| Database  | Neon PostgreSQL |

---

# Getting Started

Implemented so far: registration/login/logout, movie browsing + search, and admin movie CRUD (poster is a URL field for now). Ratings/reviews are not yet implemented.

## Backend (`api/`)

```bash
cd api
npm install
cp .env.example .env   # fill in DATABASE_URL (e.g. a Neon connection string) and JWT_SECRET
npm run db:push        # creates the users/movies tables via Drizzle
npm run dev             # starts the API on http://localhost:5000
```

To create an admin user, register a normal account through the app, then manually set that user's `role` column to `admin` in the database (e.g. via `npm run db:studio`).

## Frontend (`app/`)

```bash
cd app
npm install
cp .env.example .env   # VITE_API_URL defaults to http://localhost:5000/api
npm run dev             # starts Vite on http://localhost:5173
```
