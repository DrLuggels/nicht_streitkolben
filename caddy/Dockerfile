# Caddy mit Cloudflare-DNS-Plugin für DNS-01-Challenge.
# Damit funktioniert TLS auch hinter Cloudflares Orange-Cloud (Full Strict).

FROM caddy:2-builder AS builder
RUN xcaddy build \
    --with github.com/caddy-dns/cloudflare

FROM caddy:2-alpine
COPY --from=builder /usr/bin/caddy /usr/bin/caddy
