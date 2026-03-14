#!/bin/bash

# Install nvm if not already installed
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install Node.js 18
nvm install 18
nvm use 18

# Verify
node --version
npm --version

echo "✅ Node.js 18 installed successfully!"
