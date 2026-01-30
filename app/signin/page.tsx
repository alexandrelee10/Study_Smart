import LoginForm from "../components/form/LoginForm";

export const metadata = { title: "Sign in | StudySmart" };

export default async function SignInPage({
  searchParams,
}: {
  searchParams?: Promise<{ created?: string; signedOut?: string; error?: string }>;
}) {
  const sp = (await searchParams) ?? {};
  const created = sp.created === "1";
  const signedOut = sp.signedOut === "1";

  return (
    <main>
      <div>
        {created && (
          <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
            ✅ Account created successfully. Please sign in.
          </div>
        )}

        {signedOut && (
          <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
            👋 You’ve been signed out.
          </div>
        )}

        <LoginForm />
      </div>
    </main>
  );
}

