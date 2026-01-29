"use client";
import Image from "next/image";
import study from "@/public/assets/signin/study.png";
import owlLogo from "@/public/owl.png";
import Link from "next/link";

const LoginForm = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={study}
          alt="Study background"
          fill
          priority
          className="object-cover brightness-50"
        />
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src={owlLogo}
            alt="Owl logo"
            width={64}
            height={64}
            className="object-contain"
          />
        </div>

        <h2 className="text-2xl font-semibold text-center text-gray-900 mb-2">
          Welcome back
        </h2>
        <p className="text-sm text-center text-gray-500 mb-6">
          Log in to continue studying smarter
        </p>

        <form className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Forgot password */}
          <div className="flex justify-end">
            <button
              type="button"
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot password?
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full rounded-xl bg-blue-600 text-white py-2 font-medium hover:bg-blue-700 transition"
          >
            Log In
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-sm text-center text-gray-600">
          Don’t have an account?{" "}
          <Link className="text-blue-600 hover:underline cursor-pointer" href="/signup">
            Sign up
          </Link>
        </p>
      </div>
    </section>
  );
};

export default LoginForm;
