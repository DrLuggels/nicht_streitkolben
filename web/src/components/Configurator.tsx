"use client";
import { useMemo, useState } from "react";
import { useCart } from "./CartProvider";
import { useRouter } from "next/navigation";
import { formatEUR } from "@/lib/format";

type Material = "eiche" | "bronze" | "damast" | "titankarbon" | "karbon";
type Head = "rund" | "stern" | "geflanscht" | "spitz";
type Wrap = "leder" | "stoff" | "draht";

const MATERIALS: Record<
  Material,
  { name: string; basePrice: number; per100g: number; color: string; rim: string }
> = {
  eiche: {
    name: "Eichenholz mit Stahl-Beschlag",
    basePrice: 8900,
    per100g: 700,
    color: "#7d4f29",
    rim: "#cdb6a1",
  },
  bronze: {
    name: "Bronze",
    basePrice: 14900,
    per100g: 1100,
    color: "#9c6730",
    rim: "#d3a05d",
  },
  damast: {
    name: "Damaststahl",
    basePrice: 38900,
    per100g: 1500,
    color: "#5b3f29",
    rim: "#a98768",
  },
  titankarbon: {
    name: "Titan-Karbon-Verbund",
    basePrice: 64900,
    per100g: 1800,
    color: "#1c110a",
    rim: "#dbb87e",
  },
  karbon: {
    name: "Karbon",
    basePrice: 49900,
    per100g: 1600,
    color: "#0e0805",
    rim: "#7d4f29",
  },
};

const HEADS: Record<Head, { name: string }> = {
  rund: { name: "Rund (Klassik)" },
  stern: { name: "Sternförmig" },
  geflanscht: { name: "Geflanscht" },
  spitz: { name: "Spitz" },
};

const WRAPS: Record<Wrap, { name: string; color: string; price: number }> = {
  leder: { name: "Sattelleder", color: "#7d4f29", price: 2900 },
  stoff: { name: "Leinen-Stoff", color: "#cdb6a1", price: 1900 },
  draht: { name: "Drahtwicklung", color: "#a98768", price: 3900 },
};

function priceCents(material: Material, weightGrams: number, wrap: Wrap, gravur: string) {
  const m = MATERIALS[material];
  const w = WRAPS[wrap];
  const base = m.basePrice + Math.round(((weightGrams - 800) / 100) * m.per100g);
  const gravurPrice = gravur.trim().length > 0 ? 4900 : 0;
  return Math.max(0, base + w.price + gravurPrice);
}

export function Configurator() {
  const [material, setMaterial] = useState<Material>("damast");
  const [weight, setWeight] = useState(1200);
  const [length, setLength] = useState(64);
  const [head, setHead] = useState<Head>("geflanscht");
  const [wrap, setWrap] = useState<Wrap>("leder");
  const [gravur, setGravur] = useState("");

  const { add } = useCart();
  const router = useRouter();

  const total = useMemo(
    () => priceCents(material, weight, wrap, gravur),
    [material, weight, wrap, gravur]
  );

  function addToCart(navigate = false) {
    add(
      {
        key: `custom-${Date.now()}`,
        name: `Custom-Streitkolben (${MATERIALS[material].name})`,
        priceCents: total,
        meta: {
          Material: MATERIALS[material].name,
          Gewicht: `${weight} g`,
          "Länge": `${length} cm`,
          Kopfform: HEADS[head].name,
          Wicklung: WRAPS[wrap].name,
          Gravur: gravur || "—",
        },
      },
      1
    );
    if (navigate) router.push("/warenkorb");
  }

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_420px]">
      {/* Vorschau */}
      <div className="surface flex min-h-[520px] flex-col items-center justify-center p-6">
        <Preview
          material={material}
          weight={weight}
          length={length}
          head={head}
          wrap={wrap}
          gravur={gravur}
        />
        <div className="mt-6 grid w-full max-w-sm grid-cols-3 gap-3 text-center text-xs">
          <div className="surface p-3">
            <div className="uppercase tracking-wide" style={{ color: "rgb(var(--muted))" }}>Gewicht</div>
            <div className="mt-1 text-lg font-semibold">{weight} g</div>
          </div>
          <div className="surface p-3">
            <div className="uppercase tracking-wide" style={{ color: "rgb(var(--muted))" }}>Länge</div>
            <div className="mt-1 text-lg font-semibold">{length} cm</div>
          </div>
          <div className="surface p-3">
            <div className="uppercase tracking-wide" style={{ color: "rgb(var(--muted))" }}>Kopf</div>
            <div className="mt-1 text-lg font-semibold capitalize">{head}</div>
          </div>
        </div>
      </div>

      {/* Optionen */}
      <div className="space-y-6">
        <section className="surface p-6">
          <h2 className="text-lg font-semibold">Material</h2>
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {(Object.keys(MATERIALS) as Material[]).map((m) => (
              <button
                key={m}
                onClick={() => setMaterial(m)}
                className={`surface flex items-center gap-3 p-3 text-left text-sm ${
                  material === m ? "ring-2" : ""
                }`}
                style={{
                  boxShadow:
                    material === m ? "0 0 0 2px rgb(var(--accent))" : undefined,
                }}
              >
                <span
                  className="block h-6 w-6 rounded-full"
                  style={{
                    background: `linear-gradient(135deg, ${MATERIALS[m].color}, ${MATERIALS[m].rim})`,
                  }}
                />
                <span className="font-semibold">{MATERIALS[m].name}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="surface p-6">
          <h2 className="text-lg font-semibold">Maße</h2>
          <div className="mt-4 space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <label className="label mb-0">Gewicht</label>
                <span className="text-sm font-semibold">{weight} g</span>
              </div>
              <input
                type="range"
                min={700}
                max={1900}
                step={20}
                value={weight}
                onChange={(e) => setWeight(parseInt(e.target.value))}
                className="mt-2 w-full accent-current"
                style={{ color: "rgb(var(--accent))" }}
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="label mb-0">Länge</label>
                <span className="text-sm font-semibold">{length} cm</span>
              </div>
              <input
                type="range"
                min={40}
                max={80}
                step={1}
                value={length}
                onChange={(e) => setLength(parseInt(e.target.value))}
                className="mt-2 w-full"
                style={{ accentColor: "rgb(var(--accent))" }}
              />
            </div>
          </div>
        </section>

        <section className="surface p-6">
          <h2 className="text-lg font-semibold">Kopfform</h2>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {(Object.keys(HEADS) as Head[]).map((h) => (
              <button
                key={h}
                onClick={() => setHead(h)}
                className={`surface p-3 text-sm ${head === h ? "ring-2" : ""}`}
                style={{
                  boxShadow:
                    head === h ? "0 0 0 2px rgb(var(--accent))" : undefined,
                }}
              >
                <HeadIcon
                  type={h}
                  size={36}
                  color={MATERIALS[material].color}
                  rim={MATERIALS[material].rim}
                />
                <div className="mt-2 text-xs font-semibold">{HEADS[h].name}</div>
              </button>
            ))}
          </div>
        </section>

        <section className="surface p-6">
          <h2 className="text-lg font-semibold">Griff &amp; Wicklung</h2>
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
            {(Object.keys(WRAPS) as Wrap[]).map((w) => (
              <button
                key={w}
                onClick={() => setWrap(w)}
                className={`surface p-3 text-left text-sm ${wrap === w ? "ring-2" : ""}`}
                style={{
                  boxShadow:
                    wrap === w ? "0 0 0 2px rgb(var(--accent))" : undefined,
                }}
              >
                <span
                  className="block h-3 w-full rounded-full"
                  style={{ backgroundColor: WRAPS[w].color }}
                />
                <div className="mt-2 font-semibold">{WRAPS[w].name}</div>
                <div className="text-xs" style={{ color: "rgb(var(--muted))" }}>
                  +{formatEUR(WRAPS[w].price)}
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="surface p-6">
          <h2 className="text-lg font-semibold">Gravur</h2>
          <p className="mt-1 text-sm" style={{ color: "rgb(var(--muted))" }}>
            Persönlicher Spruch oder Initialen, in Fraktur oder Antiqua. Aufpreis +49,00 €.
          </p>
          <input
            type="text"
            maxLength={42}
            value={gravur}
            onChange={(e) => setGravur(e.target.value)}
            placeholder="z. B. „Memento Argumentum“"
            className="input mt-4"
          />
          <div className="mt-1 text-right text-xs" style={{ color: "rgb(var(--muted))" }}>
            {gravur.length} / 42 Zeichen
          </div>
        </section>

        <section className="surface flex items-center justify-between p-6">
          <div>
            <div className="text-xs uppercase tracking-wide" style={{ color: "rgb(var(--muted))" }}>
              Gesamtpreis (geschätzt)
            </div>
            <div className="mt-1 text-3xl font-semibold">{formatEUR(total)}</div>
            <div className="text-xs" style={{ color: "rgb(var(--muted))" }}>
              Lieferzeit ca. 10–14 Wochen
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <button onClick={() => addToCart(false)} className="btn btn-outline">
              In den Warenkorb
            </button>
            <button onClick={() => addToCart(true)} className="btn btn-primary">
              Bestellen →
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

function Preview({
  material,
  weight,
  length,
  head,
  wrap,
  gravur,
}: {
  material: Material;
  weight: number;
  length: number;
  head: Head;
  wrap: Wrap;
  gravur: string;
}) {
  const m = MATERIALS[material];
  const wrapColor = WRAPS[wrap].color;

  // Visuelle Skalierung
  const shaftLen = 200 + (length - 40) * 4; // 200..360
  const headSize = 40 + (weight - 700) * 0.04; // 40..88

  return (
    <svg
      viewBox="0 0 360 460"
      width="100%"
      height="auto"
      className="max-w-sm"
      aria-label="Vorschau Streitkolben"
    >
      <defs>
        <linearGradient id="shaft-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={m.rim} stopOpacity="0.4" />
          <stop offset="50%" stopColor={m.color} />
          <stop offset="100%" stopColor={m.rim} stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="head-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={m.rim} />
          <stop offset="100%" stopColor={m.color} />
        </linearGradient>
        <pattern id="wrap-pat" width="6" height="12" patternUnits="userSpaceOnUse">
          <rect width="6" height="12" fill={wrapColor} />
          <line
            x1="0"
            y1="0"
            x2="6"
            y2="12"
            stroke={m.color}
            strokeOpacity="0.3"
            strokeWidth="1"
          />
        </pattern>
      </defs>

      {/* Shaft */}
      <rect
        x="170"
        y={420 - shaftLen}
        width="20"
        height={shaftLen}
        fill="url(#shaft-grad)"
        rx="4"
      />
      {/* Wrap */}
      <rect
        x="166"
        y={420 - 70}
        width="28"
        height="80"
        fill="url(#wrap-pat)"
        rx="6"
      />

      {/* Knauf */}
      <circle cx="180" cy="430" r="14" fill={m.color} />
      <circle cx="180" cy="430" r="14" fill="none" stroke={m.rim} strokeWidth="1.5" />

      {/* Kopf */}
      <g transform={`translate(180 ${420 - shaftLen - 6})`}>
        <HeadShape type={head} size={headSize} color={m.color} rim={m.rim} />
      </g>

      {/* Gravur */}
      {gravur && (
        <g>
          <rect
            x="40"
            y={420 - shaftLen / 2 - 14}
            width="120"
            height="28"
            rx="6"
            fill="rgb(var(--bg-elev))"
            stroke={m.rim}
            strokeOpacity="0.5"
          />
          <text
            x="100"
            y={420 - shaftLen / 2 + 5}
            textAnchor="middle"
            fontSize="11"
            fontFamily="serif"
            fill="currentColor"
          >
            {gravur.length > 18 ? gravur.slice(0, 17) + "…" : gravur}
          </text>
          <line
            x1="160"
            y1={420 - shaftLen / 2}
            x2="170"
            y2={420 - shaftLen / 2}
            stroke="currentColor"
            strokeOpacity="0.3"
          />
        </g>
      )}
    </svg>
  );
}

function HeadShape({
  type,
  size,
  color,
  rim,
}: {
  type: Head;
  size: number;
  color: string;
  rim: string;
}) {
  if (type === "rund") {
    return (
      <>
        <circle r={size / 2} fill="url(#head-grad)" stroke={rim} strokeWidth="1.5" />
        <circle r={size / 4} fill={rim} fillOpacity="0.25" />
      </>
    );
  }
  if (type === "stern") {
    const points: string[] = [];
    const spikes = 8;
    for (let i = 0; i < spikes * 2; i++) {
      const r = i % 2 === 0 ? size / 2 : size / 3.4;
      const a = (i * Math.PI) / spikes - Math.PI / 2;
      points.push(`${Math.cos(a) * r},${Math.sin(a) * r}`);
    }
    return (
      <>
        <polygon
          points={points.join(" ")}
          fill="url(#head-grad)"
          stroke={rim}
          strokeWidth="1.5"
        />
        <circle r={size / 5} fill={rim} fillOpacity="0.3" />
      </>
    );
  }
  if (type === "geflanscht") {
    const flanges: string[] = [];
    const n = 6;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 - Math.PI / 2;
      const x = Math.cos(a) * (size / 2);
      const y = Math.sin(a) * (size / 2);
      flanges.push(`<rect x="${x - size / 8}" y="${y - size / 12}" width="${size / 4}" height="${size / 6}" />`);
    }
    return (
      <>
        <circle r={size / 2.4} fill="url(#head-grad)" stroke={rim} strokeWidth="1.5" />
        <g
          fill={color}
          stroke={rim}
          strokeWidth="1"
          dangerouslySetInnerHTML={{
            __html: Array.from({ length: n })
              .map((_, i) => {
                const a = (i / n) * Math.PI * 2 - Math.PI / 2;
                const x = Math.cos(a) * (size / 2);
                const y = Math.sin(a) * (size / 2);
                const rot = (a * 180) / Math.PI;
                return `<rect x="${-size / 8}" y="${-size / 12}" width="${size / 4}" height="${size / 6}" rx="2" transform="translate(${x} ${y}) rotate(${rot})"/>`;
              })
              .join(""),
          }}
        />
        <circle r={size / 5} fill={rim} fillOpacity="0.35" />
      </>
    );
  }
  // spitz
  const sp: string[] = [];
  const k = 12;
  for (let i = 0; i < k; i++) {
    const a = (i / k) * Math.PI * 2 - Math.PI / 2;
    const r1 = size / 2;
    const r2 = size / 2.6;
    sp.push(`${Math.cos(a) * r1},${Math.sin(a) * r1}`);
    const a2 = ((i + 0.5) / k) * Math.PI * 2 - Math.PI / 2;
    sp.push(`${Math.cos(a2) * r2},${Math.sin(a2) * r2}`);
  }
  return (
    <>
      <polygon
        points={sp.join(" ")}
        fill="url(#head-grad)"
        stroke={rim}
        strokeWidth="1.5"
      />
      <circle r={size / 6} fill={rim} fillOpacity="0.4" />
    </>
  );
}

function HeadIcon({
  type,
  size,
  color,
  rim,
}: {
  type: Head;
  size: number;
  color: string;
  rim: string;
}) {
  return (
    <svg viewBox="-30 -30 60 60" width={size} height={size}>
      <defs>
        <linearGradient id={`hg-${type}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={rim} />
          <stop offset="1" stopColor={color} />
        </linearGradient>
      </defs>
      <g style={{ ["--c" as never]: color, ["--r" as never]: rim }}>
        <HeadShape type={type} size={48} color={color} rim={rim} />
      </g>
    </svg>
  );
}
