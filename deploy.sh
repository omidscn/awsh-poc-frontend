#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/root/awsh-poc-frontend"
IMAGE="awsh-frontend"
CONTAINER="awsh-frontend"
ENV_FILE="/root/awsh-frontend.env"

cd "$APP_DIR"

echo "==> Pulling latest code..."
git pull origin main

echo "==> Building Docker image..."
docker build -t "$IMAGE" .

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
