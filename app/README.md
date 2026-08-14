# Movies App - Frontend

React (JavaScript) frontend for the Movies App, built with Vite.

See the [root README](../README.md) for the full project overview, features and deployment info.

## Tech Stack

- React
- Vite
- React Router
- shadcn/ui (Radix + Tailwind)
- Axios
- React Hook Form
- Zod Validation
- react-markdown

## Getting Started

```bash
npm install
cp .env.example .env   # VITE_API_URL defaults to http://localhost:5000/api
npm run dev             # starts Vite on http://localhost:5173
```

The backend (`../api`) must be running for the app to work - see the [root README](../README.md) for setup.

## Scripts

- `npm run dev` - start the dev server with HMR
- `npm run build` - production build
- `npm run preview` - preview the production build locally
- `npm run lint` - lint with oxlint

## Project Structure

- `src/pages` - route-level pages (incl. `src/pages/admin`)
- `src/components` - shared components (incl. `src/components/ui` for shadcn/ui primitives)
- `src/context` - React context providers (e.g. auth)
- `src/lib` - utilities and API client
