import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { forumCategories, forumPosts, forumThreads, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { formatDateTime } from "@/lib/format";
import { getSessionUser } from "@/lib/session";
import { ReplyForm } from "@/components/ReplyForm";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; thread: string }>;
}) {
  const { thread } = await params;
  const [t] = await db
    .select()
    .from(forumThreads)
    .where(eq(forumThreads.slug, thread))
    .limit(1);
  return { title: t ? t.title : "Thread" };
}

export default async function ThreadPage({
  params,
}: {
  params: Promise<{ category: string; thread: string }>;
}) {
  const { category, thread } = await params;
  const [t] = await db
    .select({
      id: forumThreads.id,
      title: forumThreads.title,
      body: forumThreads.body,
      createdAt: forumThreads.createdAt,
      authorName: users.username,
      categorySlug: forumCategories.slug,
      categoryName: forumCategories.name,
    })
    .from(forumThreads)
    .innerJoin(users, eq(forumThreads.authorId, users.id))
    .innerJoin(forumCategories, eq(forumThreads.categoryId, forumCategories.id))
    .where(eq(forumThreads.slug, thread))
    .limit(1);
  if (!t || t.categorySlug !== category) notFound();

  const replies = await db
    .select({
      id: forumPosts.id,
      body: forumPosts.body,
      createdAt: forumPosts.createdAt,
      authorName: users.username,
    })
    .from(forumPosts)
    .innerJoin(users, eq(forumPosts.authorId, users.id))
    .where(eq(forumPosts.threadId, t.id))
    .orderBy(forumPosts.createdAt);

  const me = await getSessionUser();

  return (
    <div className="container-tight py-10">
      <div className="text-sm">
        <Link href="/forum" className="link">Forum</Link>
        <span className="mx-2" style={{ color: "rgb(var(--muted))" }}>/</span>
        <Link href={`/forum/${t.categorySlug}`} className="link">
          {t.categoryName}
        </Link>
      </div>

      <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">{t.title}</h1>
      <div className="mt-2 text-xs" style={{ color: "rgb(var(--muted))" }}>
        von <span className="font-semibold">{t.authorName}</span> · {formatDateTime(t.createdAt)}
      </div>

      <Post body={t.body} author={t.authorName} createdAt={t.createdAt} isOriginal />

      {replies.map((r) => (
        <Post
          key={r.id}
          body={r.body}
          author={r.authorName}
          createdAt={r.createdAt}
        />
      ))}

      <section className="surface mt-8 p-5">
        <h2 className="text-lg font-semibold">Antworten</h2>
        {me ? (
          <ReplyForm threadId={t.id} />
        ) : (
          <div className="mt-3 text-sm" style={{ color: "rgb(var(--muted))" }}>
            Bitte melden Sie sich an, um zu antworten.
            <div className="mt-3">
              <Link href="/forum/login" className="btn btn-primary">
                Anmelden / Registrieren
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function Post({
  body,
  author,
  createdAt,
  isOriginal = false,
}: {
  body: string;
  author: string;
  createdAt: Date | string;
  isOriginal?: boolean;
}) {
  return (
    <article className={`surface mt-5 p-5 ${isOriginal ? "ring-1" : ""}`}
      style={{
        boxShadow: isOriginal ? "0 0 0 1px rgb(var(--accent) / 0.4)" : undefined,
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="grid h-9 w-9 place-items-center rounded-full font-semibold uppercase"
            style={{
              backgroundColor: "rgb(var(--accent) / 0.18)",
              color: "rgb(var(--accent))",
            }}
          >
            {author.slice(0, 1)}
          </div>
          <div>
            <div className="font-semibold">{author}</div>
            <div className="text-xs" style={{ color: "rgb(var(--muted))" }}>
              {formatDateTime(createdAt)}
            </div>
          </div>
        </div>
        {isOriginal && <span className="badge text-[10px]">Eröffnungsbeitrag</span>}
      </div>
      <div className="mt-4 whitespace-pre-line text-[15px] leading-relaxed">
        {body}
      </div>
    </article>
  );
}
