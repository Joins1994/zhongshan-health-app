# 中山市中小学生健康宣传互动平台

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)

> 面向中山市中小学生的健康知识宣传与互动 Web 应用，支持微信公众号和浏览器访问。

## 项目简介

本项目由**中山市保健所**发起，旨在通过趣味化的互动形式向中小学生普及健康知识，培养良好的生活习惯。平台包含健康答题抽奖、作品征集展示、21天健康打卡三大核心模块，并配备完整的管理后台。

## 功能特性

### 1. 健康答题与抽奖
- 随机抽取题库中的健康知识题目
- 每轮5题，答对3题以上获得抽奖机会
- 积分累计与排行榜
- 中奖后填写身份信息进行奖品领取登记

### 2. 作品征集
- 支持图片、视频作品上传
- 作品展示与分类筛选
- 点赞互动功能
- 后台审核与获奖名单管理

### 3. 21天健康打卡
- 三周递进式健康任务（基础习惯→饮食运动→心理安全）
- 每日打卡记录与连续天数统计
- 成就徽章系统
- 本校/全市排行榜

### 4. 管理后台
- 用户管理与数据统计
- 作品审核（通过/拒绝/设置奖项）
- 答题记录与抽奖记录查询
- 公告发布与管理

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | 原生 HTML5 / CSS3 / JavaScript（SPA） |
| 后端 | Node.js + Express |
| 数据库 | SQLite3 |
| 部署 | Nginx + PM2 |

## 项目结构

```
zhongshan-health-app/
├── frontend/                 # 前端代码
│   ├── index.html           # 主页面
│   ├── css/
│   │   └── style.css        # 样式表
│   └── js/
│       ├── app.js           # 主应用逻辑
│       ├── quiz.js          # 答题模块
│       ├── works.js         # 作品征集模块
│       ├── challenge.js     # 打卡模块
│       └── admin.js         # 管理后台模块
├── backend/                  # 后端代码
│   ├── server.js            # Express 主服务器
│   ├── package.json
│   ├── models/
│   │   └── db.js            # 数据库初始化与连接
│   └── routes/
│       ├── users.js         # 用户相关 API
│       ├── quiz.js          # 答题相关 API
│       ├── works.js         # 作品征集 API
│       ├── challenge.js     # 打卡挑战 API
│       ├── stats.js         # 统计公告 API
│       └── admin.js         # 管理后台 API
├── database/                 # SQLite 数据库文件
├── uploads/                  # 用户上传文件
├── nginx.conf                # Nginx 配置示例
└── deploy-to-server.sh       # 服务器部署脚本
```

## 快速开始

### 环境要求
- Node.js >= 18
- npm >= 9

### 本地开发

```bash
# 1. 克隆项目
git clone https://github.com/Joins1994/zhongshan-health-app.git
cd zhongshan-health-app

# 2. 安装后端依赖
cd backend
npm install

# 3. 启动开发服务器
npm start
# 或
node server.js

# 4. 访问应用
# 打开浏览器访问 http://localhost:3000
```

### 生产环境部署

在服务器上执行一键部署脚本：

```bash
curl -fsSL https://raw.githubusercontent.com/Joins1994/zhongshan-health-app/main/deploy-to-server.sh | bash
```

或手动部署：

```bash
# 1. 安装 Node.js 18、Nginx、PM2
# 2. 克隆代码到 /opt/zhongshan-health-app
# 3. 配置 Nginx（参考 nginx.conf）
# 4. cd backend && npm install
# 5. pm2 start server.js --name zhongshan-health-app
```

## API 接口文档

### 用户模块
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/users/register` | 用户注册 |
| GET | `/api/users/:id` | 获取用户信息 |
| POST | `/api/users/:id/score` | 更新积分 |

### 答题模块
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/quiz/questions?count=5` | 获取题目 |
| POST | `/api/quiz/submit` | 提交答题 |
| POST | `/api/quiz/lottery` | 抽奖 |
| GET | `/api/quiz/records/:user_id` | 答题记录 |

### 作品征集
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/works?type=xxx` | 获取作品列表 |
| POST | `/api/works` | 提交作品（multipart/form-data） |
| POST | `/api/works/:id/like` | 点赞 |
| GET | `/api/works/winners` | 获奖名单 |

### 打卡挑战
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/challenge/tasks` | 获取21天任务 |
| GET | `/api/challenge/records/:user_id` | 打卡记录 |
| POST | `/api/challenge/checkin` | 提交打卡 |
| GET | `/api/challenge/ranking` | 排行榜 |

### 统计公告
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/stats` | 首页统计数据 |
| GET | `/api/stats/notices` | 公告列表 |

### 管理后台
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/admin/users` | 用户列表 |
| GET | `/api/admin/works` | 作品列表（含待审核） |
| POST | `/api/admin/works/:id/approve` | 审核作品 |
| GET | `/api/admin/quiz-records` | 答题记录 |
| GET | `/api/admin/lottery-records` | 抽奖记录 |
| POST | `/api/admin/notices` | 发布公告 |
| DELETE | `/api/admin/notices/:id` | 删除公告 |

## 更新日志

### 2026-06-10
- 重构项目目录结构
- 添加管理后台功能
- 完善前后端 API 对接
- 添加服务器部署脚本

## 维护团队

- **发起单位**：中山市保健所
- **开发维护**：[Joins1994](https://github.com/Joins1994)

## 开源协议

本项目基于 [MIT](LICENSE) 协议开源。
