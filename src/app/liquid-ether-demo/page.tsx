"use client";

import { useState } from "react";
import LiquidEtherBackground from "@/components/LiquidEtherBackground";
import LiquidEtherBackgroundEnhanced from "@/components/LiquidEtherBackgroundEnhanced";

export default function LiquidEtherDemo() {
  const [selectedTheme, setSelectedTheme] = useState<'health' | 'ocean' | 'forest' | 'sunset'>('health');
  const [intensity, setIntensity] = useState<'subtle' | 'medium' | 'strong'>('medium');
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [blobCount, setBlobCount] = useState(5);
  const [showEnhanced, setShowEnhanced] = useState(true);

  return (
    <div className="min-h-screen relative bg-gray-50 dark:bg-gray-900">
      {/* Background */}
      {showEnhanced ? (
        <LiquidEtherBackgroundEnhanced
          theme={selectedTheme}
          intensity={intensity}
          animationSpeed={animationSpeed}
          blobCount={blobCount}
          interactive={true}
          showConnections={true}
          pulseEffect={true}
          particleCount={15}
        />
      ) : (
        <LiquidEtherBackground
          animationSpeed={animationSpeed}
          blobCount={blobCount}
          interactive={true}
        />
      )}

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
              Liquid Ether Background Demo
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Interactive animated background components for React/Next.js
            </p>
          </div>

          {/* Controls */}
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/20">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              Customize Your Background
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Component Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Component Type
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowEnhanced(true)}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      showEnhanced
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Enhanced
                  </button>
                  <button
                    onClick={() => setShowEnhanced(false)}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      !showEnhanced
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Basic
                  </button>
                </div>
              </div>

              {/* Theme Selection */}
              {showEnhanced && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Color Theme
                  </label>
                  <select
                    value={selectedTheme}
                    onChange={(e) => setSelectedTheme(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="health">Health (Amber/Green)</option>
                    <option value="ocean">Ocean (Blue/Cyan)</option>
                    <option value="forest">Forest (Green/Olive)</option>
                    <option value="sunset">Sunset (Red/Purple)</option>
                  </select>
                </div>
              )}

              {/* Intensity */}
              {showEnhanced && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Intensity
                  </label>
                  <select
                    value={intensity}
                    onChange={(e) => setIntensity(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="subtle">Subtle</option>
                    <option value="medium">Medium</option>
                    <option value="strong">Strong</option>
                  </select>
                </div>
              )}

              {/* Animation Speed */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Animation Speed: {animationSpeed}x
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="3"
                  step="0.1"
                  value={animationSpeed}
                  onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Blob Count */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Blob Count: {blobCount}
                </label>
                <input
                  type="range"
                  min="2"
                  max="15"
                  value={blobCount}
                  onChange={(e) => setBlobCount(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Info */}
              <div className="flex items-center">
                <div className="bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                  <p className="text-xs text-blue-800 dark:text-blue-200">
                    💡 Move your mouse to interact with the blobs!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                Interactive Blobs
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Liquid blobs that respond to mouse movement with realistic physics.
              </p>
            </div>

            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                Color Themes
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Pre-designed themes for health, ocean, forest, and sunset applications.
              </p>
            </div>

            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                Particle Effects
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Floating particles add depth and atmosphere to the background.
              </p>
            </div>

            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                Performance Optimized
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Canvas-based rendering ensures smooth animations even on mobile.
              </p>
            </div>

            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                Customizable
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Full control over colors, animation speed, and visual intensity.
              </p>
            </div>

            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                Easy Integration
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Drop-in component that works with any React or Next.js application.
              </p>
            </div>
          </div>

          {/* Code Examples */}
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Quick Start
            </h3>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Basic Usage:
                </h4>
                <pre className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 overflow-x-auto">
                  <code>{`import LiquidEtherBackgroundEnhanced from '@/components/LiquidEtherBackgroundEnhanced';

<LiquidEtherBackgroundEnhanced
  theme="health"
  intensity="medium"
  interactive={true}
/>`}</code>
                </pre>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Custom Colors:
                </h4>
                <pre className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 overflow-x-auto">
                  <code>{`<LiquidEtherBackgroundEnhanced
  theme="custom"
  customColors={{
    primary: "rgba(147, 51, 234, 0.12)",
    secondary: "rgba(196, 181, 253, 0.08)",
    tertiary: "rgba(147, 51, 234, 0.06)",
    accent: "rgba(236, 72, 153, 0.1)"
  }}
/>`}</code>
                </pre>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="text-center mt-8">
            <a
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
            >
              ← Back to PooLabs
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}