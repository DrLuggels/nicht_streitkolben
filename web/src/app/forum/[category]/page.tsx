import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { forumCategories, forumPosts, forumThreads, users } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import { formatDateTime } from "@/lib/format";
import { getSessionUser } from "@/lib/session";
import { NewThreadForm } from "@/components/NewThreadForm";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const [cat] = await db
    .select()
    .from(forumCategories)
    .where(eq(forumCategories.slug, category))
    .limit(1);
  return { title: cat ? cat.name : "Forum" };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const [cat] = await db
    .select()
    .from(forumCategories)
    .where(eq(forumCategories.slug, category))
    .limit(1);
  if (!cat) notFound();

  const threads = await db
    .select({
      id: forumThreads.id,
      slug: forumThreads.slug,
      title: forumThreads.title,
      pinned: forumThreads.pinned,
      createdAt: forumThreads.createdAt,
      authorName: users.username,
      replyCount: sql<number>`(SELECT COUNT(*) FROM ${forumPosts} WHERE ${forumPosts.threadId} = ${forumThreads.id})`,
    })
    .from(forumThreads)
    .innerJoin(users, eq(forumThreads.authorId, users.id))
    .where(eq(forumThreads.categoryId, cat.id))
    .orderBy(desc(forumThreads.pinned), desc(forumThreads.createdAt));

  const me = await getSessionUser();

  return (
    <div className="container-tight py-12">
      <div className="text-sm">
        <Link href="/forum" className="link">
          ← Forum-Übersicht
        </Link>
      </div>

      <h1 className="mt-3 text-4xl font-semibold">{cat.name}</h1>
      <p className="mt-2" style={{ color: "rgb(var(--muted))" }}>
        {cat.description}
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
        <section className="space-y-2">
          {threads.map((t) => (
            <Link
              key={t.id}
              href={`/forum/${cat.slug}/${t.slug}`}
              className="surface flex items-center justify-between gap-4 p-4 transition hover:shadow-liftn"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  {t.pinned && (
                    <span className="badge text-[10px]">angepinnt</span>
                  )}
                  <h2 className="truncate font-serif text-lg font-semibold leading-tight">
                    {t.title}
                  </h2>
                </div>
                <div className="mt-1 text-xs" style={{ color: "rgb(var(--muted))" }}>
                  von {t.authorName} · {formatDateTime(t.createdAt)}
                </div>
              </div>
              <div className="text-right text-sm shrink-0">
                <div className="font-semibold">{t.replyCount}</div>
                <div className="text-xs" style={{ color: "rgb(var(--muted))" }}>
                  Antworten
                </div>
              </div>
            </Link>
          ))}
        </section>

        <aside className="space-y-4 lg:sticky lg:top-24">
          <div className="surface p-5">
            <h3 className="text-sm font-semibold uppercase tracking-wide">
              Neuer Thread
            </h3>
            {me ? (
              <NewThreadForm categorySlug={cat.slug} />
            ) : (
              <div className="mt-3 text-sm" style={{ color: "rgb(var(--muted))" }}>
                Bitte melden Sie sich an, um einen neuen Thread zu erstellen.
                <div className="mt-3">
                  <Link href="/forum/login" className="btn btn-primary w-full">
                    Anmelden
                  </Link>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
