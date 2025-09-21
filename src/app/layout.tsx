import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navigation from "@/components/Navigation";
import ThemeSelector from "@/components/ThemeSelector";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PooLabs · Senior Health Monitoring System",
  description:
    "Discreet toilet-clip device that privately detects bowel events and flags constipation/diarrhea trends for seniors living alone. No photos saved, only health labels.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="min-h-screen grid-pattern">
          {/* Header */}
          <header className="sticky top-0 z-40 glass border-b border-white/10 backdrop-blur-xl">
            <div className="mx-auto max-w-7xl px-6 py-4 sm:px-8 lg:px-12">
              <Navigation />
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>

          {/* Theme Selector */}
          <ThemeSelector />

          {/* Footer */}
          <footer className="border-t border-white/10 bg-black/5 backdrop-blur-xl">
            <div className="mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">PooLabs</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    Discreet health monitoring system for seniors living alone. Private detection without photos or visual data.
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Features</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                      Discreet Monitoring
                    </span>
                    <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">
                      Privacy First
                    </span>
                    <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
                      Health Alerts
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">For Senior Care</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Designed specifically for seniors living alone and their caregivers who need peace of mind.
                  </p>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    © 2024 PooLabs. Protecting senior dignity with discreet monitoring.
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                    <span>No Photos</span>
                    <span>100% Private</span>
                    <span>Senior Focused</span>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
