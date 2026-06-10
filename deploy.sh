#!/bin/bash
# 阿里云部署脚本 - 中山市中小学生健康宣传互动平台

set -e

echo "====================================="
echo "  中山市健康宣传平台 - 阿里云部署脚本"
echo "====================================="

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 检查参数
if [ -z "$1" ]; then
    echo -e "${RED}错误: 请提供服务器IP地址${NC}"
    echo "用法: ./deploy.sh <服务器IP> [SSH端口]"
    echo "示例: ./deploy.sh 123.45.67.89"
    exit 1
fi

SERVER_IP=$1
SSH_PORT=${2:-22}
PROJECT_NAME="zhongshan-health-app"

echo -e "${YELLOW}目标服务器: $SERVER_IP:$SSH_PORT${NC}"

# 1. 本地构建
echo -e "${GREEN}[1/6] 本地构建项目...${NC}"
npm install --prefix backend

# 2. 打包项目
echo -e "${GREEN}[2/6] 打包项目文件...${NC}"
tar czf deploy.tar.gz \
    backend/ \
    frontend/ \
    Dockerfile \
    docker-compose.yml \
    README.md \
    --exclude='backend/node_modules' \
    --exclude='backend/data' \
    --exclude='backend/uploads'

# 3. 上传到服务器
echo -e "${GREEN}[3/6] 上传到阿里云服务器...${NC}"
read -p "请输入服务器用户名 (默认 root): " USERNAME
USERNAME=${USERNAME:-root}

scp -P $SSH_PORT deploy.tar.gz $USERNAME@$SERVER_IP:/tmp/

# 4. 远程部署
echo -e "${GREEN}[4/6] 在服务器上部署...${NC}"
ssh -p $SSH_PORT $USERNAME@$SERVER_IP << 'REMOTE_SCRIPT'
    # 安装 Docker（如果未安装）
    if ! command -v docker &> /dev/null; then
        echo "安装 Docker..."
        curl -fsSL https://get.docker.com | sh
        systemctl start docker
        systemctl enable docker
    fi

    # 安装 Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        echo "安装 Docker Compose..."
        curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        chmod +x /usr/local/bin/docker-compose
    fi

    # 创建项目目录
    mkdir -p /opt/zhongshan-health-app
    cd /opt/zhongshan-health-app

    # 解压文件
    tar xzf /tmp/deploy.tar.gz

    # 创建数据目录
    mkdir -p data uploads/works

    # 构建并启动
    docker-compose down 2>/dev/null || true
    docker-compose up -d --build

    # 清理
    rm -f /tmp/deploy.tar.gz

    echo "部署完成！"
REMOTE_SCRIPT

# 5. 配置 Nginx（可选）
echo -e "${GREEN}[5/6] 配置 Nginx 反向代理...${NC}"
read -p "是否配置域名? (y/n): " CONFIG_NGINX

if [ "$CONFIG_NGINX" = "y" ]; then
    read -p "请输入域名 (如 health.zhongshan.edu.cn): " DOMAIN

    ssh -p $SSH_PORT $USERNAME@$SERVER_IP << REMOTE_NGINX
        # 安装 Nginx
        if ! command -v nginx &> /dev/null; then
            apt-get update && apt-get install -y nginx
        fi

        # 创建 Nginx 配置
        cat > /etc/nginx/sites-available/$PROJECT_NAME << EOF
server {
    listen 80;
    server_name $DOMAIN;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_cache_bypass \$http_upgrade;
    }

    location /uploads {
        alias /opt/zhongshan-health-app/uploads;
        expires 30d;
    }

    client_max_body_size 50M;
}
EOF

        # 启用配置
        ln -sf /etc/nginx/sites-available/$PROJECT_NAME /etc/nginx/sites-enabled/
        rm -f /etc/nginx/sites-enabled/default
        nginx -t && systemctl restart nginx

        echo "Nginx 配置完成"
REMOTE_NGINX
fi

# 6. 配置 HTTPS（可选）
echo -e "${GREEN}[6/6] 配置 HTTPS...${NC}"
read -p "是否配置 SSL 证书? (y/n): " CONFIG_SSL

if [ "$CONFIG_SSL" = "y" ]; then
    ssh -p $SSH_PORT $USERNAME@$SERVER_IP << REMOTE_SSL
        # 安装 Certbot
        if ! command -v certbot &> /dev/null; then
            apt-get install -y certbot python3-certbot-nginx
        fi

        # 申请证书
        certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN

        echo "SSL 证书配置完成"
REMOTE_SSL
fi

# 清理本地文件
rm -f deploy.tar.gz

echo -e "${GREEN}=====================================${NC}"
echo -e "${GREEN}  部署完成！${NC}"
echo -e "${GREEN}=====================================${NC}"
if [ -n "$DOMAIN" ]; then
    echo -e "访问地址: ${YELLOW}https://$DOMAIN${NC}"
else
    echo -e "访问地址: ${YELLOW}http://$SERVER_IP:3000${NC}"
fi
echo -e "${GREEN}=====================================${NC}"
