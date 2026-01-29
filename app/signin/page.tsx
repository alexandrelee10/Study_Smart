import LoginForm from "../components/form/LoginForm";

export const metadata = { title: "Sign in | StudySmart" };

export default function SignInPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-16">
      <LoginForm />
    </main>
  );
}
