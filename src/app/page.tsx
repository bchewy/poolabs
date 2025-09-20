import Link from "next/link";
import { ArrowRight, Shield, Brain, Zap, Database, Smartphone, Users, Heart, Sparkles, Target, EyeOff, Lock } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50 dark:from-black dark:via-zinc-950 dark:to-emerald-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-12">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1 text-sm font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-700/10 dark:bg-emerald-900/20 dark:text-emerald-300 dark:ring-emerald-800/30">
              <Shield className="h-4 w-4" />
              AI-Powered Health Monitoring
            </div>
            <h1 className="mt-6 text-5xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-6xl lg:text-7xl">
              Smart Toilet
              <span className="block text-emerald-600 dark:text-emerald-400">AI Analytics</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
              Revolutionize eldercare with AI-powered stool analysis. Privacy-first technology that monitors health while preserving dignity.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/upload-test"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:-translate-y-0.5 hover:bg-emerald-700"
              >
                Try AI Analysis
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/database-dashboard"
                className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-white px-6 py-3 text-base font-semibold text-emerald-700 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-500 dark:bg-zinc-900 dark:text-emerald-300"
              >
                View Dashboard
                <Database className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
              The Silent Health Crisis
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
              Millions of seniors live alone with declining health. Traditional monitoring solutions often compromise dignity or provide too little too late.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-5xl">
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/80 p-8 shadow-lg dark:border-white/5 dark:bg-zinc-900/60">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/20">
                  <Heart className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-white">Health Deterioration</h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  Digestive health issues often go unnoticed until they become serious emergencies requiring hospitalization.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/80 p-8 shadow-lg dark:border-white/5 dark:bg-zinc-900/60">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/20">
                  <Users className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-white">Caregiver Burden</h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  Family members struggle to balance care with daily life, often missing crucial health indicators.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/80 p-8 shadow-lg dark:border-white/5 dark:bg-zinc-900/60">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
                  <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-white">Privacy Concerns</h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  Traditional monitoring cameras invade privacy, making seniors uncomfortable in their own homes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-24 sm:py-32 bg-emerald-50 dark:bg-emerald-950/20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-1 text-sm font-semibold text-white">
              <Sparkles className="h-4 w-4" />
              Our Solution
            </div>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
              AI-Powered Toilet Analytics
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
              Advanced computer vision and AI analysis provides comprehensive health insights without compromising dignity or privacy.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-5xl">
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white p-8 shadow-xl dark:border-white/5 dark:bg-zinc-900/60">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/20">
                    <Brain className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Smart Analysis</h3>
                </div>
                <ul className="mt-6 space-y-4">
                  <li className="flex items-start gap-3">
                    <Target className="mt-1 h-5 w-5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-white">Bristol Scoring</p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">AI-powered stool classification using medical standards</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Zap className="mt-1 h-5 w-5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-white">Real-time Processing</p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">Instant analysis with immediate health insights</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Database className="mt-1 h-5 w-5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-white">Health Tracking</p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">Long-term trend analysis and pattern recognition</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white p-8 shadow-xl dark:border-white/5 dark:bg-zinc-900/60">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/20">
                    <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Privacy First</h3>
                </div>
                <ul className="mt-6 space-y-4">
                  <li className="flex items-start gap-3">
                    <EyeOff className="mt-1 h-5 w-5 flex-shrink-0 text-purple-600 dark:text-purple-400" />
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-white">Discreet Monitoring</p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">Camera focused only on water level, never on person</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Lock className="mt-1 h-5 w-5 flex-shrink-0 text-purple-600 dark:text-purple-400" />
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-white">Secure Storage</p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">Encrypted database with enterprise-grade security</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Smartphone className="mt-1 h-5 w-5 flex-shrink-0 text-purple-600 dark:text-purple-400" />
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-white">Caregiver Access</p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">Controlled sharing with family and healthcare providers</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
              How It Works
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
              Simple setup, powerful insights. From installation to actionable health data in minutes.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-4xl">
            <div className="space-y-12">
              <div className="flex gap-8 lg:flex-row">
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xl font-bold text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">Smart Installation</h3>
                  <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
                    ESP32-S3 camera with discreet waterline monitoring installs in minutes. WiFi-connected and ready for intelligent analysis.
                  </p>
                </div>
              </div>

              <div className="flex gap-8 lg:flex-row">
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xl font-bold text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">AI Analysis</h3>
                  <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
                    Advanced computer vision analyzes stool characteristics using the Bristol scale, providing instant health insights and hydration indicators.
                  </p>
                </div>
              </div>

              <div className="flex gap-8 lg:flex-row">
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xl font-bold text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">Health Dashboard</h3>
                  <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
                    Caregivers access comprehensive health insights, trend analysis, and timely alerts through our secure web dashboard.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 sm:py-32 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to Transform Elder Care?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-emerald-100">
              Join us in revolutionizing health monitoring while preserving dignity and privacy.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/upload-test"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-base font-semibold text-emerald-600 shadow-lg transition hover:-translate-y-0.5"
              >
                Try Demo Now
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="mailto:hello@poolabs.dev"
                className="inline-flex items-center gap-2 rounded-full border-2 border-white px-6 py-3 text-base font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-white hover:text-emerald-600"
              >
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
              Key Features
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
              Everything you need for comprehensive health monitoring and peace of mind.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-5xl">
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/80 p-8 shadow-lg dark:border-white/5 dark:bg-zinc-900/60">
                <Brain className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-white">AI-Powered Analysis</h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  Advanced computer vision provides accurate health insights using medical standards.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/80 p-8 shadow-lg dark:border-white/5 dark:bg-zinc-900/60">
                <Shield className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-white">Privacy Protected</h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  Discreet monitoring ensures dignity while providing essential health data.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/80 p-8 shadow-lg dark:border-white/5 dark:bg-zinc-900/60">
                <Smartphone className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-white">Real-time Alerts</h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  Immediate notifications for caregivers when health issues are detected.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/80 p-8 shadow-lg dark:border-white/5 dark:bg-zinc-900/60">
                <Database className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-white">Trend Analysis</h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  Long-term health tracking identifies patterns and potential issues early.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/80 p-8 shadow-lg dark:border-white/5 dark:bg-zinc-900/60">
                <Zap className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-white">Easy Setup</h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  Quick installation with minimal technical expertise required.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/80 p-8 shadow-lg dark:border-white/5 dark:bg-zinc-900/60">
                <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
                <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-white">Caregiver Access</h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  Secure sharing with family members and healthcare providers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}