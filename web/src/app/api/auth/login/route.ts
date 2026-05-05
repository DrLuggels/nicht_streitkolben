import { NextResponse } from "next/server";
import { authenticate, loginSchema } from "@/lib/auth";
import { createSession } from "@/lib/session";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json(
      { error: "Bitte alle Felder ausfüllen." },
      { status: 400 }
    );
  const u = await authenticate(parsed.data.identifier, parsed.data.password);
  if (!u)
    return NextResponse.json(
      { error: "E-Mail/Benutzername oder Passwort falsch." },
      { status: 401 }
    );
  await createSession(u.id);
  return NextResponse.json({ ok: true, username: u.username });
}
