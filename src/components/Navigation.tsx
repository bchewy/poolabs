"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import NotificationBell from "./NotificationBell";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isPoopTheme = true; // Always use poo theme

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center space-x-8">
        <Link
          href="/"
          className="flex items-center space-x-3 group transition-smooth"
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center group-hover:scale-110 transition-smooth bg-gradient-to-br from-amber-500 to-amber-600 animate-bounce-soft">
            <span className="text-white font-bold text-sm">
              💩
            </span>
          </div>
          <span className="text-xl font-bold group-hover:scale-105 transition-smooth text-amber-700 dark:text-amber-300">
            PooLabs
            <span className="ml-2 text-lg animate-bounce-soft">✨</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/"
            className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-smooth relative group"
          >
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-600 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link
            href="/analyze"
            className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-smooth relative group"
          >
            Analyze
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-600 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link
            href="/database-dashboard"
            className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-smooth relative group"
          >
            My History
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-600 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link
            href="/health-trends"
            className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-smooth relative group"
          >
            Health Trends
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-600 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link
            href="/roadmap"
            className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-smooth relative group"
          >
            Roadmap
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-600 transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </nav>
      </div>

      <div className="flex items-center space-x-4">
        <div className="hidden sm:block text-xs text-gray-500 dark:text-gray-400">
          v1.0 • Simple & Private
        </div>

        {/* Notification Bell */}
        <NotificationBell />

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-smooth"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-700">
          <nav className="flex flex-col space-y-2 pt-4">
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-smooth px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Home
            </Link>
            <Link
              href="/analyze"
              onClick={() => setIsMenuOpen(false)}
              className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-smooth px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Analyze
            </Link>
            <Link
              href="/database-dashboard"
              onClick={() => setIsMenuOpen(false)}
              className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-smooth px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              My History
            </Link>
            <Link
              href="/health-trends"
              onClick={() => setIsMenuOpen(false)}
              className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-smooth px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Health Trends
            </Link>
            <Link
              href="/roadmap"
              onClick={() => setIsMenuOpen(false)}
              className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-smooth px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Roadmap
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}