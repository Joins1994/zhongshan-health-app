const express = require('express');
const router = express.Router();
const { db } = require('../models/db');

// 获取所有作品（管理员视角，包含待审核）
router.get('/works', (req, res) => {
    const { status } = req.query;
    let sql = 'SELECT * FROM works';
    const params = [];

    if (status) {
        sql += ' WHERE status = ?';
        params.push(status);
    }

    sql += ' ORDER BY created_at DESC';

    db.all(sql, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ success: false, message: '获取作品失败' });
        }
        res.json({ success: true, data: rows });
    });
});

// 审核作品
router.post('/works/:id/approve', (req, res) => {
    const workId = req.params.id;
    const { status, prize_level } = req.body;

    let sql = 'UPDATE works SET status = ?';
    const params = [status];

    if (prize_level) {
        sql += ', prize_level = ?';
        params.push(prize_level);
    }

    sql += ' WHERE id = ?';
    params.push(workId);

    db.run(sql, params, function(err) {
        if (err) {
            return res.status(500).json({ success: false, message: '审核失败' });
        }
        res.json({ success: true, message: '审核成功' });
    });
});

// 获取所有用户
router.get('/users', (req, res) => {
    db.all('SELECT id, name, school, grade, phone, score, created_at FROM users ORDER BY created_at DESC', (err, rows) => {
        if (err) {
            return res.status(500).json({ success: false, message: '获取用户失败' });
        }
        res.json({ success: true, data: rows });
    });
});

// 获取所有答题记录
router.get('/quiz-records', (req, res) => {
    db.all(
        `SELECT qr.*, u.name, u.school 
         FROM quiz_records qr 
         JOIN users u ON qr.user_id = u.id 
         ORDER BY qr.created_at DESC`,
        (err, rows) => {
            if (err) {
                return res.status(500).json({ success: false, message: '获取记录失败' });
            }
            res.json({ success: true, data: rows });
        }
    );
});

// 获取所有抽奖记录
router.get('/lottery-records', (req, res) => {
    db.all(
        `SELECT lr.*, u.name, u.school, u.phone 
         FROM lottery_records lr 
         JOIN users u ON lr.user_id = u.id 
         ORDER BY lr.created_at DESC`,
        (err, rows) => {
            if (err) {
                return res.status(500).json({ success: false, message: '获取记录失败' });
            }
            res.json({ success: true, data: rows });
        }
    );
});

// 发布公告
router.post('/notices', (req, res) => {
    const { title, content, tag } = req.body;

    if (!title || !content) {
        return res.status(400).json({ success: false, message: '标题和内容不能为空' });
    }

    db.run(
        'INSERT INTO notices (title, content, tag) VALUES (?, ?, ?)',
        [title, content, tag || '活动'],
        function(err) {
            if (err) {
                return res.status(500).json({ success: false, message: '发布失败' });
            }
            res.json({ success: true, data: { id: this.lastID } });
        }
    );
});

// 删除公告
router.delete('/notices/:id', (req, res) => {
    const noticeId = req.params.id;
    db.run('DELETE FROM notices WHERE id = ?', [noticeId], function(err) {
        if (err) {
            return res.status(500).json({ success: false, message: '删除失败' });
        }
        res.json({ success: true, message: '删除成功' });
    });
});

module.exports = router;
