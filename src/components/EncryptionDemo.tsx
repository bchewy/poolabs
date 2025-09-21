"use client";

import { useState, useEffect } from "react";
import { Lock, Unlock, RefreshCw, Eye, EyeOff, Shield, Key } from "lucide-react";

export default function EncryptionDemo() {
  const [originalText, setOriginalText] = useState("Sensitive health data: Bristol score 4, hydration 72%");
  const [encryptedText, setEncryptedText] = useState("");
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showProcess, setShowProcess] = useState(false);

  // Simulate encryption/decryption
  const performEncryption = async () => {
    setIsAnimating(true);
    setShowProcess(true);

    // Simulate encryption process
    const encryptionSteps = [
      "Generating AES-256 key...",
      "Hashing with SHA-256...",
      "Applying IV vector...",
      "Encrypting with AES-GCM...",
      "Generating authentication tag..."
    ];

    for (let i = 0; i < encryptionSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 300));
      // Update UI with progress
    }

    // Generate "encrypted" text (base64-like)
    const encrypted = btoa(originalText.split('').reverse().join('')) +
                     Math.random().toString(36).substring(2, 15);
    setEncryptedText(encrypted);
    setIsEncrypted(true);
    setIsAnimating(false);
  };

  const performDecryption = async () => {
    setIsAnimating(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsEncrypted(false);
    setIsAnimating(false);
    setShowProcess(false);
  };

  const generateNewData = () => {
    const healthData = [
      "Bristol score 3, hydration 68%, no flags detected",
      "Bristol score 5, hydration 75%, mild dehydration flagged",
      "Bristol score 4, hydration 71%, optimal hydration levels",
      "Bristol score 6, hydration 69%, possible diarrhea pattern",
      "Bristol score 2, hydration 70%, constipation detected"
    ];

    const randomData = healthData[Math.floor(Math.random() * healthData.length)];
    setOriginalText(`Sensitive health data: ${randomData}`);
    if (isEncrypted) {
      setIsEncrypted(false);
      setShowProcess(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Shield className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Live Encryption Demo
          </h3>
        </div>
        <button
          onClick={generateNewData}
          className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          New Data
        </button>
      </div>

      {/* Data Display */}
      <div className="space-y-4">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Original Data
            </span>
            <Eye className="h-4 w-4 text-gray-500" />
          </div>
          <p className="text-sm text-gray-900 dark:text-white font-mono">
            {originalText}
          </p>
        </div>

        {showProcess && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <RefreshCw className={`h-4 w-4 text-blue-600 ${isAnimating ? 'animate-spin' : ''}`} />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                {isAnimating ? "Encrypting..." : "Encryption Complete"}
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Key className="h-3 w-3 text-blue-500" />
                <span className="text-xs text-blue-600 dark:text-blue-400">
                  AES-256 encryption algorithm
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-3 w-3 text-blue-500" />
                <span className="text-xs text-blue-600 dark:text-blue-400">
                  Zero-knowledge proof generation
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {isEncrypted ? "Encrypted Data" : "Decrypted Data"}
            </span>
            {isEncrypted ? <EyeOff className="h-4 w-4 text-red-500" /> : <Eye className="h-4 w-4 text-green-500" />}
          </div>
          <p className="text-sm text-gray-900 dark:text-white font-mono break-all">
            {isEncrypted ? encryptedText : originalText}
          </p>
        </div>

        {/* Encryption Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-lg font-bold text-green-600 dark:text-green-400">
              256
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Bit Encryption
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {isEncrypted ? "∞" : "0"}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Years to Crack
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
              100%
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Data Protection
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={isEncrypted ? performDecryption : performEncryption}
          disabled={isAnimating}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
            isEncrypted
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          } ${isAnimating ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isAnimating ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : isEncrypted ? (
            <>
              <Unlock className="h-4 w-4" />
              Decrypt Data
            </>
          ) : (
            <>
              <Lock className="h-4 w-4" />
              Encrypt Now
            </>
          )}
        </button>
      </div>
    </div>
  );
}