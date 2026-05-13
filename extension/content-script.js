// Content script: injected into https://storage.googleapis.com/1234webtool/* pages.
// Bridges messages between the web page and the Chrome extension background.
// Unlike the popup bridge, this runs inside the same frame as the React app,
// so it works reliably regardless of iframe/popup state.

// Track processed message IDs to avoid duplicate handling
const processed = new Set();

window.addEventListener("message", async (event) => {
  // Only accept messages from the same window (the React app)
  if (event.source !== window) return;
  if (!event.data || event.data.type !== "REMINDER_ACTION") return;

  const msgId = event.data.id;
  if (!msgId || processed.has(msgId)) return;
  processed.add(msgId);

  // Clean up old IDs periodically
  if (processed.size > 500) {
    const arr = [...processed];
    arr.splice(0, arr.length - 100);
    processed.clear();
    arr.forEach((id) => processed.add(id));
  }

  try {
    const response = await chrome.runtime.sendMessage(event.data.payload);
    window.postMessage(
      { type: "REMINDER_RESPONSE", id: msgId, response },
      "*"
    );
  } catch (err) {
    window.postMessage(
      { type: "REMINDER_RESPONSE", id: msgId, error: err.message },
      "*"
    );
  }
});

// Signal to the page that the content script bridge is available
window.postMessage({ type: "REMINDER_BRIDGE_READY" }, "*");
