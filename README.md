# Iye's Law Study ⚖️

A study app for the Nigerian Law School Bar Part II (Abuja 2026) — lessons and quizzes across all five courses, with per-student progress tracking, daily streaks, and an admin dashboard with class leaderboards.

## Courses & topics (55 total)

- **Civil Litigation** — 12 topics
- **Criminal Litigation** — 10 topics
- **Professional Ethics & Skills** — 11 topics
- **Property Law Practice** — 11 topics
- **Corporate Law Practice** — 11 topics

Each topic has a full lesson (sourced from the official NLS 2026 slides and the relevant statutes) followed by a multiple-choice quiz. Correct answers are automatically balanced across A/B/C/D so they never cluster.

## Features

- 👥 **Multi-user** — every classmate registers with their name + matric number
- 🔥 **Streaks** — daily study streaks per course
- 📊 **Progress** — topics completed and best quiz scores
- 🏆 **Admin dashboard** — leaderboards for streaks, scores and progress; per-student detail
- 📱 **Mobile-first** — designed for phones; works as an "Add to Home Screen" web app
- ☁️ **Works online or offline** — runs on localStorage with no setup, or syncs everyone via a free Supabase database

## Quick start (local)

```bash
npm install
npm run dev
```

## Deploy it for the class

See **`SETUP_GUIDE.md`** — a step-by-step, non-technical guide to putting this online for free (Supabase + Vercel) in about 15 minutes.

## Tech

Vite · React 18 · Supabase (optional backend). No build-time secrets — configuration is via environment variables at deploy time:

- `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` — enable multi-user sync
- `VITE_ADMIN_CODE` — the admin dashboard password
