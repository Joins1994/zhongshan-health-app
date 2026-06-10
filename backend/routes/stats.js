const express = require('express');
const router = express.Router();
const { db } = require('../models/db');

// 获取统计数据
router.get('/', (req, res) => {
    db.get('SELECT * FROM stats WHERE id = 1', (err, row) => {
        if (err) {
            return res.status(500).json({ success: false, message: '获取统计失败' });
        }

        // 同时获取真实用户数
        db.get('SELECT COUNT(*) as count FROM users', (err2, userRow) => {
            const stats = row || { participants: 0, quiz_count: 0, works_count: 0, checkin_days: 0 };
            stats.participants = userRow ? userRow.count : stats.participants;

            res.json({ success: true, data: stats });
        });
    });
});

// 获取公告列表
router.get('/notices', (req, res) => {
    db.all('SELECT * FROM notices ORDER BY is_top DESC, created_at DESC', (err, rows) => {
        if (err) {
            return res.status(500).json({ success: false, message: '获取公告失败' });
        }
        res.json({ success: true, data: rows });
    });
});

module.exports = router;
