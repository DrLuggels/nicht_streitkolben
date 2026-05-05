// Insider: Wer Impressum öffnet, landet in einem "echt aussehenden" Stack-Trace.
// Kein redirect, kein notFound — eine sehr seriös wirkende Fehlerseite.
import { ImpressumStackTrace } from "@/components/ImpressumStackTrace";

export const metadata = {
  title: "Internal Server Error",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function ImpressumPage() {
  return <ImpressumStackTrace />;
}
