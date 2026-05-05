import Link from "next/link";
import { RegisterForm } from "@/components/AuthForms";

export const metadata = { title: "Registrieren" };

export default function RegisterPage() {
  return (
    <div className="container-tight grid gap-12 py-16 md:grid-cols-2">
      <div>
        <span className="badge">Manufaktur-Forum</span>
        <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">Werden Sie Teil</h1>
        <p className="mt-3 text-lg" style={{ color: "rgb(var(--muted))" }}>
          Eine Registrierung dauert weniger als eine Minute und ist
          selbstverständlich kostenfrei. Bitte achten Sie auf einen
          gepflegten Benutzernamen — er begleitet Sie durch alle Diskussionen.
        </p>
        <p className="mt-6 text-sm" style={{ color: "rgb(var(--muted))" }}>
          Bereits Mitglied?{" "}
          <Link href="/forum/login" className="link">
            Anmelden →
          </Link>
        </p>
      </div>
      <div className="surface p-6">
        <RegisterForm />
      </div>
    </div>
  );
}
