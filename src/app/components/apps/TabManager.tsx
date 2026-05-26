"use client";

import React, { useCallback, useEffect, useRef, useState } from 'react';

type CurrentTab = {
  id: number;
  title: string;
  url: string;
  favIconUrl?: string;
};

type HistoryEntry = {
  id: string;
  title: string;
  url: string;
  lastVisitTime: number;
  visitCount: number;
};

type ChromeTab = {
  id: number;
  title?: string;
  url?: string;
  favIconUrl?: string;
};

type ChromeHistoryItem = {
  id: string;
  title?: string;
  url?: string;
  lastVisitTime?: number;
  visitCount?: number;
};

type ChromeApi = {
  tabs?: {
    query?: (queryInfo: { currentWindow?: boolean }, callback: (tabs: ChromeTab[]) => void) => void;
    remove?: (ids: number[], callback?: () => void) => void;
    create?: (createProperties: { url: string }) => void;
  };
  history?: {
    search?: (query: { text: string; maxResults: number; startTime: number }, callback: (results: ChromeHistoryItem[]) => void) => void;
  };
};

const formatVisitTime = (time: number) => {
  try {
    return new Date(time).toLocaleString();
  } catch {
    return 'Unknown';
  }
};

export default function TabManager() {
  const [currentTabs, setCurrentTabs] = useState<CurrentTab[]>([]);
  const [historyEntries, setHistoryEntries] = useState<HistoryEntry[]>([]);
  const [selectedCurrentTabs, setSelectedCurrentTabs] = useState<Set<number>>(new Set());
  const [selectedHistoryUrls, setSelectedHistoryUrls] = useState<Set<string>>(new Set());
  const [status, setStatus] = useState<string>('');
  const [isMounted, setIsMounted] = useState(false);
  const [hasChromeApi, setHasChromeApi] = useState(false);
  const [hasTabsPermission, setHasTabsPermission] = useState(false);
  const [hasHistoryPermission, setHasHistoryPermission] = useState(false);
  const chromeApiRef = useRef<ChromeApi | null>(null);

  useEffect(() => {
    setIsMounted(true);
    const api = (window as unknown as { chrome?: ChromeApi }).chrome ?? null;
    chromeApiRef.current = api;
    setHasChromeApi(!!api);
    setHasTabsPermission(!!api?.tabs?.query);
    setHasHistoryPermission(!!api?.history?.search);
  }, []);

  const loadCurrentTabs = useCallback(() => {
    const chromeApi = chromeApiRef.current;
    const tabsApi = chromeApi?.tabs;
    if (!hasTabsPermission || !tabsApi?.query) {
      return;
    }

    tabsApi.query({ currentWindow: true }, (tabs: ChromeTab[]) => {
      const mappedTabs = tabs.map((tab) => ({
        id: tab.id as number,
        title: tab.title || tab.url || 'New Tab',
        url: tab.url || '',
        favIconUrl: tab.favIconUrl,
      }));

      setCurrentTabs(mappedTabs);
      setSelectedCurrentTabs(new Set());
    });
  }, [hasTabsPermission]);

  const loadHistoryEntries = useCallback(() => {
    const chromeApi = chromeApiRef.current;
    if (!hasHistoryPermission || !chromeApi?.history?.search) {
      return;
    }

    chromeApi.history.search(
      { text: '', maxResults: 200, startTime: 0 },
      (results: ChromeHistoryItem[]) => {
        const filtered = results
          .filter((item) => item.url && item.url.startsWith('http'))
          .map((item) => ({
            id: item.id,
            title: item.title ?? item.url ?? '',
            url: item.url ?? '',
            lastVisitTime: item.lastVisitTime || 0,
            visitCount: item.visitCount || 0,
          }));

        setHistoryEntries(filtered);
        setSelectedHistoryUrls(new Set());
      }
    );
  }, [hasHistoryPermission]);

  useEffect(() => {
    if (isMounted && hasChromeApi) {
      loadCurrentTabs();
      loadHistoryEntries();
    }
  }, [isMounted, hasChromeApi, loadCurrentTabs, loadHistoryEntries]);

  const closeAllTabs = () => {
    const chromeApi = chromeApiRef.current;
    const tabsApi = chromeApi?.tabs;
    if (!hasTabsPermission || !tabsApi?.query || !tabsApi?.remove) {
      setStatus('Chrome tabs API unavailable. Open this app from the extension context with tabs permission.');
      return;
    }

    const { query, remove } = tabsApi;
    query({ currentWindow: true }, (tabs: ChromeTab[]) => {
      const ids = tabs
        .filter((tab) => typeof tab.id === 'number')
        .map((tab) => tab.id as number);

      if (ids.length === 0) {
        setStatus('No tabs found to close.');
        return;
      }

      remove(ids, () => {
        setStatus(`Closed ${ids.length} tab(s).`);
        loadCurrentTabs();
      });
    });
  };

  const restoreTabs = () => {
    const chromeApi = chromeApiRef.current;
    const tabsApi = chromeApi?.tabs;
    if (!hasTabsPermission || !tabsApi?.create) {
      setStatus('Chrome tabs API unavailable. Open this app from the extension context with tabs permission.');
      return;
    }

    const { create } = tabsApi;
    const selectedUrls = historyEntries
      .filter((entry) => selectedHistoryUrls.has(entry.url))
      .map((entry) => entry.url);

    const urlsToRestore = selectedUrls.length > 0
      ? selectedUrls
      : historyEntries.slice(0, 10).map((entry) => entry.url);

    if (urlsToRestore.length === 0) {
      setStatus('No history URLs available to restore.');
      return;
    }

    urlsToRestore.forEach((url) => create({ url }));
    setStatus(`Restored ${urlsToRestore.length} tab(s) from history.`);
  };

  const toggleCurrentTabSelection = (id: number) => {
    setSelectedCurrentTabs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleHistorySelection = (url: string) => {
    setSelectedHistoryUrls((prev) => {
      const next = new Set(prev);
      if (next.has(url)) {
        next.delete(url);
      } else {
        next.add(url);
      }
      return next;
    });
  };

  const selectAllCurrentTabs = () => {
    setSelectedCurrentTabs(new Set(currentTabs.map((tab) => tab.id)));
  };

  const deselectAllCurrentTabs = () => {
    setSelectedCurrentTabs(new Set());
  };

  const selectAllHistoryItems = () => {
    setSelectedHistoryUrls(new Set(historyEntries.map((entry) => entry.url)));
  };

  const deselectAllHistoryItems = () => {
    setSelectedHistoryUrls(new Set());
  };

  const showLoading = !isMounted;

  return (
    <main className="min-h-screen font-[Arial,sans-serif] flex flex-col items-center px-4">
      <div className="w-full max-w-lg pb-10 sm:px-6 lg:px-8">
        <div className="mb-2 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={closeAllTabs}
              className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              Close All Tabs
            </button>
            <button
              type="button"
              onClick={restoreTabs}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              Restore Tabs
            </button>
          </div>
        </div>

        <div className="mb-4">
            {status && (
              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 relative">
                <button
                  aria-label="Dismiss status"
                  onClick={() => setStatus('')}
                  className="absolute top-2 right-2 inline-flex h-6 w-6 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <span className="text-sm font-bold">×</span>
                </button>
                <div className="pr-8">{status}</div>
              </div>
            )}
        </div>

        {showLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 text-sm text-slate-800 shadow-sm dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200">
            Loading Chrome extension APIs...
          </div>
        ) : !hasChromeApi ? (
          <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
            Chrome extension APIs are not available in this browser context. Load this app inside your extension or extension-backed page to manage tabs and history.
          </div>
        ) : (
          <>
            <section className="mb-4 rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
              <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Current Tabs</h2>
                </div>
                <div className="flex flex-wrap gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <button type="button" onClick={selectAllCurrentTabs} className="rounded-lg border border-slate-300 px-3 py-1 hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800">Select all</button>
                  <button type="button" onClick={deselectAllCurrentTabs} className="rounded-lg border border-slate-300 px-3 py-1 hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800">Clear</button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-700">
                  <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                    <tr>
                      <th className="px-3 py-2 w-12" />
                      <th className="px-3 py-2">Title</th>
                      <th className="px-3 py-2">URL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {currentTabs.map((tab) => (
                      <tr key={tab.id} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                        <td className="px-3 py-3">
                          <input
                            type="checkbox"
                            checked={selectedCurrentTabs.has(tab.id)}
                            onChange={() => toggleCurrentTabSelection(tab.id)}
                            className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
                          />
                        </td>
                        <td className="px-3 py-3 font-medium text-slate-900 dark:text-slate-100">{tab.title}</td>
                        <td className="px-3 py-3 break-words text-slate-600 dark:text-slate-300">{tab.url}</td>
                      </tr>
                    ))}
                    {currentTabs.length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-3 py-8 text-center text-slate-500 dark:text-slate-400">No open tabs found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
              <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Tab History</h2>
                </div>
                <div className="flex flex-wrap gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <button type="button" onClick={selectAllHistoryItems} className="rounded-lg border border-slate-300 px-3 py-1 hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800">Select all</button>
                  <button type="button" onClick={deselectAllHistoryItems} className="rounded-lg border border-slate-300 px-3 py-1 hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800">Clear</button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-700">
                  <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                    <tr>
                      <th className="px-3 py-2 w-12" />
                      <th className="px-3 py-2">Title</th>
                      <th className="px-3 py-2">URL</th>
                      <th className="px-3 py-2">Last Visited</th>
                      <th className="px-3 py-2">Visits</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {historyEntries.map((entry) => (
                      <tr key={entry.id} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                        <td className="px-3 py-3">
                          <input
                            type="checkbox"
                            checked={selectedHistoryUrls.has(entry.url)}
                            onChange={() => toggleHistorySelection(entry.url)}
                            className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
                          />
                        </td>
                        <td className="px-3 py-3 font-medium text-slate-900 dark:text-slate-100">{entry.title}</td>
                        <td className="px-3 py-3 break-words text-slate-600 dark:text-slate-300">{entry.url}</td>
                        <td className="px-3 py-3 text-slate-600 dark:text-slate-300">{formatVisitTime(entry.lastVisitTime)}</td>
                        <td className="px-3 py-3 text-slate-600 dark:text-slate-300">{entry.visitCount}</td>
                      </tr>
                    ))}
                    {historyEntries.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-3 py-8 text-center text-slate-500 dark:text-slate-400">No history entries found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
