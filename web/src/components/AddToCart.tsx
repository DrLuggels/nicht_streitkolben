"use client";
import { useState } from "react";
import { useCart, type CartItem } from "./CartProvider";
import { useRouter } from "next/navigation";

export function AddToCart({
  item,
  size = "lg",
}: {
  item: Omit<CartItem, "qty">;
  size?: "sm" | "lg";
}) {
  const { add } = useCart();
  const router = useRouter();
  const [adding, setAdding] = useState(false);

  function handle() {
    add(item, 1);
    setAdding(true);
    setTimeout(() => setAdding(false), 1400);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        onClick={handle}
        className={`btn btn-primary ${size === "lg" ? "h-12 px-6 text-base" : ""}`}
      >
        {adding ? "✓ Hinzugefügt" : "In den Warenkorb"}
      </button>
      <button
        onClick={() => {
          add(item, 1);
          router.push("/warenkorb");
        }}
        className={`btn btn-outline ${size === "lg" ? "h-12 px-6" : ""}`}
      >
        Sofort kaufen →
      </button>
    </div>
  );
}
