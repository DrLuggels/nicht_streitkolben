#!/usr/bin/env bash
# Lädt freie Wikimedia-Commons-Bilder herunter via Special:FilePath.
set -euo pipefail

BASE="$(cd "$(dirname "$0")/.." && pwd)"
PROD_DIR="$BASE/web/public/images/products"
ART_DIR="$BASE/web/public/images/articles"
mkdir -p "$PROD_DIR" "$ART_DIR"

UA="KolbenmanufakturWittenberg/1.0 (kontakt@nicht-streitkolben.xyz)"

# $1=Wikimedia-Dateiname (raw, ohne "File:")  $2=Zielpfad  $3=Breite
dl() {
  local file="$1" dest="$2" width="${3:-1200}"
  if [[ -f "$dest" && -s "$dest" ]]; then
    echo "  SKIP $dest"
    return 0
  fi
  # URL-encode space → underscore (Wikimedia konvertiert intern)
  local encoded
  encoded=$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1].replace(' ','_'), safe=''))" "$file")
  local url="https://commons.wikimedia.org/wiki/Special:FilePath/${encoded}?width=${width}"
  echo "  GET  ${dest}"
  if curl -fsSL --retry 3 -A "$UA" -L -o "$dest" "$url"; then
    return 0
  else
    echo "       FAIL: $url"
    rm -f "$dest"
    return 1
  fi
}

# Verifizierte Wikimedia-Commons-Dateinamen (per API gefunden)
declare -a PRODUCTS=(
  "Mace MET DP163750.jpg|hero.jpg|1400"
  "Mace IMG 3823.jpg|lehrlings-kolben-eiche.jpg|1024"
  "Mace MET DP160631.jpg|buergerkolben-bronze.jpg|1024"
  "Mace MET DP160630.jpg|kompakt-kolben.jpg|1024"
  "Mace MET DP163743.jpg|buchhalter-kolben.jpg|1024"
  "Mace MET DP163753.jpg|verhandlungskolben.jpg|1024"
  "Bulawa mace Buzdygan Wawel.jpg|salon-kolben.jpg|1024"
  "Maces.jpg|feldkolben.jpg|1024"
  "Ceremonial Mace MET DP165539.jpg|diplomatenkolben.jpg|1024"
  "Mace MET DP165544.jpg|morgendaemmerung-titan.jpg|1024"
  "Mace MET DP166311.jpg|vorstands-kolben.jpg|1024"
  "Ceremonial Mace MET DP165540.jpg|bankbesuch-classic.jpg|1024"
  "Ceremonial Mace MET DP163751.jpg|bankbesuch-premium.jpg|1024"
  "Ceremonial Mace MET DP165538.jpg|bankbesuch-platinum.jpg|1024"
)

declare -a ARTICLES=(
  "Various Maces.jpg|grundlagen.jpg|1600"
  "EB1911 - Mace - Fig. 1.—Group of War Maces of the 15th and 16th centuries.jpg|vergleich.jpg|1600"
  "Replica of a Byzantine mace at Athens War Museum on November 22, 2022.jpg|anwendung.jpg|1600"
  "Various Indo-Persian maces.jpg|rhetorik.jpg|1600"
  "EB1911 - Mace - Fig. 2.—Mace of the House of Commons.jpg|banken.jpg|1600"
  "Maces-Topkapi palace.jpg|aesthetik.jpg|1600"
)

SUCCESS=()

for entry in "${PRODUCTS[@]}"; do
  IFS='|' read -r file dest w <<< "$entry"
  if dl "$file" "$PROD_DIR/$dest" "$w"; then
    SUCCESS+=("$PROD_DIR/$dest")
  fi
done

for entry in "${ARTICLES[@]}"; do
  IFS='|' read -r file dest w <<< "$entry"
  if dl "$file" "$ART_DIR/$dest" "$w"; then
    SUCCESS+=("$ART_DIR/$dest")
  fi
done

# Fallback: kopiere ein erfolgreiches Bild für fehlende Dateien
fallback=""
for f in "${SUCCESS[@]}"; do
  [[ -f "$f" && -s "$f" ]] && { fallback="$f"; break; }
done

if [[ -n "$fallback" ]]; then
  for entry in "${PRODUCTS[@]}"; do
    IFS='|' read -r _ dest _ <<< "$entry"
    [[ -f "$PROD_DIR/$dest" && -s "$PROD_DIR/$dest" ]] || cp "$fallback" "$PROD_DIR/$dest"
  done
  for entry in "${ARTICLES[@]}"; do
    IFS='|' read -r _ dest _ <<< "$entry"
    [[ -f "$ART_DIR/$dest" && -s "$ART_DIR/$dest" ]] || cp "$fallback" "$ART_DIR/$dest"
  done
fi

# Statistik
total_p=$(ls -1 "$PROD_DIR" 2>/dev/null | wc -l)
total_a=$(ls -1 "$ART_DIR" 2>/dev/null | wc -l)
echo "OK – ${total_p} Produktbilder, ${total_a} Artikelbilder"
