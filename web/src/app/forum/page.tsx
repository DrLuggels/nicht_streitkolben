import Link from "next/link";
import { db } from "@/db";
import { forumCategories, forumThreads, forumPosts, users } from "@/db/schema";
import { count, desc, eq, sql } from "drizzle-orm";
import { formatDateTime } from "@/lib/format";

export const metadata = { title: "Forum" };
export const dynamic = "force-dynamic";

export default async function ForumIndex() {
  const cats = await db
    .select({
      id: forumCategories.id,
      slug: forumCategories.slug,
      name: forumCategories.name,
      description: forumCategories.description,
      sortOrder: forumCategories.sortOrder,
      threadCount: sql<number>`(SELECT COUNT(*) FROM forum_threads WHERE forum_threads.category_id = forum_categories.id)`,
      postCount: sql<number>`(SELECT COUNT(*) FROM forum_posts INNER JOIN forum_threads ft ON forum_posts.thread_id = ft.id WHERE ft.category_id = forum_categories.id)`,
    })
    .from(forumCategories)
    .orderBy(forumCategories.sortOrder);

  const recent = await db
    .select({
      id: forumThreads.id,
      title: forumThreads.title,
      slug: forumThreads.slug,
      categorySlug: forumCategories.slug,
      categoryName: forumCategories.name,
      authorName: users.username,
      createdAt: forumThreads.createdAt,
    })
    .from(forumThreads)
    .innerJoin(forumCategories, eq(forumThreads.categoryId, forumCategories.id))
    .innerJoin(users, eq(forumThreads.authorId, users.id))
    .orderBy(desc(forumThreads.createdAt))
    .limit(8);

  return (
    <div className="container-tight py-12">
      <div className="flex items-end justify-between gap-4">
        <div>
          <span className="badge">Forum</span>
          <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">
            Gemeinschaft der Manufaktur
          </h1>
          <p className="mt-3 max-w-2xl text-lg" style={{ color: "rgb(var(--muted))" }}>
            Tausch, Beratung, Erfahrungsberichte. Bitte bleiben Sie gepflegt
            und vermeiden Sie Schwerter-Themen.
          </p>
        </div>
        <Link href="/forum/login" className="btn btn-primary">
          Anmelden / Registrieren
        </Link>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
        <section className="space-y-3">
          {cats.map((c) => (
            <Link
              key={c.id}
              href={`/forum/${c.slug}`}
              className="surface flex items-start justify-between gap-4 p-5 transition hover:shadow-liftn"
            >
              <div>
                <h2 className="font-serif text-xl font-semibold">{c.name}</h2>
                <p className="mt-1 text-sm" style={{ color: "rgb(var(--muted))" }}>
                  {c.description}
                </p>
              </div>
              <div className="text-right text-sm shrink-0">
                <div>
                  <span className="font-semibold">{c.threadCount}</span>
                  <span className="ml-1 text-xs" style={{ color: "rgb(var(--muted))" }}>Threads</span>
                </div>
                <div>
                  <span className="font-semibold">{c.postCount}</span>
                  <span className="ml-1 text-xs" style={{ color: "rgb(var(--muted))" }}>Beiträge</span>
                </div>
              </div>
            </Link>
          ))}
        </section>

        <aside className="surface h-fit p-5 lg:sticky lg:top-24">
          <h3 className="text-sm font-semibold uppercase tracking-wide">
            Neueste Threads
          </h3>
          <ul className="mt-3 space-y-3 text-sm">
            {recent.map((r) => (
              <li key={r.id}>
                <Link
                  href={`/forum/${r.categorySlug}/${r.slug}`}
                  className="font-semibold leading-tight hover:underline"
                >
                  {r.title}
                </Link>
                <div className="text-xs" style={{ color: "rgb(var(--muted))" }}>
                  von {r.authorName} · {formatDateTime(r.createdAt)}
                </div>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
