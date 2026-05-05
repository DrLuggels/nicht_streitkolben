# nicht-streitkolben.xyz

Manufaktur- &amp; Forum-Plattform für die Kolbenmanufaktur Wittenberg.

> Gimmick-Projekt mit ernstem Anspruch: Onlineshop, Konfigurator, Wissensbereich,
> voll funktionales Forum mit Auth, alles in einem Docker-Stack.

## Stack

- **Next.js 15** (App Router, TypeScript, Server Components)
- **Postgres 16** + **Drizzle ORM**
- **Tailwind CSS** mit Cappuccino-Palette und Light/Dark-Mode
- **Caddy 2** als Reverse-Proxy mit automatischem Let’s Encrypt
- **Mailhog** (Mail-Catcher), **Adminer** (DB-Admin)

## Schnellstart (lokal)

```bash
cp .env.example .env          # Passwort/SECRET anpassen!

# Stack hochfahren – Local-Override für Plain-HTTP-Caddy
docker compose -f docker-compose.yml -f docker-compose.local.yml up -d --build

# Schema initialisieren + Demo-Daten einspielen
docker compose exec web npm run db:push
docker compose exec web npm run db:seed
```

Anschließend:

- **Webseite**: http://localhost
- **Mailhog**: http://localhost:8025
- **Adminer**: http://localhost:8080 (Server: `db`, User/Pass `kolben`)

## Produktion

Auf dem Server ohne Local-Override starten – damit Caddy die Produktions-Caddyfile
mit Cloudflare-DNS-01-Challenge nutzt:

```bash
docker compose up -d --build
```

In `.env` müssen gesetzt sein: `POSTGRES_PASSWORD`, `SESSION_SECRET`, `CF_API_TOKEN`,
`CF_ZONE_NAME=nicht-streitkolben.xyz`, `ORIGIN_IPV4`. Port 80 und 443 müssen von außen
erreichbar sein.

## Demo-Accounts

Nach dem Seed sind folgende Accounts verfügbar (Passwort `kolbenpasswort`):

- `KolbenKlaus_72`, `Damaszener_Doris`, `BronzeBert`, `FrauHolle1487`,
  `AltgesellMartin`, `GravurGerda`, `NeulingNorbert`, `FilialleiterFranz`,
  `TitanTina`, `MeisterMolch`

Admin: `Manufaktur` mit Passwort `manufaktur1487`.

## Lokale Entwicklung ohne Docker

```bash
cd web
npm install
# Postgres muss erreichbar sein
DATABASE_URL=postgres://... SESSION_SECRET=... npm run db:push
DATABASE_URL=postgres://... SESSION_SECRET=... npm run db:seed
npm run dev
```

## Bilder

Die echten Streitkolben-Fotos werden aus Wikimedia Commons geladen:

```bash
bash scripts/download-images.sh
```

Quellen siehe `scripts/image-credits.md`.

## Insider

Klick auf „Impressum" liefert eine sehr seriös wirkende 500-Stack-Trace-Seite.
Das ist Absicht.
