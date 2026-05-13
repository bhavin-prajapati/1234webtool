import type { Metadata } from "next";
import { Geist } from "next/font/google";
import ReminderNotifierWrapper from "./components/ReminderNotifierWrapper";
import "./globals.css";
import "./weather.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: "1234webtool",
  description: "A collection of tools to enhance your productivity and organization.",
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
        <ReminderNotifierWrapper />
      </body>
    </html>
  );
}
