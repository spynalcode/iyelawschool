import { useState } from "react";

export default function Login({ onLogin, hasBackend }) {
  const [mode, setMode] = useState("student"); // student | admin
  const [name, setName] = useState("");
  const [matric, setMatric] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    setError("");
    if (mode === "student") {
      if (!name.trim() || !matric.trim()) {
        setError("Please enter both your name and matric number.");
        return;
      }
    } else if (!code.trim()) {
      setError("Please enter the admin code.");
      return;
    }
    setBusy(true);
    const res = await onLogin(mode === "student" ? { name, matric } : { code });
    setBusy(false);
    if (!res.ok) setError(res.error);
  }

  return (
    <div className="app">
      <div style={{ paddingTop: 64 }} className="rise">
        <div className="center">
          <div style={{ fontSize: 40, marginBottom: 8 }}>⚖️</div>
          <h1 style={{ fontSize: "2.1rem" }}>
            Iye's <span style={{ color: "var(--gold)", fontStyle: "italic" }}>Law</span> Study
          </h1>
          <p className="soft mt" style={{ maxWidth: 380, margin: "10px auto 0" }}>
            Nigerian Law School · Bar Part II · Abuja 2026. Lessons and quizzes for all five courses — built for Iye and her classmates.
          </p>
        </div>

        <div className="card mt2 rise d1">
          <div className="row gap mb" style={{ background: "var(--bg-raised)", padding: 5, borderRadius: 13 }}>
            <button
              className="tab"
              style={{ flex: 1, background: mode === "student" ? "var(--gold)" : "transparent", color: mode === "student" ? "#1a1410" : "var(--ink-faint)", border: "none" }}
              onClick={() => { setMode("student"); setError(""); }}
            >
              I'm a student
            </button>
            <button
              className="tab"
              style={{ flex: 1, background: mode === "admin" ? "var(--gold)" : "transparent", color: mode === "admin" ? "#1a1410" : "var(--ink-faint)", border: "none" }}
              onClick={() => { setMode("admin"); setError(""); }}
            >
              Admin
            </button>
          </div>

          {mode === "student" ? (
            <>
              <div className="field mb">
                <label>Your name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Iye Okoro" autoComplete="name" />
              </div>
              <div className="field">
                <label>Matric / Exam number</label>
                <input value={matric} onChange={(e) => setMatric(e.target.value)} placeholder="e.g. NLS/AB/2026/0123" autoComplete="off" />
              </div>
              <p className="muted mt" style={{ fontSize: "0.8rem" }}>
                Your matric number keeps your progress and streak. Use the same one each time to log back in.
              </p>
            </>
          ) : (
            <div className="field">
              <label>Admin code</label>
              <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter admin code" type="password" />
              <p className="muted mt" style={{ fontSize: "0.8rem" }}>
                For monitoring all students' progress, streaks and scores.
              </p>
            </div>
          )}

          {error && <p style={{ color: "var(--bad)", marginTop: 14, fontSize: "0.9rem" }}>{error}</p>}

          <button className="btn mt2" onClick={submit} disabled={busy}>
            {busy ? "Just a moment…" : mode === "student" ? "Start studying" : "Open dashboard"}
          </button>
        </div>

        {!hasBackend && (
          <p className="muted center mt2" style={{ fontSize: "0.78rem", lineHeight: 1.5 }}>
            Running in offline mode — progress is saved on this device only.
            <br />Add a free database (see the setup guide) to sync everyone and enable the live leaderboard.
          </p>
        )}
      </div>
    </div>
  );
}
