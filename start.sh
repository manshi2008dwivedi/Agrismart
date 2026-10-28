#!/usr/bin/env bash
set -e

echo "Starting AgriSmart Platform..."

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js (v18+) to continue."
    exit 1
fi

# Ensure data directory exists
mkdir -p backend/data

# Run server
exec node backend/server.js
