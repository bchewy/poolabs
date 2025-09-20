"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Upload, Eye, EyeOff, Brain, CheckCircle, AlertCircle } from "lucide-react";

interface AIAnalysisResult {
  bristolScore?: number;
  color?: string;
  volumeEstimate?: "low" | "medium" | "high";
  hydrationIndex?: number;
  flags?: string[];
  confidence?: number;
  analysis?: string;
}

interface UploadResponse {
  ok: boolean;
  filename: string;
  mimeType: string;
  size: number;
  error?: string;
  meta: {
    deviceId?: string;
    bristolScore?: string;
    notes?: string;
  };
  aiAnalysis?: AIAnalysisResult;
}

const bristolDescriptions: Record<number, string> = {
  1: "Severe constipation",
  2: "Constipation",
  3: "Optimal",
  4: "Optimal",
  5: "Borderline loose",
  6: "Loose stool",
  7: "Diarrhoea",
};

export default function ImageUploadTestPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [deviceId, setDeviceId] = useState<string>("microbit-controller-01");
  const [notes, setNotes] = useState<string>("");
  const [result, setResult] = useState<UploadResponse | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isImageBlurred, setIsImageBlurred] = useState(true);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setResult(null);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select an image first");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // Convert file to base64
      const base64String = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const jsonData = {
        imageData: base64String,
        filename: file.name,
        mimeType: file.type,
        deviceId: deviceId,
        notes: notes || undefined,
      };

      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData),
      });

      const data: UploadResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    setNotes("");
    setIsImageBlurred(true);
  };

  const toggleImageBlur = () => {
    setIsImageBlurred(!isImageBlurred);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50 dark:from-black dark:via-zinc-950 dark:to-emerald-950">
      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-zinc-900 dark:text-white">
            AI Toilet Bowl Analysis Test
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Upload images from your micro:bit controller to test AI-powered stool analysis
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Upload Section */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/80 p-6 shadow-lg dark:border-white/5 dark:bg-zinc-900/60">
              <div className="flex items-center gap-3">
                <Upload className="h-6 w-6 text-emerald-600" />
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                  Upload Image
                </h2>
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Device ID
                  </label>
                  <input
                    type="text"
                    value={deviceId}
                    onChange={(e) => setDeviceId(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                    placeholder="microbit-controller-01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Select Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-600 file:px-3 file:py-1.5 file:text-white hover:file:bg-emerald-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Notes (optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                    rows={3}
                    placeholder="Add any context about the image..."
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-red-700 dark:bg-red-900/20 dark:text-red-300">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleUpload}
                    disabled={isUploading || !file}
                    className="flex-1 rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400/70"
                  >
                    {isUploading ? "Analyzing..." : "Upload & Analyze"}
                  </button>

                  {(file || result) && (
                    <button
                      onClick={resetForm}
                      className="rounded-full border border-zinc-300 bg-white px-4 py-3 text-sm font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Image Preview */}
            {preview && (
              <div className="rounded-3xl border border-white/10 bg-white/80 p-6 shadow-lg dark:border-white/5 dark:bg-zinc-900/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Eye className="h-6 w-6 text-emerald-600" />
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                      Image Preview
                    </h3>
                  </div>
                  <button
                    onClick={toggleImageBlur}
                    className="flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                  >
                    {isImageBlurred ? (
                      <>
                        <Eye className="h-4 w-4" />
                        Unblur
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-4 w-4" />
                        Blur
                      </>
                    )}
                  </button>
                </div>
                <div className="mt-4 relative">
                  <img
                    src={preview}
                    alt="Preview"
                    className={`w-full rounded-xl border border-zinc-200 dark:border-zinc-700 transition-all duration-300 ${
                      isImageBlurred ? 'blur-2xl scale-105' : 'blur-none'
                    }`}
                  />
                  {isImageBlurred && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/20">
                      <div className="text-center">
                        <EyeOff className="mx-auto h-8 w-8 text-white/80" />
                        <p className="mt-2 text-sm font-medium text-white/90">
                          Image blurred for discretion
                        </p>
                        <p className="text-xs text-white/70">
                          Click &quot;Unblur&quot; to view
                        </p>
                      </div>
                    </div>
                  )}
                  {file && (
                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                      {file.name} ({Math.round(file.size / 1024)}KB)
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {result ? (
              <div className="rounded-3xl border border-white/10 bg-white/80 p-6 shadow-lg dark:border-white/5 dark:bg-zinc-900/60">
                <div className="flex items-center gap-3">
                  <Brain className="h-6 w-6 text-emerald-600" />
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                    AI Analysis Results
                  </h2>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>

                {result.aiAnalysis && (
                  <div className="mt-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-xl bg-emerald-50 p-4 dark:bg-emerald-900/20">
                        <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                          Bristol Score
                        </p>
                        <p className="text-lg font-bold text-emerald-900 dark:text-emerald-100">
                          {result.aiAnalysis.bristolScore}
                        </p>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400">
                          {result.aiAnalysis.bristolScore ? bristolDescriptions[result.aiAnalysis.bristolScore] : 'N/A'}
                        </p>
                      </div>

                      <div className="rounded-xl bg-blue-50 p-4 dark:bg-blue-900/20">
                        <p className="text-xs font-medium text-blue-700 dark:text-blue-300">
                          Volume
                        </p>
                        <p className="text-lg font-bold text-blue-900 dark:text-blue-100 capitalize">
                          {result.aiAnalysis.volumeEstimate}
                        </p>
                      </div>

                      <div className="rounded-xl bg-purple-50 p-4 dark:bg-purple-900/20">
                        <p className="text-xs font-medium text-purple-700 dark:text-purple-300">
                          Hydration Index
                        </p>
                        <p className="text-lg font-bold text-purple-900 dark:text-purple-100">
                          {Math.round((result.aiAnalysis.hydrationIndex || 0) * 100)}%
                        </p>
                      </div>

                      <div className="rounded-xl bg-orange-50 p-4 dark:bg-orange-900/20">
                        <p className="text-xs font-medium text-orange-700 dark:text-orange-300">
                          Confidence
                        </p>
                        <p className="text-lg font-bold text-orange-900 dark:text-orange-100">
                          {Math.round((result.aiAnalysis.confidence || 0) * 100)}%
                        </p>
                      </div>
                    </div>

                    {result.aiAnalysis.color && (
                      <div className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-800/40">
                        <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                          Detected Color
                        </p>
                        <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100 capitalize">
                          {result.aiAnalysis.color}
                        </p>
                      </div>
                    )}

                    {result.aiAnalysis.flags && result.aiAnalysis.flags.length > 0 && (
                      <div className="rounded-xl bg-rose-50 p-4 dark:bg-rose-900/20">
                        <p className="text-xs font-medium text-rose-700 dark:text-rose-300">
                          Health Flags
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {result.aiAnalysis.flags.map((flag, index) => (
                            <span
                              key={index}
                              className="rounded-full bg-rose-200 px-2 py-1 text-xs font-medium text-rose-800 dark:bg-rose-800/30 dark:text-rose-200"
                            >
                              {flag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {result.aiAnalysis.analysis && (
                      <div className="rounded-xl bg-teal-50 p-4 dark:bg-teal-900/20">
                        <p className="text-xs font-medium text-teal-700 dark:text-teal-300">
                          AI Analysis Summary
                        </p>
                        <p className="mt-2 text-sm text-teal-900 dark:text-teal-100">
                          {result.aiAnalysis.analysis}
                        </p>
                      </div>
                    )}

                    <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/40">
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        Upload Details
                      </p>
                      <div className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <p>File: {result.filename}</p>
                        <p>Size: {Math.round(result.size / 1024)}KB</p>
                        <p>Device: {result.meta.deviceId}</p>
                        {result.meta.notes && <p>Notes: {result.meta.notes}</p>}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center dark:border-zinc-700 dark:bg-zinc-900/40">
                <Brain className="mx-auto h-12 w-12 text-zinc-400" />
                <h3 className="mt-4 text-lg font-medium text-zinc-900 dark:text-zinc-100">
                  AI Analysis Ready
                </h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  Upload an image to see AI-powered stool analysis results here. The system will analyze the image and provide health insights.
                </p>
              </div>
            )}

            {/* API Info */}
            <div className="rounded-3xl border border-white/10 bg-white/80 p-6 shadow-lg dark:border-white/5 dark:bg-zinc-900/60">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
                API Integration Info
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-zinc-700 dark:text-zinc-300">Endpoint:</p>
                  <code className="block mt-1 rounded bg-black/10 px-2 py-1 text-xs text-emerald-600 dark:bg-black/20 dark:text-emerald-400">
                    POST /api/upload
                  </code>
                </div>
                <div>
                  <p className="font-medium text-zinc-700 dark:text-zinc-300">Content-Type:</p>
                  <code className="block mt-1 rounded bg-black/10 px-2 py-1 text-xs text-emerald-600 dark:bg-black/20 dark:text-emerald-400">
                    application/json
                  </code>
                </div>
                <div>
                  <p className="font-medium text-zinc-700 dark:text-zinc-300">Required fields:</p>
                  <code className="block mt-1 rounded bg-black/10 px-2 py-1 text-xs text-emerald-600 dark:bg-black/20 dark:text-emerald-400">
                    imageData, filename, mimeType
                  </code>
                </div>
                <div>
                  <p className="font-medium text-zinc-700 dark:text-zinc-300">Optional fields:</p>
                  <code className="block mt-1 rounded bg-black/10 px-2 py-1 text-xs text-emerald-600 dark:bg-black/20 dark:text-emerald-400">
                    deviceId, notes
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}