let audioContext = null;
let lastPlayedAt = 0;

const MIN_INTERVAL_MS = 1200;

function getAudioContext() {
  if (typeof window === "undefined") return null;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  if (!audioContext) audioContext = new Ctx();
  return audioContext;
}

export function playNotificationSound() {
  try {
    const nowMs = Date.now();
    if (nowMs - lastPlayedAt < MIN_INTERVAL_MS) return;
    lastPlayedAt = nowMs;

    const ctx = getAudioContext();
    if (!ctx) return;

    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    const base = ctx.currentTime + 0.01;

    const playTone = (start, frequency, peak = 0.12, duration = 0.17) => {
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.linearRampToValueAtTime(peak, start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      gain.connect(ctx.destination);

      const osc = ctx.createOscillator();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(frequency, start);
      osc.frequency.exponentialRampToValueAtTime(
        frequency * 0.94,
        start + duration,
      );
      osc.connect(gain);
      osc.start(start);
      osc.stop(start + duration);
    };

    // Sonido de notificación corto y más presente (dos tonos).
    playTone(base, 980, 0.13, 0.16);
    playTone(base + 0.115, 1240, 0.11, 0.18);
  } catch {
    // sonido opcional: si falla no interrumpe el flujo
  }
}
