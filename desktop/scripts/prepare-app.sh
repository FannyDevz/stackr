#!/usr/bin/env bash
# Stage a production copy of the Laravel app into desktop/app-dist for bundling.
# Run from the desktop/ directory (npm run prepare-app).
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"   # desktop/
ROOT="$(cd "$HERE/.." && pwd)"                              # laravel project root
DIST="$HERE/app-dist"

echo "▸ Building the SPA (host)…"
( cd "$ROOT" && npm run build )

echo "▸ Copying app → $DIST"
rm -rf "$DIST"
mkdir -p "$DIST"

# Copy the project, excluding dev-only and per-machine state.
rsync -a \
  --exclude '.git/' \
  --exclude '.ddev/' \
  --exclude 'desktop/' \
  --exclude 'node_modules/' \
  --exclude 'tests/' \
  --exclude '.env' \
  --exclude 'storage/framework/cache/*' \
  --exclude 'storage/framework/sessions/*' \
  --exclude 'storage/framework/views/*' \
  --exclude 'storage/logs/*' \
  --exclude 'database/*.sqlite' \
  --exclude 'bootstrap/cache/*.php' \
  "$ROOT/" "$DIST/"

echo "▸ Installing production vendor (no dev)…"
COMPOSER_BIN="$(command -v composer || true)"
if [ -n "$COMPOSER_BIN" ]; then
  ( cd "$DIST" && "$COMPOSER_BIN" install --no-dev --optimize-autoloader --no-interaction )
else
  echo "  composer not on PATH — bundling the copied vendor as-is (includes dev deps)."
fi

echo "▸ Writing bundled .env"
cp "$HERE/env.desktop" "$DIST/.env"

# Do NOT config:cache — desktop reads env at runtime. Clear any stale caches.
rm -f "$DIST"/bootstrap/cache/config.php "$DIST"/bootstrap/cache/routes-*.php "$DIST"/bootstrap/cache/events.php || true

echo "✓ app-dist ready ($(du -sh "$DIST" | cut -f1))"
