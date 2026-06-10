const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');

const { initTables, initQuestions, initNotices } = require('./models/db');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务 - 前端文件
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 限流
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15分钟
    max: 100 // 每个IP最多100次请求
});
app.use('/api/', apiLimiter);

// 路由
app.use('/api/users', require('./routes/users'));
app.use('/api/quiz', require('./routes/quiz'));
app.use('/api/works', require('./routes/works'));
app.use('/api/challenge', require('./routes/challenge'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/stats', require('./routes/stats'));

// 前端路由兜底
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// 错误处理
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: '服务器内部错误' });
});

// 初始化数据库并启动服务器
async function start() {
    await initTables();
    await initQuestions();
    await initNotices();

    app.listen(PORT, () => {
        console.log(`=================================`);
        console.log(`服务器运行在 http://localhost:${PORT}`);
        console.log(`=================================`);
    });
}

start().catch(console.error);
