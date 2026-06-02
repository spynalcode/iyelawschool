# 📚 Iye's Law Study — Setup & Deployment Guide

A complete study app for the Nigerian Law School Bar Part II (Abuja 2026), covering all five courses with lessons, quizzes, streaks, per-student progress, and an admin dashboard.

**You do NOT need to know how to code.** Follow these steps and you'll have a live website your whole class can use on their phones in about 15 minutes.

---

## What you're setting up

1. **The database** (Supabase — free) — stores every student's progress so the admin dashboard can show everyone.
2. **The website** (Vercel or Netlify — free) — gives you a real link like `iye-law.vercel.app` that anyone can open.

> 💡 **Want to try it first without any setup?** You can. The app runs in "offline mode" with no database — progress saves on one phone only, and the admin dashboard only sees that phone. Good for a quick test, but for the real multi-student experience, do the database step.

---

## PART 1 — Create the free database (Supabase)

1. Go to **https://supabase.com** and click **Start your project** → sign up (free, use Google/GitHub or email).
2. Click **New project**. Give it a name like `iye-law`. Choose any region close to Nigeria (e.g. *West EU* or *East US*). Set a database password (save it somewhere — you won't need it often). Click **Create new project** and wait ~2 minutes.
3. On the left sidebar, click **SQL Editor** → **New query**.
4. Open the file **`supabase_schema.sql`** (included in this project), copy ALL of it, paste it into the editor, and click **Run**. You should see "Success".
5. On the left sidebar, click **Project Settings** (the gear) → **API**.
6. Copy two values — you'll need them in Part 3:
   - **Project URL** (looks like `https://abcdxyz.supabase.co`)
   - **anon public** key (a long string under "Project API keys")

✅ Your database is ready.

---

## PART 2 — Put the code online (GitHub)

The easiest way to deploy is through GitHub (free).

1. Go to **https://github.com** and sign up / log in.
2. Click **New repository**. Name it `iye-law-study`. Keep it **Public** (or Private — both work). Click **Create repository**.
3. On the new repo page, click **uploading an existing file**.
4. Drag in **all the files and folders** from this project (the whole `iye-law-app` folder contents — `src`, `public`, `index.html`, `package.json`, etc.). Click **Commit changes**.

✅ Your code is on GitHub.

---

## PART 3 — Deploy the website (Vercel — recommended)

1. Go to **https://vercel.com** → **Sign up** → choose **Continue with GitHub**.
2. Click **Add New… → Project**. Find your `iye-law-study` repo and click **Import**.
3. Vercel auto-detects it's a Vite app — leave the build settings as they are.
4. Before deploying, expand **Environment Variables** and add these three (from Part 1):

   | Name | Value |
   |------|-------|
   | `VITE_SUPABASE_URL` | *(your Project URL)* |
   | `VITE_SUPABASE_ANON_KEY` | *(your anon public key)* |
   | `VITE_ADMIN_CODE` | *(choose any secret code, e.g. `IYE_ADMIN_2026`)* |

5. Click **Deploy**. Wait ~1 minute. You'll get a live link like `https://iye-law-study.vercel.app`.

✅ **Done!** Open the link on your phone. Share it with the class.

> **Netlify alternative:** the steps are nearly identical — go to https://netlify.com, "Add new site → Import an existing project", pick the GitHub repo, and add the same three environment variables under **Site settings → Environment variables**. Build command `npm run build`, publish directory `dist`.

---

## How everyone uses it

- **Students:** open the link, tap **"I'm a student"**, enter their name + matric/exam number, and start. Their progress, scores and streak are saved automatically. They log back in with the **same matric number**.
- **You (admin):** open the link, tap **Admin**, enter your `VITE_ADMIN_CODE`. You'll see every student ranked by 🔥 streaks, 🏆 scores, and 📊 topics completed. Tap any student to see their full breakdown by course.

**Tip:** On a phone, tap the browser's *Share → Add to Home Screen* to make it open like a real app.

---

## Updating questions later

Each topic currently has a solid set of questions. To add more (Iye wanted 40–50 per topic eventually), open the relevant file in `src/data/`:

- `q_civil.js`, `q_criminal.js`, `q_ethics.js`, `q_property.js`, `q_corporate.js`

Each question is just:

```js
{ q: "Your question?", correct: "The right answer", wrong: ["Wrong 1", "Wrong 2", "Wrong 3"] },
```

Add as many as you like to any topic's list. The app automatically shuffles options so correct answers stay evenly spread across A, B, C and D — you never have to worry about that. After editing, commit the change on GitHub and Vercel re-deploys automatically.

> Or just ask me (Claude) to generate more questions for any course and paste them in — I can produce them in batches.

---

## Changing the admin code

Change the `VITE_ADMIN_CODE` value in Vercel (Project → Settings → Environment Variables), then redeploy (Deployments → ⋯ → Redeploy).

---

## Troubleshooting

- **"Offline mode" message won't go away** → your environment variables aren't set, or you redeployed before adding them. Re-check Part 3 step 4, then redeploy.
- **Admin shows no students** → make sure the database SQL ran (Part 1 step 4) and the env vars match your Supabase project.
- **Build failed on Vercel** → make sure you uploaded `package.json` and the whole `src` folder to GitHub.

That's everything. Enjoy — and good luck to Iye and the whole class in the Bar exams! ⚖️
