import { useState } from "react";

export default function Login({ onLogin, hasBackend }) {
  const [mode, setMode] = useState("student"); // student | admin
  const [username, setUsername] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    setError("");
    if (mode === "student") {
      if (!username.trim()) {
        setError("Please enter a username.");
        return;
      }
    } else if (!code.trim()) {
      setError("Please enter the admin code.");
      return;
    }
    setBusy(true);
    const res = await onLogin(
      mode === "student" ? { name: username, matric: username } : { code }
    );
    setBusy(false);
    if (!res.ok) setError(res.error);
  }

  return (
    <div className="app">
      <div style={{ paddingTop: 64 }} className="rise">
        <div className="center">
          <div style={{ fontSize: 40, marginBottom: 8 }}>⚖️</div>
          <h1 style={{ fontSize: "2.1rem" }}>
            Nigerian Law School <span style={{ color: "var(--gold)", fontStyle: "italic" }}>MCQ</span> Quiz
          </h1>
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
              <div className="field">
                <label>Username</label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. iye_okoro"
                  autoComplete="off"
                  onKeyDown={(e) => e.key === "Enter" && submit()}
                />
              </div>
              <p className="muted mt" style={{ fontSize: "0.8rem" }}>
                Your username keeps your progress and streak. Use the same one each time to log back in.
              </p>
            </>
          ) : (
            <div className="field">
              <label>Admin code</label>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter admin code"
                type="password"
                onKeyDown={(e) => e.key === "Enter" && submit()}
              />
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