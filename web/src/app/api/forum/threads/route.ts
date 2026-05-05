import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { forumCategories, forumThreads } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSessionUser } from "@/lib/session";

const schema = z.object({
  categorySlug: z.string().min(1),
  title: z.string().min(5).max(240),
  body: z.string().min(10).max(20000),
});

function slugify(s: string) {
  return (
    s
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ä/g, "ae")
      .replace(/ö/g, "oe")
      .replace(/ü/g, "ue")
      .replace(/ß/g, "ss")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "")
      .slice(0, 240) +
    "-" +
    Math.random().toString(36).slice(2, 6)
  );
}

export async function POST(req: Request) {
  const me = await getSessionUser();
  if (!me) return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });

  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success)
    return NextResponse.json({ error: "Ungültige Eingaben." }, { status: 400 });

  const [cat] = await db
    .select()
    .from(forumCategories)
    .where(eq(forumCategories.slug, parsed.data.categorySlug))
    .limit(1);
  if (!cat)
    return NextResponse.json({ error: "Kategorie nicht gefunden." }, { status: 404 });

  const slug = slugify(parsed.data.title);
  const [t] = await db
    .insert(forumThreads)
    .values({
      categoryId: cat.id,
      authorId: me.id,
      title: parsed.data.title,
      body: parsed.data.body,
      slug,
    })
    .returning();

  return NextResponse.json({ id: t.id, slug: t.slug });
}
