#!/bin/bash
# 阿里云部署脚本 - 中山市中小学生健康宣传互动平台
# 使用方式：在服务器上直接执行

set -e

echo "====================================="
echo "  中山市健康宣传平台 - 服务器部署脚本"
echo "====================================="

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

PROJECT_DIR="/opt/zhongshan-health-app"
GITHUB_REPO="https://github.com/Joins1994/zhongshan-health-app.git"

echo -e "${YELLOW}开始部署...${NC}"

# 1. 安装必要软件
echo -e "${GREEN}[1/7] 检查并安装必要软件...${NC}"
apt-get update -qq

# 安装 Node.js 18
if ! command -v node &> /dev/null || [ "$(node -v | cut -d'v' -f2 | cut -d'.' -f1)" != "18" ]; then
    echo "安装 Node.js 18..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
fi

echo "Node.js 版本: $(node -v)"
echo "npm 版本: $(npm -v)"

# 安装 Nginx
if ! command -v nginx &> /dev/null; then
    echo "安装 Nginx..."
    apt-get install -y nginx
fi

# 安装 PM2
if ! command -v pm2 &> /dev/null; then
    echo "安装 PM2..."
    npm install -g pm2
fi

# 2. 克隆/更新代码
echo -e "${GREEN}[2/7] 获取最新代码...${NC}"
if [ -d "$PROJECT_DIR/.git" ]; then
    cd "$PROJECT_DIR"
    git fetch origin
    git reset --hard origin/main
else
    rm -rf "$PROJECT_DIR"
    git clone "$GITHUB_REPO" "$PROJECT_DIR"
    cd "$PROJECT_DIR"
fi

# 3. 创建必要目录
echo -e "${GREEN}[3/7] 创建数据目录...${NC}"
mkdir -p database uploads/works

# 4. 安装后端依赖
echo -e "${GREEN}[4/7] 安装后端依赖...${NC}"
cd "$PROJECT_DIR/backend"
npm install

# 5. 配置 Nginx
echo -e "${GREEN}[5/7] 配置 Nginx...${NC}"
cat > /etc/nginx/sites-available/zhongshan-health << 'EOF'
server {
    listen 80;
    server_name _;

    # 前端静态文件
    location / {
        root /opt/zhongshan-health-app/frontend;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # API 代理
    location /api/ {
        proxy_pass http://localhost:3000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }

    # 上传文件访问
    location /uploads/ {
        alias /opt/zhongshan-health-app/uploads/;
        expires 30d;
    }

    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
}
EOF

# 启用配置
ln -sf /etc/nginx/sites-available/zhongshan-health /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# 测试并重载 Nginx
nginx -t && systemctl reload nginx

# 6. 启动后端服务
echo -e "${GREEN}[6/7] 启动后端服务...${NC}"
cd "$PROJECT_DIR/backend"

# 使用 PM2 启动
pm2 delete zhongshan-health-app 2>/dev/null || true
pm2 start server.js --name zhongshan-health-app --watch --ignore-watch="node_modules"
pm2 save
pm2 startup systemd -u root --hp /root 2>/dev/null || true

# 7. 检查状态
echo -e "${GREEN}[7/7] 检查服务状态...${NC}"
echo ""
echo "Nginx 状态:"
systemctl is-active nginx

echo ""
echo "PM2 进程:"
pm2 list

echo ""
echo -e "${GREEN}=====================================${NC}"
echo -e "${GREEN}  部署完成！${NC}"
echo -e "${GREEN}=====================================${NC}"
echo ""
echo "访问地址: http://$(curl -s ifconfig.me 2>/dev/null || echo '您的服务器IP')"
echo "管理后台: 点击首页右下角的齿轮图标"
echo ""
echo "常用命令:"
echo "  查看日志: pm2 logs zhongshan-health-app"
echo "  重启服务: pm2 restart zhongshan-health-app"
echo "  更新代码: cd $PROJECT_DIR && git pull && pm2 restart zhongshan-health-app"
