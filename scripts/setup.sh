#!/bin/bash
set -e

echo "🍽️  RestroVerse Development Setup"
echo "================================="

# Check prerequisites
command -v docker >/dev/null 2>&1 || { echo "❌ Docker is required but not installed."; exit 1; }
command -v pnpm >/dev/null 2>&1 || { echo "❌ pnpm is required. Install with: npm install -g pnpm"; exit 1; }

# Copy env file
if [ ! -f .env ]; then
  echo "📋 Creating .env from .env.example..."
  cp .env.example .env
fi

# Start Docker services
echo "🐳 Starting Docker services..."
docker compose -f docker-compose.dev.yml up -d

# Wait for Postgres
echo "⏳ Waiting for PostgreSQL..."
until docker exec rv-postgres pg_isready -U restroverse -d restroverse_dev > /dev/null 2>&1; do
  sleep 1
done
echo "✅ PostgreSQL is ready"

# Wait for Redis
echo "⏳ Waiting for Redis..."
until docker exec rv-redis redis-cli ping > /dev/null 2>&1; do
  sleep 1
done
echo "✅ Redis is ready"

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

echo ""
echo "🎉 RestroVerse is ready!"
echo ""
echo "Services:"
echo "  PostgreSQL:  localhost:5432"
echo "  Redis:       localhost:6379"
echo "  MinIO:       localhost:9000 (console: localhost:9001)"
echo "  NATS:        localhost:4222 (monitor: localhost:8222)"
echo ""
echo "Run 'pnpm dev' to start all apps"
