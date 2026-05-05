import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { orders } from "@/db/schema";

const itemSchema = z.object({
  key: z.string(),
  name: z.string(),
  priceCents: z.number().int().nonnegative(),
  qty: z.number().int().positive(),
  meta: z.record(z.string(), z.union([z.string(), z.number()])).optional(),
});

const schema = z.object({
  name: z.string().min(3).max(200),
  email: z.string().email(),
  phone: z.string().optional(),
  street: z.string().min(3),
  zip: z.string().regex(/^[0-9]{5}$/),
  city: z.string().min(2),
  country: z.string().min(2).max(3),
  shipping: z.enum(["standard", "express", "brieftaube"]),
  notes: z.string().optional(),
  items: z.array(itemSchema).min(1),
  totalCents: z.number().int().nonnegative(),
});

function generateOrderNumber() {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `KMW-${stamp}-${rand}`;
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ungültiger Request." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Bitte prüfen Sie Ihre Eingaben.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const data = parsed.data;
  const orderNumber = generateOrderNumber();

  await db.insert(orders).values({
    orderNumber,
    customerName: data.name,
    customerEmail: data.email,
    shippingAddress: {
      street: data.street,
      zip: data.zip,
      city: data.city,
      country: data.country,
      phone: data.phone,
      shipping: data.shipping,
    },
    items: data.items,
    totalCents: data.totalCents,
    notes: data.notes ?? null,
  });

  return NextResponse.json({ orderNumber });
}
