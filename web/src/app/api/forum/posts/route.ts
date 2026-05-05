import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { forumPosts, forumThreads } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSessionUser } from "@/lib/session";

const schema = z.object({
  threadId: z.number().int().positive(),
  body: z.string().min(2).max(20000),
});

export async function POST(req: Request) {
  const me = await getSessionUser();
  if (!me) return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });

  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success)
    return NextResponse.json({ error: "Ungültige Eingaben." }, { status: 400 });

  const [t] = await db
    .select({ id: forumThreads.id })
    .from(forumThreads)
    .where(eq(forumThreads.id, parsed.data.threadId))
    .limit(1);
  if (!t)
    return NextResponse.json({ error: "Thread nicht gefunden." }, { status: 404 });

  const [p] = await db
    .insert(forumPosts)
    .values({
      threadId: t.id,
      authorId: me.id,
      body: parsed.data.body,
    })
    .returning();

  return NextResponse.json({ id: p.id });
}
