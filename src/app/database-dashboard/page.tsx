"use client";

import { useState, useEffect } from "react";
import { StoredAnalysis } from "@/lib/database";
import { Brain, Calendar, Smartphone, Droplets, Scale, AlertTriangle } from "lucide-react";

const bristolDescriptions: Record<number, string> = {
  1: "Severe constipation",
  2: "Constipation",
  3: "Optimal",
  4: "Optimal",
  5: "Borderline loose",
  6: "Loose stool",
  7: "Diarrhoea",
};

export default function DatabaseDashboardPage() {
  const [analyses, setAnalyses] = useState<StoredAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const fetchAnalyses = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/analyses');
      if (!response.ok) {
        throw new Error('Failed to fetch analyses');
      }

      const data = await response.json();
      setAnalyses(data.analyses || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analyses');
    } finally {
      setLoading(false);
    }
  };

  const getBristolColor = (score?: number) => {
    if (!score) return 'bg-gray-100 text-gray-800';
    if (score >= 3 && score <= 4) return 'bg-green-100 text-green-800';
    if (score >= 2 && score <= 6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getConfidenceColor = (confidence?: number) => {
    if (!confidence) return 'bg-gray-100 text-gray-800';
    if (confidence >= 0.8) return 'bg-green-100 text-green-800';
    if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50 dark:from-black dark:via-zinc-950 dark:to-emerald-950">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Brain className="mx-auto h-8 w-8 text-emerald-600 animate-pulse" />
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">Loading analysis results...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50 dark:from-black dark:via-zinc-950 dark:to-emerald-950">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertTriangle className="mx-auto h-8 w-8 text-red-600" />
              <p className="mt-2 text-red-600">Error: {error}</p>
              <button
                onClick={fetchAnalyses}
                className="mt-4 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50 dark:from-black dark:via-zinc-950 dark:to-emerald-950">
      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            Database Analysis Dashboard
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            View all stored AI stool analysis results from database
          </p>
        </div>

        {/* Stats Overview */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-white/10 bg-white/80 p-6 shadow-lg dark:border-white/5 dark:bg-zinc-900/60">
            <div className="flex items-center gap-3">
              <Brain className="h-6 w-6 text-emerald-600" />
              <div>
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  Total Analyses
                </p>
                <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                  {analyses.length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/80 p-6 shadow-lg dark:border-white/5 dark:bg-zinc-900/60">
            <div className="flex items-center gap-3">
              <Smartphone className="h-6 w-6 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  Unique Devices
                </p>
                <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                  {new Set(analyses.map(a => a.device_id).filter(Boolean)).size}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/80 p-6 shadow-lg dark:border-white/5 dark:bg-zinc-900/60">
            <div className="flex items-center gap-3">
              <Scale className="h-6 w-6 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  Avg Bristol Score
                </p>
                <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                  {analyses.length > 0
                    ? (analyses.reduce((sum, a) => sum + (a.bristol_score || 0), 0) / analyses.filter(a => a.bristol_score).length).toFixed(1)
                    : 'N/A'
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/80 p-6 shadow-lg dark:border-white/5 dark:bg-zinc-900/60">
            <div className="flex items-center gap-3">
              <Droplets className="h-6 w-6 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  Avg Hydration
                </p>
                <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                  {analyses.length > 0
                    ? Math.round((analyses.reduce((sum, a) => sum + (a.hydration_index || 0), 0) / analyses.filter(a => a.hydration_index).length) * 100)
                    : 0
                  }%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Analyses List */}
        <div className="space-y-4">
          {analyses.length === 0 ? (
            <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center dark:border-zinc-700 dark:bg-zinc-900/40">
              <Brain className="mx-auto h-12 w-12 text-zinc-400" />
              <h3 className="mt-4 text-lg font-medium text-zinc-900 dark:text-zinc-100">
                No analyses yet
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Upload images to see AI analysis results here.
              </p>
            </div>
          ) : (
            analyses.map((analysis) => (
              <div
                key={analysis.id}
                className="rounded-xl border border-white/10 bg-white/80 p-6 shadow-lg dark:border-white/5 dark:bg-zinc-900/60"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                          {analysis.filename}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="h-4 w-4 text-zinc-400" />
                          <span className="text-sm text-zinc-600 dark:text-zinc-400">
                            {new Date(analysis.created_at).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <Scale className="h-5 w-5 text-purple-600" />
                        <div>
                          <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                            Bristol Score
                          </p>
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBristolColor(analysis.bristol_score)}`}>
                              {analysis.bristol_score || 'N/A'}
                            </span>
                            {analysis.bristol_score && (
                              <span className="text-xs text-zinc-600 dark:text-zinc-400">
                                {bristolDescriptions[analysis.bristol_score]}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Droplets className="h-5 w-5 text-orange-600" />
                        <div>
                          <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                            Hydration
                          </p>
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getConfidenceColor(analysis.confidence)}`}>
                              {analysis.hydration_index ? Math.round(analysis.hydration_index * 100) + '%' : 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {analysis.color && (
                      <div className="mb-2">
                        <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                          Detected Color
                        </p>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200 capitalize">
                          {analysis.color}
                        </span>
                      </div>
                    )}

                    {analysis.flags && analysis.flags.length > 0 && (
                      <div className="mb-2">
                        <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                          Health Flags
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {analysis.flags.map((flag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-200"
                            >
                              {flag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {analysis.analysis && (
                      <div className="mb-2">
                        <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                          AI Analysis
                        </p>
                        <p className="text-sm text-zinc-700 dark:text-zinc-300">
                          {analysis.analysis}
                        </p>
                      </div>
                    )}

                    {analysis.device_id && (
                      <div className="flex items-center gap-2 mt-3">
                        <Smartphone className="h-4 w-4 text-zinc-400" />
                        <span className="text-xs text-zinc-600 dark:text-zinc-400">
                          Device: {analysis.device_id}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="ml-4">
                    <img
                      src={analysis.image_data}
                      alt={analysis.filename}
                      className="w-24 h-24 object-cover rounded-lg border border-zinc-200 dark:border-zinc-700 blur-sm hover:blur-none transition-all duration-300"
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}