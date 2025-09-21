"use client";

import { useState } from "react";
import React from "react";
import {
  Microchip, Smartphone,
  Activity, Heart, Shield, Droplets,
  Database, BarChart3, MapPin, Users, Bell,
  Rocket, Star,
  ArrowRight, ArrowLeft, Calendar, X, Brain
} from "lucide-react";

interface RoadmapFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  timeline: string;
  status: "concept" | "development" | "testing" | "complete";
  color: string;
  features: string[];
}

export default function RoadmapPage() {
  const [selectedFeature, setSelectedFeature] = useState<RoadmapFeature | null>(null);

  const roadmapFeatures: RoadmapFeature[] = [
    {
      id: "esp32-basic",
      title: "ESP32-CAM Basic Setup",
      description: "Core toilet-clip device with ESP32-CAM, motion sensors, and wireless connectivity",
      icon: Microchip,
      category: "Hardware",
      difficulty: "easy",
      timeline: "Q1 2024",
      status: "complete",
      color: "from-green-500 to-emerald-600",
      features: [
        "ESP32-CAM module integration",
        "PIR motion detection",
        "WiFi/Bluetooth connectivity",
        "Battery power management",
        "Weatherproof enclosure"
      ]
    },
    {
      id: "real-time-analysis",
      title: "Real-time AI Analysis",
      description: "On-device AI processing for instant Bristol scoring and health insights",
      icon: Brain,
      category: "AI/ML",
      difficulty: "medium",
      timeline: "Q2 2024",
      status: "development",
      color: "from-blue-500 to-cyan-600",
      features: [
        "TensorFlow Lite model",
        "Real-time image classification",
        "Bristol scale scoring",
        "Hydration level detection",
        "Edge AI processing"
      ]
    },
    {
      id: "health-dashboard",
      title: "Senior Health Dashboard",
      description: "Comprehensive health monitoring dashboard for caregivers and family members",
      icon: Activity,
      category: "Software",
      difficulty: "medium",
      timeline: "Q2 2024",
      status: "complete",
      color: "from-purple-500 to-violet-600",
      features: [
        "Health trends visualization",
        "Caregiver alerts system",
        "Multi-device support",
        "Privacy-first design",
        "Real-time notifications"
      ]
    },
    {
      id: "privacy-shield",
      title: "Privacy Shield Architecture",
      description: "Military-grade encryption with zero-knowledge proof system",
      icon: Shield,
      category: "Security",
      difficulty: "hard",
      timeline: "Q3 2024",
      status: "development",
      color: "from-amber-500 to-orange-600",
      features: [
        "End-to-end encryption",
        "Zero-knowledge proofs",
        "Differential privacy",
        "Secure multi-party computation",
        "HIPAA-compliant logging"
      ]
    },
    {
      id: "smart-sensors",
      title: "Advanced Smart Sensors",
      description: "Multi-spectral analysis and environmental monitoring capabilities",
      icon: Droplets,
      category: "Hardware",
      difficulty: "medium",
      timeline: "Q3 2024",
      status: "concept",
      color: "from-cyan-500 to-blue-600",
      features: [
        "Multi-spectral imaging",
        "pH level detection",
        "Temperature monitoring",
        "Odor analysis sensors",
        "Auto-calibration system"
      ]
    },
    {
      id: "predictive-analytics",
      title: "Predictive Health Analytics",
      description: "ML-powered early warning system for potential health issues",
      icon: BarChart3,
      category: "AI/ML",
      difficulty: "hard",
      timeline: "Q4 2024",
      status: "concept",
      color: "from-red-500 to-pink-600",
      features: [
        "Anomaly detection algorithms",
        "Trend pattern recognition",
        "Early warning system",
        "Health risk assessment",
        "Automated caregiver alerts"
      ]
    },
    {
      id: "mobile-app",
      title: "Companion Mobile App",
      description: "Native iOS/Android app with real-time notifications and health insights",
      icon: Smartphone,
      category: "Mobile",
      difficulty: "medium",
      timeline: "Q4 2024",
      status: "concept",
      color: "from-indigo-500 to-purple-600",
      features: [
        "Cross-platform support",
        "Push notifications",
        "Health trend tracking",
        "Medication reminders",
        "Emergency response system"
      ]
    },
    {
      id: "voice-interface",
      title: "Voice-First Interface",
      description: "Hands-free voice control and audio feedback for accessibility",
      icon: Bell,
      category: "UX/Accessibility",
      difficulty: "medium",
      timeline: "Q1 2025",
      status: "concept",
      color: "from-teal-500 to-green-600",
      features: [
        "Voice command processing",
        "Audio health summaries",
        "Accessibility features",
        "Hands-free operation",
        "Multi-language support"
      ]
    },
    {
      id: "fleet-management",
      title: "Fleet Management System",
      description: "Enterprise-scale deployment for care facilities and hospitals",
      icon: Users,
      category: "Enterprise",
      difficulty: "hard",
      timeline: "Q2 2025",
      status: "concept",
      color: "from-violet-500 to-purple-600",
      features: [
        "Multi-device management",
        "Bulk configuration",
        "Analytics dashboard",
        "Compliance reporting",
        "API integration"
      ]
    },
    {
      id: "research-platform",
      title: "Medical Research Platform",
      description: "Privacy-preserving data sharing for medical research",
      icon: Database,
      category: "Research",
      difficulty: "hard",
      timeline: "Q3 2025",
      status: "concept",
      color: "from-rose-500 to-pink-600",
      features: [
        "Federated learning",
        "Synthetic data generation",
        "Research participant portal",
        "IRB compliance tools",
        "Data marketplace"
      ]
    },
    {
      id: "environmental-monitoring",
      title: "Environmental Monitoring",
      description: "Advanced sensors for air quality, chemical detection, and health insights",
      icon: MapPin,
      category: "Sensors",
      difficulty: "medium",
      timeline: "Q4 2025",
      status: "concept",
      color: "from-emerald-500 to-green-600",
      features: [
        "VOC detection",
        "Air quality monitoring",
        "Chemical sensing",
        "Environmental health insights",
        "Smart home integration"
      ]
    },
    {
      id: "ai-health-coach",
      title: "AI Health Coach",
      description: "Personalized health recommendations and lifestyle coaching",
      icon: Heart,
      category: "AI/ML",
      difficulty: "hard",
      timeline: "Q1 2026",
      status: "concept",
      color: "from-orange-500 to-red-600",
      features: [
        "Personalized recommendations",
        "Lifestyle coaching",
        "Diet and exercise suggestions",
        "Mental health support",
        "Progress tracking"
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "complete": return "bg-green-500";
      case "development": return "bg-blue-500";
      case "testing": return "bg-yellow-500";
      case "concept": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "text-green-600 bg-green-100";
      case "medium": return "text-yellow-600 bg-yellow-100";
      case "hard": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-12">
          <div className="text-center animate-slide-up">
            <div className="inline-flex items-center gap-2 rounded-full px-6 py-2 text-sm font-semibold ring-1 ring-inset backdrop-blur-sm bg-purple-100/10 text-purple-300 ring-purple-500/20 mb-6">
              <Rocket className="h-4 w-4" />
              Future Innovations
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
              ESP32 Toilet-Clip
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                Roadmap 2024-2026
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Building the future of discreet health monitoring. From basic motion detection to
              AI-powered health insights and privacy-preserving analytics.
            </p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="sticky top-0 z-10 bg-gray-900/90 backdrop-blur-md border-b border-gray-800">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center gap-4 overflow-x-auto">
            {["All", "Hardware", "Software", "AI/ML", "Security", "Mobile", "Enterprise", "Research"].map((category) => (
              <button
                key={category}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap
                  bg-gray-800 text-gray-300 hover:bg-purple-600 hover:text-white
                  border border-gray-700 hover:border-purple-500"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Side-Scrolling Timeline */}
      <div className="relative py-16">
        {/* Fixed Timeline Header */}
        <div className="sticky top-20 z-20 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 py-4 mb-8">
          <div className="flex items-center justify-between max-w-7xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-white">Development Timeline</h2>
            <div className="flex items-center gap-8">
              {["2024", "2025", "2026"].map((year) => (
                <div key={year} className="text-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white mb-2 ${
                    year === "2024" ? "bg-purple-600" :
                    year === "2025" ? "bg-blue-600" : "bg-green-600"
                  }`}>
                    {year}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between mb-6 px-6">
          <button
            onClick={() => document.getElementById('timeline-container')?.scrollBy({ left: -400, behavior: 'smooth' })}
            className="p-3 bg-gray-800 hover:bg-gray-700 rounded-full text-white transition-all border border-gray-700"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="text-sm text-gray-400">Scroll to explore timeline →</div>
          <button
            onClick={() => document.getElementById('timeline-container')?.scrollBy({ left: 400, behavior: 'smooth' })}
            className="p-3 bg-gray-800 hover:bg-gray-700 rounded-full text-white transition-all border border-gray-700"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>

        {/* Horizontal Timeline Container */}
        <div
          id="timeline-container"
          className="relative overflow-x-auto scrollbar-hide pb-8"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="relative min-w-max px-12">
            {/* Main Timeline Line */}
            <div className="absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-blue-600 to-green-600"></div>

            {/* Timeline Content */}
            <div className="relative flex gap-8 pb-8">
              {roadmapFeatures
                .sort((a, b) => {
                  const dateOrder = ["Q1 2024", "Q2 2024", "Q3 2024", "Q4 2024", "Q1 2025", "Q2 2025", "Q3 2025", "Q4 2025", "Q1 2026"];
                  return dateOrder.indexOf(a.timeline) - dateOrder.indexOf(b.timeline);
                })
                .map((feature) => {
                  const yearIndex = feature.timeline.includes("2024") ? 0 : feature.timeline.includes("2025") ? 1 : 2;
                  const yearColors = ["bg-purple-600", "bg-blue-600", "bg-green-600"];

                  return (
                    <div key={feature.id} className="relative flex-shrink-0 w-80 group">
                      {/* Timeline Node */}
                      <div className={`absolute -top-6 left-1/2 transform -translate-x-1/2 w-6 h-6 ${yearColors[yearIndex]} rounded-full border-4 border-gray-900 ${getStatusColor(feature.status)} z-10`}></div>

                      {/* Timeline Label */}
                      <div className="text-center mb-4 -mt-2">
                        <div className="text-sm font-semibold text-white bg-gray-800 px-3 py-1 rounded-full border border-gray-700 inline-block">
                          {feature.timeline}
                        </div>
                      </div>

                      {/* Feature Card */}
                      <div
                        className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-purple-500 transition-all cursor-pointer transform hover:scale-105 h-full"
                        onClick={() => setSelectedFeature(feature)}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
                            <feature.icon className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(feature.difficulty)}`}>
                              {feature.difficulty}
                            </span>
                            <span className={`w-3 h-3 rounded-full ${getStatusColor(feature.status)}`}></span>
                          </div>
                        </div>

                        <h3 className="text-lg font-semibold text-white mb-2">
                          {feature.title}
                        </h3>

                        <p className="text-gray-400 text-sm leading-relaxed mb-4">
                          {feature.description}
                        </p>

                        {/* Category Badge */}
                        <div className="mb-3">
                          <span className="text-xs text-purple-400 font-medium bg-purple-900/30 px-2 py-1 rounded">
                            {feature.category}
                          </span>
                        </div>

                        {/* Key Features */}
                        <div className="space-y-2">
                          <div className="text-xs font-medium text-gray-500">Key Features:</div>
                          <div className="flex flex-wrap gap-1">
                            {feature.features.slice(0, 3).map((feat, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full text-xs"
                              >
                                {feat}
                              </span>
                            ))}
                            {feature.features.length > 3 && (
                              <span className="px-2 py-1 bg-gray-600/50 text-gray-400 text-xs rounded-full">
                                +{feature.features.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Year Dividers */}
            <div className="absolute top-20 bottom-0 pointer-events-none">
              <div className="absolute left-1/3 top-0 bottom-0 w-0.5 bg-purple-600/30"></div>
              <div className="absolute left-2/3 top-0 bottom-0 w-0.5 bg-blue-600/30"></div>
            </div>
          </div>
        </div>

        {/* Timeline Progress Indicator */}
        <div className="sticky bottom-0 z-20 bg-gray-900/95 backdrop-blur-sm border-t border-gray-800 py-3">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between text-sm">
              <div className="text-gray-400">Progress</div>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="w-1/3 h-full bg-gradient-to-r from-purple-600 to-blue-600"></div>
                </div>
                <div className="text-gray-400">33% Complete</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Detail Modal */}
      {selectedFeature && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${selectedFeature.color} flex items-center justify-center`}>
                  <selectedFeature.icon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {selectedFeature.title}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {selectedFeature.timeline}
                    </span>
                    <span className={`px-2 py-1 rounded-full ${getDifficultyColor(selectedFeature.difficulty)}`}>
                      {selectedFeature.difficulty}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedFeature(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <p className="text-gray-300 mb-6 leading-relaxed">
              {selectedFeature.description}
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Key Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedFeature.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-gray-300">
                      <Star className="h-4 w-4 text-purple-400" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Category</span>
                  <span className="text-sm text-purple-400 font-medium">
                    {selectedFeature.category}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-gray-400">Status</span>
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${getStatusColor(selectedFeature.status)}`}></span>
                    <span className="text-sm text-gray-300 capitalize">
                      {selectedFeature.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Call to Action */}
      <div className="relative py-24">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Join the Health Monitoring Revolution
          </h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            We&apos;re building the future of discreet health monitoring.
            Be part of the journey to improve senior care through innovative technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
              Get Involved
            </button>
            <button className="px-8 py-3 bg-gray-800 text-white rounded-xl font-semibold border border-gray-700 hover:bg-gray-700 transition-all">
              View Documentation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}