import Link from "next/link";
import Image from "next/image";
import { db } from "@/db";
import { products } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { formatEUR, formatGrams } from "@/lib/format";

export const metadata = { title: "Shop" };
export const dynamic = "force-dynamic";

const CATEGORIES: Record<string, { label: string; sub: string }> = {
  einsteiger: { label: "Einsteiger", sub: "Für die ersten Schritte." },
  fortgeschritten: { label: "Fortgeschritten", sub: "Für regelmäßige Anwender." },
  profi: { label: "Profi", sub: "Für die hohen Ämter." },
  bankbesuch: { label: "Bankbesuch-Edition", sub: "Für die Konditionsrunde." },
};

const MATERIALS = [
  "Eichenholz mit Stahl-Beschlag",
  "Bronze",
  "Damaststahl",
  "Titan-Karbon-Verbund",
  "Karbon",
];

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ kategorie?: string; material?: string }>;
}) {
  const { kategorie, material } = await searchParams;

  const where = and(
    kategorie ? eq(products.category, kategorie) : undefined,
    material ? eq(products.material, material) : undefined
  );
  const list = await db.select().from(products).where(where);

  return (
    <div className="container-tight py-12">
      <span className="badge">Sortiment</span>
      <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">
        Manufaktur-Shop
      </h1>
      <p className="mt-3 max-w-2xl text-lg" style={{ color: "rgb(var(--muted))" }}>
        Vom Lehrlings-Kolben bis zur Bankbesuch-Edition Platinum. Jedes Modell
        wird in Wittenberg von Hand gefertigt — Lieferzeit 3–5 Werktage,
        Konfigurator-Modelle 10–14 Wochen.
      </p>

      <div className="mt-8 grid gap-3 lg:grid-cols-[280px_1fr]">
        {/* Filter */}
        <aside className="surface h-fit p-5 lg:sticky lg:top-24">
          <h3 className="text-sm font-semibold uppercase tracking-wide">
            Kategorie
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link
                href="/shop"
                className={!kategorie ? "font-semibold" : ""}
                style={{ color: !kategorie ? "rgb(var(--accent))" : undefined }}
              >
                Alle anzeigen
              </Link>
            </li>
            {Object.entries(CATEGORIES).map(([k, v]) => (
              <li key={k}>
                <Link
                  href={`/shop?kategorie=${k}`}
                  className={kategorie === k ? "font-semibold" : ""}
                  style={{ color: kategorie === k ? "rgb(var(--accent))" : undefined }}
                >
                  {v.label}
                </Link>
              </li>
            ))}
          </ul>

          <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide">
            Material
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link
                href={kategorie ? `/shop?kategorie=${kategorie}` : "/shop"}
                className={!material ? "font-semibold" : ""}
                style={{ color: !material ? "rgb(var(--accent))" : undefined }}
              >
                Alle Materialien
              </Link>
            </li>
            {MATERIALS.map((m) => (
              <li key={m}>
                <Link
                  href={`/shop?${new URLSearchParams({
                    ...(kategorie ? { kategorie } : {}),
                    material: m,
                  }).toString()}`}
                  className={material === m ? "font-semibold" : ""}
                  style={{ color: material === m ? "rgb(var(--accent))" : undefined }}
                >
                  {m}
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href="/konfigurator"
            className="btn btn-primary mt-6 w-full"
          >
            Eigenen Kolben gestalten
          </Link>
        </aside>

        {/* Liste */}
        <div>
          {kategorie && CATEGORIES[kategorie] && (
            <div className="mb-6">
              <h2 className="text-2xl font-semibold">
                {CATEGORIES[kategorie].label}
              </h2>
              <p style={{ color: "rgb(var(--muted))" }}>
                {CATEGORIES[kategorie].sub}
              </p>
            </div>
          )}
          {list.length === 0 ? (
            <p className="surface p-8 text-center" style={{ color: "rgb(var(--muted))" }}>
              Keine Modelle für diese Filterauswahl.
            </p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {list.map((p) => (
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
                      className="h-full w-full object-cover transition group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between text-xs uppercase tracking-wide" style={{ color: "rgb(var(--muted))" }}>
                      <span>{p.material}</span>
                      <span>{formatGrams(p.weightGrams)}</span>
                    </div>
                    <h3 className="mt-2 font-serif text-lg font-semibold leading-tight">
                      {p.name}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm" style={{ color: "rgb(var(--muted))" }}>
                      {p.tagline}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-lg font-semibold">{formatEUR(p.priceCents)}</span>
                      {!p.inStock ? (
                        <span className="text-xs" style={{ color: "rgb(var(--muted))" }}>
                          Vorbestellung
                        </span>
                      ) : (
                        <span className="link text-sm">Details →</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
