#!/bin/bash

# Kislap Deployment Script (Production)

set -e
set -o pipefail

COMPOSE_FILE="docker-compose.prod.yml"

echo "===== Pulling latest code ====="
git pull origin main

echo "===== Rebuilding and restarting containers ====="
docker compose -f $COMPOSE_FILE up -d --build kislap_flash kislap_admin kislap_web_server

echo "===== Cleaning up old images ====="
docker image prune -f
docker image prune -a -f

echo "===== Deployment complete ====="
