import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import "./hexagons.css";


const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: "iOS Web App",
  description: "A web-based iOS-like interface",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
