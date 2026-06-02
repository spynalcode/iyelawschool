import { useState, useMemo } from "react";
import { COURSES, TOTAL_TOPICS } from "../data/courses";
import { currentStreak } from "../lib/store";
import Topic from "./Topic.jsx";

export default function Dashboard({ student, setStudent, onLogout }) {
  const [activeCourse, setActiveCourse] = useState(COURSES[0].id);
  const [openTopic, setOpenTopic] = useState(null); // {courseId, topicId}

  const progress = student.progress || {};
  const streaks = student.streaks || {};
  const scores = student.scores || {};

  const doneCount = useMemo(
    () => Object.values(progress).reduce((n, arr) => n + (arr?.length || 0), 0),
    [progress]
  );

  const bestStreak = useMemo(
    () => Math.max(0, ...Object.values(streaks).map((s) => currentStreak(s))),
    [streaks]
  );

  const course = COURSES.find((c) => c.id === activeCourse);
  const courseDone = new Set(progress[activeCourse] || []);

  if (openTopic) {
    return (
      <Topic
        student={student}
        setStudent={setStudent}
        courseId={openTopic.courseId}
        topicId={openTopic.topicId}
        onBack={() => setOpenTopic(null)}
      />
    );
  }

  const firstName = (student.name || "there").split(" ")[0];

  return (
    <div className="app">
      <div className="topbar">
        <div className="brand">Iye's <span className="accent">Law</span> Study</div>
        <button className="btn-ghost btn-sm" onClick={onLogout}>Sign out</button>
      </div>

      <div className="rise">
        <h1 style={{ fontSize: "1.7rem" }}>Welcome back, {firstName} 📚</h1>
        <div className="row gap wrap mt">
          <span className="pill"><b>{doneCount}</b>/{TOTAL_TOPICS} topics studied</span>
          <span className="pill streak">🔥 {bestStreak}-day streak</span>
        </div>
      </div>

      {/* Course tabs */}
      <div className="tabs mt2">
        {COURSES.map((c) => (
          <button
            key={c.id}
            className={"tab" + (c.id === activeCourse ? " on" : "")}
            style={c.id === activeCourse ? { background: c.tint, borderColor: c.tint } : {}}
            onClick={() => setActiveCourse(c.id)}
          >
            {c.icon} {c.short}
          </button>
        ))}
      </div>

      {/* Course header */}
      <div className="card rise" style={{ borderColor: course.tint + "55" }}>
        <div className="row between">
          <div>
            <h2 style={{ fontSize: "1.3rem", color: course.tint }}>{course.name}</h2>
            <p className="muted" style={{ fontSize: "0.85rem", marginTop: 2 }}>
              {courseDone.size}/{course.topics.length} topics · 🔥 {currentStreak(streaks[activeCourse])}-day streak
            </p>
          </div>
          <div style={{ fontSize: 30 }}>{course.icon}</div>
        </div>
        <div className="bar mt">
          <i style={{ width: `${(courseDone.size / course.topics.length) * 100}%`, background: course.tint }} />
        </div>
      </div>

      {/* Topic list */}
      <div className="mt2">
        {course.topics.map((t, i) => {
          const done = courseDone.has(t.id);
          const sc = scores[t.id];
          return (
            <button
              key={t.id}
              className="card rise"
              style={{ display: "block", width: "100%", textAlign: "left", marginBottom: 11, animationDelay: `${i * 0.03}s` }}
              onClick={() => setOpenTopic({ courseId: course.id, topicId: t.id })}
            >
              <div className="row between gap">
                <div style={{ flex: 1 }}>
                  <div className="row gap" style={{ alignItems: "center" }}>
                    <span style={{ fontFamily: "var(--display)", color: course.tint, fontSize: "0.95rem", minWidth: 22 }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span style={{ fontWeight: 500, fontSize: "0.98rem" }}>{t.title}</span>
                  </div>
                  {sc && (
                    <p className="muted" style={{ fontSize: "0.78rem", marginTop: 6, marginLeft: 32 }}>
                      Best quiz: {sc.score}/{sc.total} ({Math.round((sc.score / sc.total) * 100)}%)
                    </p>
                  )}
                </div>
                <span style={{ fontSize: 18, color: done ? course.tint : "var(--ink-faint)" }}>
                  {done ? "✓" : "›"}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
