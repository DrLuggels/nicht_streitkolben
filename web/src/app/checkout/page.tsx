"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import { formatEUR } from "@/lib/format";

export default function CheckoutPage() {
  const { items, totalCents, clear } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (items.length === 0 && !submitting) {
    return (
      <div className="container-tight py-20 text-center">
        <h1 className="text-4xl font-semibold">Warenkorb ist leer</h1>
        <p className="mt-3" style={{ color: "rgb(var(--muted))" }}>
          Bitte legen Sie zuerst einen Streitkolben in den Warenkorb.
        </p>
      </div>
    );
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const f = new FormData(e.currentTarget);
    const data = Object.fromEntries(f.entries());
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, items, totalCents }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Fehler beim Abschließen.");
      }
      const json = await res.json();
      clear();
      router.push(`/checkout/danke?bestellung=${json.orderNumber}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unbekannter Fehler.");
      setSubmitting(false);
    }
  }

  return (
    <div className="container-tight py-12">
      <h1 className="text-4xl font-semibold">Bestellung abschließen</h1>
      <p className="mt-2" style={{ color: "rgb(var(--muted))" }}>
        Versand erfolgt diskret. Zahlung per Rechnung nach Lieferung —
        Zahlungsdaten werden zu keinem Zeitpunkt online erfasst.
      </p>

      <form onSubmit={submit} className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <section className="surface p-6">
            <h2 className="text-lg font-semibold">Kontakt</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Vor- und Nachname</label>
                <input className="input" name="name" required minLength={3} />
              </div>
              <div>
                <label className="label">E-Mail</label>
                <input className="input" name="email" type="email" required />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Telefon (optional, für Rückfragen)</label>
                <input className="input" name="phone" type="tel" />
              </div>
            </div>
          </section>

          <section className="surface p-6">
            <h2 className="text-lg font-semibold">Lieferanschrift</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label">Straße und Hausnummer</label>
                <input className="input" name="street" required />
              </div>
              <div>
                <label className="label">PLZ</label>
                <input className="input" name="zip" required pattern="[0-9]{5}" />
              </div>
              <div>
                <label className="label">Ort</label>
                <input className="input" name="city" required />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Land</label>
                <select className="input" name="country" defaultValue="DE">
                  <option value="DE">Deutschland</option>
                  <option value="AT">Österreich</option>
                  <option value="CH">Schweiz</option>
                  <option value="LI">Liechtenstein</option>
                </select>
              </div>
            </div>
          </section>

          <section className="surface p-6">
            <h2 className="text-lg font-semibold">Versandoptionen</h2>
            <div className="mt-4 space-y-3 text-sm">
              <label className="surface flex cursor-pointer items-start gap-3 p-4">
                <input type="radio" name="shipping" value="standard" defaultChecked className="mt-1" />
                <div>
                  <div className="font-semibold">DPD Standard · 3–5 Werktage · kostenfrei</div>
                  <div style={{ color: "rgb(var(--muted))" }}>
                    Diskrete Verpackung im neutralen Karton.
                  </div>
                </div>
              </label>
              <label className="surface flex cursor-pointer items-start gap-3 p-4">
                <input type="radio" name="shipping" value="express" className="mt-1" />
                <div>
                  <div className="font-semibold">Express · 1–2 Werktage · 19,90 €</div>
                  <div style={{ color: "rgb(var(--muted))" }}>
                    Persönliche Übergabe durch DPD-Sicherheitspartner.
                  </div>
                </div>
              </label>
              <label className="surface flex cursor-pointer items-start gap-3 p-4">
                <input type="radio" name="shipping" value="brieftaube" className="mt-1" />
                <div>
                  <div className="font-semibold">Brieftaube · 4–9 Werktage · 0,00 €</div>
                  <div style={{ color: "rgb(var(--muted))" }}>
                    Für historisch interessierte Sammler. Witterungsabhängig.
                  </div>
                </div>
              </label>
            </div>
          </section>

          <section className="surface p-6">
            <h2 className="text-lg font-semibold">Zahlung</h2>
            <div
              className="mt-4 rounded-lg p-4 text-sm"
              style={{
                backgroundColor: "rgb(var(--accent) / 0.1)",
                color: "rgb(var(--muted))",
              }}
            >
              Wir akzeptieren ausschließlich <strong>Rechnung nach Lieferung</strong>.
              Aus Diskretionsgründen werden online keine Zahlungsdaten
              entgegengenommen. Sie erhalten Ihre Rechnung auf Pergamentpapier
              gemeinsam mit der Lieferung.
            </div>
          </section>

          <section className="surface p-6">
            <h2 className="text-lg font-semibold">Anmerkungen</h2>
            <textarea
              className="input mt-4 min-h-[100px]"
              name="notes"
              placeholder="Optional: Wunschtermin, Liefereinweisung, besondere Diskretion."
            />
          </section>

          {error && (
            <div className="surface p-4 text-sm" style={{ color: "rgb(var(--accent))" }}>
              {error}
            </div>
          )}
        </div>

        <aside className="surface h-fit p-6 lg:sticky lg:top-24">
          <h2 className="text-lg font-semibold">Ihre Bestellung</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {items.map((it) => (
              <li key={it.key} className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold leading-tight">{it.name}</div>
                  <div className="text-xs" style={{ color: "rgb(var(--muted))" }}>
                    Menge {it.qty}
                  </div>
                </div>
                <div>{formatEUR(it.priceCents * it.qty)}</div>
              </li>
            ))}
          </ul>
          <dl className="mt-5 space-y-2 border-t pt-4 text-sm" style={{ borderColor: "rgb(var(--border) / 0.5)" }}>
            <div className="flex justify-between">
              <dt style={{ color: "rgb(var(--muted))" }}>Versand</dt>
              <dd>kostenfrei</dd>
            </div>
            <div className="flex justify-between text-base font-semibold">
              <dt>Gesamt</dt>
              <dd>{formatEUR(totalCents)}</dd>
            </div>
          </dl>
          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary mt-6 w-full"
          >
            {submitting ? "Wird übermittelt …" : "Kostenpflichtig bestellen"}
          </button>
          <p className="mt-3 text-xs" style={{ color: "rgb(var(--muted))" }}>
            Mit Klick auf „Kostenpflichtig bestellen" akzeptieren Sie unsere
            AGB. Es gelten unsere Versandbedingungen.
          </p>
        </aside>
      </form>
    </div>
  );
}
