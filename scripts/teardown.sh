#!/bin/bash
echo "🛑 Stopping RestroVerse services..."
docker compose -f docker-compose.dev.yml down

if [ "$1" = "--clean" ]; then
  echo "🗑️  Removing volumes..."
  docker compose -f docker-compose.dev.yml down -v
  echo "✅ Volumes removed"
fi

echo "✅ Services stopped"
