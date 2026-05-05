"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function ReplyForm({ threadId }: { threadId: number }) {
  const [body, setBody] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const r = await fetch("/api/forum/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ threadId, body }),
      });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        throw new Error(j.error ?? "Fehler beim Antworten.");
      }
      setBody("");
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Fehler.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-4 space-y-3 text-sm">
      <textarea
        className="input min-h-[140px]"
        required
        minLength={2}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Bleiben Sie sachlich und gepflegt."
      />
      {err && (
        <div className="text-xs" style={{ color: "rgb(var(--accent))" }}>
          {err}
        </div>
      )}
      <button type="submit" disabled={busy} className="btn btn-primary">
        {busy ? "Wird gesendet …" : "Antwort veröffentlichen"}
      </button>
    </form>
  );
}
