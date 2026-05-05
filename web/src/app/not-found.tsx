import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-tight py-24 text-center">
      <div className="text-7xl font-serif font-semibold" style={{ color: "rgb(var(--accent))" }}>
        404
      </div>
      <h1 className="mt-4 text-3xl font-semibold">Seite nicht gefunden</h1>
      <p className="mt-3 text-lg" style={{ color: "rgb(var(--muted))" }}>
        Diese Seite scheint sich aus dem Sortiment zurückgezogen zu haben.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/" className="btn btn-primary">Zur Startseite</Link>
        <Link href="/shop" className="btn btn-outline">Sortiment ansehen</Link>
      </div>
    </div>
  );
}
