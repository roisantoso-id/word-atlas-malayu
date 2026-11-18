#!/usr/bin/env bash
# 部署到新加坡服务器：https://www.bahasa.cn/words/
# 文件放在官网目录的 words/ 子目录里，由同一个 Caddy 站点托管，不用改 Caddy 和 DNS。
# 官网部署脚本（cuc-bahasa-malay/deploy/deploy-website.sh）已经排除了 /words/，互不覆盖。
set -euo pipefail
HOST="${HOST:-ubuntu@43.134.55.33}"
DIR=/opt/jombelajar/website/words
cd "$(dirname "$0")/.."
ATLAS_BASE=/words/ npm run build
ssh "$HOST" "mkdir -p $DIR"
rsync -az --delete dist/ "$HOST:$DIR/"
echo "已部署 → https://www.bahasa.cn/words/"
