import "server-only";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const registerSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(40)
    .regex(/^[A-Za-z0-9_-]+$/, "Nur Buchstaben, Zahlen, _ und - erlaubt"),
  email: z.string().email(),
  password: z.string().min(8).max(200),
});

export const loginSchema = z.object({
  identifier: z.string().min(3),
  password: z.string().min(1),
});

export async function registerUser(input: z.infer<typeof registerSchema>) {
  const exists = await db
    .select()
    .from(users)
    .where(eq(users.email, input.email))
    .limit(1);
  if (exists.length) throw new Error("E-Mail bereits registriert.");
  const exists2 = await db
    .select()
    .from(users)
    .where(eq(users.username, input.username))
    .limit(1);
  if (exists2.length) throw new Error("Benutzername bereits vergeben.");

  const hash = await bcrypt.hash(input.password, 10);
  const [u] = await db
    .insert(users)
    .values({
      email: input.email,
      username: input.username,
      passwordHash: hash,
    })
    .returning();
  return u;
}

export async function authenticate(
  identifier: string,
  password: string
) {
  const [u] = await db
    .select()
    .from(users)
    .where(
      identifier.includes("@")
        ? eq(users.email, identifier)
        : eq(users.username, identifier)
    )
    .limit(1);
  if (!u) return null;
  const ok = await bcrypt.compare(password, u.passwordHash);
  return ok ? u : null;
}
