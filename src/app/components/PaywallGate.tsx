'use client';

import React, { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';

type EntitlementStatus = 'loading' | 'granted' | 'denied';

interface PaywallGateProps {
  /** Children shown when the user has an active entitlement. */
  children: React.ReactNode;
  /** RevenueCat entitlement identifier to check. Defaults to "1234webtool_pro". */
  entitlementId?: string;
}

/**
 * PaywallGate
 *
 * Wraps content that should only be accessible to subscribers.
 *
 * Behaviour:
 * - On **web** (browser / static export): renders children directly —
 *   RevenueCat Capacitor SDK is unavailable in that environment.
 * - On **native** (Android / iOS inside Capacitor):
 *   1. Shows a loading spinner while checking entitlement.
 *   2. If the user has an active entitlement → renders children.
 *   3. If the user does not → shows the RevenueCatUI paywall.
 *      On a successful purchase the paywall closes and children are rendered.
 *      On dismissal the user sees a "Subscribe to unlock" prompt.
 */
export default function PaywallGate({
  children,
  entitlementId = '1234webtool_pro',
}: PaywallGateProps) {
  const [status, setStatus] = useState<EntitlementStatus>('loading');
  const [paywallDismissed, setPaywallDismissed] = useState(false);
  const isNative = Capacitor.getPlatform() !== 'web';

  useEffect(() => {
    if (!isNative) {
      setStatus('granted');
      return;
    }
    checkEntitlement();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function checkEntitlement() {
    try {
      const { Purchases } = await import('@revenuecat/purchases-capacitor');
      const { customerInfo } = await Purchases.getCustomerInfo();
      const hasAccess =
        typeof customerInfo.entitlements.active[entitlementId] !== 'undefined';
      setStatus(hasAccess ? 'granted' : 'denied');
    } catch (err) {
      console.error('[PaywallGate] Error checking entitlement:', err);
      // Fail open so a SDK error does not permanently block the user.
      setStatus('granted');
    }
  }

  async function showPaywall() {
    try {
      const { RevenueCatUI, PAYWALL_RESULT } = await import(
        '@revenuecat/purchases-capacitor-ui'
      );
      // presentPaywallIfNeeded only shows the paywall if the user lacks the entitlement
      const result = await RevenueCatUI.presentPaywallIfNeeded({
        requiredEntitlementIdentifier: entitlementId,
      });
      if (
        result.result === PAYWALL_RESULT.PURCHASED ||
        result.result === PAYWALL_RESULT.RESTORED ||
        result.result === PAYWALL_RESULT.NOT_PRESENTED // already has entitlement
      ) {
        setStatus('granted');
      } else {
        setPaywallDismissed(true);
      }
    } catch (err) {
      console.error('[PaywallGate] Error presenting paywall:', err);
      setPaywallDismissed(true);
    }
  }

  // ── Render states ─────────────────────────────────────────────────────────

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
        <p
          className="text-white/80 text-sm font-medium"
          style={{ fontFamily: 'Arial, sans-serif' }}
        >
          Checking subscription…
        </p>
      </div>
    );
  }

  if (status === 'granted') {
    return <>{children}</>;
  }

  // status === 'denied'
  if (!paywallDismissed) {
    // Trigger paywall automatically once
    showPaywall();
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-6">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-sm w-full text-center border border-white/20 shadow-2xl">
        {/* Lock icon */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-5 shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="white"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
            />
          </svg>
        </div>

        <h2
          className="text-xl font-bold text-white mb-2"
          style={{ fontFamily: 'Arial, sans-serif' }}
        >
          Pro Feature
        </h2>
        <p
          className="text-white/70 text-sm mb-6"
          style={{ fontFamily: 'Arial, sans-serif' }}
        >
          Subscribe to 1234WebTool Pro to unlock this feature and enjoy all
          premium tools.
        </p>

        <button
          onClick={() => {
            setPaywallDismissed(false);
            showPaywall();
          }}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 active:scale-95 text-white font-semibold text-base shadow-lg transition-all duration-200 cursor-pointer"
          style={{ fontFamily: 'Arial, sans-serif' }}
        >
          Subscribe to Unlock
        </button>

        <button
          onClick={() => {
            if (typeof window !== 'undefined') {
              if (window.history.length > 1) {
                window.history.back();
              } else {
                window.location.href = '/';
              }
            }
          }}
          className="mt-3 w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white/80 font-medium text-sm transition-all duration-200 cursor-pointer"
          style={{ fontFamily: 'Arial, sans-serif' }}
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
