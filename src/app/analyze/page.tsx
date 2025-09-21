"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Upload, Eye, EyeOff, Brain, CheckCircle, AlertCircle, Microscope, Activity, BarChart3, Target, Droplets, Heart } from "lucide-react";
import Image from "next/image";

interface GutHealthInsights {
  digestionStatus: string;
  dietaryImplications: string;
  potentialIssues: string[];
  recommendations: string[];
  followUpActions: string[];
}

interface MedicalInterpretation {
  possibleConditions: string[];
  urgencyLevel: "low" | "medium" | "high";
  whenToConsultDoctor: string;
  redFlags: string[];
}

interface AIAnalysisResult {
  bristolScore?: number;
  color?: string;
  volumeEstimate?: "low" | "medium" | "high";
  hydrationIndex?: number;
  flags?: string[];
  confidence?: number;
  analysis?: string;
  gutHealthInsights?: GutHealthInsights;
  medicalInterpretation?: MedicalInterpretation;
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
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStage, setUploadStage] = useState<'idle' | 'uploading' | 'analyzing' | 'storing'>('idle');
  const [startTime, setStartTime] = useState<number>(0);
  const [isPoopTheme, setIsPoopTheme] = useState(false);

  // Check for poop theme
  useEffect(() => {
    const checkTheme = () => {
      const currentTheme = localStorage.getItem("poolabs-theme");
      setIsPoopTheme(currentTheme === "Poop Fun");
    };

    checkTheme();
    window.addEventListener("storage", checkTheme);
    window.addEventListener("themeChange", ((e: CustomEvent) => {
      setIsPoopTheme(e.detail === "Poop Fun");
    }) as EventListener);

    return () => {
      window.removeEventListener("storage", checkTheme);
      window.removeEventListener("themeChange", checkTheme as EventListener);
    };
  }, []);

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
    setUploadProgress(0);
    setUploadStage('uploading');
    setStartTime(Date.now());

    try {
      // Stage 1: File Processing (0-10%) - until file is converted to base64
      const processingInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 10) {
            clearInterval(processingInterval);
            return 10;
          }
          return prev + Math.random() * 3 + 1;
        });
      }, 50);

      // Convert file to base64
      const base64String = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      clearInterval(processingInterval);
      setUploadProgress(10);

      // Stage 2: API Analysis (10-90%) - sync with actual API call
      setUploadStage('analyzing');
      setUploadProgress(10);

      const jsonData = {
        imageData: base64String,
        filename: file.name,
        mimeType: file.type,
        deviceId: deviceId,
        notes: notes || undefined,
      };

      // Start the actual API call and track progress
      const apiStartTime = Date.now();

      // Simulate progress based on typical API response time
      const analysisInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(analysisInterval);
            return 90;
          }
          // Gradual progress during API call
          return prev + Math.random() * 2 + 0.5;
        });
      }, 500);

      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData),
      });

      const data: UploadResponse = await response.json();

      // Clear analysis interval
      clearInterval(analysisInterval);

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      // Ensure we reach at least 90% after API completion
      setUploadProgress(Math.max(90, uploadProgress));

      // Stage 3: Final Processing (90-100%) - quick completion
      setUploadStage('storing');
      setUploadProgress(95);

      // Brief delay for final processing
      await new Promise(resolve => setTimeout(resolve, 100));
      setUploadProgress(100);

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      // Hold at 100% for a moment before resetting
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        setUploadStage('idle');
        setStartTime(0);
      }, 1500);
    }
  };

  const resetForm = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    setNotes("");
    setIsImageBlurred(true);
    setUploadProgress(0);
    setUploadStage('idle');
    setStartTime(0);
  };

  const toggleImageBlur = () => {
    setIsImageBlurred(!isImageBlurred);
  };

  // Calculate time remaining
  const getTimeRemaining = () => {
    if (startTime === 0) return '';

    const elapsed = Date.now() - startTime;

    if (uploadStage === 'uploading') {
      return 'Preparing file...';
    } else if (uploadStage === 'analyzing') {
      // Estimate based on progress (10-90% is analysis)
      const analysisProgress = Math.max(0, (uploadProgress - 10) / 80);
      const avgTimePerPercent = elapsed / Math.max(uploadProgress - 10, 1);
      const estimatedRemaining = avgTimePerPercent * (90 - uploadProgress);
      return `About ${Math.ceil(estimatedRemaining / 1000)} seconds remaining`;
    } else if (uploadStage === 'storing') {
      return 'Finalizing...';
    }
    return '';
  };

  // Loading Overlay Component
  const LoadingOverlay = () => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          {/* Animated Icon */}
          <div className="mb-6">
            {uploadStage === 'uploading' && (
              <div className="relative">
                <Upload className={`w-12 h-12 mx-auto mb-4 animate-pulse ${
                  isPoopTheme ? 'text-amber-500' : 'text-amber-600'
                }`} />
                <div className={`w-12 h-12 border-4 rounded-full animate-spin mx-auto ${
                  isPoopTheme
                    ? 'border-amber-200 border-t-amber-500'
                    : 'border-amber-200 border-t-amber-600'
                }`}></div>
              </div>
            )}
            {uploadStage === 'analyzing' && (
              <div className="relative">
                <Brain className={`w-12 h-12 mx-auto mb-4 animate-pulse ${
                  isPoopTheme ? 'text-amber-400' : 'text-purple-600'
                }`} />
                <div className={`w-12 h-12 border-4 rounded-full animate-spin mx-auto ${
                  isPoopTheme
                    ? 'border-amber-200 border-t-amber-400'
                    : 'border-purple-200 border-t-purple-600'
                }`}></div>
              </div>
            )}
            {uploadStage === 'storing' && (
              <div className="relative">
                <Activity className={`w-12 h-12 mx-auto mb-4 animate-pulse ${
                  isPoopTheme ? 'text-yellow-600' : 'text-green-600'
                }`} />
                <div className={`w-12 h-12 border-4 rounded-full animate-spin mx-auto ${
                  isPoopTheme
                    ? 'border-yellow-200 border-t-yellow-600'
                    : 'border-green-200 border-t-green-600'
                }`}></div>
              </div>
            )}
          </div>

          {/* Stage Title */}
          <h3 className={`text-xl font-semibold mb-2 ${
            isPoopTheme
              ? 'text-amber-700 dark:text-amber-300'
              : 'text-gray-900 dark:text-white'
          }`}>
            {uploadStage === 'uploading' && (isPoopTheme ? '🚽 Uploading Your Masterpiece...' : 'Uploading Image...')}
            {uploadStage === 'analyzing' && (isPoopTheme ? '🔬 AI Poop Analysis...' : 'AI Analysis in Progress...')}
            {uploadStage === 'storing' && (isPoopTheme ? '💾 Saving Poo Data...' : 'Saving Results...')}
          </h3>

          {/* Stage Description */}
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            {uploadStage === 'uploading' && 'Preparing your image for AI analysis...'}
            {uploadStage === 'analyzing' && 'Our AI is performing comprehensive stool analysis using GPT-5... This may take 20-30 seconds.'}
            {uploadStage === 'storing' && 'Storing your analysis results securely...'}
          </p>

          {/* Time Remaining */}
          {uploadStage === 'analyzing' && (
            <div className="mb-4">
              <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                isPoopTheme
                  ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                  : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
              }`}>
                {getTimeRemaining()}
              </span>
            </div>
          )}

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2 overflow-hidden">
              <div
                className={`h-3 rounded-full transition-all duration-300 ease-out ${
                  isPoopTheme
                    ? uploadStage === 'uploading' ? 'bg-amber-500' :
                      uploadStage === 'analyzing' ? 'bg-amber-400' :
                      'bg-yellow-600'
                    : uploadStage === 'uploading' ? 'bg-amber-600' :
                      uploadStage === 'analyzing' ? 'bg-purple-600' :
                      'bg-green-600'
                }`}
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                {uploadProgress}% complete
              </p>
              <div className="flex space-x-1">
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse"></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          </div>

          {/* AI Features */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center mx-auto mb-1">
                <Target className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Bristol Scale</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-1">
                <Heart className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Gut Health</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-1">
                <Droplets className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Hydration</p>
            </div>
          </div>

          {/* Loading Animation */}
          <div className="flex justify-center space-x-1">
            <div className={`w-2 h-2 rounded-full animate-bounce ${
              isPoopTheme ? 'bg-amber-500' : 'bg-amber-600'
            }`}></div>
            <div className={`w-2 h-2 rounded-full animate-bounce ${
              isPoopTheme ? 'bg-amber-400' : 'bg-purple-600'
            }`} style={{animationDelay: '0.1s'}}></div>
            <div className={`w-2 h-2 rounded-full animate-bounce ${
              isPoopTheme ? 'bg-yellow-600' : 'bg-green-600'
            }`} style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Loading Overlay */}
      {isUploading && <LoadingOverlay />}
      <div className="mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 transition-smooth"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <div className={`flex items-center gap-4 mt-4 ${isPoopTheme ? 'animate-bounce-soft' : ''}`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              isPoopTheme
                ? 'bg-amber-100 dark:bg-amber-900/30'
                : 'bg-amber-100 dark:bg-amber-900/30'
            }`}>
              <Microscope className={`h-6 w-6 ${
                isPoopTheme
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-amber-600 dark:text-amber-400'
              }`} />
            </div>
            <div>
              <h1 className={`text-4xl font-bold ${
                isPoopTheme
                  ? 'text-amber-700 dark:text-amber-300'
                  : 'text-gray-900 dark:text-white'
              }`}>
                {isPoopTheme ? '🔬 Analyze' : 'Analyze'}
              </h1>
              <p className={`mt-2 text-lg ${
                isPoopTheme
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-gray-600 dark:text-gray-300'
              }`}>
                Connect your device to get instant insights about digestive health
                {isPoopTheme && <span className="ml-2">✨</span>}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Upload Section */}
          <div className="space-y-6 animate-scale-in" style={{animationDelay: '0.1s'}}>
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <Upload className="h-6 w-6 text-amber-600" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Device Configuration
                </h2>
              </div>

              <div className="mt-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Device Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={deviceId}
                    onChange={(e) => setDeviceId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-smooth"
                    placeholder="My Phone"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Image
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*" capture="environment"
                      onChange={handleFileChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-amber-600 file:text-white hover:file:bg-amber-700 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-smooth cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Personal Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-smooth resize-none"
                    rows={3}
                    placeholder="How are you feeling today?"
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-3 rounded-xl bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 dark:border-red-800">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    onClick={handleUpload}
                    disabled={isUploading || !file}
                    className="flex-1 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 disabled:cursor-not-allowed disabled:bg-amber-400 disabled:shadow-none shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40"
                  >
                    {isUploading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        {uploadStage === 'uploading' && 'Uploading...'}
                        {uploadStage === 'analyzing' && 'Analyzing...'}
                        {uploadStage === 'storing' && 'Saving...'}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Brain className="h-4 w-4" />
                        Analyze Sample
                      </div>
                    )}
                  </button>

                  {(file || result) && (
                    <button
                      onClick={resetForm}
                      className="px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-smooth"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Image Preview */}
            {preview && (
              <div className="rounded-2xl border border-white/10 bg-white/80 p-6 shadow-lg dark:border-white/5 dark:bg-gray-900/60 backdrop-blur-sm animate-scale-in" style={{animationDelay: '0.2s'}}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                      <Eye className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Sample Preview
                    </h3>
                  </div>
                  <button
                    onClick={toggleImageBlur}
                    className="flex items-center gap-2 rounded-full bg-amber-100 dark:bg-amber-900/30 px-3 py-1.5 text-sm font-medium text-amber-700 dark:text-amber-300 transition-all hover:bg-amber-200 dark:hover:bg-amber-900/50 hover:scale-105"
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
                <div className="mt-4 relative group">
                  <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <Image
                      src={preview}
                      alt="Preview"
                      width={0}
                      height={0}
                      sizes="100vw"
                      className={`w-full transition-all duration-500 ${
                        isImageBlurred ? 'blur-2xl scale-105' : 'blur-none hover:scale-105'
                      }`}
                    />
                    {isImageBlurred && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3 mx-auto">
                            <EyeOff className="h-6 w-6 text-white" />
                          </div>
                          <p className="text-sm font-medium text-white/90">
                            Sample blurred for privacy
                          </p>
                          <p className="text-xs text-white/70 mt-1">
                            Click &quot;Unblur&quot; to view
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  {file && (
                    <div className="mt-3 flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">
                        {file.name}
                      </span>
                      <span className="text-amber-600 dark:text-amber-400 font-medium">
                        {Math.round(file.size / 1024)}KB
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {result ? (
              <div className="rounded-2xl border border-white/10 bg-white/80 p-6 shadow-lg dark:border-white/5 dark:bg-gray-900/60 backdrop-blur-sm animate-scale-in" style={{animationDelay: '0.3s'}}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                    <Brain className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Your Results
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Simple explanation of your digestive health</p>
                  </div>
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center animate-pulse-glow">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                </div>

                {result.aiAnalysis && (
                  <div className="mt-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="group bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-200 dark:border-amber-800/30 hover:shadow-md transition-all hover:scale-105">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/40 rounded-lg flex items-center justify-center">
                            <BarChart3 className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                          </div>
                          <p className="text-xs font-medium text-amber-700 dark:text-amber-300">
                            Health Score
                          </p>
                        </div>
                        <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                          {result.aiAnalysis.bristolScore}
                        </p>
                        <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                          {result.aiAnalysis.bristolScore ? bristolDescriptions[result.aiAnalysis.bristolScore] : 'N/A'}
                        </p>
                      </div>

                      <div className="group bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-200 dark:border-purple-800/30 hover:shadow-md transition-all hover:scale-105">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/40 rounded-lg flex items-center justify-center">
                            <Activity className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                          </div>
                          <p className="text-xs font-medium text-purple-700 dark:text-purple-300">
                            Volume
                          </p>
                        </div>
                        <p className="text-2xl font-bold text-purple-900 dark:text-purple-100 capitalize">
                          {result.aiAnalysis.volumeEstimate}
                        </p>
                      </div>

                      <div className="group bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-xl border border-cyan-200 dark:border-cyan-800/30 hover:shadow-md transition-all hover:scale-105">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-cyan-100 dark:bg-cyan-900/40 rounded-lg flex items-center justify-center">
                            <Droplets className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                          </div>
                          <p className="text-xs font-medium text-cyan-700 dark:text-cyan-300">
                            Hydration Index
                          </p>
                        </div>
                        <p className="text-2xl font-bold text-cyan-900 dark:text-cyan-100">
                          {Math.round((result.aiAnalysis.hydrationIndex || 0) * 100)}%
                        </p>
                      </div>

                      <div className="group bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-200 dark:border-orange-800/30 hover:shadow-md transition-all hover:scale-105">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/40 rounded-lg flex items-center justify-center">
                            <Target className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                          </div>
                          <p className="text-xs font-medium text-orange-700 dark:text-orange-300">
                            Confidence
                          </p>
                        </div>
                        <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                          {Math.round((result.aiAnalysis.confidence || 0) * 100)}%
                        </p>
                      </div>
                    </div>

                    {result.aiAnalysis.color && (
                      <div className="bg-gray-50 dark:bg-gray-800/40 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                            <Eye className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                          </div>
                          <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                            Detected Color
                          </p>
                        </div>
                        <p className="text-lg font-bold text-gray-900 dark:text-gray-100 capitalize">
                          {result.aiAnalysis.color}
                        </p>
                      </div>
                    )}

                    {result.aiAnalysis.flags && result.aiAnalysis.flags.length > 0 && (
                      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-200 dark:border-red-800/30">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-red-100 dark:bg-red-900/40 rounded-lg flex items-center justify-center">
                            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                          </div>
                          <p className="text-xs font-medium text-red-700 dark:text-red-300">
                            Health Notes
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {result.aiAnalysis.flags.map((flag, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-red-200 dark:bg-red-800/30 text-red-800 dark:text-red-200 text-xs font-medium rounded-full transition-all hover:scale-105"
                            >
                              {flag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {result.aiAnalysis.analysis && (
                      <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-xl border border-teal-200 dark:border-teal-800/30">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900/40 rounded-lg flex items-center justify-center">
                            <Microscope className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                          </div>
                          <p className="text-xs font-medium text-teal-700 dark:text-teal-300">
                            What This Means
                          </p>
                        </div>
                        <p className="text-sm text-teal-900 dark:text-teal-100 leading-relaxed">
                          {result.aiAnalysis.analysis}
                        </p>
                      </div>
                    )}

                    {/* Gut Health Insights Section */}
                    {result.aiAnalysis.gutHealthInsights && (
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-200 dark:border-purple-800/30">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/40 rounded-lg flex items-center justify-center">
                            <Activity className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                          </div>
                          <p className="text-xs font-medium text-purple-700 dark:text-purple-300">
                            Gut Health Insights
                          </p>
                        </div>

                        {result.aiAnalysis.gutHealthInsights.digestionStatus && (
                          <div className="mb-3">
                            <p className="text-xs font-medium text-purple-600 dark:text-purple-400 mb-1">Digestion Status</p>
                            <p className="text-sm text-purple-900 dark:text-purple-100">{result.aiAnalysis.gutHealthInsights.digestionStatus}</p>
                          </div>
                        )}

                        {result.aiAnalysis.gutHealthInsights.dietaryImplications && (
                          <div className="mb-3">
                            <p className="text-xs font-medium text-purple-600 dark:text-purple-400 mb-1">Dietary Implications</p>
                            <p className="text-sm text-purple-900 dark:text-purple-100">{result.aiAnalysis.gutHealthInsights.dietaryImplications}</p>
                          </div>
                        )}

                        {result.aiAnalysis.gutHealthInsights.potentialIssues.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs font-medium text-purple-600 dark:text-purple-400 mb-1">Potential Issues</p>
                            <div className="flex flex-wrap gap-1">
                              {result.aiAnalysis.gutHealthInsights.potentialIssues.map((issue, index) => (
                                <span key={index} className="px-2 py-1 bg-purple-200 dark:bg-purple-800/30 text-purple-800 dark:text-purple-200 text-xs rounded-full">
                                  {issue}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {result.aiAnalysis.gutHealthInsights.recommendations.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs font-medium text-purple-600 dark:text-purple-400 mb-1">Recommendations</p>
                            <ul className="text-sm text-purple-900 dark:text-purple-100 space-y-1">
                              {result.aiAnalysis.gutHealthInsights.recommendations.map((rec, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <span className="text-purple-500 mt-1">•</span>
                                  <span>{rec}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {result.aiAnalysis.gutHealthInsights.followUpActions.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-purple-600 dark:text-purple-400 mb-1">Follow-up Actions</p>
                            <ul className="text-sm text-purple-900 dark:text-purple-100 space-y-1">
                              {result.aiAnalysis.gutHealthInsights.followUpActions.map((action, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <span className="text-purple-500 mt-1">→</span>
                                  <span>{action}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Medical Interpretation Section */}
                    {result.aiAnalysis.medicalInterpretation && (
                      <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-200 dark:border-orange-800/30">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/40 rounded-lg flex items-center justify-center">
                            <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                          </div>
                          <p className="text-xs font-medium text-orange-700 dark:text-orange-300">
                            Medical Interpretation
                          </p>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            result.aiAnalysis.medicalInterpretation.urgencyLevel === 'high' ? 'bg-red-200 text-red-800' :
                            result.aiAnalysis.medicalInterpretation.urgencyLevel === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                            'bg-green-200 text-green-800'
                          }`}>
                            {result.aiAnalysis.medicalInterpretation.urgencyLevel.toUpperCase()} URGENCY
                          </span>
                        </div>

                        {result.aiAnalysis.medicalInterpretation.whenToConsultDoctor && (
                          <div className="mb-3">
                            <p className="text-xs font-medium text-orange-600 dark:text-orange-400 mb-1">When to Consult a Doctor</p>
                            <p className="text-sm text-orange-900 dark:text-orange-100">{result.aiAnalysis.medicalInterpretation.whenToConsultDoctor}</p>
                          </div>
                        )}

                        {result.aiAnalysis.medicalInterpretation.possibleConditions.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs font-medium text-orange-600 dark:text-orange-400 mb-1">Possible Conditions</p>
                            <div className="flex flex-wrap gap-1">
                              {result.aiAnalysis.medicalInterpretation.possibleConditions.map((condition, index) => (
                                <span key={index} className="px-2 py-1 bg-orange-200 dark:bg-orange-800/30 text-orange-800 dark:text-orange-200 text-xs rounded-full">
                                  {condition}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {result.aiAnalysis.medicalInterpretation.redFlags.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-red-600 dark:text-red-400 mb-1">⚠️ Red Flags</p>
                            <ul className="text-sm text-red-900 dark:text-red-100 space-y-1">
                              {result.aiAnalysis.medicalInterpretation.redFlags.map((flag, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <span className="text-red-500 mt-1">⚠</span>
                                  <span>{flag}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="bg-gray-50 dark:bg-gray-800/40 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                          <Upload className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        </div>
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          Sample Information
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">File:</span>
                          <span className="ml-2 text-gray-900 dark:text-gray-100 font-medium">{result.filename}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Size:</span>
                          <span className="ml-2 text-amber-600 dark:text-amber-400 font-medium">{Math.round(result.size / 1024)}KB</span>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Device:</span>
                          <span className="ml-2 text-gray-900 dark:text-gray-100 font-medium">{result.meta.deviceId}</span>
                        </div>
                        {result.meta.notes && (
                          <div className="col-span-2">
                            <span className="text-gray-500 dark:text-gray-400">Notes:</span>
                            <span className="ml-2 text-gray-900 dark:text-gray-100">{result.meta.notes}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-2xl border-2 border-dashed border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/10 p-8 text-center animate-scale-in" style={{animationDelay: '0.3s'}}>
                <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Ready to Analyze
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Connect your toilet-clip device to get instant insights about digestive health. It&apos;s simple, private, and easy to understand.
                </p>
              </div>
            )}

            {/* API Integration Info */}
            <div className="rounded-2xl border border-white/10 bg-white/80 p-6 shadow-lg dark:border-white/5 dark:bg-gray-900/60 backdrop-blur-sm animate-scale-in" style={{animationDelay: '0.4s'}}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <Activity className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  How It Works
                </h3>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-800/40 p-4 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Simple Process</span>
                    <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">Easy</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Just connect your device and our AI analyzes the data in simple terms
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                    <p className="text-xs font-medium text-green-700 dark:text-green-300 mb-1">What You Need</p>
                    <div className="text-xs text-green-600 dark:text-green-400 space-y-1">
                      <div>• Device connected</div>
                      <div>• Good lighting</div>
                    </div>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
                    <p className="text-xs font-medium text-amber-700 dark:text-amber-300 mb-1">What You Get</p>
                    <div className="text-xs text-amber-600 dark:text-amber-400 space-y-1">
                      <div>• Health insights</div>
                      <div>• Simple explanations
</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}