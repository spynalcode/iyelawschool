import { useState, useEffect } from "react";
import { ADMIN_CODE, HAS_BACKEND } from "./lib/supabase";
import { registerOrLogin, getStudent } from "./lib/store";
import Login from "./components/Login.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Admin from "./components/Admin.jsx";

const SESSION_KEY = "iye_law_session";

export default function App() {
  const [student, setStudent] = useState(null);
  const [adminMode, setAdminMode] = useState(false);
  const [loading, setLoading] = useState(true);

  // Restore session on load
  useEffect(() => {
    (async () => {
      try {
        const saved = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
        if (saved?.admin) {
          setAdminMode(true);
        } else if (saved?.matric) {
          const s = await getStudent(saved.matric);
          if (s) setStudent(s);
        }
      } catch {}
      setLoading(false);
    })();
  }, []);

  async function handleLogin({ name, matric, code }) {
    // Admin path
    if (code) {
      if (code.trim() === ADMIN_CODE) {
        localStorage.setItem(SESSION_KEY, JSON.stringify({ admin: true }));
        setAdminMode(true);
        return { ok: true };
      }
      return { ok: false, error: "Incorrect admin code." };
    }
    // Student path
    try {
      const s = await registerOrLogin({ name, matric });
      localStorage.setItem(SESSION_KEY, JSON.stringify({ matric: s.matric }));
      setStudent(s);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message || "Something went wrong. Try again." };
    }
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    setStudent(null);
    setAdminMode(false);
  }

  if (loading) {
    return (
      <div className="app" style={{ paddingTop: 120 }}>
        <p className="center muted">Loading…</p>
      </div>
    );
  }

  if (adminMode) return <Admin onLogout={logout} />;
  if (student) return <Dashboard student={student} setStudent={setStudent} onLogout={logout} />;
  return <Login onLogin={handleLogin} hasBackend={HAS_BACKEND} />;
}
