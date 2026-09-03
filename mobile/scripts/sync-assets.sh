#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
ROOT_DIR="$(cd "${APP_DIR}/.." && pwd)"

echo "=== Building web assets from root Next.js project ==="
cd "${ROOT_DIR}"
npm run build

echo "=== Copying web assets to app/dist ==="
rm -rf "${APP_DIR}/dist"
mkdir -p "${APP_DIR}/dist"
cp -R "${ROOT_DIR}/out/"* "${APP_DIR}/dist/"

echo "=== Syncing assets with Capacitor (Android & iOS) ==="
cd "${APP_DIR}"
npx cap sync

echo "=== Sync complete! Assets are ready in native Android and iOS folders. ==="
