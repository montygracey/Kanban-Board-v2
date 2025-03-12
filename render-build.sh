#!/bin/bash
set -e

# Install root dependencies
npm install

# Install and build server
cd server
npm install
npm install -g typescript
tsc
cd ..

# Install and build client
cd client
npm install
npm run build
cd ..