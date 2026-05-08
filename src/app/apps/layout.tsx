import Link from "next/link";

export default function AppsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen animate-gradient-rotate">
      <div className="block m-10 pt-10 top-4 left-4 z-50" 
           style={{ padding: '10px' }}>
        <Link
          href="/"
          className="flex app-menu-link items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-gray-700 to-gray-800 shadow-md hover:shadow-lg no-underline"
        >
          <span
            className="text-sm font-semibold text-white"
            style={{ fontFamily: 'Arial, sans-serif', textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}
          >
            ← Back
          </span>
        </Link>
      </div>
      <div className="pt-14">
        {children}
      </div>
    </div>
  );
}
