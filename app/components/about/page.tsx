import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";


import office from "@/public/assets/aboutus/office.png";
import team from "@/public/assets/aboutus/team.png";
import FooterPage from "../Footer";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn what StudySmart is and why it exists.",
};

export default function AboutPage() {
  return (
    <main className="bg-white text-zinc-800 dark:bg-zinc-900 dark:text-white">
      <section className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12 pt-28 pb-16">
        
        {/* Title */}
        <div className="pb-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            About StudySmart
          </h1>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-12 sm:px-8">

          {/* Team Image */}
          <div className="flex justify-center">
            <Image
              src={team}
              alt="StudySmart team"
              width={600}
              height={600}
              className="object-cover rounded-2xl"
            />
          </div>

          {/* Team Text */}
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl text-center pb-6">Our Team</h2>
            <p className="text-zinc-600 dark:text-white/70 leading-relaxed">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed dolor
              cupiditate pariatur consequuntur tempora doloribus laboriosam
              expedita magnam adipisci beatae nobis fuga aliquam animi eos,
              unde iusto, nihil vero corporis. Lorem ipsum dolor sit amet,
              consectetur adipisicing elit. Animi aut doloribus illo rem porro
              aspernatur et, veritatis necessitatibus ipsum.
            </p>
          </div>

          {/* Company Text */}
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl text-center pb-6">Our Company</h2>
            <p className="text-zinc-600 dark:text-white/70 leading-relaxed">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed dolor
              cupiditate pariatur consequuntur tempora doloribus laboriosam
              expedita magnam adipisci beatae nobis fuga aliquam animi eos,
              unde iusto, nihil vero corporis. Lorem ipsum dolor sit amet,
              consectetur adipisicing elit. Animi aut doloribus illo rem porro
              aspernatur et, veritatis necessitatibus ipsum.
            </p>
          </div>

          {/* Office Image */}
          <div className="flex justify-center">
            <Image
              src={office}
              alt="StudySmart office"
              width={600}
              height={600}
              className="object-cover rounded-2xl"
            />
          </div>

        </div>

        {/* Buttons */}
        <div className="mt-12 flex flex-wrap gap-3">
          <Link
            href="/components/features"
            className="px-5 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Explore features
          </Link>

          <Link
            href="/components/contact"
            className="px-5 py-2 rounded-xl border border-zinc-200 hover:border-zinc-300 dark:border-white/10 dark:hover:border-white/20 transition"
          >
            Contact us
          </Link>
        </div>
      </section>
      <FooterPage />
    </main>
  );
}