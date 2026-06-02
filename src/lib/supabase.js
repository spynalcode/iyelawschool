import { createClient } from "@supabase/supabase-js";

// These get filled in from environment variables at deploy time.
// If absent, the app runs in OFFLINE MODE (localStorage only, single device).
const url = import.meta.env.VITE_SUPABASE_URL || "";
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const HAS_BACKEND = Boolean(url && key);

export const supabase = HAS_BACKEND ? createClient(url, key) : null;

// Admin code — change this to whatever you like before deploying.
export const ADMIN_CODE = import.meta.env.VITE_ADMIN_CODE || "IYE_ADMIN_2026";
