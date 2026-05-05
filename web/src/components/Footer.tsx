import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer
      className="mt-24 border-t"
      style={{ borderColor: "rgb(var(--border) / 0.4)" }}
    >
      <div className="container-tight grid gap-10 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link href="/" className="flex items-center gap-2.5">
            <Logo size={28} />
            <div className="leading-tight">
              <div className="font-serif text-lg font-semibold">
                Kolbenmanufaktur Wittenberg
              </div>
              <div className="text-[10px] uppercase tracking-[0.18em]" style={{ color: "rgb(var(--muted))" }}>
                Tradition seit 1487
              </div>
            </div>
          </Link>
          <p className="mt-4 max-w-md text-sm" style={{ color: "rgb(var(--muted))" }}>
            Handgefertigte Streitkolben aus Sumpf-Eiche, Bronze, Damaststahl
            und Titan-Karbon-Verbund. Versandkostenfrei innerhalb der
            Bundesländer Sachsen-Anhalt und Brandenburg.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Sortiment</h4>
          <ul className="space-y-2 text-sm" style={{ color: "rgb(var(--muted))" }}>
            <li><Link href="/shop?kategorie=einsteiger" className="hover:underline">Einsteiger</Link></li>
            <li><Link href="/shop?kategorie=fortgeschritten" className="hover:underline">Fortgeschritten</Link></li>
            <li><Link href="/shop?kategorie=profi" className="hover:underline">Profi</Link></li>
            <li><Link href="/shop?kategorie=bankbesuch" className="hover:underline">Bankbesuch-Edition</Link></li>
            <li><Link href="/konfigurator" className="hover:underline">Konfigurator</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Manufaktur</h4>
          <ul className="space-y-2 text-sm" style={{ color: "rgb(var(--muted))" }}>
            <li><Link href="/wissen" className="hover:underline">Wissen</Link></li>
            <li><Link href="/forum" className="hover:underline">Forum</Link></li>
            <li><Link href="/impressum" className="hover:underline">Impressum</Link></li>
            <li><Link href="/datenschutz" className="hover:underline">Datenschutz</Link></li>
            <li><Link href="/agb" className="hover:underline">AGB</Link></li>
          </ul>
        </div>
      </div>
      <div
        className="border-t"
        style={{ borderColor: "rgb(var(--border) / 0.4)" }}
      >
        <div className="container-tight flex flex-col items-start justify-between gap-2 py-5 text-xs sm:flex-row sm:items-center" style={{ color: "rgb(var(--muted))" }}>
          <div>© {new Date().getFullYear()} Kolbenmanufaktur Wittenberg GmbH & Co. KG · Alle Rechte vorbehalten.</div>
          <div>Versand: 3–5 Werktage · DPD &amp; Brieftaube</div>
        </div>
      </div>
    </footer>
  );
}
