import Link from "next/link";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { CartButton } from "./CartButton";
import { getSessionUser } from "@/lib/session";

const nav = [
  { href: "/shop", label: "Shop" },
  { href: "/konfigurator", label: "Konfigurator" },
  { href: "/wissen", label: "Wissen" },
  { href: "/forum", label: "Forum" },
];

export async function Header() {
  const user = await getSessionUser();
  return (
    <header
      className="sticky top-0 z-40 backdrop-blur"
      style={{
        backgroundColor: "rgb(var(--bg) / 0.78)",
        borderBottom: "1px solid rgb(var(--border) / 0.4)",
      }}
    >
      <div className="container-tight flex h-16 items-center gap-4">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo size={30} />
          <div className="leading-tight">
            <div className="font-serif text-lg font-semibold">
              Kolbenmanufaktur
            </div>
            <div className="text-[10px] uppercase tracking-[0.18em]" style={{ color: "rgb(var(--muted))" }}>
              Wittenberg · seit 1487
            </div>
          </div>
        </Link>
        <nav className="ml-auto hidden items-center gap-1 md:flex">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="btn btn-ghost px-3">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <ThemeToggle />
          <CartButton />
          {user ? (
            <Link href="/forum" className="btn btn-outline px-3" title={`Angemeldet als ${user.username}`}>
              {user.username}
            </Link>
          ) : (
            <Link href="/forum/login" className="btn btn-outline px-3 hidden sm:inline-flex">
              Anmelden
            </Link>
          )}
        </div>
      </div>
      <div className="container-tight flex gap-2 overflow-x-auto pb-2 md:hidden">
        {nav.map((n) => (
          <Link key={n.href} href={n.href} className="btn btn-ghost h-10 shrink-0 px-4 text-sm">
            {n.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
