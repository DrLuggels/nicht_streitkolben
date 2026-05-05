import { NextResponse } from "next/server";
import { registerSchema, registerUser } from "@/lib/auth";
import { createSession } from "@/lib/session";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json(
      { error: "Bitte prüfen Sie Ihre Eingaben." },
      { status: 400 }
    );
  try {
    const u = await registerUser(parsed.data);
    await createSession(u.id);
    return NextResponse.json({ ok: true, username: u.username });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Fehler bei der Registrierung." },
      { status: 400 }
    );
  }
}
