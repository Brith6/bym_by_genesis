#!/bin/bash

# Load nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Use Node 18
nvm use 18

# Go to backend directory
cd /home/erwin/bym_by_genesis/backend

# Reinstall dependencies
echo "🔄 Reinstalling dependencies with Node 18..."
rm -rf node_modules
npm install

echo "✅ Dependencies installed!"
echo "🚀 Starting backend server..."

# Start the server
npm run dev
