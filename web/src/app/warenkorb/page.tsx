"use client";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { formatEUR } from "@/lib/format";

export default function CartPage() {
  const { items, totalCents, setQty, remove, clear } = useCart();

  if (items.length === 0) {
    return (
      <div className="container-tight py-20 text-center">
        <h1 className="text-4xl font-semibold">Ihr Warenkorb ist leer</h1>
        <p className="mt-3" style={{ color: "rgb(var(--muted))" }}>
          Vielleicht der richtige Moment, einen Bürgerkolben Bronze Klassik
          zu betrachten.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/shop" className="btn btn-primary">
            Sortiment ansehen
          </Link>
          <Link href="/konfigurator" className="btn btn-outline">
            Konfigurator starten
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-tight py-12">
      <h1 className="text-4xl font-semibold">Warenkorb</h1>
      <p className="mt-2" style={{ color: "rgb(var(--muted))" }}>
        Prüfen Sie Ihre Auswahl und schließen Sie die Bestellung diskret ab.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {items.map((it) => (
            <div key={it.key} className="surface flex gap-4 p-4">
              {it.image && (
                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={it.image}
                    alt={it.name}
                    width={200}
                    height={200}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col">
                <div className="font-serif text-lg font-semibold">{it.name}</div>
                {it.meta && (
                  <div className="mt-1 text-xs" style={{ color: "rgb(var(--muted))" }}>
                    {Object.entries(it.meta)
                      .map(([k, v]) => `${k}: ${v}`)
                      .join(" · ")}
                  </div>
                )}
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      className="btn btn-outline h-8 w-8 p-0"
                      onClick={() => setQty(it.key, it.qty - 1)}
                      aria-label="Eins weniger"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-semibold">{it.qty}</span>
                    <button
                      className="btn btn-outline h-8 w-8 p-0"
                      onClick={() => setQty(it.key, it.qty + 1)}
                      aria-label="Eins mehr"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">
                      {formatEUR(it.priceCents * it.qty)}
                    </span>
                    <button
                      className="text-xs underline"
                      style={{ color: "rgb(var(--muted))" }}
                      onClick={() => remove(it.key)}
                    >
                      entfernen
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="flex justify-end">
            <button
              className="text-xs underline"
              style={{ color: "rgb(var(--muted))" }}
              onClick={() => clear()}
            >
              Warenkorb leeren
            </button>
          </div>
        </div>

        <aside className="surface h-fit p-6 lg:sticky lg:top-24">
          <h2 className="text-lg font-semibold">Zusammenfassung</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt style={{ color: "rgb(var(--muted))" }}>Zwischensumme</dt>
              <dd>{formatEUR(totalCents)}</dd>
            </div>
            <div className="flex justify-between">
              <dt style={{ color: "rgb(var(--muted))" }}>Versand</dt>
              <dd>kostenfrei</dd>
            </div>
            <div className="flex justify-between border-t pt-3 text-base font-semibold" style={{ borderColor: "rgb(var(--border) / 0.5)" }}>
              <dt>Gesamtbetrag</dt>
              <dd>{formatEUR(totalCents)}</dd>
            </div>
          </dl>
          <Link href="/checkout" className="btn btn-primary mt-6 w-full">
            Zur Kasse →
          </Link>
          <p className="mt-3 text-xs" style={{ color: "rgb(var(--muted))" }}>
            Wir akzeptieren ausschließlich Rechnung &amp; Vorkasse. Keine
            Speicherung von Zahlungsdaten.
          </p>
        </aside>
      </div>
    </div>
  );
}
