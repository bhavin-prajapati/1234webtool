'use client';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-12">
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
      </div>
    </div>
  );
}
