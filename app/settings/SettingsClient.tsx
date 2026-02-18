"use client";

import * as React from "react";
import Image from "next/image";
import { updateProfile, changePassword } from "./action";

type SettingsClientProps = {
  initial: {
    username: string;
    email: string;
    image: string | null;
  };
};

export default function SettingsClient({ initial }: SettingsClientProps) {
  const [username, setUsername] = React.useState(initial.username);
  const [email, setEmail] = React.useState(initial.email);
  const [image, setImage] = React.useState(initial.image ?? "");

  const [msg, setMsg] = React.useState<string | null>(null);
  const [err, setErr] = React.useState<string | null>(null);

  const [pwdMsg, setPwdMsg] = React.useState<string | null>(null);
  const [pwdErr, setPwdErr] = React.useState<string | null>(null);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setErr(null);

    const fd = new FormData();
    fd.set("username", username);
    fd.set("email", email);
    fd.set("image", image);

    try {
      await updateProfile(fd);
      setMsg("Profile updated ✅");
    } catch (e: any) {
      setErr(e?.message ?? "Something went wrong.");
    }
  }

  async function handleChangePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPwdMsg(null);
    setPwdErr(null);

    const form = e.currentTarget;
    const fd = new FormData(form);

    try {
      await changePassword(fd);
      setPwdMsg("Password updated ✅");
      form.reset();
    } catch (e: any) {
      setPwdErr(e?.message ?? "Something went wrong.");
    }
  }

  return (
    <div className="space-y-6">
      {/* Profile card */}
      <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900/50 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-black/10 dark:border-white/10 bg-gradient-to-r from-blue-600/10 to-transparent dark:from-blue-500/10">
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            Settings
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Update your profile and account info.
          </p>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6">
          {/* Avatar preview */}

          {/* Form */}
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                Username
              </label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
                className="mt-2 w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-zinc-900/20 dark:focus:ring-zinc-100/20"
              />
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                3–20 chars, letters/numbers/underscore only.
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                Email
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="you@email.com"
                className="mt-2 w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-zinc-900/20 dark:focus:ring-zinc-100/20"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="rounded-2xl px-5 py-3 text-sm font-medium
                           bg-zinc-900 text-white hover:bg-zinc-800
                           dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 transition"
              >
                Save changes
              </button>

              {msg && <span className="text-sm text-emerald-600 dark:text-emerald-400">{msg}</span>}
              {err && <span className="text-sm text-rose-600 dark:text-rose-400">{err}</span>}
            </div>
          </form>
        </div>
      </div>

      {/* Password card */}
      <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900/50 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-black/10 dark:border-white/10 bg-gradient-to-r from-rose-600/10 to-transparent dark:from-rose-500/10">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Change Password
          </h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Keep your account secure.
          </p>
        </div>

        <form onSubmit={handleChangePassword} className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
              Current password
            </label>
            <input
              name="currentPassword"
              type="password"
              className="mt-2 w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-zinc-900/20 dark:focus:ring-zinc-100/20"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                New password
              </label>
              <input
                name="newPassword"
                type="password"
                className="mt-2 w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-zinc-900/20 dark:focus:ring-zinc-100/20"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                Confirm new password
              </label>
              <input
                name="confirmPassword"
                type="password"
                className="mt-2 w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-zinc-900/20 dark:focus:ring-zinc-100/20"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="rounded-2xl px-5 py-3 text-sm font-medium
                         bg-zinc-900 text-white hover:bg-zinc-800
                         dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 transition"
            >
              Update password
            </button>

            {pwdMsg && <span className="text-sm text-emerald-600 dark:text-emerald-400">{pwdMsg}</span>}
            {pwdErr && <span className="text-sm text-rose-600 dark:text-rose-400">{pwdErr}</span>}
          </div>
        </form>
      </div>
    </div>
  );
}
