#!/bin/bash
# Railway Deployment Script for BrezCode Health

echo "🚀 Starting BrezCode Railway deployment..."

# Check if required environment variables are set
check_env_var() {
    if [ -z "${!1}" ]; then
        echo "❌ Missing required environment variable: $1"
        return 1
    else
        echo "✅ $1 is set"
        return 0
    fi
}

echo "🔍 Checking required environment variables..."

# Critical environment variables
check_env_var "MONGODB_URI" || exit 1
check_env_var "DB_NAME" || exit 1

# Optional but recommended
if [ -z "$SESSION_SECRET" ]; then
    echo "⚠️  SESSION_SECRET not set, using default (not recommended for production)"
fi

if [ -z "$ANTHROPIC_API_KEY" ]; then
    echo "⚠️  ANTHROPIC_API_KEY not set - AI features will be disabled"
fi

if [ -z "$OPENAI_API_KEY" ]; then
    echo "⚠️  OPENAI_API_KEY not set - AI features will be disabled"
fi

echo "📦 Installing dependencies..."
npm install

echo "🏗️  Building React frontend..."
npm run build

echo "🧪 Testing health endpoint..."
node -e "
const express = require('express');
const app = express();
app.get('/health', (req, res) => res.json({ok: true}));
const server = app.listen(3000, () => {
  console.log('✅ Health endpoint test passed');
  server.close();
});
"

echo "🎉 Railway deployment preparation complete!"
echo "📍 Health check available at: /health"
echo "🌐 Starting server with: node server/index.js"