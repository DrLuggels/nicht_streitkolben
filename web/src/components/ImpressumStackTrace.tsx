// Sehr seriös wirkende 500-Fehlerseite.
// Stack-Trace ist Fake (passt aber zu Next.js-Konventionen).

const TRACE = `Error: ENOENT: no such file or directory, open '/app/.next/server/app/impressum/legal-entity.json'
    at async open (node:internal/fs/promises:639:25)
    at async loadLegalEntity (/app/.next/server/chunks/legal/loader.js:142:18)
    at async ImpressumPage (/app/.next/server/app/impressum/page.js:38:21)
    at async resolveServerComponentResponse (/app/node_modules/next/dist/server/app-render/render.js:1924:18)
    at async renderToStream (/app/node_modules/next/dist/server/app-render/render.js:2107:24)
    at async DevServer.renderHTML (/app/node_modules/next/dist/server/dev/next-dev-server.js:418:20)
    at async pipe.req.req (/app/node_modules/next/dist/server/base-server.js:1396:20)`;

export function ImpressumStackTrace() {
  const requestId = "req_" + Math.random().toString(36).slice(2, 18);
  const ts = new Date().toISOString();

  return (
    <div className="container-tight py-16">
      <div
        className="rounded-lg border-2 p-6 font-mono text-sm"
        style={{
          borderColor: "#dc2626",
          backgroundColor: "rgb(var(--bg-elev))",
        }}
      >
        <div className="mb-2 flex items-center gap-2 text-base font-semibold" style={{ color: "#dc2626" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          500 — Internal Server Error
        </div>
        <div className="mb-4" style={{ color: "rgb(var(--muted))" }}>
          A server-side exception has occurred (see the server logs for more
          information).
        </div>
        <pre
          className="overflow-x-auto rounded p-4 text-xs leading-relaxed"
          style={{
            backgroundColor: "rgb(var(--bg))",
            color: "rgb(var(--fg))",
            border: "1px solid rgb(var(--border) / 0.4)",
          }}
        >
          {TRACE}
        </pre>
        <div className="mt-4 grid gap-1 text-xs" style={{ color: "rgb(var(--muted))" }}>
          <div>
            <span className="font-semibold" style={{ color: "rgb(var(--fg))" }}>
              Request ID:
            </span>{" "}
            {requestId}
          </div>
          <div>
            <span className="font-semibold" style={{ color: "rgb(var(--fg))" }}>
              Timestamp:
            </span>{" "}
            {ts}
          </div>
          <div>
            <span className="font-semibold" style={{ color: "rgb(var(--fg))" }}>
              Path:
            </span>{" "}
            /impressum
          </div>
          <div>
            <span className="font-semibold" style={{ color: "rgb(var(--fg))" }}>
              Digest:
            </span>{" "}
            3849473820
          </div>
        </div>
      </div>

      <div className="mt-6 text-sm" style={{ color: "rgb(var(--muted))" }}>
        <p>
          Hinweis: Dieser Fehler wurde automatisch protokolliert. Bei
          fortdauerndem Auftreten wenden Sie sich an die Systemadministration
          unserer Manufaktur.
        </p>
      </div>
    </div>
  );
}
