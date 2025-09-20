"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function ImageUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [deviceId, setDeviceId] = useState<string>("esp32-s3-01");
  const [bristolScore, setBristolScore] = useState<string>("4");
  const [notes, setNotes] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [isImageBlurred, setIsImageBlurred] = useState(true);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setMessage(null);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const toggleImageBlur = () => {
    setIsImageBlurred(!isImageBlurred);
  };

  const submit = async () => {
    setMessage(null);
    if (!file) {
      setMessage("Choose an image first");
      return;
    }
    setPending(true);
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
        deviceId: deviceId || undefined,
        notes: notes || undefined,
      };

      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData),
      });

      const json = await response.json();
      if (!response.ok) {
        setMessage(`Failed: ${json.error ?? "unexpected error"}`);
      } else {
        setMessage(`Uploaded ${json.filename} (${Math.round(json.size / 1024)}KB)`);
      }
    } catch {
      setMessage("Unexpected error during upload");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/60 via-white/20 to-emerald-100/40 p-6 shadow-lg dark:border-white/5 dark:from-emerald-500/10 dark:via-zinc-900/80 dark:to-zinc-900">
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Image upload</h3>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Send a single frame to /api/upload as JSON.</p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Device ID
          <input
            className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
          />
        </label>

        <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Bristol score (hint)
          <select
            className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            value={bristolScore}
            onChange={(e) => setBristolScore(e.target.value)}
          >
            {[1, 2, 3, 4, 5, 6, 7].map((n) => (
              <option key={n} value={String(n)}>
                {n}
              </option>
            ))}
          </select>
        </label>

        <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Image file
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-600 file:px-3 file:py-1.5 file:text-white hover:file:bg-emerald-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </label>

        <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400 sm:col-span-2">
          Notes
          <input
            className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. sample frame from bathroom cam"
          />
        </label>
      </div>

      {/* Image Preview */}
      {preview && (
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/60 p-4 dark:border-white/5 dark:bg-zinc-900/40">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Image Preview</span>
            <button
              onClick={toggleImageBlur}
              className="flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600 transition hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
            >
              {isImageBlurred ? (
                <>
                  <Eye className="h-3 w-3" />
                  Unblur
                </>
              ) : (
                <>
                  <EyeOff className="h-3 w-3" />
                  Blur
                </>
              )}
            </button>
          </div>
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className={`w-full rounded-lg border border-zinc-200 dark:border-zinc-700 transition-all duration-300 ${
                isImageBlurred ? 'blur-2xl scale-105' : 'blur-none'
              }`}
            />
            {isImageBlurred && (
              <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/20">
                <div className="text-center">
                  <EyeOff className="mx-auto h-6 w-6 text-white/80" />
                  <p className="mt-1 text-xs font-medium text-white/90">
                    Blurred for discretion
                  </p>
                </div>
              </div>
            )}
          </div>
          {file && (
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
              {file.name} ({Math.round(file.size / 1024)}KB)
            </p>
          )}
        </div>
      )}

      {message ? (
        <div className="mt-3 text-sm font-medium text-emerald-600 dark:text-emerald-300">{message}</div>
      ) : null}

      <button
        type="button"
        onClick={submit}
        disabled={pending || !file}
        className="mt-6 w-full rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400/70"
      >
        {pending ? "Uploading…" : "Upload image"}
      </button>
    </div>
  );
}


