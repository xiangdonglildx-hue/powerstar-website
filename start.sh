#!/bin/sh
# Cloud Run 动态端口启动脚本
# Cloud Run 通过 PORT 环境变量分配端口，默认 8080

export PORT=${PORT:-8080}

# 替换 nginx 配置中的端口
sed -i "s/listen 8080/listen $PORT/g" /etc/nginx/nginx.conf

echo "Starting nginx on port $PORT"
nginx -g "daemon off;"