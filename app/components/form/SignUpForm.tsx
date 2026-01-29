import Image from "next/image";
import studyPic from "@/public/assets/signin/study.png";
import { signup } from "@/app/signup/actions";

export default function SignupForm() {
  return (
    <section className="min-h-screen w-full grid lg:grid-cols-2">
      {/* LEFT: Image panel */}
      <div className="relative hidden lg:block">
        <Image
          src={studyPic}
          alt="Study background"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 flex items-center justify-center px-10">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold tracking-tight">StudySmart</h1>
            <p className="mt-3 text-xl text-white/85">
              Build consistent study habits.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT: Form panel */}
      <div className="flex min-h-screen items-center justify-center bg-white px-6 py-10">
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-semibold text-zinc-900">Create account</h2>
              <p className="text-sm text-zinc-500">Start tracking your progress.</p>
            </div>

            <form action={signup} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-zinc-700">
                    First name
                  </label>
                  <input
                    name="firstName"
                    required
                    className="w-full rounded-xl bg-zinc-50 px-4 py-3 text-sm outline-none ring-1 ring-zinc-200 focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-zinc-700">
                    Last name
                  </label>
                  <input
                    name="lastName"
                    required
                    className="w-full rounded-xl bg-zinc-50 px-4 py-3 text-sm outline-none ring-1 ring-zinc-200 focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-zinc-700">
                  Username
                </label>
                <input
                  name="username"
                  required
                  className="w-full rounded-xl bg-zinc-50 px-4 py-3 text-sm outline-none ring-1 ring-zinc-200 focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-zinc-700">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full rounded-xl bg-zinc-50 px-4 py-3 text-sm outline-none ring-1 ring-zinc-200 focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-zinc-700">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  className="w-full rounded-xl bg-zinc-50 px-4 py-3 text-sm outline-none ring-1 ring-zinc-200 focus:ring-2 focus:ring-black"
                  placeholder="At least 8 characters"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-zinc-700">
                  Confirm password
                </label>
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  minLength={8}
                  className="w-full rounded-xl bg-zinc-50 px-4 py-3 text-sm outline-none ring-1 ring-zinc-200 focus:ring-2 focus:ring-black"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-zinc-900 py-3 text-sm font-semibold text-white hover:bg-zinc-800"
              >
                Sign up →
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-zinc-500">
              Already have an account?{" "}
              <a className="font-semibold text-blue-600 hover:underline" href="/signin">
                Log in →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
