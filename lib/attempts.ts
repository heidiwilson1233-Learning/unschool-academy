// Shared client-side helpers for the quiz players.
// Pure functions + browser API guards — no JSX, safe to import from any "use client" module.
export function speakJapanese(text: string) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "ja-JP";
  u.rate = 0.85;
  window.speechSynthesis.speak(u);
}

export function recordAttempt(entry: { kind: string; topic?: string; score: number; total: number; at: string }) {
  try {
    const key = "ua-attempts";
    const prev = JSON.parse(localStorage.getItem(key) ?? "[]");
    prev.push(entry);
    localStorage.setItem(key, JSON.stringify(prev.slice(-50)));
  } catch {
    /* storage unavailable — session simply isn't saved */
  }
}
