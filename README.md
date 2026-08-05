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

| Component | Platform        | URL                                                                          |
| --------- | --------------- | ----------------------------------------------------------------------------|
| Frontend  | Vercel          | [movies-app-six-zeta.vercel.app](https://movies-app-six-zeta.vercel.app)    |
| Backend   | Render          | [movies-api-bc6e.onrender.com/api](https://movies-api-bc6e.onrender.com/api) |
| Database  | Neon PostgreSQL | —                                                                            |

---

# Getting Started

Implemented so far: registration/login/logout, movie browsing + search, admin movie CRUD (poster is a URL field for now), and user ratings/reviews (submit, edit and delete your own 1–5 star rating with an optional review).

## Backend (`api/`)

```bash
cd api
npm install
cp .env.example .env   # fill in DATABASE_URL (e.g. a Neon connection string) and JWT_SECRET
npm run db:push        # creates the users/movies/ratings tables via Drizzle
npm run db:seed         # (optional) seeds sample movies, users and ratings/reviews
npm run dev             # starts the API on http://localhost:5000
```

The command `npm run db:seed` creates an `admin@moviesapp.com` account along with sample users, movies and ratings.

## Frontend (`app/`)

```bash
cd app
npm install
cp .env.example .env   # VITE_API_URL defaults to http://localhost:5000/api
npm run dev             # starts Vite on http://localhost:5173
```
