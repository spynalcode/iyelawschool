// Each raw question is authored as { q, correct, wrong: [.,.,.] }.
// At load time we shuffle the four options. To GUARANTEE answers are spread
// evenly across A/B/C/D (no clustering on B/C), we assign each question in a
// topic a target slot using a rotating, lightly-randomised pattern so that
// across 40 questions roughly 10 fall on each of A, B, C and D.

function shuffleArray(arr, seed) {
  // deterministic-ish shuffle using a simple LCG so a given session is stable
  let s = seed;
  const rand = () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Build a balanced target-slot sequence for n questions: 0,1,2,3,0,1,2,3...
// then shuffle that sequence so the pattern is not predictable.
function balancedSlots(n, seed) {
  const slots = [];
  for (let i = 0; i < n; i++) slots.push(i % 4);
  return shuffleArray(slots, seed);
}

// Prepare a topic's questions: place the correct answer at its target slot and
// distribute the three wrong options around it. Returns array of
// { q, opts:[4], ans:index }.
export function prepareTopic(rawQuestions, seed = 12345) {
  const slots = balancedSlots(rawQuestions.length, seed);
  return rawQuestions.map((raw, i) => {
    const target = slots[i];
    const wrong = shuffleArray(raw.wrong, seed + i * 7);
    const opts = [];
    let w = 0;
    for (let pos = 0; pos < 4; pos++) {
      if (pos === target) opts.push(raw.correct);
      else opts.push(wrong[w++]);
    }
    return { q: raw.q, opts, ans: target };
  });
}

// Re-shuffle for a fresh attempt (called each time a quiz starts) while still
// keeping the balanced distribution but with a new random pattern.
export function freshAttempt(rawQuestions) {
  const seed = Math.floor(Math.random() * 1e9);
  // also shuffle the order of the questions themselves
  const order = shuffleArray(
    rawQuestions.map((_, i) => i),
    seed
  );
  const reordered = order.map((idx) => rawQuestions[idx]);
  return prepareTopic(reordered, seed + 1);
}
