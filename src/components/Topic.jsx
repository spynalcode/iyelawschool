import { useState, useMemo } from "react";
import { COURSES } from "../data/courses";
import { LESSONS } from "../data/lessons";
import { QUESTIONS } from "../data/questions";
import { freshAttempt } from "../lib/questions";
import { recordActivity } from "../lib/store";

export default function Topic({ student, setStudent, courseId, topicId, onBack }) {
  const course = COURSES.find((c) => c.id === courseId);
  const topic = course.topics.find((t) => t.id === topicId);
  const lesson = LESSONS[topicId] || [];
  const rawQs = QUESTIONS[topicId] || [];

  const [view, setView] = useState("lesson"); // lesson | quiz | done
  const [quiz, setQuiz] = useState([]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);

  function startQuiz() {
    setQuiz(freshAttempt(rawQs));
    setIdx(0); setPicked(null); setScore(0); setAnswered(0);
    setView("quiz");
  }

  function pick(i) {
    if (picked !== null) return;
    setPicked(i);
    const correct = i === quiz[idx].ans;
    if (correct) setScore((s) => s + 1);
    setAnswered((a) => a + 1);
  }

  async function next() {
    if (idx + 1 < quiz.length) {
      setIdx(idx + 1);
      setPicked(null);
    } else {
      // finished
      setView("done");
      const updated = await recordActivity({
        matric: student.matric,
        courseId,
        topicId,
        score,
        total: quiz.length,
      });
      if (updated) setStudent(updated);
    }
  }

  const letters = ["A", "B", "C", "D"];
  const firstName = (student.name || "you").split(" ")[0];

  // ── LESSON VIEW ──
  if (view === "lesson") {
    return (
      <div className="app">
        <div className="topbar">
          <button className="btn-ghost btn-sm" onClick={onBack}>← Back</button>
          <span className="pill" style={{ color: course.tint }}>{course.icon} {course.short}</span>
        </div>
        <div className="rise">
          <h1 style={{ fontSize: "1.5rem", color: course.tint }}>{topic.title}</h1>
          <p className="muted mt" style={{ fontSize: "0.85rem" }}>
            Read the lesson, then test yourself with {rawQs.length} questions.
          </p>
        </div>
        <div className="lesson mt2">
          {lesson.map((sec, i) => (
            <div key={i} className="rise" style={{ animationDelay: `${i * 0.05}s` }}>
              <h3>{sec.heading}</h3>
              <p>{sec.body}</p>
            </div>
          ))}
        </div>
        <button className="btn" style={{ background: course.tint }} onClick={startQuiz}>
          Start quiz →
        </button>
      </div>
    );
  }

  // ── QUIZ VIEW ──
  if (view === "quiz") {
    const q = quiz[idx];
    return (
      <div className="app">
        <div className="topbar">
          <button className="btn-ghost btn-sm" onClick={() => setView("lesson")}>← Lesson</button>
          <span className="pill">{idx + 1} / {quiz.length}</span>
        </div>

        <div className="bar mb">
          <i style={{ width: `${((idx) / quiz.length) * 100}%`, background: course.tint }} />
        </div>

        <div className="rise" key={idx}>
          <h2 style={{ fontSize: "1.18rem", lineHeight: 1.35, marginBottom: 20 }}>{q.q}</h2>
          {q.opts.map((opt, i) => {
            let cls = "opt";
            if (picked !== null) {
              if (i === q.ans) cls += " correct";
              else if (i === picked) cls += " wrong";
            }
            return (
              <button key={i} className={cls} onClick={() => pick(i)}>
                <span className="key">{letters[i]}</span>
                <span>{opt}</span>
              </button>
            );
          })}
        </div>

        {picked !== null && (
          <div className="pop mt">
            <p className="soft mb" style={{ fontSize: "0.9rem" }}>
              {picked === q.ans ? "✓ Correct!" : `✗ The answer is ${letters[q.ans]}.`}
            </p>
            <button className="btn" style={{ background: course.tint }} onClick={next}>
              {idx + 1 < quiz.length ? "Next question →" : "See results"}
            </button>
          </div>
        )}
      </div>
    );
  }

  // ── DONE VIEW ──
  const pct = Math.round((score / quiz.length) * 100);
  const msg =
    pct >= 80 ? `Outstanding, ${firstName}! You've really got this. 🌟` :
    pct >= 60 ? `Good work, ${firstName}. A little more revision and it's yours. 💪` :
    `Keep going, ${firstName} — re-read the lesson and try again. You'll get it. 📖`;

  return (
    <div className="app">
      <div className="topbar">
        <button className="btn-ghost btn-sm" onClick={onBack}>← Back to topics</button>
      </div>
      <div className="center rise" style={{ paddingTop: 30 }}>
        <div className="pop" style={{ fontSize: 56, marginBottom: 10 }}>
          {pct >= 80 ? "🏆" : pct >= 60 ? "👏" : "📚"}
        </div>
        <h1 style={{ fontSize: "2.4rem", color: course.tint }}>{score}/{quiz.length}</h1>
        <p className="soft" style={{ fontSize: "1.1rem", marginTop: 4 }}>{pct}%</p>
        <p className="soft mt2" style={{ maxWidth: 360, margin: "20px auto 0", fontSize: "1.02rem" }}>{msg}</p>

        <div className="mt2" style={{ display: "flex", flexDirection: "column", gap: 11 }}>
          <button className="btn" style={{ background: course.tint }} onClick={startQuiz}>
            Try again (questions reshuffle)
          </button>
          <button className="btn btn-ghost" onClick={() => setView("lesson")}>Re-read the lesson</button>
          <button className="btn btn-ghost" onClick={onBack}>Back to topics</button>
        </div>
      </div>
    </div>
  );
}
