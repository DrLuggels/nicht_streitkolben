"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const r = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        throw new Error(j.error ?? "Anmeldung fehlgeschlagen.");
      }
      router.push("/forum");
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Fehler.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="label">E-Mail oder Benutzername</label>
        <input
          className="input"
          required
          autoComplete="username"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />
      </div>
      <div>
        <label className="label">Passwort</label>
        <input
          className="input"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {err && (
        <div className="text-xs" style={{ color: "rgb(var(--accent))" }}>
          {err}
        </div>
      )}
      <button type="submit" className="btn btn-primary w-full" disabled={busy}>
        {busy ? "Anmelden …" : "Anmelden"}
      </button>
      <p className="text-xs" style={{ color: "rgb(var(--muted))" }}>
        Demo-Account: <code>KolbenKlaus_72</code> · Passwort{" "}
        <code>kolbenpasswort</code>
      </p>
    </form>
  );
}

export function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const r = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        throw new Error(j.error ?? "Registrierung fehlgeschlagen.");
      }
      router.push("/forum");
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Fehler.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="label">Benutzername</label>
        <input
          className="input"
          required
          minLength={3}
          maxLength={40}
          pattern="[A-Za-z0-9_-]+"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label className="label">E-Mail</label>
        <input
          className="input"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label className="label">Passwort (min. 8 Zeichen)</label>
        <input
          className="input"
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {err && (
        <div className="text-xs" style={{ color: "rgb(var(--accent))" }}>
          {err}
        </div>
      )}
      <button type="submit" className="btn btn-primary w-full" disabled={busy}>
        {busy ? "Wird angelegt …" : "Konto erstellen"}
      </button>
    </form>
  );
}
