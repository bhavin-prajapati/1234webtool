'use client';

import React from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function PrivacyPolicyPage() {
  const handleBack = () => {
    if (typeof window !== 'undefined') {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = '/';
      }
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-6">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-xl border border-white/40 p-6 sm:p-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: May 12, 2026</p>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Overview</h2>
            <p>
              1234webtool is a collection of browser-based productivity tools. Your privacy is important to us.
              This policy explains how the application handles your data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Data Collection</h2>
            <p>
              <strong>We do not collect, store, or transmit any personal data.</strong> All information
              you enter into 1234webtool (notes, todos, calendar events, settings, etc.) is stored
              exclusively in your browser&apos;s local storage on your own device.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Local Storage</h2>
            <p>
              1234webtool uses your browser&apos;s <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">localStorage</code> to
              save your data between sessions. This data never leaves your device and is not accessible
              to us or any third party. You can clear this data at any time through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Cookies</h2>
            <p>
              1234webtool does not use cookies or any similar tracking technologies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Third-Party Services</h2>
            <p>
              1234webtool does not integrate with any third-party analytics, advertising, or tracking services.
              No data is shared with external parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Children&apos;s Privacy</h2>
            <p>
              Since we do not collect any data, there are no special concerns regarding children&apos;s privacy.
              The application is safe for users of all ages.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. Any changes will be reflected on this page
              with an updated revision date.
            </p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-200 flex justify-center">
          <button
            onClick={handleBack}
            className="flex items-center gap-2.5 px-7 py-3 rounded-xl bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 active:scale-95 text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer border border-white/20"
            style={{ fontFamily: 'Arial, sans-serif', textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}
            title="Back to Home"
          >
            <ArrowLeftIcon style={{ width: 22, height: 22 }} />
            <span>Back</span>
          </button>
        </div>
      </div>
    </div>
  );
}
