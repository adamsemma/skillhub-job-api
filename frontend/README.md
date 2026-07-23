# SkillHub Frontend

Vite + React dashboard for SkillHub's job search and career tools.

## Local setup

```bash
npm install
cp .env.example .env
# Edit .env if your backend runs somewhere other than http://localhost:8001
npm run dev
```

Runs at `http://localhost:5173` by default, proxying `/api` to
`http://localhost:8001` in dev (see `vite.config.js`).

## Environment variables
- `VITE_API_URL` — base URL of the backend API (default `http://localhost:8001`).
- `VITE_USE_MOCK` — when the backend is unreachable, the app falls back to
  placeholder mock data by default so the UI stays usable during frontend-only
  development. Set to `false` to disable this and see real network errors —
  **do this before testing against a real deployment**, otherwise API
  failures can be silently masked by mock data.

## Build
```bash
npm run build   # outputs to dist/
npm run preview # preview the production build locally
```

## Deployment
`render.yaml` defines a Render static site: builds with `npm install && npm
run build`, publishes `dist/`. Set `VITE_API_URL` to your deployed backend's
URL in the Render dashboard.

## Auth
Login is handled by `src/services/api.js` → `loginAPI()`, backed by the
FastAPI backend's real (bcrypt + JWT) auth. The client-side mock fallback in
that file only activates when the backend is *unreachable* — it's a dev
convenience, not a security bypass, but keep `VITE_USE_MOCK=false` in any
environment where you need to be certain you're talking to the real API.
