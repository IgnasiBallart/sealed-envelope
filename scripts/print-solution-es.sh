#!/usr/bin/env bash
set -euo pipefail
HTML="/home/iballart/repos/personal/sealed-envelope/cases/the-last-train/solution.es.html"
OUT="/home/iballart/repos/personal/sealed-envelope/storage/pdfs/rooms/the-last-train/v1.es.solution.pdf"
mkdir -p "$(dirname "$OUT")"
EDGE="/mnt/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
CHROME="/mnt/c/Program Files/Google/Chrome/Application/chrome.exe"
if [[ -x "$EDGE" ]]; then
  BROWSER="$EDGE"
elif [[ -x "$CHROME" ]]; then
  BROWSER="$CHROME"
else
  echo "Need Edge or Chrome to print the solution"
  exit 1
fi
FILE_URL="file://wsl.localhost/Ubuntu${HTML}"
WIN_OUT="$(wslpath -w "$OUT")"
"$BROWSER" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="$WIN_OUT" "$FILE_URL"
ls -lh "$OUT"
