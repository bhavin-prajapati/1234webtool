// Polyfill for Node.js 25+ where localStorage exists as a global but
// getItem/setItem are not functions. This breaks Next.js dev overlay
// which checks `typeof localStorage !== 'undefined'` during SSR.
// See: https://github.com/vercel/next.js/issues/...
if (
  typeof localStorage !== 'undefined' &&
  typeof localStorage.getItem !== 'function'
) {
  const store = new Map();
  globalThis.localStorage = {
    getItem(key) {
      return store.get(key) ?? null;
    },
    setItem(key, value) {
      store.set(key, String(value));
    },
    removeItem(key) {
      store.delete(key);
    },
    clear() {
      store.clear();
    },
    get length() {
      return store.size;
    },
    key(index) {
      return [...store.keys()][index] ?? null;
    },
  };
}
