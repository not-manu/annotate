#!/bin/bash
set -euo pipefail

# Load NPM_ACCESS_TOKEN from .env
if [ -f .env ]; then
  export $(grep -E '^NPM_ACCESS_TOKEN=' .env | xargs)
fi

if [ -z "${NPM_ACCESS_TOKEN:-}" ]; then
  echo "Error: NPM_ACCESS_TOKEN not found in .env"
  exit 1
fi

# Bump version
echo "Bumping patch version..."
npm version patch --no-git-tag-version

# Build
echo "Building..."
bun build ./src/index.ts --outdir dist --target node --format esm --packages external

# Add shebang to the entry point
echo '#!/usr/bin/env node' | cat - dist/index.js > dist/index.tmp && mv dist/index.tmp dist/index.js

# Publish
echo "Publishing..."
npm publish --access public --registry https://registry.npmjs.org/ --//registry.npmjs.org/:_authToken="$NPM_ACCESS_TOKEN"

echo "Published $(node -p "require('./package.json').version") successfully!"
