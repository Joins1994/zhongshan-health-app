# 中山市中小学生健康宣传互动平台 - Docker 部署配置
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制后端依赖文件
COPY backend/package*.json ./

# 安装依赖
RUN npm install --production

# 复制项目文件
COPY backend/ ./backend/
COPY frontend/ ./frontend/
COPY README.md ./

# 创建上传目录
RUN mkdir -p backend/uploads/works backend/data

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["node", "backend/server.js"]
