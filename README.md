# Monorepo: Go Backend + Vite React Frontend

[![Go](https://github.com/TuringProblem/vcoder/actions/workflows/go.yml/badge.svg)](https://github.com/TuringProblem/vcoder/actions/workflows/go.yml)
[![Lint Code Base](https://github.com/TuringProblem/vcoder/actions/workflows/super-linter.yml/badge.svg)](https://github.com/TuringProblem/vcoder/actions/workflows/super-linter.yml)

This repository contains a simple monolithic setup:

- Go backend exposing a single `/analyze` POST endpoint on `localhost:8080` that returns hardcoded feedback.
- Vite + React + TypeScript + Tailwind + shadcn styles + Monaco Editor frontend with an Analyze button that calls the backend and shows results in a sidebar.

## Prerequisites

- Go 1.22+
- Node 18+ and npm

## Running the backend

```bash
cd backend
go run main.go
```

The server listens on `http://localhost:8080`.

### Endpoints

- `POST /analyze` with JSON body `{ "code": "..." }` returns an array of feedback objects for testing roundtrip.
- `GET /healthz` basic health check.

## Running the frontend

Install dependencies once:

```bash
cd frontend
npm install
```

Start the dev server:

```bash
npm run dev
```

Open the app at the URL printed by Vite (e.g., `http://localhost:5173`).

The Analyze button will send the current editor contents to `http://localhost:8080/analyze` and render the returned JSON in the sidebar.

## Project Structure

```
backend/
  handlers/
  models/
  routes/
  services/
  go.mod
  main.go
frontend/
  src/
    components/
    pages/
    lib/
  index.html
  package.json
  tsconfig.json
  tailwind.config.js
  postcss.config.js
  vite.config.ts
```

- Backend code is organized into `routes/`, `handlers/`, `services/`, and `models/` for extensibility.
- Frontend uses `components/`, `pages/`, and `lib/` directories. The Monaco Editor is in `components/Editor.tsx`.

## Notes

- CORS: The frontend calls the backend at `http://localhost:8080`. If you open the Vite app in the browser, this works directly in dev. For production you may want to proxy or serve the frontend from the backend.
- Styling: Tailwind is configured with a shadcn-like design token setup (CSS variables and Tailwind theme extension). You can add shadcn components later with the `shadcn-ui` CLI if desired.
