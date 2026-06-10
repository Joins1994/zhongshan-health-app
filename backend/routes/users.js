const express = require('express');
const router = express.Router();
const { db } = require('../models/db');

// 用户注册/登录（简化版，实际应接入微信OAuth）
router.post('/register', (req, res) => {
    const { name, school, grade, phone } = req.body;

    if (!name || !school || !grade || !phone) {
        return res.status(400).json({ success: false, message: '请填写完整信息' });
    }

    // 生成模拟 openid
    const openid = 'user_' + Date.now();

    db.run(
        'INSERT INTO users (openid, name, school, grade, phone) VALUES (?, ?, ?, ?, ?)',
        [openid, name, school, grade, phone],
        function(err) {
            if (err) {
                return res.status(500).json({ success: false, message: '注册失败' });
            }
            res.json({
                success: true,
                data: {
                    id: this.lastID,
                    openid,
                    name,
                    school,
                    grade,
                    phone,
                    score: 0
                }
            });
        }
    );
});

// 获取用户信息
router.get('/:id', (req, res) => {
    const userId = req.params.id;
    db.get('SELECT id, name, school, grade, phone, score FROM users WHERE id = ?', [userId], (err, row) => {
        if (err || !row) {
            return res.status(404).json({ success: false, message: '用户不存在' });
        }
        res.json({ success: true, data: row });
    });
});

// 更新用户积分
router.post('/:id/score', (req, res) => {
    const userId = req.params.id;
    const { score } = req.body;

    db.run('UPDATE users SET score = score + ? WHERE id = ?', [score, userId], function(err) {
        if (err) {
            return res.status(500).json({ success: false, message: '更新失败' });
        }
        res.json({ success: true, message: '积分更新成功' });
    });
});

module.exports = router;
