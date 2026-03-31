#!/bin/bash
set -euo pipefail

# Bump version
echo "Bumping patch version..."
npm version patch --no-git-tag-version

# Build
echo "Building..."
bun build ./src/index.ts --outdir dist --target node --format esm --packages external

# Replace bun shebang with node shebang
sed -i '' '1s|^#!.*|#!/usr/bin/env node|' dist/index.js

# Publish (auth via .npmrc + .env)
echo "Publishing..."
bun publish --access public
