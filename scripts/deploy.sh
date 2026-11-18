#!/usr/bin/env bash
# 部署到新加坡服务器：https://words.bahasa.cn/
# 文件放在服务器官网目录下的 words/，由 Caddy 的 words.bahasa.cn 站点托管（配置在 cuc-bahasa-malay/deploy/Caddyfile）。
# 官网部署脚本（cuc-bahasa-malay/deploy/deploy-website.sh）已经排除了 /words/，互不覆盖。
set -euo pipefail
HOST="${HOST:-jombelajar}"  # ~/.ssh/config 里的主机别名，仓库里不写服务器地址
DIR="${DIR:-/opt/jombelajar/website/words}"
cd "$(dirname "$0")/.."
npm run build
ssh "$HOST" "mkdir -p $DIR"
rsync -az --delete dist/ "$HOST:$DIR/"
echo "已部署 → https://words.bahasa.cn/"
