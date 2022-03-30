#!/usr/bin/env bash
set -ex

# automate tagging with the short commit hash
docker build --no-cache -t jabahum/himcore:$(git rev-parse --short HEAD) .
docker tag jabahum/himcore:$(git rev-parse --short HEAD) jabahum/himcore
docker push jabahum/himcore:$(git rev-parse --short HEAD)
docker push jabahum/himcore:latest