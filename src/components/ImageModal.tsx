"use client";

import React from "react";
import { X, Eye, EyeOff, Microscope } from "lucide-react";
import Image from "next/image";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageData: string;
  filename: string;
  isBlurred: boolean;
  onToggleBlur: () => void;
}

export function ImageModal({
  isOpen,
  onClose,
  imageData,
  filename,
  isBlurred,
  onToggleBlur
}: ImageModalProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-scale-in"
      onClick={handleBackdropClick}
    >
      <div className="relative max-w-5xl max-h-[90vh] w-full bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-white/10 backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <Microscope className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Sample Analysis
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {filename}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleBlur}
              className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 px-4 py-2 text-sm font-medium text-blue-700 dark:text-blue-300 rounded-xl transition-all hover:bg-blue-200 dark:hover:bg-blue-900/50 hover:scale-105"
            >
              {isBlurred ? (
                <>
                  <EyeOff className="h-4 w-4" />
                  Unblur
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  Blur
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center transition-all hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-105"
            >
              <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Image Container */}
        <div className="p-6 overflow-auto max-h-[calc(90vh-100px)]">
          <div className="relative group">
            <div className="overflow-hidden rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <Image
                src={imageData}
                alt={filename}
                width={0}
                height={0}
                sizes="100vw"
                className={`w-full h-auto transition-all duration-500 ${
                  isBlurred ? 'blur-3xl scale-105' : 'blur-none hover:scale-105'
                }`}
              />
            </div>
            {isBlurred && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-2xl">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <EyeOff className="h-8 w-8 text-white" />
                  </div>
                  <p className="text-xl font-semibold text-white/90 mb-2">
                    Sample Protected
                  </p>
                  <p className="text-sm text-white/70 max-w-md">
                    This sample is blurred for privacy and research discretion. Click &quot;Unblur&quot; to view the detailed analysis.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}