// Notification modal logic

const messageEl = document.getElementById("message");
const snoozeBtn = document.getElementById("snooze-btn");
const dismissBtn = document.getElementById("dismiss-btn");

// Extract reminder ID from URL
const params = new URLSearchParams(window.location.search);
const reminderId = params.get("id");

// ─── Play notification sound using Web Audio API ────────────────────
function playNotificationSound() {
  try {
    const ctx = new AudioContext();

    // Pleasant two-tone chime
    const notes = [
      { freq: 587.33, start: 0, dur: 0.2 },    // D5
      { freq: 880, start: 0.25, dur: 0.2 },     // A5
      { freq: 1046.5, start: 0.5, dur: 0.35 },  // C6
    ];

    notes.forEach(({ freq, start, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.value = freq;

      gain.gain.setValueAtTime(0, ctx.currentTime + start);
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + start + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + dur + 0.05);
    });

    // Repeat the chime after a pause
    setTimeout(() => {
      try {
        const ctx2 = new AudioContext();
        notes.forEach(({ freq, start, dur }) => {
          const osc = ctx2.createOscillator();
          const gain = ctx2.createGain();
          osc.type = "sine";
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0, ctx2.currentTime + start);
          gain.gain.linearRampToValueAtTime(0.25, ctx2.currentTime + start + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx2.currentTime + start + dur);
          osc.connect(gain);
          gain.connect(ctx2.destination);
          osc.start(ctx2.currentTime + start);
          osc.stop(ctx2.currentTime + start + dur + 0.05);
        });
      } catch (e) { /* ignore */ }
    }, 1200);
  } catch (e) {
    console.warn("Could not play notification sound:", e);
  }
}

// ─── Load reminder data ─────────────────────────────────────────────
async function loadReminder() {
  if (!reminderId) {
    messageEl.textContent = "Reminder not found.";
    return;
  }

  try {
    const reminder = await chrome.runtime.sendMessage({
      action: "getReminder",
      id: reminderId,
    });

    if (reminder) {
      messageEl.innerHTML = reminder.richText || reminder.plainText;
    } else {
      messageEl.textContent = "This reminder has been dismissed.";
      snoozeBtn.disabled = true;
    }
  } catch (err) {
    messageEl.textContent = "Could not load reminder.";
  }

  // Play sound after loading
  playNotificationSound();
}

// ─── Snooze (10 min) ────────────────────────────────────────────────
snoozeBtn.addEventListener("click", async () => {
  snoozeBtn.disabled = true;
  snoozeBtn.textContent = "Snoozing...";

  try {
    await chrome.runtime.sendMessage({
      action: "snoozeReminder",
      id: reminderId,
    });
  } catch (e) { /* ignore */ }

  window.close();
});

// ─── Dismiss ────────────────────────────────────────────────────────
dismissBtn.addEventListener("click", async () => {
  dismissBtn.disabled = true;
  dismissBtn.textContent = "Dismissing...";

  try {
    await chrome.runtime.sendMessage({
      action: "dismissReminder",
      id: reminderId,
    });
  } catch (e) { /* ignore */ }

  window.close();
});

// Load on open
loadReminder();
