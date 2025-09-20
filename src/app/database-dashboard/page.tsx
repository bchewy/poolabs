"use client";

import { useState, useEffect, useCallback } from "react";
import { StoredAnalysis } from "@/lib/database";
import { Brain, Calendar, Smartphone, Droplets, Scale, AlertTriangle, ChevronLeft, ChevronRight, Image as ImageIcon, BarChart3, Filter, Users } from "lucide-react";
import { ImageModal } from "@/components/ImageModal";
import Image from "next/image";

// Helper function to detect MIME type from base64 data and normalize it
const normalizeImageData = (imageData: string): string => {
  // Check if the data already has a MIME type prefix
  if (imageData.startsWith('data:')) {
    return imageData;
  }

  // Remove any whitespace
  const cleanData = imageData.trim();

  // Detect MIME type from base64 signature
  let mimeType = 'image/jpeg'; // default

  if (cleanData.startsWith('iVBORw')) {
    mimeType = 'image/png';
  } else if (cleanData.startsWith('R0lGOD')) {
    mimeType = 'image/gif';
  } else if (cleanData.startsWith('/9j/')) {
    mimeType = 'image/jpeg';
  } else if (cleanData.startsWith('UklGR')) {
    mimeType = 'image/webp';
  }

  return `data:${mimeType};base64,${cleanData}`;
};

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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(10);
  const [filterEnabled, setFilterEnabled] = useState(true);

  // Modal state
  const [selectedImage, setSelectedImage] = useState<{
    data: string;
    filename: string;
  } | null>(null);
  const [isModalBlurred, setIsModalBlurred] = useState(false); // Start unblurred since user clicked to open

  const fetchAnalyses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch both analyses and total count in parallel
      const offset = (currentPage - 1) * itemsPerPage;
      const [analysesResponse, countResponse] = await Promise.all([
        fetch(`/api/analyses?limit=${itemsPerPage}&offset=${offset}&filter=${filterEnabled}`),
        fetch(`/api/analyses/count?filter=${filterEnabled}`)
      ]);

      if (!analysesResponse.ok) {
        throw new Error('Failed to fetch analyses');
      }

      const analysesData = await analysesResponse.json();
      setAnalyses(analysesData.analyses || []);

      // Get total count
      if (countResponse.ok) {
        const countData = await countResponse.json();
        setTotalItems(countData.count);
      } else {
        // Fallback: estimate based on current page
        setTotalItems(offset + analysesData.analyses.length);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analyses');
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, filterEnabled]);

  useEffect(() => {
    fetchAnalyses();
  }, [fetchAnalyses]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleImageClick = (imageData: string, filename: string) => {
    setSelectedImage({ data: normalizeImageData(imageData), filename });
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
    setIsModalBlurred(false); // Reset for next time
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
      <div className="min-h-screen">
        <div className="mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-12">
          <div className="flex items-center justify-center h-64">
            <div className="text-center animate-scale-in">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-blue-600 dark:text-blue-400 animate-pulse" />
              </div>
              <p className="text-gray-600 dark:text-gray-400">Loading your health history...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <div className="mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-12">
          <div className="flex items-center justify-center h-64">
            <div className="text-center animate-scale-in">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <p className="text-red-600 dark:text-red-400 font-medium">Error: {error}</p>
              <button
                onClick={fetchAnalyses}
                className="mt-4 bg-blue-600 hover:bg-blue-700 px-6 py-2 text-sm font-semibold text-white transition-all hover:scale-105 rounded-full"
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
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                  My Health History
                </h1>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
                  Track your digestive health journey over time
                </p>
              </div>
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700">
                <Filter className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Filter incomplete entries
                </span>
                <button
                  onClick={() => setFilterEnabled(!filterEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    filterEnabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      filterEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 animate-scale-in" style={{animationDelay: '0.1s'}}>
          <div className="group bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-200 dark:border-blue-800/30 hover:shadow-lg transition-all hover:scale-105">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center">
                <Brain className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Photos Analyzed
                </p>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                  {totalItems}
                </p>
              </div>
            </div>
          </div>

          <div className="group bg-purple-50 dark:bg-purple-900/20 p-6 rounded-2xl border border-purple-200 dark:border-purple-800/30 hover:shadow-lg transition-all hover:scale-105">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/40 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                  Devices Used
                </p>
                <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                  {new Set(analyses.map(a => a.device_id).filter(Boolean)).size}
                </p>
              </div>
            </div>
          </div>

          <div className="group bg-green-50 dark:bg-green-900/20 p-6 rounded-2xl border border-green-200 dark:border-green-800/30 hover:shadow-lg transition-all hover:scale-105">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/40 rounded-xl flex items-center justify-center">
                <Scale className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-300">
                  Avg Health Score
                </p>
                <p className="text-3xl font-bold text-green-900 dark:text-green-100">
                  {analyses.length > 0
                    ? (analyses.reduce((sum, a) => sum + (a.bristol_score || 0), 0) / analyses.filter(a => a.bristol_score).length).toFixed(1)
                    : 'N/A'
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="group bg-cyan-50 dark:bg-cyan-900/20 p-6 rounded-2xl border border-cyan-200 dark:border-cyan-800/30 hover:shadow-lg transition-all hover:scale-105">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/40 rounded-xl flex items-center justify-center">
                <Droplets className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-cyan-700 dark:text-cyan-300">
                  Avg Hydration
                </p>
                <p className="text-3xl font-bold text-cyan-900 dark:text-cyan-100">
                  {analyses.length > 0
                    ? Math.round((analyses.reduce((sum, a) => sum + (a.hydration_index || 0), 0) / analyses.filter(a => a.hydration_index).length) * 100)
                    : 0
                  }%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Pagination Controls */}
        {totalPages > 1 && (
          <div className="mb-6 flex items-center justify-between animate-slide-up" style={{animationDelay: '0.2s'}}>
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              Page {currentPage} of {totalPages} • {totalItems} photos analyzed
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-xl border border-gray-200 dark:border-gray-700 transition-all hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`h-10 w-10 rounded-xl text-sm font-medium transition-all ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:scale-105'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-xl border border-gray-200 dark:border-gray-700 transition-all hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Analyses List */}
        <div className="space-y-6 animate-scale-in" style={{animationDelay: '0.3s'}}>
          {analyses.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/10 p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Photos Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Start by uploading photos to begin tracking your digestive health journey.
              </p>
            </div>
          ) : (
            <>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-6">
                Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} photos
              </div>
              {analyses.map((analysis) => (
                <div
                  key={analysis.id}
                  className="group bg-white dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] backdrop-blur-sm"
                >
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                              <ImageIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {analysis.filename}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  {new Date(analysis.created_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-xl border border-purple-200 dark:border-purple-800/30">
                              <div className="flex items-center gap-2 mb-2">
                                <Scale className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                <p className="text-xs font-medium text-purple-700 dark:text-purple-300">
                                  Health Score
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getBristolColor(analysis.bristol_score)}`}>
                                  {analysis.bristol_score || 'N/A'}
                                </span>
                                {analysis.bristol_score && (
                                  <span className="text-xs text-purple-600 dark:text-purple-400">
                                    {bristolDescriptions[analysis.bristol_score]}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="bg-cyan-50 dark:bg-cyan-900/20 p-3 rounded-xl border border-cyan-200 dark:border-cyan-800/30">
                              <div className="flex items-center gap-2 mb-2">
                                <Droplets className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                                <p className="text-xs font-medium text-cyan-700 dark:text-cyan-300">
                                  Hydration
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getConfidenceColor(analysis.confidence)}`}>
                                  {analysis.hydration_index ? Math.round(analysis.hydration_index * 100) + '%' : 'N/A'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {analysis.color && (
                            <div className="bg-gray-50 dark:bg-gray-800/40 p-3 rounded-xl border border-gray-200 dark:border-gray-700 mb-3">
                              <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Detected Color
                              </p>
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200 capitalize">
                                {analysis.color}
                              </span>
                            </div>
                          )}

                          {analysis.flags && analysis.flags.length > 0 && (
                            <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-xl border border-red-200 dark:border-red-800/30 mb-3">
                              <p className="text-xs font-medium text-red-700 dark:text-red-300 mb-2">
                                Health Notes
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {analysis.flags.map((flag, index) => (
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

                          {analysis.analysis && (
                            <div className="bg-teal-50 dark:bg-teal-900/20 p-3 rounded-xl border border-teal-200 dark:border-teal-800/30 mb-3">
                              <p className="text-xs font-medium text-teal-700 dark:text-teal-300 mb-1">
                                What This Means
                              </p>
                              <p className="text-sm text-teal-900 dark:text-teal-100 leading-relaxed">
                                {analysis.analysis}
                              </p>
                            </div>
                          )}

                          {analysis.device_id && (
                            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/40 p-2 rounded-lg">
                              <Smartphone className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                              <span className="text-xs text-gray-600 dark:text-gray-400">
                                Device: {analysis.device_id}
                              </span>
                            </div>
                          )}
                    </div>

                    <div className="flex-shrink-0">
                      <div className="group relative">
                        <button
                          onClick={() => handleImageClick(analysis.image_data, analysis.filename)}
                          className="block"
                        >
                          <div className="w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 transition-all hover:border-blue-400 hover:shadow-lg hover:scale-105">
                            <Image
                              src={normalizeImageData(analysis.image_data)}
                              alt={analysis.filename}
                              width={128}
                              height={128}
                              className="w-full h-full object-cover blur-sm hover:blur-none transition-all duration-300"
                            />
                          </div>
                        </button>
                        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                          Click to view
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Bottom Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between animate-slide-up" style={{animationDelay: '0.4s'}}>
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-xl border border-gray-200 dark:border-gray-700 transition-all hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`h-10 w-10 rounded-xl text-sm font-medium transition-all ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:scale-105'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-xl border border-gray-200 dark:border-gray-700 transition-all hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={selectedImage !== null}
        onClose={handleCloseModal}
        imageData={selectedImage?.data || ''}
        filename={selectedImage?.filename || ''}
        isBlurred={isModalBlurred}
        onToggleBlur={() => setIsModalBlurred(!isModalBlurred)}
      />
    </div>
  );
}