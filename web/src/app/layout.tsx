import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CookieBanner } from "@/components/CookieBanner";
import { CartProvider } from "@/components/CartProvider";

export const metadata: Metadata = {
  title: {
    default: "Kolbenmanufaktur Wittenberg — Streitkolben seit 1487",
    template: "%s · Kolbenmanufaktur Wittenberg",
  },
  description:
    "Handgefertigte Streitkolben aus Sumpf-Eiche, Bronze, Damaststahl und Titan-Karbon-Verbund. Konfigurator, Beratung und Wissen für die nachhaltige Argumentationskultur.",
  applicationName: "Kolbenmanufaktur Wittenberg",
  keywords: [
    "Streitkolben",
    "Argumentation",
    "Manufaktur",
    "Wittenberg",
    "Damaststahl",
    "Konfigurator",
  ],
  openGraph: {
    type: "website",
    title: "Kolbenmanufaktur Wittenberg",
    description:
      "Streitkolben für nachhaltige Konversationskultur. Seit 1487.",
    siteName: "Kolbenmanufaktur Wittenberg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const themeBootstrap = `(() => {
  try {
    const t = localStorage.getItem('theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', t === 'dark');
  } catch (e) {}
})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body className="min-h-screen">
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <CookieBanner />
        </CartProvider>
      </body>
    </html>
  );
}
