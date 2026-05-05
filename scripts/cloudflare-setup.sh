#!/usr/bin/env bash
# Richtet Cloudflare-DNS und SSL-Modus für nicht-streitkolben.de ein.
#
# Nutzt:
#   CF_API_TOKEN    – Token mit Zone:Read + DNS:Edit (+ optional Zone Settings:Edit)
#   CF_ZONE_NAME    – Domain, z. B. nicht-streitkolben.de
#   ORIGIN_IPV4     – Öffentliche IPv4 dieses Servers
#   ORIGIN_IPV6     – (optional) Öffentliche IPv6
#
# Aufruf: ./scripts/cloudflare-setup.sh
# Erfordert: bash, curl, jq

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# .env aus dem Projekt-Root laden, falls vorhanden
if [[ -f "$SCRIPT_DIR/../.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  . "$SCRIPT_DIR/../.env"
  set +a
fi

: "${CF_API_TOKEN:?CF_API_TOKEN nicht gesetzt}"
: "${CF_ZONE_NAME:?CF_ZONE_NAME nicht gesetzt (z. B. nicht-streitkolben.de)}"
: "${ORIGIN_IPV4:?ORIGIN_IPV4 nicht gesetzt}"

API="https://api.cloudflare.com/client/v4"

cf() {
  curl -fsS -H "Authorization: Bearer $CF_API_TOKEN" \
           -H "Content-Type: application/json" "$@"
}

ok() { printf "  ✓ %s\n" "$1"; }
info() { printf "  · %s\n" "$1"; }
fail() { printf "  ✗ %s\n" "$1" >&2; exit 1; }

echo "==> Token verifizieren"
verify=$(cf "$API/user/tokens/verify")
echo "$verify" | jq -e '.success == true' >/dev/null || fail "Token ungültig"
ok "Token akzeptiert"

echo "==> Zone für $CF_ZONE_NAME suchen"
zone=$(cf "$API/zones?name=$CF_ZONE_NAME")
zone_id=$(echo "$zone" | jq -r '.result[0].id // empty')
[[ -n "$zone_id" ]] || fail "Zone $CF_ZONE_NAME im Cloudflare-Account nicht gefunden — bitte zuerst dort hinzufügen"
ok "Zone-ID: $zone_id"

upsert_record() {
  local name="$1" type="$2" content="$3" proxied="$4"
  local existing
  existing=$(cf "$API/zones/$zone_id/dns_records?type=$type&name=$name")
  local rid
  rid=$(echo "$existing" | jq -r '.result[0].id // empty')
  local payload
  payload=$(jq -n --arg n "$name" --arg t "$type" --arg c "$content" \
                  --argjson p "$proxied" --argjson ttl 1 \
                  '{type:$t,name:$n,content:$c,ttl:$ttl,proxied:$p}')
  if [[ -n "$rid" ]]; then
    cf -X PUT "$API/zones/$zone_id/dns_records/$rid" --data "$payload" >/dev/null
    ok "DNS update: $type $name → $content (proxied=$proxied)"
  else
    cf -X POST "$API/zones/$zone_id/dns_records" --data "$payload" >/dev/null
    ok "DNS create: $type $name → $content (proxied=$proxied)"
  fi
}

echo "==> DNS-Records setzen"
upsert_record "$CF_ZONE_NAME" "A" "$ORIGIN_IPV4" true
upsert_record "www.$CF_ZONE_NAME" "A" "$ORIGIN_IPV4" true
if [[ -n "${ORIGIN_IPV6:-}" ]]; then
  upsert_record "$CF_ZONE_NAME" "AAAA" "$ORIGIN_IPV6" true
  upsert_record "www.$CF_ZONE_NAME" "AAAA" "$ORIGIN_IPV6" true
fi

echo "==> Zone-Settings versuchen (optional, benötigt Zone Settings:Edit)"
trySet() {
  local key="$1" body="$2"
  if cf -X PATCH "$API/zones/$zone_id/settings/$key" --data "$body" >/dev/null 2>&1; then
    ok "$key gesetzt"
  else
    info "$key übersprungen (Token hat evtl. keinen Scope dafür)"
  fi
}
trySet ssl '{"value":"strict"}'
trySet always_use_https '{"value":"on"}'
trySet automatic_https_rewrites '{"value":"on"}'
trySet min_tls_version '{"value":"1.2"}'

echo
echo "Fertig. Zugriff in Kürze:"
echo "  https://$CF_ZONE_NAME"
echo "  https://www.$CF_ZONE_NAME (→ apex)"
echo
echo "Hinweise:"
echo "  · DNS-Propagation: meist <60s, gelegentlich bis ~5 min"
echo "  · Caddy fordert das Zertifikat per DNS-01-Challenge an,"
echo "    sobald der Stack die Domain das erste Mal beantwortet."
echo "  · Sicherstellen, dass Port 80+443 vom Internet auf $ORIGIN_IPV4 geroutet sind."
