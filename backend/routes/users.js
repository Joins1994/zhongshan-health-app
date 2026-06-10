const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { db } = require('../models/db');

// 简单密码哈希
function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

// 用户注册（带密码）
router.post('/register', (req, res) => {
    const { name, school, grade, phone, password } = req.body;

    if (!name || !school || !grade || !phone) {
        return res.status(400).json({ success: false, message: '请填写完整信息（姓名、学校、年级、手机号）' });
    }

    // 如果有密码，验证长度
    let hashedPassword = null;
    if (password) {
        if (password.length < 6) {
            return res.status(400).json({ success: false, message: '密码长度不能少于6位' });
        }
        hashedPassword = hashPassword(password);
    }

    // 生成模拟 openid
    const openid = 'user_' + Date.now();

    db.run(
        'INSERT INTO users (openid, name, school, grade, phone, password) VALUES (?, ?, ?, ?, ?, ?)',
        [openid, name, school, grade, phone, hashedPassword],
        function(err) {
            if (err) {
                if (err.message.includes('UNIQUE')) {
                    return res.status(400).json({ success: false, message: '该手机号已注册' });
                }
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

// 用户登录（手机号+密码）
router.post('/login', (req, res) => {
    const { phone, password } = req.body;

    if (!phone || !password) {
        return res.status(400).json({ success: false, message: '请输入手机号和密码' });
    }

    const hashedPassword = hashPassword(password);

    db.get('SELECT id, openid, name, school, grade, phone, score, created_at FROM users WHERE phone = ? AND password = ?',
        [phone, hashedPassword],
        (err, row) => {
            if (err) {
                return res.status(500).json({ success: false, message: '登录失败' });
            }
            if (!row) {
                return res.status(401).json({ success: false, message: '手机号或密码错误' });
            }
            res.json({
                success: true,
                data: row
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
