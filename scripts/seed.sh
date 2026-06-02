#!/bin/bash
set -e
echo "🌱 Seeding database..."

# Use the DATABASE_URL from .env or default
DB_URL="${DATABASE_URL:-postgresql://restroverse:restroverse_dev@localhost:5432/restroverse_dev}"

# Run seed SQL if it exists
if [ -f docker/seed.sql ]; then
  psql "$DB_URL" -f docker/seed.sql
  echo "✅ Database seeded"
else
  echo "⚠️  No seed file found at docker/seed.sql"
fi
