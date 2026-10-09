#!/usr/bin/env bash
set -euo pipefail

# Package script for Shopify Dark Admin
# Creates a release-ready zip file in dist/

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
EXTENSION_DIR="$PROJECT_ROOT/extension"
DIST_DIR="$PROJECT_ROOT/dist"
MANIFEST="$EXTENSION_DIR/manifest.json"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Shopify Dark Admin - Package Script${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Check if extension directory exists
if [ ! -d "$EXTENSION_DIR" ]; then
  echo "❌ Error: extension/ directory not found at $EXTENSION_DIR"
  exit 1
fi

# Check if manifest exists
if [ ! -f "$MANIFEST" ]; then
  echo "❌ Error: manifest.json not found at $MANIFEST"
  exit 1
fi

# Extract version from manifest.json
VERSION=$(grep -o '"version"[[:space:]]*:[[:space:]]*"[^"]*"' "$MANIFEST" | sed 's/.*"\([^"]*\)".*/\1/')

if [ -z "$VERSION" ]; then
  echo "❌ Error: Could not extract version from manifest.json"
  exit 1
fi

echo -e "${GREEN}✓${NC} Found version: ${YELLOW}$VERSION${NC}"
echo ""

# Create dist directory
mkdir -p "$DIST_DIR"

# Output filename
ZIP_NAME="shopify-dark-admin-v${VERSION}.zip"
ZIP_PATH="$DIST_DIR/$ZIP_NAME"

# Remove old zip if it exists
if [ -f "$ZIP_PATH" ]; then
  echo "🗑️  Removing old zip: $ZIP_NAME"
  rm "$ZIP_PATH"
fi

echo "📦 Creating archive..."
echo ""

# Create zip from extension directory
cd "$EXTENSION_DIR"
zip -r "$ZIP_PATH" . \
  -x "*.DS_Store" \
  -x "*.git*" \
  -x "*node_modules*" \
  -x "*.env*" \
  -q

# Return to original directory
cd "$PROJECT_ROOT"

# Get file size
if command -v du &> /dev/null; then
  SIZE=$(du -h "$ZIP_PATH" | cut -f1)
else
  SIZE="$(ls -lh "$ZIP_PATH" | awk '{print $5}')"
fi

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Package created successfully!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "   📦 ${BLUE}$ZIP_NAME${NC}"
echo -e "   📏 Size: ${YELLOW}$SIZE${NC}"
echo -e "   📂 Location: ${BLUE}dist/${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo -e "  1. Test the extension by loading ${BLUE}dist/$ZIP_NAME${NC}"
echo -e "  2. Create a GitHub release at:"
echo -e "     ${BLUE}https://github.com/UribeJr/shopify-dark-admin/releases/new${NC}"
echo -e "  3. Tag: ${YELLOW}v$VERSION${NC}"
echo -e "  4. Upload ${BLUE}$ZIP_NAME${NC} as a release asset"
echo ""
