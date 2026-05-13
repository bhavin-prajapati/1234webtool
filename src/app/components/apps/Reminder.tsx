'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';

// ─── Types ──────────────────────────────────────────────────────────
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

// ─── Content script bridge helper ────────────────────────────────────
// The Chrome extension injects a content script into this page.
// We communicate with it via same-window postMessage — the content script
// then forwards to chrome.runtime.sendMessage (background service worker).
// This works even inside the popup iframe and ensures chrome.alarms get set.
let msgCounter = 0;
const pendingMessages: Record<string, { resolve: (v: unknown) => void; reject: (e: Error) => void }> = {};
let contentScriptReady = false;

function sendToExtension(payload: Record<string, unknown>): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const id = `msg_${++msgCounter}_${Date.now()}`;
    pendingMessages[id] = { resolve, reject };

    // Timeout after 3s
    setTimeout(() => {
      if (pendingMessages[id]) {
        delete pendingMessages[id];
        reject(new Error('Extension bridge timeout'));
      }
    }, 3000);

    try {
      // Post to same window — the injected content script intercepts this
      window.postMessage({ type: 'REMINDER_ACTION', id, payload }, '*');
    } catch {
      delete pendingMessages[id];
      reject(new Error('Cannot reach extension'));
    }
  });
}

// Listen for responses from the content script
if (typeof window !== 'undefined') {
  window.addEventListener('message', (event) => {
    if (!event.data) return;

    // Content script ready signal
    if (event.data.type === 'REMINDER_BRIDGE_READY') {
      contentScriptReady = true;
      return;
    }

    if (event.data.type !== 'REMINDER_RESPONSE') return;
    const { id, response, error } = event.data;
    const pending = pendingMessages[id];
    if (!pending) return;
    delete pendingMessages[id];
    if (error) pending.reject(new Error(error));
    else pending.resolve(response);
  });
}

// ─── Local storage helpers (fallback when not in extension) ─────────
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

// ─── Sound ──────────────────────────────────────────────────────────
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
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
    // Second chime
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
  } catch {
    console.warn('Could not play notification sound');
  }
}

// ─── Time options ───────────────────────────────────────────────────
const TIME_OPTIONS = [
  { value: 1, label: '1 minute' },
  { value: 5, label: '5 minutes' },
  { value: 10, label: '10 minutes' },
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 60, label: '1 hour' },
  { value: 120, label: '2 hours' },
  { value: 240, label: '4 hours' },
  { value: 480, label: '8 hours' },
  { value: 720, label: '12 hours' },
  { value: 1440, label: '1 day' },
  { value: 2880, label: '2 days' },
  { value: 4320, label: '3 days' },
  { value: 10080, label: '1 week' },
];

// ─── Component ──────────────────────────────────────────────────────
export default function Reminder() {
  const editorRef = useRef<HTMLDivElement>(null);
  const [delayMinutes, setDelayMinutes] = useState(15);
  const [reminders, setReminders] = useState<ReminderItem[]>([]);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [bridgeStatus, setBridgeStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [creating, setCreating] = useState(false);

  // Detect and verify the content script bridge on mount
  useEffect(() => {
    // If the content script already signalled ready, try immediately
    if (contentScriptReady) {
      sendToExtension({ action: 'getReminders' })
        .then(() => setBridgeStatus('connected'))
        .catch(() => setBridgeStatus('disconnected'));
      return;
    }

    // Otherwise wait briefly for the content script to load, then ping
    const timer = setTimeout(() => {
      sendToExtension({ action: 'getReminders' })
        .then(() => setBridgeStatus('connected'))
        .catch(() => setBridgeStatus('disconnected'));
    }, 500);

    // Also listen for late BRIDGE_READY signal
    const onReady = (e: MessageEvent) => {
      if (e.data?.type === 'REMINDER_BRIDGE_READY') {
        clearTimeout(timer);
        sendToExtension({ action: 'getReminders' })
          .then(() => setBridgeStatus('connected'))
          .catch(() => setBridgeStatus('disconnected'));
        window.removeEventListener('message', onReady);
      }
    };
    window.addEventListener('message', onReady);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('message', onReady);
    };
  }, []);

  const isConnected = bridgeStatus === 'connected';

  // ─── Load reminders ───────────────────────────────────────────────
  const loadReminders = useCallback(async () => {
    let items: Record<string, ReminderItem> = {};

    if (isConnected) {
      try {
        items = (await sendToExtension({ action: 'getReminders' })) as Record<string, ReminderItem>;
      } catch {
        items = getLocalReminders();
      }
    } else {
      items = getLocalReminders();
    }

    const sorted = Object.values(items).sort((a, b) => a.firesAt - b.firesAt);
    setReminders(sorted);
    return items;
  }, [isConnected]);

  // Initial load + polling
  useEffect(() => {
    loadReminders();
    const interval = setInterval(loadReminders, 15000);
    return () => clearInterval(interval);
  }, [loadReminders]);


  // ─── Create reminder ──────────────────────────────────────────────
  const handleCreate = async () => {
    const editor = editorRef.current;
    if (!editor) return;

    const richText = editor.innerHTML.trim();
    const plainText = editor.innerText.trim();

    if (!plainText) {
      showStatus('Please enter a reminder message.', 'error');
      return;
    }

    const label = TIME_OPTIONS.find((o) => o.value === delayMinutes)?.label || `${delayMinutes} min`;

    setCreating(true);

    let savedToExtension = false;
    if (isConnected) {
      try {
        const resp = await sendToExtension({
          action: 'createReminder',
          data: { richText, plainText, delayMinutes, label },
        }) as { success?: boolean };
        savedToExtension = !!resp?.success;
      } catch {
        // Extension bridge failed
      }
    }

    // Save locally as fallback (or always for standalone use)
    if (!savedToExtension) {
      const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
      const reminder: ReminderItem = {
        id,
        richText,
        plainText,
        delayMinutes,
        createdAt: Date.now(),
        firesAt: Date.now() + delayMinutes * 60 * 1000,
        label,
      };
      const items = getLocalReminders();
      items[id] = reminder;
      setLocalReminders(items);
    }

    editor.innerHTML = '';
    const suffix = savedToExtension
      ? ' (background alarm set ✓)'
      : ' (local only — keep extension open)';
    showStatus(`Reminder set for ${label}${suffix}`, 'success');
    setCreating(false);
    loadReminders();
  };

  // ─── Delete reminder ──────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    if (isConnected) {
      try {
        await sendToExtension({ action: 'deleteReminder', id });
      } catch { /* ignore */ }
    }
    const items = getLocalReminders();
    delete items[id];
    setLocalReminders(items);
    loadReminders();
  };

  // ─── Snooze (10 min) ─────────────────────────────────────────────
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const handleSnooze = async (id: string) => {
    if (isConnected) {
      try {
        await sendToExtension({ action: 'snoozeReminder', id });
      } catch { /* ignore */ }
    }
    const items = getLocalReminders();
    if (items[id]) {
      items[id].firesAt = Date.now() + 10 * 60 * 1000;
      items[id].snoozed = true;
      setLocalReminders(items);
    }
    loadReminders();
  };

  // ─── Toolbar command ──────────────────────────────────────────────
  const execCmd = (cmd: string, value?: string) => {
    document.execCommand(cmd, false, value || undefined);
    editorRef.current?.focus();
  };

  // ─── Status ───────────────────────────────────────────────────────
  const showStatus = (text: string, type: 'success' | 'error') => {
    setStatusMsg({ text, type });
    setTimeout(() => setStatusMsg(null), 3000);
  };

  // ─── Format remaining time ────────────────────────────────────────
  const formatRemaining = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const days = Math.floor(totalSec / 86400);
    const hours = Math.floor((totalSec % 86400) / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const parts: string[] = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (mins > 0) parts.push(`${mins}m`);
    return parts.length > 0 ? parts.join(' ') : '< 1m';
  };

  return (
    <div className="min-h-screen font-[Arial,sans-serif] flex flex-col items-center px-4 py-6">

      <div className="w-full max-w-lg">
        {/* ─── Create Form ─────────────────────────────────────── */}
        <div className="bg-white/95 backdrop-blur rounded-2xl p-5 shadow-lg mb-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">⏰ Set a Reminder</h2>
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                bridgeStatus === 'connected'
                  ? 'bg-green-100 text-green-700'
                  : bridgeStatus === 'checking'
                    ? 'bg-gray-100 text-gray-500'
                    : 'bg-amber-100 text-amber-700'
              }`}
              title={
                bridgeStatus === 'connected'
                  ? 'Connected to extension — reminders fire in the background'
                  : 'Not connected — reminders only fire while this page is open'
              }
            >
              {bridgeStatus === 'connected'
                ? '● Background active'
                : bridgeStatus === 'checking'
                  ? '○ Connecting…'
                  : '○ Local only'}
            </span>
          </div>

          <label className="block text-xs font-semibold text-gray-500 mb-1">Message</label>

          {/* Toolbar */}
          <div className="flex items-center gap-0.5 px-2 py-1.5 bg-gray-100 border border-gray-200 rounded-t-lg">
            <ToolbarBtn label={<b>B</b>} title="Bold" onClick={() => execCmd('bold')} />
            <ToolbarBtn label={<i>I</i>} title="Italic" onClick={() => execCmd('italic')} />
            <ToolbarBtn label={<u>U</u>} title="Underline" onClick={() => execCmd('underline')} />
            <ToolbarBtn label={<s>S</s>} title="Strikethrough" onClick={() => execCmd('strikeThrough')} />
            <ToolbarSep />
            <ToolbarBtn label="• List" title="Bullet List" onClick={() => execCmd('insertUnorderedList')} />
            <ToolbarBtn label="1. List" title="Numbered List" onClick={() => execCmd('insertOrderedList')} />
            <ToolbarSep />
            <ToolbarBtn
              label="A"
              title="Red"
              onClick={() => execCmd('foreColor', '#e74c3c')}
              style={{ color: '#e74c3c', fontWeight: 700 }}
            />
            <ToolbarBtn
              label="A"
              title="Blue"
              onClick={() => execCmd('foreColor', '#2980b9')}
              style={{ color: '#2980b9', fontWeight: 700 }}
            />
            <ToolbarBtn
              label="A"
              title="Green"
              onClick={() => execCmd('foreColor', '#27ae60')}
              style={{ color: '#27ae60', fontWeight: 700 }}
            />
            <ToolbarBtn label="✕" title="Clear Formatting" onClick={() => execCmd('removeFormat')} />
          </div>

          {/* Editor */}
          <div
            ref={editorRef}
            contentEditable
            className="min-h-[80px] max-h-[180px] overflow-y-auto p-3 border border-gray-200 border-t-0 rounded-b-lg text-sm text-black leading-relaxed outline-none focus:border-purple-500 bg-white"
            style={{ wordBreak: 'break-word' }}
            data-placeholder="Type your reminder message..."
            onFocus={(e) => {
              if (e.currentTarget.textContent === '') e.currentTarget.classList.add('editor-focused');
            }}
            onBlur={(e) => e.currentTarget.classList.remove('editor-focused')}
          />

          <label className="block text-xs font-semibold text-gray-500 mt-3 mb-1">Remind me in</label>
          <select
            value={delayMinutes}
            onChange={(e) => setDelayMinutes(Number(e.target.value))}
            className="w-full py-2.5 px-3 border border-gray-200 rounded-lg text-sm text-black bg-white outline-none focus:border-purple-500 cursor-pointer"
          >
            {TIME_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <button
            onClick={handleCreate}
            disabled={creating}
            className="w-full mt-4 py-3 rounded-lg text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 active:bg-purple-800 transition-colors cursor-pointer border-none disabled:opacity-60"
          >
            {creating ? 'Setting...' : 'Set Reminder'}
          </button>

          {statusMsg && (
            <div
              className={`mt-3 py-2 px-3 rounded-lg text-xs text-center ${
                statusMsg.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
              }`}
            >
              {statusMsg.text}
            </div>
          )}
        </div>

        {/* ─── Active Reminders ────────────────────────────────── */}
        <div className="bg-white/95 backdrop-blur rounded-2xl p-5 shadow-lg">
          <h2 className="text-base font-bold text-gray-800 mb-3">Active Reminders</h2>

          {reminders.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-5">No active reminders.</p>
          ) : (
            <div className="space-y-2">
              {reminders.map((r) => {
                const remaining = r.firesAt - Date.now();
                const timeStr = remaining > 0 ? formatRemaining(remaining) : 'Firing now...';
                return (
                  <div
                    key={r.id}
                    className="flex items-start gap-3 p-3 border border-gray-100 rounded-xl bg-gray-50/80 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div
                        className="text-sm leading-snug break-words text-gray-700"
                        dangerouslySetInnerHTML={{ __html: r.richText }}
                      />
                      <div className="text-[11px] text-gray-400 mt-1">
                        Fires in <strong className="text-gray-500">{timeStr}</strong>
                        <span className="mx-1">·</span>
                        {new Date(r.firesAt).toLocaleString()}
                        {r.snoozed && (
                          <span className="ml-1.5 inline-block bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded text-[10px] font-semibold">
                            Snoozed
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded p-1 transition-colors cursor-pointer border-none bg-transparent text-base"
                      title="Delete"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Inline keyframes */}
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
        [contenteditable]:empty::before {
          content: attr(data-placeholder);
          color: #b2bec3;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}

// ─── Toolbar sub-components ─────────────────────────────────────────
function ToolbarBtn({
  label,
  title,
  onClick,
  style,
}: {
  label: React.ReactNode;
  title: string;
  onClick: () => void;
  style?: React.CSSProperties;
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      className="bg-transparent border border-transparent rounded px-2 py-1 text-xs text-gray-700 hover:bg-gray-200 active:bg-gray-300 cursor-pointer transition-colors"
      style={style}
    >
      {label}
    </button>
  );
}

function ToolbarSep() {
  return <span className="w-px h-5 bg-gray-300 mx-1" />;
}
