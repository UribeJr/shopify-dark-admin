#!/bin/bash

# Take screenshots using Chrome headless mode
# This script uses Chrome's built-in --screenshot feature

set -e

CHROME=$(which google-chrome chromium-browser chromium chrome 2>/dev/null | head -1)
if [ -z "$CHROME" ]; then
    echo "❌ Chrome not found"
    exit 1
fi

echo "📸 Using Chrome: $CHROME"

# Get absolute path to test page
TEST_PAGE="$(cd "$(dirname "$0")/.." && pwd)/test/test-page.html"
SCREENSHOTS_DIR="$(cd "$(dirname "$0")/.." && pwd)/docs/screenshots"

mkdir -p "$SCREENSHOTS_DIR"

echo "🌞 Taking light mode screenshot..."

# Light mode screenshot
"$CHROME" \
    --headless \
    --disable-gpu \
    --no-sandbox \
    --disable-setuid-sandbox \
    --window-size=1280,800 \
    --screenshot="$SCREENSHOTS_DIR/test-page-light.png" \
    "file://$TEST_PAGE" \
    2>/dev/null

echo "✓ Light mode screenshot saved"

# For dark mode, we need to inject a script that adds the class
# Create a temporary HTML file with dark mode enabled
TEMP_DARK_PAGE="/tmp/test-page-dark.html"

cat "$TEST_PAGE" | sed 's/<html lang="en">/<html lang="en" class="sda-dark">/' > "$TEMP_DARK_PAGE"

echo "🌙 Taking dark mode screenshot..."

"$CHROME" \
    --headless \
    --disable-gpu \
    --no-sandbox \
    --disable-setuid-sandbox \
    --window-size=1280,800 \
    --screenshot="$SCREENSHOTS_DIR/test-page-dark.png" \
    "file://$TEMP_DARK_PAGE" \
    2>/dev/null

rm "$TEMP_DARK_PAGE"

echo "✓ Dark mode screenshot saved"
echo ""
echo "✅ Screenshots generated successfully!"
echo "   Light: $SCREENSHOTS_DIR/test-page-light.png"
echo "   Dark:  $SCREENSHOTS_DIR/test-page-dark.png"
