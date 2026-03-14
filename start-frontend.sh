#!/bin/bash

# Load nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Use Node 23
nvm use 23

# Go to frontend directory
cd /home/erwin/bym_by_genesis/bym_by_genesis

echo "🚀 Starting frontend server..."

# Start the server
npm run dev
