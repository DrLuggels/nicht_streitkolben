export const metadata = { title: "Datenschutz" };

export default function DatenschutzPage() {
  return (
    <div className="container-tight py-12">
      <h1 className="text-4xl font-semibold">Datenschutzerklärung</h1>
      <div className="prose-paper mt-8 max-w-3xl">
        <p>
          Die Kolbenmanufaktur Wittenberg behandelt Ihre personenbezogenen
          Daten mit der Sorgfalt, die wir auch unseren Damaststahl-Klingen
          angedeihen lassen — sparsam, präzise und mit dem nötigen Respekt.
        </p>

        <h2>1. Verantwortliche Stelle</h2>
        <p>
          Verantwortlich für die Datenverarbeitung ist die Kolbenmanufaktur
          Wittenberg GmbH &amp; Co. KG. Details zur Geschäftsführung und
          Postanschrift entnehmen Sie unserem Impressum.
        </p>

        <h2>2. Erhobene Daten</h2>
        <ul>
          <li>Bestelldaten: Name, Adresse, E-Mail, ggf. Telefonnummer.</li>
          <li>Forendaten: Benutzername, E-Mail, gesetzte Beiträge.</li>
          <li>Technische Daten: Anonymisierte Server-Logs (max. 7 Tage).</li>
        </ul>

        <h2>3. Cookies</h2>
        <p>
          Wir verwenden ausschließlich technisch notwendige Cookies. Es gibt
          keine Tracker, kein Profiling, keine Drittanbieter-Werbung.
        </p>

        <h2>4. Ihre Rechte</h2>
        <p>
          Sie haben jederzeit das Recht auf Auskunft, Berichtigung, Löschung,
          Einschränkung der Verarbeitung sowie auf Datenübertragbarkeit. Eine
          Anfrage genügt — am besten per Brief, idealerweise mit dezenter
          Briefbeschwer.
        </p>

        <h2>5. Stand</h2>
        <p>
          Diese Datenschutzerklärung gilt ab dem 1. Januar 1487 in der
          aktuell überarbeiteten Fassung.
        </p>
      </div>
    </div>
  );
}
