"use client";
import Link from "next/link";
import { useCart } from "./CartProvider";

export function CartButton() {
  const { count } = useCart();
  return (
    <Link
      href="/warenkorb"
      className="btn btn-ghost relative h-9 w-9 p-0"
      aria-label={`Warenkorb (${count})`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      {count > 0 && (
        <span
          className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full px-1 text-[10px] font-semibold"
          style={{
            backgroundColor: "rgb(var(--accent))",
            color: "rgb(var(--accent-fg))",
          }}
        >
          {count}
        </span>
      )}
    </Link>
  );
}
