# 中山市中小学生健康宣传互动平台

## 项目结构

```
zhongshan-health-platform/
├── frontend/           # 前端代码
│   ├── index.html
│   ├── css/
│   └── js/
├── backend/            # 后端代码
│   ├── server.js       # 主服务器
│   ├── package.json
│   ├── models/
│   │   └── db.js       # 数据库模型
│   ├── routes/         # API路由
│   │   ├── users.js    # 用户相关
│   │   ├── quiz.js     # 答题相关
│   │   ├── works.js    # 作品征集
│   │   ├── challenge.js # 打卡挑战
│   │   ├── stats.js    # 统计公告
│   │   └── admin.js    # 管理后台
│   ├── uploads/        # 上传文件目录
│   └── data/           # 数据库文件
└── README.md
```

## 功能模块

### 1. 健康答题
- 随机抽题（从数据库）
- 答题记录保存
- 积分累计
- 抽奖功能

### 2. 作品征集
- 作品上传（图片/视频）
- 作品展示与筛选
- 点赞功能
- 审核管理

### 3. 21天闯关打卡
- 21天任务列表
- 打卡记录
- 排行榜
- 连续打卡统计

### 4. 管理后台
- 用户管理
- 作品审核
- 获奖设置
- 公告发布

## 快速开始

### 1. 安装依赖
```bash
cd backend
npm install
```

### 2. 启动服务器
```bash
npm start
# 或
node server.js
```

### 3. 访问应用
打开浏览器访问：`http://localhost:3000`

## API 接口文档

### 用户相关
- `POST /api/users/register` - 用户注册
- `GET /api/users/:id` - 获取用户信息
- `POST /api/users/:id/score` - 更新积分

### 答题相关
- `GET /api/quiz/questions?count=5` - 获取题目
- `POST /api/quiz/submit` - 提交答题
- `POST /api/quiz/lottery` - 抽奖
- `GET /api/quiz/records/:user_id` - 答题记录

### 作品征集
- `GET /api/works?type=xxx` - 获取作品列表
- `POST /api/works` - 提交作品（multipart/form-data）
- `POST /api/works/:id/like` - 点赞
- `GET /api/works/winners` - 获奖名单

### 打卡挑战
- `GET /api/challenge/tasks` - 获取21天任务
- `GET /api/challenge/records/:user_id` - 打卡记录
- `POST /api/challenge/checkin` - 提交打卡
- `GET /api/challenge/ranking` - 排行榜

### 统计公告
- `GET /api/stats` - 统计数据
- `GET /api/stats/notices` - 公告列表

### 管理后台
- `GET /api/admin/works` - 所有作品（含待审核）
- `POST /api/admin/works/:id/approve` - 审核作品
- `GET /api/admin/users` - 用户列表
- `GET /api/admin/quiz-records` - 答题记录
- `GET /api/admin/lottery-records` - 抽奖记录
- `POST /api/admin/notices` - 发布公告
- `DELETE /api/admin/notices/:id` - 删除公告

## 部署说明

### 方式1：本地运行
```bash
cd backend
npm start
```

### 方式2：部署到服务器
1. 上传代码到服务器
2. 安装 Node.js 和 npm
3. 运行 `npm install && npm start`
4. 使用 Nginx 反向代理到 3000 端口

### 方式3：Docker 部署（可选）
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "backend/server.js"]
```

## 技术栈

- **前端**：HTML5 + CSS3 + JavaScript (原生)
- **后端**：Node.js + Express
- **数据库**：SQLite3
- **部署**：GitHub Pages / 自有服务器

## 注意事项

1. 当前用户认证为简化版，生产环境建议接入微信 OAuth
2. 文件上传大小限制为 20MB
3. 数据库文件位于 `backend/data/health_app.db`
4. 上传的文件保存在 `backend/uploads/works/`
