import Link from "next/link";
import { LoginForm } from "@/components/AuthForms";

export const metadata = { title: "Anmelden" };

export default function LoginPage() {
  return (
    <div className="container-tight grid gap-12 py-16 md:grid-cols-2">
      <div>
        <span className="badge">Forum-Anmeldung</span>
        <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">Willkommen zurück</h1>
        <p className="mt-3 text-lg" style={{ color: "rgb(var(--muted))" }}>
          Melden Sie sich an, um Threads zu verfassen, zu antworten und an
          Klangwerkstätten und Wittenberg-Touren teilzunehmen.
        </p>
        <p className="mt-6 text-sm" style={{ color: "rgb(var(--muted))" }}>
          Noch kein Konto?{" "}
          <Link href="/forum/register" className="link">
            Hier registrieren →
          </Link>
        </p>
      </div>
      <div className="surface p-6">
        <LoginForm />
      </div>
    </div>
  );
}
