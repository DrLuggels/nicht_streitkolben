"use client";
import { useEffect, useState } from "react";

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("cookie-consent")) {
      const t = setTimeout(() => setShow(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  function decide(value: "accept" | "decline") {
    localStorage.setItem("cookie-consent", value);
    setShow(false);
  }

  if (!show) return null;
  return (
    <div className="fixed inset-x-3 bottom-3 z-50 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:max-w-md">
      <div className="surface p-5">
        <h3 className="mb-1 text-base font-semibold">Cookies & Diskretion</h3>
        <p className="mb-4 text-sm" style={{ color: "rgb(var(--muted))" }}>
          Damit unsere Bestellprozesse so reibungslos verlaufen wie ein gut
          ausbalancierter Damaststahl, verwenden wir notwendige Cookies. Eine
          ausführliche Datenschutzerklärung liegt im Tresor unserer
          Manufaktur.
        </p>
        <div className="flex items-center gap-2">
          <button
            className="btn btn-primary flex-1"
            onClick={() => decide("accept")}
          >
            Verstanden, akzeptieren
          </button>
          <button
            className="btn btn-outline"
            onClick={() => decide("decline")}
          >
            Nur notwendige
          </button>
        </div>
      </div>
    </div>
  );
}
