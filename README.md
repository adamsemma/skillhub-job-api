# SkillHub

AI-assisted job search and skill-matching platform: FastAPI backend +
Vite/React frontend.

```
.
├── backend/     FastAPI API — job search, matching, auth (see backend/README.md)
└── frontend/    Vite + React dashboard (see frontend/README.md)
```

## Quick start

```bash
# Backend
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # then set a real SECRET_KEY and DB/Redis URLs
uvicorn app.main:app --reload --port 8001

# Frontend (separate terminal)
cd frontend
npm install
cp .env.example .env
npm run dev
```

Or via Docker: `cd backend && docker compose up --build`.

## Before pushing to GitHub

- [x] `.env` is git-ignored in both `backend/` and `frontend/` — only
      `.env.example` (no real secrets) is tracked.
- [x] No hardcoded API keys, passwords, or secrets in source — verified by
      grep across `.py`/`.js`/`.jsx` files.
- [x] `SECRET_KEY` in the backend now fails fast at startup if left as the
      default placeholder while `DEBUG=False`, so a misconfigured deploy
      can't silently ship with a known signing key.
- [x] `node_modules/`, `dist/`, `__pycache__/`, `.pytest_cache/`, `venv/`,
      and local logs are git-ignored in both projects.
- [ ] **Decide on a license.** No `LICENSE` file is included — if this repo
      is going public, add one (MIT/Apache-2.0 for open source, or a private
      repo + internal copyright notice for proprietary Meritlives code).
- [ ] If any commit history already exists with a real `.env` or API key in
      it, git-ignoring the file now is not enough — those secrets are still
      in history and need to be rotated and scrubbed (e.g. `git filter-repo`).

## Production checklist
See `backend/README.md` and `frontend/README.md` for environment-variable
details. In short: real `SECRET_KEY`, `DEBUG=False`, `VITE_USE_MOCK=false`,
and CORS origins locked down to your actual frontend domain.
