// Background service worker for Reminder feature

const ALARM_PREFIX = "reminder_";
const WATCHDOG_ALARM = "reminder_watchdog";

// ─── Startup: re-register alarms for all pending reminders ──────────
// Service workers can restart at any time; ensure alarms exist.
async function reregisterAlarms() {
  const data = await chrome.storage.local.get("reminders");
  const reminders = data.reminders || {};
  const existingAlarms = await chrome.alarms.getAll();
  const existingNames = new Set(existingAlarms.map((a) => a.name));

  for (const [id, reminder] of Object.entries(reminders)) {
    const alarmName = `${ALARM_PREFIX}${id}`;
    if (existingNames.has(alarmName)) continue; // alarm already exists

    const remaining = reminder.firesAt - Date.now();
    if (remaining <= 0) {
      // Already overdue — fire immediately
      fireReminder(id, reminder);
    } else {
      chrome.alarms.create(alarmName, {
        delayInMinutes: Math.max(remaining / 60000, 0.5),
      });
    }
  }
}

chrome.runtime.onInstalled.addListener(() => {
  reregisterAlarms();
  // Start the watchdog (fires every 1 minute)
  chrome.alarms.create(WATCHDOG_ALARM, { periodInMinutes: 1 });
});

chrome.runtime.onStartup.addListener(() => {
  reregisterAlarms();
  chrome.alarms.create(WATCHDOG_ALARM, { periodInMinutes: 1 });
});

// ─── Listen for alarm events ────────────────────────────────────────
chrome.alarms.onAlarm.addListener(async (alarm) => {
  // Watchdog: check for any overdue reminders that were missed
  if (alarm.name === WATCHDOG_ALARM) {
    const data = await chrome.storage.local.get("reminders");
    const reminders = data.reminders || {};
    const now = Date.now();
    for (const [id, reminder] of Object.entries(reminders)) {
      if (reminder.firesAt <= now) {
        fireReminder(id, reminder);
      }
    }
    return;
  }

  if (!alarm.name.startsWith(ALARM_PREFIX)) return;

  const reminderId = alarm.name.replace(ALARM_PREFIX, "");
  const data = await chrome.storage.local.get("reminders");
  const reminders = data.reminders || {};
  const reminder = reminders[reminderId];

  if (!reminder) return;
  fireReminder(reminderId, reminder);
});

// ─── Fire a reminder notification ───────────────────────────────────
function fireReminder(reminderId, reminder) {
  // Open notification modal window
  chrome.windows.create({
    url: `notification.html?id=${reminderId}`,
    type: "popup",
    width: 480,
    height: 400,
    focused: true,
  });

  // Also fire a system notification as a fallback
  chrome.notifications.create(`notif_${reminderId}`, {
    type: "basic",
    iconUrl: "logo.png",
    title: "⏰ Reminder",
    message: reminder.plainText || "You have a reminder!",
    priority: 2,
    requireInteraction: true,
  });
}

// Listen for messages from popup and notification pages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "createReminder") {
    handleCreateReminder(message.data).then(sendResponse);
    return true; // async response
  }

  if (message.action === "deleteReminder") {
    handleDeleteReminder(message.id).then(sendResponse);
    return true;
  }

  if (message.action === "snoozeReminder") {
    handleSnoozeReminder(message.id).then(sendResponse);
    return true;
  }

  if (message.action === "dismissReminder") {
    handleDismissReminder(message.id).then(sendResponse);
    return true;
  }

  if (message.action === "getReminders") {
    chrome.storage.local.get("reminders").then((data) => {
      sendResponse(data.reminders || {});
    });
    return true;
  }

  if (message.action === "getReminder") {
    chrome.storage.local.get("reminders").then((data) => {
      const reminders = data.reminders || {};
      sendResponse(reminders[message.id] || null);
    });
    return true;
  }
});

async function handleCreateReminder(data) {
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const delayMinutes = parseFloat(data.delayMinutes);

  const reminder = {
    id,
    richText: data.richText,
    plainText: data.plainText,
    delayMinutes,
    createdAt: Date.now(),
    firesAt: Date.now() + delayMinutes * 60 * 1000,
    label: data.label,
  };

  // Save to storage
  const stored = await chrome.storage.local.get("reminders");
  const reminders = stored.reminders || {};
  reminders[id] = reminder;
  await chrome.storage.local.set({ reminders });

  // Create alarm
  chrome.alarms.create(`${ALARM_PREFIX}${id}`, {
    delayInMinutes: delayMinutes,
  });

  return { success: true, id };
}

async function handleDeleteReminder(id) {
  // Clear alarm
  await chrome.alarms.clear(`${ALARM_PREFIX}${id}`);

  // Remove from storage
  const stored = await chrome.storage.local.get("reminders");
  const reminders = stored.reminders || {};
  delete reminders[id];
  await chrome.storage.local.set({ reminders });

  // Clear any system notification
  chrome.notifications.clear(`notif_${id}`);

  return { success: true };
}

async function handleSnoozeReminder(id) {
  const stored = await chrome.storage.local.get("reminders");
  const reminders = stored.reminders || {};
  const reminder = reminders[id];

  if (!reminder) return { success: false };

  // Update fire time (+10 min)
  reminder.firesAt = Date.now() + 10 * 60 * 1000;
  reminder.snoozed = true;
  reminders[id] = reminder;
  await chrome.storage.local.set({ reminders });

  // Create new alarm for 10 min
  chrome.alarms.create(`${ALARM_PREFIX}${id}`, {
    delayInMinutes: 10,
  });

  // Clear system notification
  chrome.notifications.clear(`notif_${id}`);

  return { success: true };
}

async function handleDismissReminder(id) {
  return handleDeleteReminder(id);
}
