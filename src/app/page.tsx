"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Brain,
  Activity,
  BarChart3,
  Smartphone,
  Heart,
  Sparkles,
  Target,
  Shield,
  Lock,
  Zap,
  Eye,
  Droplets,
  TestTube
} from "lucide-react";
import LiquidEther from "@/components/LiquidEther";
import FAQ from "@/components/FAQ";

export default function Home() {
  const [isPoopTheme] = useState(true); // Always use poop theme

  return (
    <div className="min-h-screen relative">
      {/* Liquid Ether Background */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        <LiquidEther
          key="liquid-ether-bg"
          colors={['#8B4513', '#D2691E', '#CD853F']}
          mouseForce={20}
          cursorSize={100}
          isViscous={false}
          resolution={0.5}
          isBounce={false}
          autoDemo={true}
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
          style={{
            width: '100vw',
            height: '100vh',
            position: 'absolute',
            top: 0,
            left: 0
          }}
        />
      </div>

      {/* Hero Section */}
      <section className={`relative overflow-hidden ${
        isPoopTheme
          ? 'bg-gradient-to-br from-amber-50/20 via-white/10 to-amber-50/20 dark:from-gray-900/20 dark:via-gray-950/10 dark:to-amber-950/20'
          : 'bg-gradient-to-br from-blue-50/20 via-white/10 to-blue-50/20 dark:from-gray-900/20 dark:via-gray-950/10 dark:to-blue-950/20'
      }`} style={{ zIndex: 10 }}>
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative mx-auto max-w-7xl px-6 py-32 sm:px-8 lg:px-12">
          <div className="text-center animate-slide-up">
            <div className="inline-flex items-center gap-2 rounded-full px-6 py-2 text-sm font-semibold ring-1 ring-inset backdrop-blur-sm bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 ring-amber-600/20">
              <Activity className="h-4 w-4" />
              Senior Health Monitoring
            </div>
            <h1 className="mt-8 text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-amber-700 dark:text-amber-300">
              Discreet Toilet-Clip
              <span className="block mt-2 text-amber-600 dark:text-amber-400">
                Health Monitor 🏡
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-xl leading-relaxed text-amber-600 dark:text-amber-400">
              Private detection of bowel events for seniors living alone. Flags constipation/diarrhea trends without photos—only discrete health labels for caregiver awareness.
              <span className="ml-2">🛡️</span>
            </p>
            <div className="mt-12 flex flex-wrap justify-center gap-6">
              <Link
                href="/analyze"
                className="group inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold text-white shadow-2xl transition-all duration-300 hover:scale-105 rounded-full bg-amber-800 hover:bg-amber-900 shadow-amber-800/25 hover:shadow-amber-800/40"
              >
                🏡 Learn More
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/database-dashboard"
                className="group inline-flex items-center gap-3 border-2 px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 rounded-full border-amber-300 dark:border-amber-700 bg-white dark:bg-gray-900 hover:border-amber-600 dark:hover:border-amber-600 text-amber-700 dark:text-amber-300"
              >
                Health Trends
                <BarChart3 className="h-5 w-5" />
              </Link>
            </div>
          </div>

          
          {/* Floating elements */}
          <div className="absolute top-20 left-10 animate-float">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-amber-200 dark:bg-amber-900/30">
              <TestTube className="h-8 w-8 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <div className="absolute bottom-20 right-10 animate-float" style={{animationDelay: '2s'}}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-yellow-200 dark:bg-yellow-900/30">
              <Activity className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white/70 dark:bg-gray-900/50 backdrop-blur-sm relative" style={{ zIndex: 10 }}>
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-3xl text-center animate-scale-in">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl text-amber-700 dark:text-amber-300">
              Easy as 💩-1-2
            </h2>
            <p className="mx-auto mt-6 text-xl leading-relaxed text-amber-600 dark:text-amber-400">
              Understanding your poop health has never been easier. No toilet degree required!
              <span className="ml-2">🚽</span>
            </p>
          </div>
          <div className="mx-auto mt-20 max-w-6xl">
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="group bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30 group-hover:bg-amber-200 dark:group-hover:bg-amber-900/50 transition-smooth">
                  <Smartphone className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">Install Device</h3>
                <p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                  Simply clip the discreet sensor to any toilet. Our system automatically detects events and provides health insights without any user interaction needed.
                </p>
              </div>
              <div className="group bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/30 group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-smooth">
                  <Brain className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">Get AI Analysis</h3>
                <p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                  Our smart AI instantly analyzes your sample and explains what it means in simple, easy-to-understand language.
                </p>
              </div>
              <div className="group bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-900/30 group-hover:bg-orange-200 dark:group-hover:bg-orange-900/50 transition-smooth">
                  <Heart className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">Track Your Health</h3>
                <p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                  Keep track of your digestive health over time. Spot patterns and understand what&apos;s normal for you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    {/* Why PooLabs Section */}
      <section className="py-24 bg-gray-50/70 dark:bg-gray-900/30 backdrop-blur-sm relative" style={{ zIndex: 10 }}>
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-600 px-6 py-2 text-sm font-semibold text-white">
              <Sparkles className="h-4 w-4" />
              Why Choose PooLabs
            </div>
            <h2 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
              Made for Everyone
            </h2>
            <p className="mx-auto mt-6 text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              Simple, private, and effective digestive health tracking for the whole family.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-6xl">
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
                    <Brain className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Smart & Simple</h3>
                </div>
                <ul className="mt-6 space-y-4">
                  <li className="flex items-start gap-3">
                    <Target className="mt-1 h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Easy to Understand</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Results explained in plain language, no medical jargon</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Zap className="mt-1 h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Instant Results</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Get insights in seconds, not days</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <BarChart3 className="mt-1 h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Track Progress</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">See how your digestive health changes over time</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100 dark:bg-yellow-900/30">
                    <Shield className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Private & Secure</h3>
                </div>
                <ul className="mt-6 space-y-4">
                  <li className="flex items-start gap-3">
                    <Eye className="mt-1 h-5 w-5 flex-shrink-0 text-yellow-600 dark:text-yellow-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">100% Private</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Your data stays yours, we never share it</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Lock className="mt-1 h-5 w-5 flex-shrink-0 text-yellow-600 dark:text-yellow-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Secure Storage</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Military-grade encryption for your peace of mind</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Droplets className="mt-1 h-5 w-5 flex-shrink-0 text-yellow-600 dark:text-yellow-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Family Friendly</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Safe for users of all ages</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Perfect For Everyone */}
      <section className="py-24 bg-white/70 dark:bg-gray-900/50 backdrop-blur-sm relative" style={{ zIndex: 10 }}>
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
              Perfect For Senior Care
            </h2>
            <p className="mx-auto mt-6 text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              Giving families peace of mind while preserving independence for seniors living alone.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-5xl">
            <div className="space-y-12">
              <div className="flex gap-8 lg:flex-row animate-slide-up">
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-amber-600 text-xl font-bold text-white animate-pulse-glow">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">For Seniors</h3>
                  <p className="mt-3 text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                    Maintain independence with discreet monitoring that doesn&apos;t intrude on daily life or compromise dignity.
                  </p>
                </div>
              </div>

              <div className="flex gap-8 lg:flex-row animate-slide-up" style={{animationDelay: '0.2s'}}>
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-amber-600 text-xl font-bold text-white animate-pulse-glow">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">For Caregivers</h3>
                  <p className="mt-3 text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                    Receive essential health alerts and trend analysis without invading privacy. Know when to check in or seek medical attention.
                  </p>
                </div>
              </div>

              <div className="flex gap-8 lg:flex-row animate-slide-up" style={{animationDelay: '0.4s'}}>
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-amber-600 text-xl font-bold text-white animate-pulse-glow">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">For Families</h3>
                  <p className="mt-3 text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                    Peace of mind knowing your elderly loved ones are monitored discreetly, with alerts only for significant health changes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-r from-amber-600/90 to-amber-700/90 backdrop-blur-sm relative overflow-hidden" style={{ zIndex: 10 }}>
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative mx-auto max-w-4xl px-6 sm:px-8 lg:px-12 text-center">
          <div className="animate-scale-in">
            <h2 className="text-5xl font-bold tracking-tight text-white sm:text-6xl">
              Ready to Understand Your Health?
            </h2>
            <p className="mx-auto mt-6 text-2xl text-amber-100 leading-relaxed">
              Join thousands of users who are already taking control of their digestive health with PooLabs.
            </p>
            <div className="mt-12 flex flex-wrap justify-center gap-6">
              <Link
                href="/analyze"
                className="group inline-flex items-center gap-3 bg-white text-amber-700 px-8 py-4 text-lg font-semibold shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl rounded-full"
              >
                Try PooLabs Free
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="mailto:hello@poolabs.dev"
                className="inline-flex items-center gap-3 border-2 border-white text-white px-8 py-4 text-lg font-semibold transition-all duration-300 hover:bg-white hover:text-amber-600 rounded-full"
              >
                Ask Us Anything
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}