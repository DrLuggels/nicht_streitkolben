import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articles, getArticle } from "@/content/articles";
import { renderArticleBody } from "@/lib/markdown";
import { formatDate } from "@/lib/format";

export async function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return { title: "Nicht gefunden" };
  return { title: a.title, description: a.lead };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) notFound();

  const html = renderArticleBody(a.body);
  const others = articles.filter((x) => x.slug !== slug).slice(0, 3);

  return (
    <article className="container-tight py-10">
      <div className="mb-6 text-sm">
        <Link href="/wissen" className="link">
          ← Wissens-Bereich
        </Link>
      </div>

      <header className="mb-8">
        <div className="text-xs uppercase tracking-[0.18em]" style={{ color: "rgb(var(--muted))" }}>
          {a.kicker} · {formatDate(a.publishedAt)} · {a.readingMinutes} Min. Lesezeit
        </div>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
          {a.title}
        </h1>
        <p className="mt-4 max-w-2xl text-lg" style={{ color: "rgb(var(--muted))" }}>
          {a.lead}
        </p>
        <div className="mt-3 text-sm" style={{ color: "rgb(var(--muted))" }}>
          von {a.author}
        </div>
      </header>

      <div className="surface mb-10 overflow-hidden p-0">
        <Image
          src={a.image}
          alt={a.title}
          width={1600}
          height={900}
          className="aspect-[16/8] w-full object-cover"
          priority
        />
      </div>

      <div
        className="prose-paper mx-auto max-w-3xl"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      <div className="mt-16 border-t pt-10" style={{ borderColor: "rgb(var(--border) / 0.4)" }}>
        <h2 className="mb-6 text-2xl font-semibold">Weitere Artikel</h2>
        <div className="grid gap-5 md:grid-cols-3">
          {others.map((o) => (
            <Link
              key={o.slug}
              href={`/wissen/${o.slug}`}
              className="surface group overflow-hidden p-0 transition hover:shadow-liftn"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <Image
                  src={o.image}
                  alt={o.title}
                  width={600}
                  height={375}
                  className="h-full w-full object-cover transition group-hover:scale-[1.04]"
                />
              </div>
              <div className="p-4">
                <div className="text-xs uppercase tracking-wide" style={{ color: "rgb(var(--muted))" }}>
                  {o.kicker}
                </div>
                <h3 className="mt-2 font-serif font-semibold leading-tight">{o.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}
