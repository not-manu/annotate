#!/bin/bash
ln -sf "$(cd "$(dirname "$0")/.." && pwd)/src/index.ts" ~/.bun/bin/annotate-dev
echo "Linked annotate-dev → src/index.ts"
