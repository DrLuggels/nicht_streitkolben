import { Configurator } from "@/components/Configurator";

export const metadata = { title: "Konfigurator" };

export default function KonfiguratorPage() {
  return (
    <div className="container-tight py-12">
      <span className="badge">Konfigurator</span>
      <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">
        Ihr persönlicher Streitkolben
      </h1>
      <p className="mt-3 max-w-2xl text-lg" style={{ color: "rgb(var(--muted))" }}>
        Stellen Sie Ihren maßgefertigten Kolben in unserer Manufaktur zusammen.
        Jede Konfiguration wird in Wittenberg gefertigt — Lieferzeit 10–14
        Wochen, lebenslange Werkstattgarantie inklusive.
      </p>

      <Configurator />
    </div>
  );
}
