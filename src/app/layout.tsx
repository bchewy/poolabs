import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Poolabs · Smart Bathroom Observatory",
  description:
    "Hackathon-ready platform that ingests ESP32 smart toilet captures, scores stool health, and nudges caregivers in real-time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-zinc-50 dark:bg-black">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-emerald-50 via-white to-sky-50 text-zinc-900 dark:from-black dark:via-zinc-950 dark:to-emerald-950 dark:text-zinc-100`}
      >
        <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 pb-12 pt-8 sm:px-8 lg:px-12">
          <header className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Link href="/" className="text-2xl font-semibold tracking-tight">
                Poolabs Guardian
              </Link>
              <p className="mt-1 max-w-xl text-sm text-zinc-600 dark:text-zinc-400">
                Smart toilet bowl analytics for ageing-in-place. Built for hackathon demos — privacy-first, ESP32-friendly, and caregiver ready.
              </p>
            </div>
            <nav className="flex items-center gap-3 text-sm font-medium">
              <Link
                href="/"
                className="rounded-full border border-transparent bg-white px-4 py-2 text-zinc-800 shadow-sm transition hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-lg dark:bg-zinc-900 dark:text-zinc-100"
              >
                Overview
              </Link>
              <Link
                href="/dashboard"
                className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-emerald-600 shadow-sm transition hover:-translate-y-1 hover:bg-emerald-500/20 hover:text-emerald-700 dark:text-emerald-300"
              >
                Live dashboard
              </Link>
              <Link
                href="/upload-test"
                className="rounded-full border border-purple-500/40 bg-purple-500/10 px-4 py-2 text-purple-600 shadow-sm transition hover:-translate-y-1 hover:bg-purple-500/20 hover:text-purple-700 dark:text-purple-300"
              >
                AI Upload Test
              </Link>
            </nav>
          </header>

          <main className="mt-10 flex-1">{children}</main>

          <footer className="mt-14 flex flex-col gap-2 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between dark:text-zinc-500">
            <span>Poolabs · Hackathon 2024</span>
            <span>Ageing population · Sleep hygiene · Smart sanitation</span>
          </footer>
        </div>
      </body>
    </html>
  );
}
