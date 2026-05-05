"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function NewThreadForm({ categorySlug }: { categorySlug: string }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const r = await fetch("/api/forum/threads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categorySlug, title, body }),
      });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        throw new Error(j.error ?? "Fehler beim Erstellen.");
      }
      const j = await r.json();
      router.push(`/forum/${categorySlug}/${j.slug}`);
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Fehler.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-3 space-y-3 text-sm">
      <div>
        <label className="label">Titel</label>
        <input
          className="input"
          required
          minLength={5}
          maxLength={200}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label className="label">Beitrag</label>
        <textarea
          className="input min-h-[120px]"
          required
          minLength={10}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </div>
      {err && (
        <div className="text-xs" style={{ color: "rgb(var(--accent))" }}>
          {err}
        </div>
      )}
      <button type="submit" disabled={busy} className="btn btn-primary w-full">
        {busy ? "Wird erstellt …" : "Thread veröffentlichen"}
      </button>
    </form>
  );
}
