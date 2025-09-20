import Link from "next/link";
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

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-950 dark:to-blue-950">
        <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
        <div className="relative mx-auto max-w-7xl px-6 py-32 sm:px-8 lg:px-12">
          <div className="text-center animate-slide-up">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 dark:bg-blue-900/30 px-6 py-2 text-sm font-semibold text-blue-700 dark:text-blue-300 ring-1 ring-inset ring-blue-600/20 backdrop-blur-sm">
              <Activity className="h-4 w-4" />
              Understand Your Digestive Health
            </div>
            <h1 className="mt-8 text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-gray-900 dark:text-white">
              Know Your
              <span className="block text-blue-600 dark:text-blue-400 mt-2">Poop Better</span>
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              Simple AI analysis for everyone. Just snap a photo and get instant insights about your digestive health.
              No medical knowledge required.
            </p>
            <div className="mt-12 flex flex-wrap justify-center gap-6">
              <Link
                href="/upload-test"
                className="group inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 px-8 py-4 text-lg font-semibold text-white shadow-2xl shadow-blue-500/25 transition-all duration-300 hover:shadow-blue-500/40 hover:scale-105 rounded-full"
              >
                Analyze Your Poop
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/database-dashboard"
                className="group inline-flex items-center gap-3 border-2 border-blue-200 dark:border-blue-800 bg-white dark:bg-gray-900 hover:border-blue-600 dark:hover:border-blue-600 px-8 py-4 text-lg font-semibold text-blue-600 dark:text-blue-400 transition-all duration-300 hover:scale-105 rounded-full"
              >
                Your History
                <BarChart3 className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Floating elements */}
          <div className="absolute top-20 left-10 animate-float">
            <div className="w-16 h-16 bg-blue-200 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <TestTube className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="absolute bottom-20 right-10 animate-float" style={{animationDelay: '2s'}}>
            <div className="w-12 h-12 bg-green-200 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <Activity className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white dark:bg-gray-900/50">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-3xl text-center animate-scale-in">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
              Simple as 1-2-3
            </h2>
            <p className="mx-auto mt-6 text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              Understanding your digestive health has never been easier. No medical degree required!
            </p>
          </div>
          <div className="mx-auto mt-20 max-w-6xl">
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="group bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-smooth">
                  <Smartphone className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">Snap a Photo</h3>
                <p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                  Just take a picture with your phone. Our AI guides you through the process with simple instructions.
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
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-smooth">
                  <Heart className="h-8 w-8 text-purple-600 dark:text-purple-400" />
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
      <section className="py-24 bg-gray-50 dark:bg-gray-900/30">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white">
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
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
                    <Brain className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Smart & Simple</h3>
                </div>
                <ul className="mt-6 space-y-4">
                  <li className="flex items-start gap-3">
                    <Target className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Easy to Understand</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Results explained in plain language, no medical jargon</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Zap className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Instant Results</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Get insights in seconds, not days</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <BarChart3 className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Track Progress</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">See how your digestive health changes over time</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/30">
                    <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Private & Secure</h3>
                </div>
                <ul className="mt-6 space-y-4">
                  <li className="flex items-start gap-3">
                    <Eye className="mt-1 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">100% Private</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Your data stays yours, we never share it</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Lock className="mt-1 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Secure Storage</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Military-grade encryption for your peace of mind</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Droplets className="mt-1 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400" />
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
      <section className="py-24 bg-white dark:bg-gray-900/50">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
              Perfect For Every Family
            </h2>
            <p className="mx-auto mt-6 text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              Whether you&apos;re keeping track of your own health or monitoring your family&apos;s wellbeing.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-5xl">
            <div className="space-y-12">
              <div className="flex gap-8 lg:flex-row animate-slide-up">
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white animate-pulse-glow">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">For Parents</h3>
                  <p className="mt-3 text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                    Keep track of your children&apos;s digestive health with ease. Understand what&apos;s normal and when to seek help.
                  </p>
                </div>
              </div>

              <div className="flex gap-8 lg:flex-row animate-slide-up" style={{animationDelay: '0.2s'}}>
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white animate-pulse-glow">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">For Adults</h3>
                  <p className="mt-3 text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                    Monitor your digestive health, spot patterns, and make informed decisions about your diet and lifestyle.
                  </p>
                </div>
              </div>

              <div className="flex gap-8 lg:flex-row animate-slide-up" style={{animationDelay: '0.4s'}}>
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white animate-pulse-glow">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">For Seniors</h3>
                  <p className="mt-3 text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                    Simple interface designed for all ages. Large text and clear instructions make it easy for everyone to use.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-r from-blue-600 to-blue-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative mx-auto max-w-4xl px-6 sm:px-8 lg:px-12 text-center">
          <div className="animate-scale-in">
            <h2 className="text-5xl font-bold tracking-tight text-white sm:text-6xl">
              Ready to Understand Your Health?
            </h2>
            <p className="mx-auto mt-6 text-2xl text-blue-100 leading-relaxed">
              Join thousands of users who are already taking control of their digestive health with PooLabs.
            </p>
            <div className="mt-12 flex flex-wrap justify-center gap-6">
              <Link
                href="/upload-test"
                className="group inline-flex items-center gap-3 bg-white text-blue-600 px-8 py-4 text-lg font-semibold shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl rounded-full"
              >
                Try PooLabs Free
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="mailto:hello@poolabs.dev"
                className="inline-flex items-center gap-3 border-2 border-white text-white px-8 py-4 text-lg font-semibold transition-all duration-300 hover:bg-white hover:text-blue-600 rounded-full"
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