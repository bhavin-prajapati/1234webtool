'use client';
import React, { useState, useEffect, useCallback } from 'react';

interface ReminderItem {
  id: string;
  richText: string;
  plainText: string;
  delayMinutes: number;
  createdAt: number;
  firesAt: number;
  label: string;
  snoozed?: boolean;
}

function getLocalReminders(): Record<string, ReminderItem> {
  try {
    const raw = localStorage.getItem('1234wt_reminders');
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function setLocalReminders(reminders: Record<string, ReminderItem>) {
  localStorage.setItem('1234wt_reminders', JSON.stringify(reminders));
}

function playNotificationSound() {
  try {
    const ctx = new AudioContext();
    const notes = [
      { freq: 587.33, start: 0, dur: 0.2 },
      { freq: 880, start: 0.25, dur: 0.2 },
      { freq: 1046.5, start: 0.5, dur: 0.35 },
    ];
    notes.forEach(({ freq, start, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, ctx.currentTime + start);
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + start + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + dur + 0.05);
    });
    setTimeout(() => {
      try {
        const ctx2 = new AudioContext();
        notes.forEach(({ freq, start, dur }) => {
          const osc = ctx2.createOscillator();
          const gain = ctx2.createGain();
          osc.type = 'sine';
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0, ctx2.currentTime + start);
          gain.gain.linearRampToValueAtTime(0.25, ctx2.currentTime + start + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx2.currentTime + start + dur);
          osc.connect(gain);
          gain.connect(ctx2.destination);
          osc.start(ctx2.currentTime + start);
          osc.stop(ctx2.currentTime + start + dur + 0.05);
        });
      } catch { /* ignore */ }
    }, 1200);
  } catch { /* ignore */ }
}

/**
 * Global component that checks for fired reminders on ANY page.
 * Include this in the root layout so notifications appear everywhere.
 */
export default function ReminderNotifier() {
  const [fired, setFired] = useState<ReminderItem | null>(null);

  // Poll localStorage every 3 seconds for overdue reminders
  const checkReminders = useCallback(() => {
    if (fired) return; // already showing a modal
    const now = Date.now();
    const items = getLocalReminders();
    for (const r of Object.values(items)) {
      if (r.firesAt <= now) {
        setFired(r);
        playNotificationSound();
        return;
      }
    }
  }, [fired]);

  useEffect(() => {
    checkReminders();
    const interval = setInterval(checkReminders, 3000);
    return () => clearInterval(interval);
  }, [checkReminders]);

  const handleSnooze = () => {
    if (!fired) return;
    const items = getLocalReminders();
    if (items[fired.id]) {
      items[fired.id].firesAt = Date.now() + 10 * 60 * 1000;
      items[fired.id].snoozed = true;
      setLocalReminders(items);
    }
    // Also try extension bridge
    try { window.postMessage({ type: 'REMINDER_ACTION', id: `snz_${Date.now()}`, payload: { action: 'snoozeReminder', id: fired.id } }, '*'); } catch { /* ignore */ }
    setFired(null);
  };

  const handleDismiss = () => {
    if (!fired) return;
    const items = getLocalReminders();
    delete items[fired.id];
    setLocalReminders(items);
    // Also try extension bridge
    try { window.postMessage({ type: 'REMINDER_ACTION', id: `dis_${Date.now()}`, payload: { action: 'dismissReminder', id: fired.id } }, '*'); } catch { /* ignore */ }
    setFired(null);
  };

  if (!fired) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        className="bg-white rounded-2xl shadow-2xl p-7 max-w-md w-full mx-4 text-center"
        style={{ animation: 'reminderSlideIn 0.3s ease-out' }}
      >
        <div className="text-5xl mb-2" style={{ animation: 'reminderPulse 1.5s ease-in-out infinite' }}>
          ⏰
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Reminder</h2>
        <div
          className="bg-gray-50 rounded-xl p-4 text-left text-sm leading-relaxed text-gray-700 max-h-48 overflow-y-auto mb-5 break-words"
          dangerouslySetInnerHTML={{ __html: fired.richText || fired.plainText }}
        />
        <div className="flex gap-3">
          <button
            onClick={handleSnooze}
            className="flex-1 py-3 px-4 rounded-xl font-semibold text-sm bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition-colors cursor-pointer border-none"
          >
            😴 Snooze (10 min)
          </button>
          <button
            onClick={handleDismiss}
            className="flex-1 py-3 px-4 rounded-xl font-semibold text-sm bg-purple-600 text-white hover:bg-purple-700 transition-colors cursor-pointer border-none"
          >
            ✓ Dismiss
          </button>
        </div>
      </div>
      <style>{`
        @keyframes reminderSlideIn {
          from { opacity: 0; transform: translateY(-20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes reminderPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
      `}</style>
    </div>
  );
}
