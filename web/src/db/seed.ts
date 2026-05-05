import "dotenv/config";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import bcrypt from "bcryptjs";
import {
  users,
  products,
  forumCategories,
  forumThreads,
  forumPosts,
} from "./schema";
import { sql } from "drizzle-orm";

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ??
    "postgres://kolben:kolben@localhost:5432/kolben",
});
const db = drizzle(pool);

const productSeed = [
  // Einsteiger
  {
    slug: "lehrlings-kolben-eiche",
    name: "Lehrlings-Kolben „Eiche I“",
    tagline: "Der ehrliche Beginn jeder Überzeugungslaufbahn.",
    category: "einsteiger",
    material: "Eichenholz mit Stahl-Beschlag",
    weightGrams: 980,
    lengthCm: 58,
    priceCents: 8900,
    description:
      "Unser klassisches Einstiegsmodell aus heimischer Sumpf-Eiche, von Hand gedrechselt und mit handgeschmiedeten Stahlnieten beschlagen. Der ausgewogene Schwerpunkt vermittelt Anfängern in nur wenigen Wochen ein sicheres Standing in Diskussionen jeder Art.",
    image: "/images/products/lehrlings-kolben-eiche.jpg",
    inStock: true,
    featured: true,
  },
  {
    slug: "buergerkolben-bronze",
    name: "Bürgerkolben „Bronze Klassik“",
    tagline: "Die solide Wahl für die täglichen kleinen Differenzen.",
    category: "einsteiger",
    material: "Bronze",
    weightGrams: 1240,
    lengthCm: 62,
    priceCents: 14900,
    description:
      "Eine Hommage an die mittelalterliche Patrizier-Tradition. Vollbronze-Kopf mit dezenter Patina, Eschenholzschaft. Wirkt seriös in jeder Aktentasche und überzeugt Steuerberater wie Schwiegermütter.",
    image: "/images/products/buergerkolben-bronze.jpg",
    inStock: true,
    featured: false,
  },
  {
    slug: "kompakt-kolben-handlich",
    name: "Kompakt-Kolben „Handlich“",
    tagline: "Diskret in der Innentasche, deutlich im Argument.",
    category: "einsteiger",
    material: "Eichenholz mit Stahl-Beschlag",
    weightGrams: 720,
    lengthCm: 41,
    priceCents: 7400,
    description:
      "Unser kürzestes Modell für die urbane Kommunikationskultur. Passt in jede Aktentasche, jedes Cello-Etui und jeden gut geschnittenen Mantel. Empfohlen für Kassenschlangen und Mietwagen-Übergaben.",
    image: "/images/products/kompakt-kolben.jpg",
    inStock: true,
    featured: false,
  },

  // Fortgeschritten
  {
    slug: "buchhalter-kolben-praezision",
    name: "Buchhalter-Kolben „Präzision“",
    tagline: "Wenn die Argumente Komma-genau sitzen müssen.",
    category: "fortgeschritten",
    material: "Damaststahl",
    weightGrams: 1380,
    lengthCm: 64,
    priceCents: 38900,
    description:
      "Damaszener Faltenstahl mit 256 Lagen, präzise austariert für die feine Klingenarbeit der Argumentation. Das geflanschte Kopfstück hinterlässt ausschließlich nachvollziehbare Eindrücke. Inklusive Lederfutteral mit Inventur-Block.",
    image: "/images/products/buchhalter-kolben.jpg",
    inStock: true,
    featured: true,
  },
  {
    slug: "verhandlungskolben-mediator",
    name: "Verhandlungskolben „Mediator“",
    tagline: "Findet die Mitte – meistens in der Stirn des Gegenübers.",
    category: "fortgeschritten",
    material: "Damaststahl",
    weightGrams: 1520,
    lengthCm: 70,
    priceCents: 44900,
    description:
      "Speziell entwickelt für lange Sitzungen mit ergonomischem Griff aus Sattelleder und kontrolliertem Schwerpunkt. Der achtfach geflanschte Kopf wurde von einem zertifizierten Konfliktcoach mitentwickelt.",
    image: "/images/products/verhandlungskolben.jpg",
    inStock: true,
    featured: false,
  },
  {
    slug: "salon-kolben-konversation",
    name: "Salon-Kolben „Konversation“",
    tagline: "Für gepflegte Gespräche unter Niveau.",
    category: "fortgeschritten",
    material: "Bronze",
    weightGrams: 1180,
    lengthCm: 66,
    priceCents: 32900,
    description:
      "Eine Reverenz an die französischen Salons des 18. Jahrhunderts. Der ziselierte Bronzekopf trägt feine Lorbeer-Ornamente und unterstreicht jede pointierte Bemerkung mit angemessener kinetischer Energie.",
    image: "/images/products/salon-kolben.jpg",
    inStock: true,
    featured: false,
  },
  {
    slug: "feldkolben-allwetter",
    name: "Feldkolben „Allwetter“",
    tagline: "Wenn das Leben draußen stattfindet.",
    category: "fortgeschritten",
    material: "Eichenholz mit Stahl-Beschlag",
    weightGrams: 1320,
    lengthCm: 72,
    priceCents: 18900,
    description:
      "Wetterfest behandelter Eschenholz-Schaft, korrosionsgeschützter Kopf, integrierter Karabiner-Gurt für die Wanderausrüstung. Hat sich vor allem in Almkonflikten und bei Bauernhof-Besichtigungen bewährt.",
    image: "/images/products/feldkolben.jpg",
    inStock: true,
    featured: false,
  },

  // Profi
  {
    slug: "diplomatenkolben-aurum",
    name: "Diplomatenkolben „Aurum“",
    tagline: "Für die ganz dezenten Hinweise auf höchster Ebene.",
    category: "profi",
    material: "Damaststahl",
    weightGrams: 1640,
    lengthCm: 74,
    priceCents: 89900,
    description:
      "Unser Spitzenmodell für Botschafts-Empfänge und Vorstandssitzungen. Damaststahl mit 24-karätiger Goldätzung, Griff aus belgischem Kalbsleder. Wird in einem maßgefertigten Mahagoni-Koffer mit Echtheitszertifikat und Krawattennadel ausgeliefert.",
    image: "/images/products/diplomatenkolben.jpg",
    inStock: true,
    featured: true,
  },
  {
    slug: "morgendaemmerung-titan",
    name: "Morgendämmerung „Titan-Karbon“",
    tagline: "Leicht wie ein Argument. Hart wie ein Beweis.",
    category: "profi",
    material: "Titan-Karbon-Verbund",
    weightGrams: 880,
    lengthCm: 68,
    priceCents: 79900,
    description:
      "Hightech trifft Tradition: Titan-Kern, Karbonfaser-Mantel, ergonomischer 3D-gedruckter Griff. Mit 880 Gramm der leichteste Streitkolben in seiner Wirkungsklasse. Perfekt für minimalistische Lebensentwürfe.",
    image: "/images/products/morgendaemmerung-titan.jpg",
    inStock: true,
    featured: true,
  },
  {
    slug: "vorstands-kolben-executive",
    name: "Vorstands-Kolben „Executive“",
    tagline: "Setzt im Quartalsgespräch klare Akzente.",
    category: "profi",
    material: "Karbon",
    weightGrams: 760,
    lengthCm: 60,
    priceCents: 64900,
    description:
      "Vollkarbon-Konstruktion in Sichtgewebe-Optik, anthrazit-eloxierter Aluminium-Knauf, integriertes Schweizer Uhrwerk im Knauf (rein zur Zier, versteht sich). Wird bevorzugt von Aufsichtsräten und Privatbankiers geführt.",
    image: "/images/products/vorstands-kolben.jpg",
    inStock: false,
    featured: false,
  },

  // Bankbesuch-Edition
  {
    slug: "bankbesuch-edition-classic",
    name: "Bankbesuch-Edition „Classic“",
    tagline: "Für faire Konditionsgespräche am Schalter.",
    category: "bankbesuch",
    material: "Bronze",
    weightGrams: 1480,
    lengthCm: 71,
    priceCents: 49900,
    description:
      "Speziell entwickelt für Verhandlungen über Dispozinsen und Kontoführungsgebühren. Der achtkantige Bronzekopf transportiert auch ohne Worte die ganze Bedeutung Ihrer finanziellen Situation. Vereinbaren Sie wie immer einen Termin.",
    image: "/images/products/bankbesuch-classic.jpg",
    inStock: true,
    featured: true,
  },
  {
    slug: "bankbesuch-edition-premium",
    name: "Bankbesuch-Edition „Premium“",
    tagline: "Wenn die Filialleitung persönlich verhandeln muss.",
    category: "bankbesuch",
    material: "Damaststahl",
    weightGrams: 1620,
    lengthCm: 73,
    priceCents: 99900,
    description:
      "Damaststahl, geflanschter Kopf, gravierte Mahnung „Carpe Annuum“. Inklusive maßgeschneidertem Aktenkoffer-Inlay, das zwischen Tagesumsätzen und Streitkolben unauffällig wechselt. Empfohlene Begleitung: Wirtschaftsanwalt.",
    image: "/images/products/bankbesuch-premium.jpg",
    inStock: true,
    featured: false,
  },
  {
    slug: "bankbesuch-edition-platinum",
    name: "Bankbesuch-Edition „Platinum“",
    tagline: "Für Privatkunden mit individuellem Beratungsbedarf.",
    category: "bankbesuch",
    material: "Titan-Karbon-Verbund",
    weightGrams: 1140,
    lengthCm: 75,
    priceCents: 159900,
    description:
      "Maßgeschneidertes Spitzenmodell aus titaneloxierter Karbonfaser. Wird ausschließlich nach persönlichem Beratungstermin in unserer Wittenberger Manufaktur ausgeliefert. Die Nummerierung erfolgt nach Ihrem Geburtsjahr.",
    image: "/images/products/bankbesuch-platinum.jpg",
    inStock: true,
    featured: true,
  },
];

const seedCategories = [
  {
    slug: "allgemein",
    name: "Allgemeine Diskussion",
    description:
      "Alles rund um den Streitkolben: Geschichte, Kultur, Lebensgefühl.",
    sortOrder: 10,
  },
  {
    slug: "kaufberatung",
    name: "Kaufberatung & Empfehlungen",
    description:
      "Welcher Kolben für welchen Zweck? Hier helfen erfahrene Mitglieder weiter.",
    sortOrder: 20,
  },
  {
    slug: "erfahrungen",
    name: "Erfahrungsberichte",
    description:
      "Eure Geschichten – vom ersten Bankbesuch bis zur Schwiegermutter-Visite.",
    sortOrder: 30,
  },
  {
    slug: "pflege",
    name: "Pflege & Wartung",
    description:
      "Damaststahl ölen, Lederwicklung pflegen, Bronze patinieren – das geballte Handwerkswissen.",
    sortOrder: 40,
  },
];

const fakeUsers = [
  { username: "KolbenKlaus_72", email: "klaus@example.test" },
  { username: "Damaszener_Doris", email: "doris@example.test" },
  { username: "BronzeBert", email: "bert@example.test" },
  { username: "FrauHolle1487", email: "holle@example.test" },
  { username: "AltgesellMartin", email: "martin@example.test" },
  { username: "GravurGerda", email: "gerda@example.test" },
  { username: "NeulingNorbert", email: "norbert@example.test" },
  { username: "FilialleiterFranz", email: "franz@example.test" },
  { username: "TitanTina", email: "tina@example.test" },
  { username: "MeisterMolch", email: "molch@example.test" },
];

type ThreadSeed = {
  category: string;
  author: string;
  title: string;
  body: string;
  posts: { author: string; body: string }[];
};

const threadSeeds: ThreadSeed[] = [
  {
    category: "allgemein",
    author: "KolbenKlaus_72",
    title: "Willkommen im Kolbenforum – bitte zuerst lesen",
    body:
      "Liebe Mitglieder,\n\nherzlich willkommen in der größten deutschsprachigen Gemeinschaft für gepflegte Streitkolben-Kultur. Bitte beachtet unsere Etikette: keine Beleidigungen, keine Schwerter, keine Fehden ohne schriftliche Voranmeldung. Wer einen Kolben bewegt, möge dies mit Würde tun.\n\nMit kollegialen Grüßen,\nKlaus",
    posts: [
      {
        author: "Damaszener_Doris",
        body: "Schön formuliert, Klaus. Für Neulinge empfehle ich zusätzlich den Wissens-Bereich – die Übersicht zu den vier Kopfformen hat mir damals sehr geholfen.",
      },
      {
        author: "BronzeBert",
        body: "Ich würde noch ergänzen: bitte keine Anfragen zu Schwertern. Wir hatten das Thema, es endet immer gleich.",
      },
      {
        author: "MeisterMolch",
        body: "+1. Und Schwerter sind auch schon ergonomisch eine Zumutung.",
      },
    ],
  },
  {
    category: "allgemein",
    author: "TitanTina",
    title: "Titan-Karbon – ist das eigentlich noch echt?",
    body:
      "Habe seit drei Wochen die „Morgendämmerung“. Großartig austariert, aber irgendwie fühlt sich Karbon nach Sportwagen an, nicht nach Tradition. Wie seht ihr das?",
    posts: [
      {
        author: "AltgesellMartin",
        body: "Mein Sohn hat dieses Modell. Ich finde, es schwingt nicht mit. Aber wir wollen ja nicht alle gleich klingen.",
      },
      {
        author: "GravurGerda",
        body: "Karbon ist okay, wenn die Gravur klassisch bleibt. Ich habe „Memento Argumentum“ in Fraktur ätzen lassen, das versöhnt das Material wieder mit der Würde.",
      },
    ],
  },
  {
    category: "allgemein",
    author: "FrauHolle1487",
    title: "Wittenberg-Tour 2026 – wer ist dabei?",
    body:
      "Die Manufaktur öffnet im Juni wieder ihre Pforten für eine Werksführung mit Schmiedevorführung und Damast-Atelier-Besichtigung. Im Anschluss gemeinsames Vesper mit Birne. Anmeldung läuft.",
    posts: [
      { author: "BronzeBert", body: "Bin dabei. Die Birne war letztes Jahr exzellent." },
      { author: "FilialleiterFranz", body: "Ich kann nur an einem Tag, aber sehr gerne." },
      {
        author: "MeisterMolch",
        body: "Ich bringe wieder selbstgebackenes Brot mit, falls niemand widerspricht.",
      },
    ],
  },
  {
    category: "allgemein",
    author: "NeulingNorbert",
    title: "Was ist eigentlich der Unterschied zwischen Kolben und Keule?",
    body:
      "Frage steht oben. Ich werde im Internet zu beidem auf dieselben Bilder weitergeleitet, möchte aber nichts Falsches kaufen.",
    posts: [
      {
        author: "MeisterMolch",
        body: "Kurzform: Eine Keule ist meist einteilig und ohne Beschlag. Ein Streitkolben hat einen klar abgesetzten Kopf, häufig geflanscht oder geziert, sowie einen verstärkten Schaft. Wer eine Keule kauft, muss damit leben, dass jemand „Höhlenmensch“ raunt.",
      },
      {
        author: "KolbenKlaus_72",
        body: "Wir hatten dazu mal einen Wissensartikel – ich glaube, der hieß „Streitkolben vs. Langschwert“. Da steht es auch sehr klar drin.",
      },
    ],
  },
  {
    category: "allgemein",
    author: "GravurGerda",
    title: "Schöne Gravur-Sprüche – eure Favoriten?",
    body:
      "Sammle gerade Inspiration für meinen neuen Salon-Kolben. Was habt ihr eingravieren lassen?",
    posts: [
      { author: "BronzeBert", body: "„Verbal ist vorbei.“ – schlicht, aber endgültig." },
      { author: "TitanTina", body: "Ich habe nur das Datum meiner letzten Mahnung. Es reicht völlig." },
      {
        author: "AltgesellMartin",
        body: "„Wer schweigt, stimmt zu. Wer redet, korrigiert.“",
      },
    ],
  },
  {
    category: "kaufberatung",
    author: "NeulingNorbert",
    title: "Erstkauf: Eichenholz oder Bronze?",
    body:
      "Stehe vor meiner ersten Anschaffung. Budget bis 200 Euro. Eher der „Lehrlings-Kolben Eiche I“ oder doch der „Bürgerkolben Bronze Klassik“? Anwendungsfeld: Mietverhandlungen.",
    posts: [
      {
        author: "KolbenKlaus_72",
        body: "Mietverhandlungen sind ein Bronze-Thema. Holz wird vom Vermieter oft als rustikal abgetan; Bronze hingegen impliziert Solvenz.",
      },
      {
        author: "Damaszener_Doris",
        body: "Sehe ich genauso. Außerdem patiniert Bronze im Lauf der Jahre und erzählt eine Geschichte. Holz wird einfach nur dunkel.",
      },
      {
        author: "NeulingNorbert",
        body: "Danke! Dann wird es der Bürgerkolben.",
      },
    ],
  },
  {
    category: "kaufberatung",
    author: "FilialleiterFranz",
    title: "Bankbesuch-Edition: Classic vs. Premium?",
    body:
      "Vor einer entscheidenden Konditionenrunde mit der Hausbank. Reicht der Classic, oder lohnt sich der Sprung zur Premium-Edition?",
    posts: [
      {
        author: "BronzeBert",
        body: "Hängt von der Filialgröße ab. In Stadtteilfilialen reicht der Classic. In der Hauptstelle empfehle ich Premium – Damaststahl wirkt einfach institutioneller.",
      },
      {
        author: "FrauHolle1487",
        body: "Premium hat zusätzlich das Aktenkoffer-Inlay, das wirkt sehr professionell. Der Classic dagegen sitzt besser in der Hand, falls es länger dauert.",
      },
    ],
  },
  {
    category: "kaufberatung",
    author: "TitanTina",
    title: "Suche etwas Leichtes für lange Tagungen",
    body:
      "Bin viel unterwegs (Beraterin), schleppe sowieso schon einen Laptop. Brauche etwas unter einem Kilo, das aber trotzdem präsent ist.",
    posts: [
      {
        author: "GravurGerda",
        body: "Ganz klar „Morgendämmerung Titan-Karbon“. 880 Gramm, lässt sich elegant am Trolley befestigen.",
      },
      {
        author: "MeisterMolch",
        body: "Alternativ der „Vorstands-Kolben Executive“ aus Vollkarbon. Etwas teurer, aber das Schweizer Uhrwerk im Knauf ist ein netter Eisbrecher.",
      },
    ],
  },
  {
    category: "kaufberatung",
    author: "AltgesellMartin",
    title: "Geschenk zum 60. Geburtstag – Empfehlung?",
    body:
      "Mein Schwager wird 60. Eher klassisch orientiert, schätzt traditionelle Werte. Was passt?",
    posts: [
      {
        author: "Damaszener_Doris",
        body: "Salon-Kolben „Konversation“. Bronze, ziseliert, gediegen – passt zu jedem Wohnzimmer und jedem Schwager.",
      },
      {
        author: "KolbenKlaus_72",
        body: "Wenn er Sammler ist: Diplomatenkolben Aurum. Aber Vorsicht – danach möchte er möglicherweise selber Aufsichtsrat werden.",
      },
    ],
  },
  {
    category: "kaufberatung",
    author: "BronzeBert",
    title: "Konfigurator vs. Standardmodell",
    body:
      "Macht es Sinn, im Konfigurator zu bestellen, wenn die Standardmodelle eigentlich genau passen? Oder ist Custom immer die bessere Wahl?",
    posts: [
      {
        author: "MeisterMolch",
        body: "Custom lohnt sich, sobald die Anatomie individuell wird – Handgröße, Reichweite, Gewichtspräferenz. Für 80 % aller Anwender reicht ein Standard mit kleiner Gravur.",
      },
      {
        author: "GravurGerda",
        body: "Stimme zu. Ich habe ein Standardmodell mit Custom-Gravur, das fühlt sich „eigen“ an, ohne dass man Wochen wartet.",
      },
    ],
  },
  {
    category: "erfahrungen",
    author: "FilialleiterFranz",
    title: "Mein erster Bankbesuch – ein Erfahrungsbericht",
    body:
      "Letzten Donnerstag war es soweit: erstes Konditionsgespräch mit dem neuen Bankbesuch-Premium. Ich habe ihn ganz ruhig auf den Verhandlungstisch gelegt – nicht drohend, einfach präsent. Der Berater hat mir innerhalb von vier Minuten 1,2 Prozentpunkte beim Dispo abgezogen, ohne dass ich ein Wort darüber verlieren musste. Wirklich beeindruckend.",
    posts: [
      {
        author: "KolbenKlaus_72",
        body: "Klassische Demonstrationsverhandlung. Wichtig ist, dass der Kolben mittig liegt, parallel zur Tischkante. Schräglage wirkt aggressiv.",
      },
      {
        author: "Damaszener_Doris",
        body: "Glückwunsch! 1,2 Punkte ist ordentlich. Ich rate trotzdem immer dazu, danach noch einen Kaffee anzunehmen – das versöhnt.",
      },
      {
        author: "FilialleiterFranz",
        body: "Stimmt, habe ich gemacht. Es war ein guter Espresso.",
      },
      {
        author: "FrauHolle1487",
        body: "Großartiger Bericht. Bitte mehr davon.",
      },
    ],
  },
  {
    category: "erfahrungen",
    author: "FrauHolle1487",
    title: "Schwiegermutter-Besuch mit dem Salon-Kolben",
    body:
      "Eigentlich nur als Gehstock-Ersatz mitgenommen. Sie kommentierte das Material kurz („interessant, dieser Bronzeton“), und das Gespräch verlief erstmals ohne Bemerkung zur Kindererziehung. Ich glaube, ich werde ihn häufiger mitnehmen.",
    posts: [
      {
        author: "BronzeBert",
        body: "Bronze ist mit Schwiegereltern statistisch am erfolgreichsten. Holz wird oft als bäuerlich empfunden, Damast wirkt schnell zu großstädtisch.",
      },
      {
        author: "GravurGerda",
        body: "Ich habe eine ähnliche Erfahrung mit der Konversation gemacht. Seitdem essen wir auch leiser.",
      },
    ],
  },
  {
    category: "erfahrungen",
    author: "MeisterMolch",
    title: "Bauamt – mit dem Feldkolben Allwetter",
    body:
      "Drei Termine, jedes Mal eine andere Auskunft. Beim vierten habe ich den Feldkolben unauffällig auf den Antrag gelegt. Innerhalb von 20 Minuten lag mir die Genehmigung vor. Der Beamte sagte sogar „danke für Ihre Geduld“. Ich war gerührt.",
    posts: [
      {
        author: "AltgesellMartin",
        body: "Behörden mögen Eichenholz, das sieht heimisch aus. Für Bauämter ist das das richtige Werkzeug.",
      },
      {
        author: "NeulingNorbert",
        body: "Werde ich notieren. Mein Carport ist seit Februar in Bearbeitung.",
      },
    ],
  },
  {
    category: "erfahrungen",
    author: "KolbenKlaus_72",
    title: "Familienfeier ohne Eskalation – ein kleiner Sieg",
    body:
      "Erstmals seit acht Jahren keine politische Diskussion am Esstisch. Mein Schwager bemerkte den unauffällig neben mir gelagerten Verhandlungskolben Mediator. Das Gespräch drehte sich anschließend stundenlang um Birnensorten.",
    posts: [
      {
        author: "FrauHolle1487",
        body: "Birnen sind ein guter Themenpuffer. Kann ich als Strategie nur empfehlen.",
      },
      {
        author: "Damaszener_Doris",
        body: "Glückwunsch! Mediator ist genau für solche Anlässe konzipiert. Manchmal reicht das bloße Vorhandensein.",
      },
    ],
  },
  {
    category: "erfahrungen",
    author: "TitanTina",
    title: "Bewerbungsgespräch mit Kolben? Ein Selbstversuch",
    body:
      "Tatsächlich gewagt: „Morgendämmerung Titan-Karbon“ unter den Arm geklemmt, im Loungebereich abgelegt. Der CEO fragte interessiert nach. Wir kamen vom Hundertsten ins Tausendste, ich erzählte von der Manufaktur in Wittenberg. Drei Tage später hatte ich den Vertrag.",
    posts: [
      {
        author: "FilialleiterFranz",
        body: "Beeindruckend. War das HR oder direkt mit dem CEO?",
      },
      {
        author: "TitanTina",
        body: "Direkt CEO. Ich glaube, der Karbon-Look hat es ausgemacht. Wirkt zugänglich, aber selbstbewusst.",
      },
      {
        author: "MeisterMolch",
        body: "Mutig und elegant. Hut ab.",
      },
    ],
  },
  {
    category: "erfahrungen",
    author: "GravurGerda",
    title: "Erstes Konfigurator-Modell – zwölf Wochen Wartezeit, voll wert",
    body:
      "Vor drei Monaten konfiguriert: Damaststahl, geflanschter Kopf, 1340 Gramm, Sattelleder-Wicklung, Gravur „Solange ich rede, hört zu“. Heute eingetroffen. Ich habe geweint.",
    posts: [
      {
        author: "Damaszener_Doris",
        body: "Wundervoll. Bitte zeig Bilder, sobald du dich beruhigt hast.",
      },
      {
        author: "KolbenKlaus_72",
        body: "Großartige Gravur. Funktional und literarisch zugleich.",
      },
    ],
  },
  {
    category: "pflege",
    author: "AltgesellMartin",
    title: "Damaststahl ölen – wie oft und womit?",
    body:
      "Mein Buchhalter-Kolben ist drei Jahre alt. Sehe leichte Ermattung der Maserung. Welches Öl, welcher Rhythmus?",
    posts: [
      {
        author: "MeisterMolch",
        body: "Kamelienöl, alle vier bis sechs Wochen einen Hauch. Niemals Olivenöl – das wird ranzig und riecht in Sitzungen unangenehm.",
      },
      {
        author: "Damaszener_Doris",
        body: "Genau. Und das Tuch immer in einem Zug ziehen, niemals reibend, sonst verlierst du die Damast-Linien.",
      },
    ],
  },
  {
    category: "pflege",
    author: "BronzeBert",
    title: "Bronze patinieren oder polieren?",
    body:
      "Streitfrage in der Familie: Mein Sohn poliert seinen Bürgerkolben jede Woche. Ich finde, eine grünliche Patina würde ihm gut stehen.",
    posts: [
      {
        author: "FrauHolle1487",
        body: "Patina ist Charakter. Polierte Bronze sieht aus wie geliehen. Lass den Kolben atmen.",
      },
      {
        author: "AltgesellMartin",
        body: "Sehe ich auch so. Ein bisschen Patina signalisiert Erfahrung. Polieren nur vor wichtigen Anlässen.",
      },
    ],
  },
  {
    category: "pflege",
    author: "GravurGerda",
    title: "Lederwicklung pflegen – Tipps für Dauerträger",
    body:
      "Trage den Salon-Kolben fast täglich. Die Wicklung wird leicht speckig. Was tun?",
    posts: [
      {
        author: "Damaszener_Doris",
        body: "Sattelseife, dünn auftragen, mit weicher Bürste einarbeiten, gut trocknen lassen. Anschließend Lederfett – sparsam.",
      },
      {
        author: "MeisterMolch",
        body: "Genau. Wenn die Wicklung locker wird: nicht selbst neu wickeln, sondern in die Manufaktur schicken. Die machen das in 48 Stunden.",
      },
    ],
  },
  {
    category: "pflege",
    author: "KolbenKlaus_72",
    title: "Gravur auffrischen – lohnt der Aufwand?",
    body:
      "Meine Gravur „Audi alteram partem“ aus 2017 ist etwas verblasst. Lohnt eine Auffrischung oder eher neu gravieren lassen?",
    posts: [
      {
        author: "GravurGerda",
        body: "Auffrischen kostet rund 80 Euro, neu gravieren 180. Wenn die Schrift noch gut lesbar ist: Auffrischen reicht.",
      },
      {
        author: "BronzeBert",
        body: "Außerdem: Patina rund um die Gravur ist Patina. Manche Sammler bezahlen mehr für „authentische Abnutzung“.",
      },
    ],
  },
  {
    category: "pflege",
    author: "TitanTina",
    title: "Karbon-Pflege – muss man da überhaupt was tun?",
    body:
      "Karbon ist doch eigentlich wartungsfrei, oder?",
    posts: [
      {
        author: "MeisterMolch",
        body: "Nicht ganz. UV-Strahlung mattiert das Sichtgewebe mit der Zeit. Einmal im Quartal mit Karbon-Pflegemilch (gibt es im Manufaktur-Shop) abreiben, dann bleibt der Glanz.",
      },
      {
        author: "AltgesellMartin",
        body: "Erstaunlich. Wieder etwas gelernt.",
      },
    ],
  },
  {
    category: "allgemein",
    author: "MeisterMolch",
    title: "Kleines Rätsel – welcher Kolben passt zur Person?",
    body:
      "Ich beschreibe drei fiktive Personen, ihr ratet das passende Modell. Person A: 38, Architektin, fährt Lastenrad. Person B: 64, Notar, Sammler. Person C: 27, Start-up, viel Reisen.",
    posts: [
      {
        author: "GravurGerda",
        body: "A: Feldkolben Allwetter. B: Diplomatenkolben Aurum. C: Morgendämmerung Titan-Karbon.",
      },
      {
        author: "FilialleiterFranz",
        body: "Bei B würde ich tatsächlich den Salon-Kolben sehen – Notare lieben Bronze.",
      },
      {
        author: "MeisterMolch",
        body: "Beide Lösungen valide. Gerda holt den Punkt für die schnelle Antwort, Franz für die feinsinnige Begründung.",
      },
    ],
  },
  {
    category: "allgemein",
    author: "Damaszener_Doris",
    title: "Streitkolben in der Literatur – Empfehlungen?",
    body:
      "Suche schöne literarische Stellen, in denen ein Streitkolben Hauptrolle spielt. Klassiker und Modernes erlaubt.",
    posts: [
      {
        author: "AltgesellMartin",
        body: "Eschenbachs „Parzival“ – Verse 134 ff., wenn auch eher ungenau übersetzt. Aber atmosphärisch unschlagbar.",
      },
      {
        author: "KolbenKlaus_72",
        body: "Aus der Moderne: Stefan Zweig, „Schachnovelle“ – nicht direkt, aber im Subtext sehr deutlich.",
      },
      {
        author: "FrauHolle1487",
        body: "Ihr beide übertreibt. Aber gerne. ",
      },
    ],
  },
  {
    category: "kaufberatung",
    author: "GravurGerda",
    title: "Lieferzeiten der Manufaktur – realistische Erwartung?",
    body:
      "Habe gehört, dass der Konfigurator gerade 12 Wochen braucht. Stimmt das?",
    posts: [
      {
        author: "MeisterMolch",
        body: "Aktuell 10–14 Wochen je nach Material. Damast und Titan-Karbon brauchen länger, Eiche und Bronze gehen schneller.",
      },
      {
        author: "Damaszener_Doris",
        body: "Tipp: Wer im Herbst bestellt, bekommt vor Weihnachten. Wer im November bestellt, bekommt zur Steuererklärung.",
      },
    ],
  },
];

async function main() {
  console.log("Seeding...");

  // Tabellen leeren (idempotent für Dev)
  await db.execute(
    sql`TRUNCATE forum_posts, forum_threads, forum_categories, products, sessions, users RESTART IDENTITY CASCADE`
  );

  // Demo-Account
  const demoHash = await bcrypt.hash("kolbenpasswort", 10);
  const adminHash = await bcrypt.hash("manufaktur1487", 10);

  const userMap = new Map<string, number>();

  const [adminRow] = await db
    .insert(users)
    .values({
      email: "verwaltung@nicht-streitkolben.de",
      username: "Manufaktur",
      passwordHash: adminHash,
      role: "admin",
    })
    .returning();
  userMap.set("Manufaktur", adminRow.id);

  for (const u of fakeUsers) {
    const [row] = await db
      .insert(users)
      .values({ ...u, passwordHash: demoHash })
      .returning();
    userMap.set(u.username, row.id);
  }

  // Produkte
  await db.insert(products).values(productSeed);

  // Forum-Kategorien
  const catRows = await db
    .insert(forumCategories)
    .values(seedCategories)
    .returning();
  const catBySlug = new Map(catRows.map((c) => [c.slug, c.id] as const));

  // Threads + Posts
  for (const t of threadSeeds) {
    const slug =
      t.title
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "")
        .slice(0, 240) +
      "-" +
      Math.random().toString(36).slice(2, 6);
    const [thread] = await db
      .insert(forumThreads)
      .values({
        categoryId: catBySlug.get(t.category)!,
        authorId: userMap.get(t.author)!,
        title: t.title,
        slug,
        body: t.body,
        pinned: t.title.startsWith("Willkommen"),
      })
      .returning();

    for (const p of t.posts) {
      await db.insert(forumPosts).values({
        threadId: thread.id,
        authorId: userMap.get(p.author)!,
        body: p.body,
      });
    }
  }

  console.log(
    `Seeded: ${productSeed.length} Produkte, ${seedCategories.length} Kategorien, ${threadSeeds.length} Threads.`
  );
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
