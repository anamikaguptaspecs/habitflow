import { useState, useEffect } from "react";

// ---------- Habit library with science-backed insights ----------
const LIBRARY = [
  {
    id: "water",
    name: "Drink 2L of water",
    emoji: "💧",
    why: "Your brain is ~75% water. Even 1–2% dehydration measurably reduces focus, mood, and short-term memory.",
    longTerm:
      "Better kidney health, clearer skin, fewer headaches, improved digestion, and sustained energy without caffeine spikes. Chronic mild dehydration is linked to kidney stones and reduced cognitive performance over years.",
  },
  {
    id: "exercise",
    name: "Exercise 30 minutes",
    emoji: "🏃",
    why: "Exercise triggers BDNF — a protein that acts like fertilizer for brain cells — and releases endorphins that lift mood within 20 minutes.",
    longTerm:
      "Regular exercisers have 30–40% lower risk of heart disease, type-2 diabetes, and depression. It's the single strongest predictor of healthy aging — adding an estimated 3–7 quality years to life.",
  },
  {
    id: "meditate",
    name: "Meditate 10 minutes",
    emoji: "🧘",
    why: "Ten minutes of focused breathing lowers cortisol (the stress hormone) and activates the prefrontal cortex — your decision-making center.",
    longTerm:
      "Eight weeks of consistent practice physically thickens grey matter in areas tied to attention and emotional regulation, while shrinking the amygdala's reactivity. Long-term meditators show slower age-related cognitive decline.",
  },
  {
    id: "read",
    name: "Read 20 pages",
    emoji: "📚",
    why: "Deep reading builds sustained attention — a muscle that scrolling actively weakens. 20 pages a day is ~30 books a year.",
    longTerm:
      "Lifelong readers show 32% slower memory decline in old age. Reading also compounds knowledge: a decade of 20 pages daily makes you meaningfully more expert than almost anyone around you.",
  },
  {
    id: "sleep",
    name: "Sleep before 11 PM",
    emoji: "😴",
    why: "Your deepest, most restorative sleep happens in the first half of the night. Sleeping late cuts it short even if total hours are equal.",
    longTerm:
      "Consistent 7–8 hour sleep lowers risk of obesity, Alzheimer's, and heart disease. Sleep is when your brain clears metabolic waste and consolidates memory — no supplement replaces it.",
  },
  {
    id: "walk",
    name: "Walk 8,000 steps",
    emoji: "🚶",
    why: "Walking after meals blunts blood-sugar spikes by up to 30%, and walking meetings measurably improve creative thinking.",
    longTerm:
      "Studies of 47,000+ adults show 8,000 daily steps cuts all-cause mortality risk roughly in half versus 4,000. It also protects joints, bone density, and mental health as you age.",
  },
  {
    id: "journal",
    name: "Journal 5 minutes",
    emoji: "✍️",
    why: "Writing thoughts down offloads mental loops, reducing rumination. Naming an emotion reduces its intensity — psychologists call it 'affect labeling'.",
    longTerm:
      "Regular journaling is linked to lower anxiety, faster recovery from stressful events, and clearer long-term decision-making because you build a record of what actually worked.",
  },
  {
    id: "nophone",
    name: "No phone for first 30 min",
    emoji: "📵",
    why: "Checking your phone on waking floods a groggy brain with other people's priorities and dopamine hits before you've set your own.",
    longTerm:
      "Protecting your first 30 minutes builds intentionality that compounds: better focus at work, lower baseline anxiety, and mornings that belong to you instead of your inbox.",
  },
];

const STORAGE_KEY = "habitflow-data-v1";

const todayKey = () => new Date().toISOString().slice(0, 10);
const dayKey = (offset) => {
  const d = new Date();
  d.setDate(d.getDate() - offset);
  return d.toISOString().slice(0, 10);
};

function loadHabits() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHabits(habits) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  } catch (e) {
    console.error("Save failed", e);
  }
}

function calcStreak(doneDates) {
  let streak = 0;
  for (let i = 0; ; i++) {
    const k = dayKey(i);
    if (doneDates[k]) streak++;
    else if (i === 0) continue;
    else break;
  }
  return streak;
}

export default function App() {
  const [habits, setHabits] = useState(() => loadHabits());
  const [showLibrary, setShowLibrary] = useState(false);
  const [customName, setCustomName] = useState("");
  const [openInsight, setOpenInsight] = useState(null);

  useEffect(() => {
    saveHabits(habits);
  }, [habits]);

  const addFromLibrary = (item) => {
    if (habits.some((h) => h.id === item.id)) return;
    setHabits((prev) => [...prev, { ...item, done: {} }]);
  };

  const addCustom = () => {
    const name = customName.trim();
    if (!name) return;
    setHabits((prev) => [
      ...prev,
      {
        id: "custom-" + Date.now(),
        name,
        emoji: "⭐",
        why: "You chose this habit — which means you already sense it matters. Consistency beats intensity: showing up daily rewires identity ('I'm the kind of person who does this').",
        longTerm:
          "Any habit kept for 90+ days becomes largely automatic, freeing willpower for harder things. Small daily actions compound — 1% better every day is ~37x better in a year.",
        done: {},
      },
    ]);
    setCustomName("");
  };

  const toggleToday = (id) => {
    const t = todayKey();
    setHabits((prev) =>
      prev.map((h) =>
        h.id === id ? { ...h, done: { ...h.done, [t]: !h.done[t] } } : h
      )
    );
  };

  const removeHabit = (id) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
    if (openInsight === id) setOpenInsight(null);
  };

  const doneToday = habits.filter((h) => h.done[todayKey()]).length;
  const inLibrary = LIBRARY.filter((l) => !habits.some((h) => h.id === l.id));
  const S = styles;

  return (
    <div style={S.page}>
      {/* Header */}
      <header style={S.header}>
        <div>
          <p style={S.eyebrow}>
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
          <h1 style={S.h1}>HabitFlow</h1>
        </div>
        <div style={S.scorePill}>
          <span style={S.scoreBig}>{doneToday}</span>
          <span style={S.scoreSmall}>/ {habits.length || 0} today</span>
        </div>
      </header>

      {/* Habit list */}
      <main style={S.main}>
        {habits.length === 0 && (
          <div style={S.empty}>
            <p style={{ fontSize: 40, margin: 0 }}>🌱</p>
            <p
              style={{
                margin: "8px 0 4px",
                fontWeight: 600,
                color: "#233A2C",
              }}
            >
              No habits yet
            </p>
            <p style={{ margin: 0, color: "#5C6B5E", fontSize: 14 }}>
              Add one from the library below to start your first streak.
            </p>
          </div>
        )}

        {habits.map((h) => {
          const t = todayKey();
          const isDone = !!h.done[t];
          const streak = calcStreak(h.done);
          const open = openInsight === h.id;
          return (
            <div
              key={h.id}
              style={{
                ...S.card,
                borderColor: isDone ? "#2F6B4F" : "#DCE3DC",
              }}
            >
              <div style={S.cardRow}>
                <button
                  onClick={() => toggleToday(h.id)}
                  aria-label={isDone ? "Mark not done" : "Mark done"}
                  style={{
                    ...S.check,
                    background: isDone ? "#2F6B4F" : "#FFFFFF",
                    borderColor: isDone ? "#2F6B4F" : "#B8C4B8",
                    color: isDone ? "#fff" : "transparent",
                  }}
                >
                  ✓
                </button>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      ...S.habitName,
                      textDecoration: isDone ? "line-through" : "none",
                      opacity: isDone ? 0.6 : 1,
                    }}
                  >
                    {h.emoji} {h.name}
                  </p>
                  <div style={S.vine}>
                    {[6, 5, 4, 3, 2, 1, 0].map((off) => (
                      <span
                        key={off}
                        title={dayKey(off)}
                        style={{
                          ...S.leaf,
                          background: h.done[dayKey(off)]
                            ? "#4C9A6E"
                            : "#E4EAE4",
                        }}
                      />
                    ))}
                    <span style={S.streakText}>
                      {streak > 0
                        ? `🔥 ${streak}-day streak`
                        : "start today"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setOpenInsight(open ? null : h.id)}
                  style={S.whyBtn}
                >
                  {open ? "Hide" : "Why?"}
                </button>
                <button
                  onClick={() => removeHabit(h.id)}
                  style={S.deleteBtn}
                  aria-label="Remove habit"
                >
                  ×
                </button>
              </div>

              {open && (
                <div style={S.insight}>
                  <p style={S.insightLabel}>Why it works</p>
                  <p style={S.insightText}>{h.why}</p>
                  <p style={S.insightLabel}>Long-term payoff</p>
                  <p style={{ ...S.insightText, marginBottom: 0 }}>
                    {h.longTerm}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </main>

      {/* Add habits */}
      <section style={S.addSection}>
        <button
          onClick={() => setShowLibrary(!showLibrary)}
          style={S.libToggle}
        >
          {showLibrary ? "Close library" : "+ Add a habit"}
        </button>

        {showLibrary && (
          <div style={S.library}>
            {inLibrary.map((item) => (
              <button
                key={item.id}
                onClick={() => addFromLibrary(item)}
                style={S.libItem}
              >
                <span>
                  {item.emoji} {item.name}
                </span>
                <span style={{ color: "#2F6B4F", fontWeight: 700 }}>+</span>
              </button>
            ))}
            {inLibrary.length === 0 && (
              <p
                style={{ color: "#5C6B5E", fontSize: 14, margin: "4px 0" }}
              >
                Library habits all added — create your own below.
              </p>
            )}
            <div style={S.customRow}>
              <input
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCustom()}
                placeholder="Custom habit, e.g. Practice guitar"
                style={S.input}
              />
              <button onClick={addCustom} style={S.addBtn}>
                Add
              </button>
            </div>
          </div>
        )}
      </section>

      <footer style={S.footer}>
        Your habits are saved on this device. Come back tomorrow and keep the
        streak alive.
      </footer>
    </div>
  );
}

// ---------- styles ----------
const display =
  "'Iowan Old Style', 'Palatino Linotype', Palatino, Georgia, serif";
const body = "-apple-system, 'Segoe UI', system-ui, sans-serif";

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #F2F5F1 0%, #E9EFE8 100%)",
    fontFamily: body,
    padding: "24px 16px 48px",
    maxWidth: 640,
    margin: "0 auto",
    boxSizing: "border-box",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 20,
  },
  eyebrow: {
    margin: 0,
    fontSize: 12,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#5C6B5E",
  },
  h1: {
    margin: "2px 0 0",
    fontFamily: display,
    fontSize: 34,
    fontWeight: 700,
    color: "#1E3527",
    letterSpacing: "-0.01em",
  },
  scorePill: {
    background: "#1E3527",
    color: "#F2F5F1",
    borderRadius: 999,
    padding: "8px 16px",
    display: "flex",
    alignItems: "baseline",
    gap: 4,
  },
  scoreBig: { fontSize: 22, fontWeight: 700, fontFamily: display },
  scoreSmall: { fontSize: 12, opacity: 0.8 },
  main: { display: "flex", flexDirection: "column", gap: 12 },
  empty: {
    background: "#fff",
    border: "1px dashed #B8C4B8",
    borderRadius: 16,
    padding: "28px 20px",
    textAlign: "center",
  },
  card: {
    background: "#FFFFFF",
    border: "1.5px solid #DCE3DC",
    borderRadius: 16,
    padding: "14px 14px 12px",
    transition: "border-color 0.2s",
  },
  cardRow: { display: "flex", alignItems: "flex-start", gap: 12 },
  check: {
    width: 32,
    height: 32,
    borderRadius: 10,
    border: "2px solid",
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
    flexShrink: 0,
    marginTop: 2,
    transition: "all 0.15s",
  },
  habitName: {
    margin: "2px 0 6px",
    fontSize: 16,
    fontWeight: 600,
    color: "#233A2C",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  vine: { display: "flex", alignItems: "center", gap: 5 },
  leaf: {
    width: 12,
    height: 12,
    borderRadius: "50% 50% 50% 2px",
    display: "inline-block",
    transform: "rotate(45deg)",
  },
  streakText: { fontSize: 12, color: "#5C6B5E", marginLeft: 6 },
  whyBtn: {
    background: "#EAF1EA",
    border: "none",
    borderRadius: 999,
    padding: "6px 12px",
    fontSize: 13,
    fontWeight: 600,
    color: "#2F6B4F",
    cursor: "pointer",
    flexShrink: 0,
  },
  deleteBtn: {
    background: "none",
    border: "none",
    fontSize: 20,
    color: "#A8B4A8",
    cursor: "pointer",
    padding: "0 4px",
    flexShrink: 0,
    lineHeight: 1,
    marginTop: 4,
  },
  insight: {
    marginTop: 12,
    background: "#F6F9F5",
    borderLeft: "3px solid #4C9A6E",
    borderRadius: "0 12px 12px 0",
    padding: "12px 14px",
  },
  insightLabel: {
    margin: "0 0 4px",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.07em",
    textTransform: "uppercase",
    color: "#2F6B4F",
  },
  insightText: {
    margin: "0 0 12px",
    fontSize: 14,
    lineHeight: 1.55,
    color: "#3A473C",
  },
  addSection: { marginTop: 20 },
  libToggle: {
    width: "100%",
    background: "#1E3527",
    color: "#F2F5F1",
    border: "none",
    borderRadius: 14,
    padding: "13px",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
  },
  library: {
    marginTop: 12,
    background: "#fff",
    border: "1.5px solid #DCE3DC",
    borderRadius: 16,
    padding: 12,
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  libItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#F6F9F5",
    border: "1px solid #E4EAE4",
    borderRadius: 12,
    padding: "10px 14px",
    fontSize: 14,
    fontWeight: 500,
    color: "#233A2C",
    cursor: "pointer",
    textAlign: "left",
  },
  customRow: { display: "flex", gap: 8, marginTop: 4 },
  input: {
    flex: 1,
    border: "1.5px solid #DCE3DC",
    borderRadius: 12,
    padding: "10px 12px",
    fontSize: 14,
    outline: "none",
    fontFamily: body,
  },
  addBtn: {
    background: "#2F6B4F",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    padding: "10px 18px",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },
  footer: {
    textAlign: "center",
    fontSize: 12,
    color: "#7A877C",
    marginTop: 28,
  },
};
