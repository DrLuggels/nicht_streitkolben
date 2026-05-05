import Link from "next/link";

export const metadata = { title: "Bestellbestätigung" };

export default async function DankePage({
  searchParams,
}: {
  searchParams: Promise<{ bestellung?: string }>;
}) {
  const { bestellung } = await searchParams;
  return (
    <div className="container-tight py-20">
      <div className="mx-auto max-w-2xl text-center">
        <div
          className="mx-auto grid h-16 w-16 place-items-center rounded-full"
          style={{
            backgroundColor: "rgb(var(--accent) / 0.18)",
            color: "rgb(var(--accent))",
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h1 className="mt-6 text-4xl font-semibold">Vielen Dank für Ihre Bestellung</h1>
        <p className="mt-3 text-lg" style={{ color: "rgb(var(--muted))" }}>
          Ihre Bestellung wurde aufgenommen. Sie erhalten in Kürze eine
          Bestätigung per E-Mail.
        </p>

        {bestellung && (
          <div className="surface mx-auto mt-8 max-w-md p-6 text-left">
            <div className="text-xs uppercase tracking-wide" style={{ color: "rgb(var(--muted))" }}>
              Ihre Bestellnummer
            </div>
            <div className="mt-1 font-mono text-xl font-semibold tracking-wider">
              {bestellung}
            </div>

            <div className="mt-6 space-y-3 text-sm" style={{ color: "rgb(var(--muted))" }}>
              <div>
                <div className="font-semibold" style={{ color: "rgb(var(--fg))" }}>
                  Voraussichtliche Lieferung
                </div>
                3–5 Werktage durch DPD oder Brieftaube (witterungsabhängig).
              </div>
              <div>
                <div className="font-semibold" style={{ color: "rgb(var(--fg))" }}>
                  Zahlung
                </div>
                Per Rechnung nach Lieferung. Die Rechnung erhalten Sie auf
                Pergamentpapier gemeinsam mit der Sendung.
              </div>
              <div>
                <div className="font-semibold" style={{ color: "rgb(var(--fg))" }}>
                  Diskretion
                </div>
                Versand erfolgt im neutralen Karton ohne sichtbares Branding.
              </div>
            </div>
          </div>
        )}

        <p className="mt-8 text-sm italic" style={{ color: "rgb(var(--muted))" }}>
          „Möge Ihr neuer Streitkolben Ihre Gespräche mit der gebührenden Würde
          rahmen.“
          <br />— Werkstattmeister Wittenberg
        </p>

        <div className="mt-10 flex justify-center gap-3">
          <Link href="/shop" className="btn btn-outline">
            Weiteres Sortiment
          </Link>
          <Link href="/forum" className="btn btn-primary">
            Erfahrungen im Forum teilen
          </Link>
        </div>
      </div>
    </div>
  );
}
