import { supabase, HAS_BACKEND } from "./supabase";

// ─────────────────────────────────────────────────────────────────────────────
// This module is the single gateway for ALL reads/writes of student data.
// If a Supabase backend is configured, it uses the cloud database (multi-user,
// admin can see everyone). If not, it falls back to localStorage (this device
// only). The rest of the app does not care which mode is active.
// ─────────────────────────────────────────────────────────────────────────────

const LS_KEY = "iye_law_local_v1";
const today = () => new Date().toISOString().split("T")[0];

function loadLocal() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY)) || { students: {} };
  } catch {
    return { students: {} };
  }
}
function saveLocal(data) {
  localStorage.setItem(LS_KEY, JSON.stringify(data));
}

// ── Registration / login ─────────────────────────────────────────────────────
export async function registerOrLogin({ name, matric }) {
  const id = matric.trim().toLowerCase();
  if (HAS_BACKEND) {
    // Upsert the student row keyed by matric number.
    const { data: existing } = await supabase
      .from("students")
      .select("*")
      .eq("matric", id)
      .maybeSingle();
    if (existing) return existing;
    const { data, error } = await supabase
      .from("students")
      .insert({ matric: id, name: name.trim(), created_at: new Date().toISOString() })
      .select()
      .single();
    if (error) throw error;
    return data;
  } else {
    const store = loadLocal();
    if (!store.students[id]) {
      store.students[id] = {
        matric: id,
        name: name.trim(),
        progress: {},
        streaks: {},
        scores: {},
      };
      saveLocal(store);
    }
    return store.students[id];
  }
}

// ── Read a single student's full record ──────────────────────────────────────
export async function getStudent(matric) {
  const id = matric.trim().toLowerCase();
  if (HAS_BACKEND) {
    const { data } = await supabase.from("students").select("*").eq("matric", id).maybeSingle();
    return data;
  }
  return loadLocal().students[id] || null;
}

// ── Mark a topic studied + record quiz score + update streak ─────────────────
export async function recordActivity({ matric, courseId, topicId, score, total }) {
  const id = matric.trim().toLowerCase();
  const td = today();

  if (HAS_BACKEND) {
    const { data: s } = await supabase.from("students").select("*").eq("matric", id).single();
    const progress = s.progress || {};
    const streaks = s.streaks || {};
    const scores = s.scores || {};

    const done = new Set(progress[courseId] || []);
    done.add(topicId);
    progress[courseId] = [...done];

    if (score != null) scores[topicId] = { score, total, date: td };

    streaks[courseId] = bumpStreak(streaks[courseId], td);

    const { data, error } = await supabase
      .from("students")
      .update({ progress, streaks, scores, last_active: td })
      .eq("matric", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  } else {
    const store = loadLocal();
    const s = store.students[id];
    if (!s) return null;
    s.progress = s.progress || {};
    s.streaks = s.streaks || {};
    s.scores = s.scores || {};
    const done = new Set(s.progress[courseId] || []);
    done.add(topicId);
    s.progress[courseId] = [...done];
    if (score != null) s.scores[topicId] = { score, total, date: td };
    s.streaks[courseId] = bumpStreak(s.streaks[courseId], td);
    s.last_active = td;
    saveLocal(store);
    return s;
  }
}

function bumpStreak(prev, td) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yStr = yesterday.toISOString().split("T")[0];
  const s = prev || { count: 0, lastDate: null };
  if (s.lastDate === td) return s; // already counted today
  return { count: s.lastDate === yStr ? s.count + 1 : 1, lastDate: td };
}

export function currentStreak(streakObj) {
  if (!streakObj?.lastDate) return 0;
  const td = today();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yStr = yesterday.toISOString().split("T")[0];
  return streakObj.lastDate === td || streakObj.lastDate === yStr ? streakObj.count : 0;
}

// ── ADMIN: fetch every student (cloud only) ──────────────────────────────────
export async function getAllStudents() {
  if (HAS_BACKEND) {
    const { data, error } = await supabase.from("students").select("*").order("name");
    if (error) throw error;
    return data || [];
  }
  // offline mode: just this device's students
  return Object.values(loadLocal().students);
}
