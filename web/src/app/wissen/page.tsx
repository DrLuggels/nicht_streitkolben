import Link from "next/link";
import Image from "next/image";
import { articles } from "@/content/articles";
import { formatDate } from "@/lib/format";

export const metadata = { title: "Wissens-Bereich" };

export default function WissenIndex() {
  return (
    <div className="container-tight py-12">
      <span className="badge">Wissens-Bereich</span>
      <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">
        Texte aus der Manufaktur
      </h1>
      <p className="mt-3 max-w-2xl text-lg" style={{ color: "rgb(var(--muted))" }}>
        Hintergründe, Anleitungen, Vergleiche. Wir publizieren Beiträge, die uns
        in 538 Jahren Werkstattalltag wichtig geworden sind.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {articles.map((a, i) => (
          <Link
            key={a.slug}
            href={`/wissen/${a.slug}`}
            className={`surface group overflow-hidden p-0 transition hover:shadow-liftn ${
              i === 0 ? "md:col-span-2" : ""
            }`}
          >
            <div className={i === 0 ? "aspect-[16/7]" : "aspect-[16/9]"}>
              <Image
                src={a.image}
                alt={a.title}
                width={1200}
                height={500}
                className="h-full w-full object-cover transition group-hover:scale-[1.03]"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 text-xs uppercase tracking-wide" style={{ color: "rgb(var(--muted))" }}>
                <span>{a.kicker}</span>
                <span>·</span>
                <span>{formatDate(a.publishedAt)}</span>
                <span>·</span>
                <span>{a.readingMinutes} Min.</span>
              </div>
              <h2 className={`mt-2 font-serif font-semibold leading-tight ${i === 0 ? "text-3xl" : "text-xl"}`}>
                {a.title}
              </h2>
              <p className="mt-2 text-sm" style={{ color: "rgb(var(--muted))" }}>
                {a.lead}
              </p>
              <span className="link mt-3 inline-block text-sm">Weiterlesen →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
