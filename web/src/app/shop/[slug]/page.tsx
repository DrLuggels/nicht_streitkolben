import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq, ne } from "drizzle-orm";
import { formatEUR, formatGrams } from "@/lib/format";
import { AddToCart } from "@/components/AddToCart";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [p] = await db
    .select()
    .from(products)
    .where(eq(products.slug, slug))
    .limit(1);
  if (!p) return { title: "Nicht gefunden" };
  return { title: p.name, description: p.tagline };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [p] = await db
    .select()
    .from(products)
    .where(eq(products.slug, slug))
    .limit(1);
  if (!p) notFound();

  const related = await db
    .select()
    .from(products)
    .where(ne(products.id, p.id))
    .limit(4);

  return (
    <div className="container-tight py-10">
      <div className="mb-6 text-sm">
        <Link href="/shop" className="link">
          ← Zurück zum Shop
        </Link>
      </div>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="surface overflow-hidden p-0">
          <Image
            src={p.image}
            alt={p.name}
            width={1000}
            height={1000}
            className="aspect-square w-full object-cover"
            priority
          />
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.18em]" style={{ color: "rgb(var(--muted))" }}>
            {p.material} · Kategorie: {p.category}
          </div>
          <h1 className="mt-2 text-4xl font-semibold leading-tight sm:text-5xl">
            {p.name}
          </h1>
          <p className="mt-3 text-lg italic" style={{ color: "rgb(var(--muted))" }}>
            „{p.tagline}"
          </p>

          <dl className="mt-8 grid grid-cols-3 gap-4 text-sm">
            <div className="surface p-4">
              <dt className="text-xs uppercase tracking-wide" style={{ color: "rgb(var(--muted))" }}>Material</dt>
              <dd className="mt-1 font-semibold">{p.material}</dd>
            </div>
            <div className="surface p-4">
              <dt className="text-xs uppercase tracking-wide" style={{ color: "rgb(var(--muted))" }}>Gewicht</dt>
              <dd className="mt-1 font-semibold">{formatGrams(p.weightGrams)}</dd>
            </div>
            <div className="surface p-4">
              <dt className="text-xs uppercase tracking-wide" style={{ color: "rgb(var(--muted))" }}>Länge</dt>
              <dd className="mt-1 font-semibold">{p.lengthCm} cm</dd>
            </div>
          </dl>

          <p className="mt-8 leading-relaxed">{p.description}</p>

          <div className="mt-8 flex items-end justify-between">
            <div>
              <div className="text-xs uppercase tracking-wide" style={{ color: "rgb(var(--muted))" }}>
                Preis
              </div>
              <div className="text-3xl font-semibold">{formatEUR(p.priceCents)}</div>
              <div className="text-xs" style={{ color: "rgb(var(--muted))" }}>
                inkl. 19 % MwSt., versandkostenfrei in DE
              </div>
            </div>
            {p.inStock ? (
              <span className="badge">Sofort lieferbar · 3–5 Tage</span>
            ) : (
              <span className="badge">Vorbestellung · 6–8 Wochen</span>
            )}
          </div>

          <div className="mt-6">
            <AddToCart
              item={{
                key: `product-${p.id}`,
                name: p.name,
                priceCents: p.priceCents,
                image: p.image,
                meta: { material: p.material, gewicht: p.weightGrams + " g" },
              }}
            />
          </div>

          <ul className="mt-10 space-y-2 text-sm" style={{ color: "rgb(var(--muted))" }}>
            <li>· Manufaktur-Echtheitszertifikat</li>
            <li>· Lebenslange Beratung in der Werkstatt Wittenberg</li>
            <li>· Diskrete Verpackung im neutralen Karton</li>
            <li>· 30 Tage Rückgabe ohne Begründung (außer Gravur)</li>
          </ul>
        </div>
      </div>

      <section className="mt-20">
        <h2 className="mb-6 text-2xl font-semibold">Das könnte Sie auch interessieren</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((r) => (
            <Link
              key={r.id}
              href={`/shop/${r.slug}`}
              className="surface group overflow-hidden p-0 transition hover:shadow-liftn"
            >
              <div className="aspect-square overflow-hidden">
                <Image
                  src={r.image}
                  alt={r.name}
                  width={400}
                  height={400}
                  className="h-full w-full object-cover transition group-hover:scale-[1.04]"
                />
              </div>
              <div className="p-4">
                <h3 className="font-serif text-lg font-semibold leading-tight">{r.name}</h3>
                <div className="mt-1 text-sm" style={{ color: "rgb(var(--muted))" }}>
                  {r.material}
                </div>
                <div className="mt-3 font-semibold">{formatEUR(r.priceCents)}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
