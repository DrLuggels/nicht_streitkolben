import Link from "next/link";
import Image from "next/image";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { formatEUR } from "@/lib/format";
import { articles } from "@/content/articles";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const featured = await db
    .select()
    .from(products)
    .where(eq(products.featured, true))
    .limit(4);

  return (
    <>
      {/* Hero */}
      <section className="container-tight grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
        <div>
          <span className="badge">Manufaktur · seit 1487</span>
          <h1 className="mt-4 text-5xl font-semibold leading-[1.05] sm:text-6xl">
            Überzeugung,
            <br />
            <span style={{ color: "rgb(var(--accent))" }}>
              die im Raum bleibt.
            </span>
          </h1>
          <p
            className="mt-5 max-w-prose text-base leading-relaxed sm:text-lg"
            style={{ color: "rgb(var(--muted))" }}
          >
            Handgefertigte Streitkolben aus Sumpf-Eiche, Bronze, Damaststahl
            und Titan-Karbon-Verbund. Im Konfigurator gestalten Sie Ihren
            persönlichen Begleiter für die alltäglichen Differenzen — vom
            Kassengespräch bis zum Aufsichtsrat.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/shop" className="btn btn-primary">
              Sortiment entdecken
            </Link>
            <Link href="/konfigurator" className="btn btn-outline">
              Eigenen Kolben gestalten
            </Link>
          </div>
          <dl className="mt-10 grid grid-cols-3 gap-4 text-sm sm:mt-12 sm:gap-6">
            <div>
              <dt className="text-[10px] uppercase tracking-wide sm:text-xs" style={{ color: "rgb(var(--muted))" }}>Tradition</dt>
              <dd className="mt-1 text-lg font-semibold sm:text-2xl">538 Jahre</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-wide sm:text-xs" style={{ color: "rgb(var(--muted))" }}>Manufaktur</dt>
              <dd className="mt-1 text-lg font-semibold sm:text-2xl">Wittenberg</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-wide sm:text-xs" style={{ color: "rgb(var(--muted))" }}>Lieferzeit</dt>
              <dd className="mt-1 text-lg font-semibold sm:text-2xl">3–5 Tage</dd>
            </div>
          </dl>
        </div>
        <div className="relative">
          <div className="surface aspect-[4/5] overflow-hidden">
            <Image
              src="/images/landing/manufaktur-1.jpg"
              alt="Streitkolben in der Manufaktur"
              width={900}
              height={1100}
              sizes="(max-width: 768px) 92vw, 50vw"
              className="h-full w-full object-cover"
              priority
            />
          </div>
          <div className="surface absolute -bottom-6 -left-6 hidden max-w-[280px] p-5 md:block">
            <p className="text-sm italic" style={{ color: "rgb(var(--muted))" }}>
              „Ein gut ausbalancierter Streitkolben spart in jedem Quartalsgespräch
              im Schnitt 11 Minuten Diskussion.“
            </p>
            <div className="mt-3 text-xs">— Aufsichtsratsmitglied, anonym</div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container-tight py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <span className="badge">Aktuelle Empfehlungen</span>
            <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">
              Aus unserem Sortiment
            </h2>
          </div>
          <Link href="/shop" className="link text-sm hidden sm:inline-flex">
            Alle Modelle →
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <Link
              key={p.id}
              href={`/shop/${p.slug}`}
              className="surface group overflow-hidden p-0 transition hover:shadow-liftn"
            >
              <div className="aspect-square overflow-hidden">
                <Image
                  src={p.image}
                  alt={p.name}
                  width={500}
                  height={500}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                  className="h-full w-full object-cover transition group-hover:scale-[1.04]"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between text-xs uppercase tracking-wide" style={{ color: "rgb(var(--muted))" }}>
                  <span>{p.material}</span>
                  <span>{p.weightGrams} g</span>
                </div>
                <h3 className="mt-2 font-serif text-lg font-semibold leading-tight">
                  {p.name}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm" style={{ color: "rgb(var(--muted))" }}>
                  {p.tagline}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-semibold">{formatEUR(p.priceCents)}</span>
                  <span className="link text-sm">Details →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Wertversprechen */}
      <section className="container-tight grid gap-6 py-12 md:grid-cols-3">
        {[
          {
            t: "Manufaktur-Qualität",
            d: "Jeder Kolben durchläuft 14 Arbeitsschritte in unserer Wittenberger Werkstatt — von der Schmiede bis zum Lederatelier.",
          },
          {
            t: "Konfigurator",
            d: "Material, Gewicht, Kopfform, Wicklung, persönliche Gravur. Live-Vorschau, faire Lieferzeit, lebenslange Beratung.",
          },
          {
            t: "Diskreter Versand",
            d: "Versandfertige Verpackung im neutralen Karton. Auf Wunsch im historischen Mahagoni-Koffer mit Echtheitszertifikat.",
          },
        ].map((b) => (
          <div key={b.t} className="surface p-6">
            <h3 className="text-lg font-semibold">{b.t}</h3>
            <p className="mt-2 text-sm" style={{ color: "rgb(var(--muted))" }}>
              {b.d}
            </p>
          </div>
        ))}
      </section>

      {/* Wissen Teaser */}
      <section className="container-tight py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <span className="badge">Aus unserem Wissens-Bereich</span>
            <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">
              Lesenswert vor dem Kauf
            </h2>
          </div>
          <Link href="/wissen" className="link text-sm hidden sm:inline-flex">
            Alle Artikel →
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articles.slice(0, 3).map((a) => (
            <Link
              key={a.slug}
              href={`/wissen/${a.slug}`}
              className="surface group overflow-hidden p-0 transition hover:shadow-liftn"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <Image
                  src={a.image}
                  alt={a.title}
                  width={800}
                  height={500}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="h-full w-full object-cover transition group-hover:scale-[1.04]"
                />
              </div>
              <div className="p-5">
                <div className="text-xs uppercase tracking-wide" style={{ color: "rgb(var(--muted))" }}>
                  {a.kicker}
                </div>
                <h3 className="mt-2 font-serif text-lg font-semibold leading-tight">
                  {a.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm" style={{ color: "rgb(var(--muted))" }}>
                  {a.lead}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
