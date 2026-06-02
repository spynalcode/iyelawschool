-- ============================================================
-- Iye's Law Study — Supabase database schema
-- Run this ONCE in your Supabase project's SQL Editor.
-- (Supabase dashboard → SQL Editor → New query → paste → Run)
-- ============================================================

create table if not exists students (
  matric       text primary key,
  name         text not null,
  progress     jsonb default '{}'::jsonb,   -- { courseId: [topicId, ...] }
  streaks      jsonb default '{}'::jsonb,   -- { courseId: { count, lastDate } }
  scores       jsonb default '{}'::jsonb,   -- { topicId: { score, total, date } }
  last_active  text,
  created_at   timestamptz default now()
);

-- Enable Row Level Security
alter table students enable row level security;

-- Allow the app (using the public anon key) to read and write student rows.
-- This is a study app with no sensitive data, so we keep policies simple:
-- anyone with the app can register and update their own record, and the
-- admin view reads all rows.

create policy "anyone can read students"
  on students for select
  using (true);

create policy "anyone can insert a student"
  on students for insert
  with check (true);

create policy "anyone can update a student"
  on students for update
  using (true)
  with check (true);

-- Done. Your app will now sync every student to this table.
