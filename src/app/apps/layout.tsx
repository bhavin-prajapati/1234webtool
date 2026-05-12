"use client";

export default function AppsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen moving-background">
      <div className="absolute top-4 left-4 z-50">
        <button onClick={() => window.history.back()}
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
          <span
            className="flex app-menu-link items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-gray-700 to-gray-800 shadow-md hover:shadow-lg no-underline text-sm font-semibold text-white"
            style={{ fontFamily: 'Arial, sans-serif', textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}
          >
            ← Back
          </span>
        </button>
      </div>
      <div className="pt-14">
        {children}
      </div>
    </div>
  );
}
