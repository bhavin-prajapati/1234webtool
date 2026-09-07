'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';

interface RevenueCatContextValue {
  isPro: boolean | null;
  refreshEntitlement: () => Promise<boolean>;
}

const RevenueCatContext = createContext<RevenueCatContextValue>({
  isPro: null,
  refreshEntitlement: async () => false,
});

export function useRevenueCat() {
  return useContext(RevenueCatContext);
}

/**
 * RevenueCatProvider
 *
 * Initializes the RevenueCat Purchases SDK **only** when the app is running
 * inside a Capacitor native shell (Android / iOS).  When rendered in a
 * standard web browser (static export, dev server, etc.) the SDK is never
 * imported so the build stays clean.
 *
 * Rendered as a zero-UI component — it mounts invisibly in the root layout.
 */
export default function RevenueCatProvider({ children }: { children: React.ReactNode }) {
  const [isPro, setIsPro] = useState<boolean | null>(null);

  const refreshEntitlement = useCallback(async () => {
    if (Capacitor.getPlatform() === 'web') {
      setIsPro(true);
      return true;
    }

    try {
      const { Purchases } = await import('@revenuecat/purchases-capacitor');
      const { customerInfo } = await Purchases.getCustomerInfo();
      const hasAccess = typeof customerInfo.entitlements.active['1234webtool_pro'] !== 'undefined';
      setIsPro(hasAccess);
      return hasAccess;
    } catch (err) {
      console.error('[RevenueCat] Failed to refresh entitlement:', err);
      setIsPro(true);
      return true;
    }
  }, []);

  useEffect(() => {
    const platform = Capacitor.getPlatform();
    if (platform === 'web') {
      setIsPro(true);
      return;
    }

    // Dynamic import ensures the Capacitor SDK is only bundled / executed
    // when it can actually talk to the native runtime.
    (async () => {
      try {
        const { Purchases, LOG_LEVEL } = await import(
          '@revenuecat/purchases-capacitor'
        );

        await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG });
        await Purchases.configure({
          apiKey: 'test_FxMsVTsDntPXsueCNgGsPEhCXdQ',
        });
        await refreshEntitlement();

        console.log('[RevenueCat] SDK configured successfully on', platform);
      } catch (err) {
        console.error('[RevenueCat] Failed to configure SDK:', err);
        setIsPro(true);
      }
    })();
  }, []);

  return (
    <RevenueCatContext.Provider value={{ isPro, refreshEntitlement }}>
      {children}
    </RevenueCatContext.Provider>
  );
}
