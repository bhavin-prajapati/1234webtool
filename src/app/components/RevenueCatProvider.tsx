'use client';

import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

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
export default function RevenueCatProvider() {
  useEffect(() => {
    const platform = Capacitor.getPlatform();
    if (platform === 'web') {
      // Not running inside native Capacitor — skip SDK init.
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

        console.log('[RevenueCat] SDK configured successfully on', platform);
      } catch (err) {
        console.error('[RevenueCat] Failed to configure SDK:', err);
      }
    })();
  }, []);

  // Renders nothing — pure side-effect component.
  return null;
}
