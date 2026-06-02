import { useState, useEffect, useMemo } from "react";
import { getAllStudents, currentStreak } from "../lib/store";
import { COURSES, TOTAL_TOPICS } from "../data/courses";
import { HAS_BACKEND } from "../lib/supabase";

export default function Admin({ onLogout }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("streaks"); // streaks | scores | topics | all
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getAllStudents();
        setStudents(data);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    })();
  }, []);

  const enriched = useMemo(() => {
    return students.map((s) => {
      const progress = s.progress || {};
      const streaks = s.streaks || {};
      const scores = s.scores || {};
      const topicsDone = Object.values(progress).reduce((n, a) => n + (a?.length || 0), 0);
      const bestStreak = Math.max(0, ...Object.values(streaks).map((x) => currentStreak(x)));
      const scoreVals = Object.values(scores);
      const avgPct = scoreVals.length
        ? Math.round(scoreVals.reduce((t, x) => t + (x.score / x.total) * 100, 0) / scoreVals.length)
        : 0;
      return { ...s, topicsDone, bestStreak, avgPct, scoreCount: scoreVals.length };
    });
  }, [students]);

  const sorted = useMemo(() => {
    const arr = [...enriched];
    if (tab === "streaks") arr.sort((a, b) => b.bestStreak - a.bestStreak);
    else if (tab === "scores") arr.sort((a, b) => b.avgPct - a.avgPct);
    else if (tab === "topics") arr.sort((a, b) => b.topicsDone - a.topicsDone);
    else arr.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    return arr;
  }, [enriched, tab]);

  const tabs = [
    { id: "streaks", label: "🔥 Streaks" },
    { id: "scores", label: "🏆 Scores" },
    { id: "topics", label: "📊 Progress" },
    { id: "all", label: "👥 All" },
  ];

  function metric(s) {
    if (tab === "streaks") return `${s.bestStreak}-day`;
    if (tab === "scores") return s.scoreCount ? `${s.avgPct}%` : "—";
    if (tab === "topics") return `${s.topicsDone}/${TOTAL_TOPICS}`;
    return `${s.topicsDone} topics`;
  }

  // Detail view for one student
  if (detail) {
    const s = enriched.find((x) => x.matric === detail);
    const progress = s.progress || {};
    const streaks = s.streaks || {};
    const scores = s.scores || {};
    return (
      <div className="app">
        <div className="topbar">
          <button className="btn-ghost btn-sm" onClick={() => setDetail(null)}>← Back</button>
          <button className="btn-ghost btn-sm" onClick={onLogout}>Sign out</button>
        </div>
        <div className="rise">
          <h1 style={{ fontSize: "1.6rem" }}>{s.name}</h1>
          <p className="muted">{s.matric}</p>
          <div className="row gap wrap mt">
            <span className="pill streak">🔥 {s.bestStreak}-day</span>
            <span className="pill">📊 {s.topicsDone}/{TOTAL_TOPICS} topics</span>
            <span className="pill">🏆 {s.scoreCount ? s.avgPct + "% avg" : "no quizzes yet"}</span>
          </div>
        </div>

        {COURSES.map((c) => {
          const done = new Set(progress[c.id] || []);
          return (
            <div key={c.id} className="card mt" style={{ borderColor: c.tint + "44" }}>
              <div className="row between mb">
                <b style={{ color: c.tint }}>{c.icon} {c.name}</b>
                <span className="muted" style={{ fontSize: "0.82rem" }}>
                  {done.size}/{c.topics.length} · 🔥 {currentStreak(streaks[c.id])}
                </span>
              </div>
              <div className="bar"><i style={{ width: `${(done.size / c.topics.length) * 100}%`, background: c.tint }} /></div>
              <div className="mt" style={{ fontSize: "0.82rem" }}>
                {c.topics.filter((t) => scores[t.id]).map((t) => (
                  <div key={t.id} className="row between" style={{ padding: "4px 0", color: "var(--ink-soft)" }}>
                    <span style={{ flex: 1, paddingRight: 10 }}>{t.title}</span>
                    <span style={{ color: c.tint }}>{scores[t.id].score}/{scores[t.id].total}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="app">
      <div className="topbar">
        <div className="brand">Admin <span className="accent">Dashboard</span></div>
        <button className="btn-ghost btn-sm" onClick={onLogout}>Sign out</button>
      </div>

      {!HAS_BACKEND && (
        <div className="card mb" style={{ borderColor: "var(--bad)" }}>
          <p className="soft" style={{ fontSize: "0.88rem" }}>
            ⚠️ Offline mode: you're only seeing students from <i>this device</i>. Connect a free database
            (see the setup guide) so every classmate's progress shows up here automatically.
          </p>
        </div>
      )}

      <div className="rise">
        <h1 style={{ fontSize: "1.6rem" }}>Class overview</h1>
        <p className="muted mt">{students.length} student{students.length === 1 ? "" : "s"} registered</p>
      </div>

      <div className="tabs mt">
        {tabs.map((t) => (
          <button key={t.id} className={"tab" + (tab === t.id ? " on" : "")}
            style={tab === t.id ? { background: "var(--gold)", borderColor: "var(--gold)" } : {}}
            onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="center muted mt2">Loading students…</p>
      ) : sorted.length === 0 ? (
        <div className="card mt center">
          <p className="soft">No students yet. Once classmates register and start studying, they'll appear here ranked by streaks, scores and progress.</p>
        </div>
      ) : (
        <div className="card mt">
          {sorted.map((s, i) => (
            <button key={s.matric} className="lb-row" style={{ width: "100%", textAlign: "left", background: "none" }}
              onClick={() => setDetail(s.matric)}>
              <span className={"lb-rank" + (i < 3 ? " top" : "")}>{i + 1}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500 }}>{s.name}</div>
                <div className="muted" style={{ fontSize: "0.76rem" }}>{s.matric}</div>
              </div>
              <span className="pill" style={{ color: tab === "streaks" ? "var(--gold)" : "var(--ink-soft)" }}>
                {metric(s)}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
