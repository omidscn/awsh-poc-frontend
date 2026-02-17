#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/root/awsh-poc-frontend"
IMAGE="awsh-frontend"
CONTAINER="awsh-frontend"
ENV_FILE="/root/awsh-frontend.env"

cd "$APP_DIR"

echo "==> Pulling latest code..."
git pull origin main

echo "==> Loading env vars for build..."
set -a
source "$ENV_FILE"
set +a

echo "==> Building Docker image..."
docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL="$NEXT_PUBLIC_SUPABASE_URL" \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY="$NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  -t "$IMAGE" .

echo "==> Replacing container..."
docker rm -f "$CONTAINER" 2>/dev/null || true
docker run -d \
  --name "$CONTAINER" \
  --network host \
  --restart unless-stopped \
  --env-file "$ENV_FILE" \
  "$IMAGE"

echo "==> Pruning old images..."
docker image prune -f

echo "==> Deploy complete. Container status:"
docker ps --filter "name=$CONTAINER" --format "table {{.Names}}\t{{.Status}}\t{{.Image}}"
