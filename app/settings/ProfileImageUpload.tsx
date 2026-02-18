// app/settings/ProfileImageUpload.tsx
"use client";

import Image from "next/image";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { setProfileImage } from "./action";
import { useState } from "react";

/* ---------- icon ---------- */
function PersonIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-10 w-10 text-zinc-400 dark:text-zinc-500"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
      <path
        fillRule="evenodd"
        d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
      />
    </svg>
  );
}

export default function ProfileImageUpload({
  currentImage,
}: {
  currentImage: string | null;
}) {
  const [preview, setPreview] = useState<string | null>(currentImage);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  return (
    <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900/50 shadow-sm p-6">
      <div className="flex items-center gap-6">
        {/* Avatar */}
        <div className="relative group shrink-0">
          <div className="relative h-24 w-24 overflow-hidden rounded-3xl border border-black/10 dark:border-white/10 bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
            {preview ? (
              <Image
                src={preview}
                alt="Profile"
                fill
                className="object-cover transition group-hover:scale-105"
                sizes="96px"
              />
            ) : (
              <PersonIcon />
            )}
          </div>

          {/* soft hover ring */}
          <div className="pointer-events-none absolute inset-0 rounded-3xl ring-0 group-hover:ring-4 ring-blue-500/20 transition" />
        </div>

        {/* Controls */}
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Profile Picture
          </h3>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            PNG/JPG up to 2MB.
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {/* UploadThing (typed) */}
            <UploadButton<OurFileRouter, "profileImage">
              endpoint="profileImage"
              appearance={{
                button:
                  "rounded-xl px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow hover:shadow-md hover:scale-[1.02] transition",
                allowedContent: "hidden",
              }}
              onUploadBegin={() => {
                setMsg("Uploading...");
                setErr(null);
              }}
              onClientUploadComplete={async (res) => {
                try {
                  const url = res?.[0]?.url;
                  if (!url) throw new Error("Upload failed (no URL returned).");

                  await setProfileImage(url);
                  setPreview(url);
                  setMsg("Saved ✅");

                  // quick refresh so navbar avatar updates too
                  window.location.reload();
                } catch (e: any) {
                  setMsg(null);
                  setErr(e?.message ?? "Failed to save image.");
                }
              }}
              onUploadError={(error) => {
                setMsg(null);
                setErr(error.message);
              }}
            />

            {/* Remove only shows if an image exists */}
            {preview && (
              <button
                type="button"
                onClick={async () => {
                  setMsg(null);
                  setErr(null);
                  await setProfileImage(null);
                  setPreview(null);
                  setMsg("Removed ✅");
                  window.location.reload();
                }}
                className="rounded-xl border border-zinc-200 dark:border-zinc-800 px-4 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900 transition"
              >
                Remove
              </button>
            )}
          </div>

          {msg && (
            <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-400">
              {msg}
            </p>
          )}
          {err && (
            <p className="mt-2 text-xs text-rose-600 dark:text-rose-400">
              {err}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
