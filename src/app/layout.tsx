import type { Metadata } from "next";
import Link from "next/link";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PooLabs · Simple Digestive Health Tracking",
  description:
    "Easy-to-use app that helps you understand your digestive health. Just snap a photo and get instant insights about your poop.",
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
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-8">
                  <Link
                    href="/"
                    className="flex items-center space-x-3 group transition-smooth"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-smooth">
                      <span className="text-white font-bold text-sm">P</span>
                    </div>
                    <span className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-smooth">
                      PooLabs
                    </span>
                  </Link>
                  <nav className="hidden md:flex items-center space-x-6">
                    <Link
                      href="/"
                      className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-smooth relative group"
                    >
                      Home
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                    <Link
                      href="/upload-test"
                      className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-smooth relative group"
                    >
                      Analyze
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                    <Link
                      href="/database-dashboard"
                      className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-smooth relative group"
                    >
                      My History
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  </nav>
                </div>

                {/* Mobile menu button would go here */}
                <div className="flex items-center space-x-4">
                  <div className="hidden sm:block text-xs text-gray-500 dark:text-gray-400">
                    v1.0 • Simple & Private
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>

          {/* Footer */}
          <footer className="border-t border-white/10 bg-black/5 backdrop-blur-xl">
            <div className="mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">PooLabs</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    Simple app that helps people of all ages understand their digestive health through easy photo analysis.
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Features</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                      Easy Analysis
                    </span>
                    <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">
                      Family Friendly
                    </span>
                    <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
                      Health Tracking
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">For Everyone</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Made for the whole family - simple enough for anyone to use, private enough to trust.
                  </p>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    © 2024 PooLabs. Made for families everywhere.
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                    <span>Privacy First</span>
                    <span>Family Safe</span>
                    <span>Easy to Use</span>
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
