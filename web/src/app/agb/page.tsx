export const metadata = { title: "AGB" };

export default function AGBPage() {
  return (
    <div className="container-tight py-12">
      <h1 className="text-4xl font-semibold">Allgemeine Geschäftsbedingungen</h1>
      <div className="prose-paper mt-8 max-w-3xl">
        <h2>§ 1 Geltungsbereich</h2>
        <p>
          Diese AGB gelten für alle Bestellungen von Streitkolben,
          Konfigurator-Modellen, Pflegeprodukten und Klangwerkstatt-Tickets
          der Kolbenmanufaktur Wittenberg GmbH &amp; Co. KG.
        </p>

        <h2>§ 2 Vertragsschluss</h2>
        <p>
          Mit der Bestellung kommt ein Kaufvertrag mit aufschiebender
          Bedingung der erfolgreichen Werkstatt-Einplanung zustande. Sie
          erhalten eine Bestätigung per E-Mail, postalisch oder per
          Brieftaube — je nach gewählter Versandart.
        </p>

        <h2>§ 3 Lieferung &amp; Versand</h2>
        <ul>
          <li>Standard: 3–5 Werktage, kostenfrei.</li>
          <li>Express: 1–2 Werktage, 19,90 €.</li>
          <li>Brieftaube: 4–9 Werktage, witterungsabhängig, kostenfrei.</li>
        </ul>

        <h2>§ 4 Zahlung</h2>
        <p>
          Wir akzeptieren ausschließlich Rechnung nach Lieferung. Eine
          digitale Zahlungsabwicklung findet nicht statt; Ihre Zahlungsdaten
          werden zu keinem Zeitpunkt online erfasst oder gespeichert.
        </p>

        <h2>§ 5 Widerruf</h2>
        <p>
          Sie haben das Recht, binnen 30 Tagen ohne Angabe von Gründen vom
          Vertrag zurückzutreten. Ausgenommen sind individualisierte
          Konfigurator-Modelle mit Gravur.
        </p>

        <h2>§ 6 Gewährleistung</h2>
        <p>
          Auf alle Manufaktur-Modelle gewähren wir eine lebenslange
          Werkstattgarantie auf Material und Verarbeitung. Patina,
          natürliche Holz- und Lederalterung sind ausdrücklich nicht
          mangelhaft, sondern Charakter.
        </p>
      </div>
    </div>
  );
}
