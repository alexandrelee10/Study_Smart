import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Contact StudySmart support or the team.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white text-zinc-800 dark:bg-zinc-900 dark:text-white">
      <section className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12 pt-28 pb-16">
        <div className="space-y-3">
          <p className="text-sm font-medium text-zinc-500 dark:text-white/60">
            Company
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Contact us
          </h1>
          <p className="max-w-2xl text-zinc-600 dark:text-white/70">
            Reach out anytime — we’ll get back to you.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-950">
            <h2 className="font-semibold">Email</h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-white/70">
              Use this for support, feedback, or general questions.
            </p>
            <p className="mt-4 text-sm">
              <a
                className="font-semibold text-blue-600 hover:underline"
                href="mailto:support@studysmart.app"
              >
                support@studysmart.app
              </a>
            </p>
            <p className="mt-2 text-xs text-zinc-500 dark:text-white/50">
              (Replace with your real email)
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-950">
            <h2 className="font-semibold">Quick message template</h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-white/70">
              Copy/paste this into an email:
            </p>

            <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700 dark:border-white/10 dark:bg-zinc-900 dark:text-white/80 whitespace-pre-wrap">
{`Subject: StudySmart - Support

Hi StudySmart team,

I need help with:
- Issue:
- What I expected:
- What happened:
- Screenshot (if any):

Thanks,
[Your name]`}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}