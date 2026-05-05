export function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Kolbenmanufaktur Wittenberg"
    >
      <defs>
        <linearGradient id="metal" x1="0" y1="0" x2="64" y2="64">
          <stop offset="0" stopColor="rgb(var(--accent))" />
          <stop offset="1" stopColor="rgb(var(--muted))" />
        </linearGradient>
      </defs>
      {/* Schaft */}
      <rect
        x="29"
        y="22"
        width="6"
        height="36"
        rx="2"
        fill="rgb(var(--muted))"
      />
      {/* Knauf */}
      <circle cx="32" cy="60" r="3" fill="rgb(var(--accent))" />
      {/* Kopf: geflanscht */}
      <g transform="translate(32 16)">
        <circle r="14" fill="url(#metal)" />
        <g fill="rgb(var(--accent))">
          <path d="M0 -14 L3 -8 L-3 -8 Z" />
          <path d="M14 0 L8 3 L8 -3 Z" />
          <path d="M0 14 L-3 8 L3 8 Z" />
          <path d="M-14 0 L-8 -3 L-8 3 Z" />
          <path d="M9.9 -9.9 L8 -3 L3 -8 Z" />
          <path d="M9.9 9.9 L3 8 L8 3 Z" />
          <path d="M-9.9 9.9 L-3 8 L-8 3 Z" />
          <path d="M-9.9 -9.9 L-8 -3 L-3 -8 Z" />
        </g>
        <circle r="5" fill="rgb(var(--bg-elev))" />
        <circle r="5" fill="none" stroke="rgb(var(--accent))" strokeWidth="1" />
      </g>
    </svg>
  );
}
