const express = require('express');
const router = express.Router();
const { db } = require('../models/db');

// 管理后台密码验证中间件
const ADMIN_PASSWORD = 'admin123';

function adminAuth(req, res, next) {
    const { password } = req.headers;
    const { admin_password } = req.body;

    const token = password || admin_password || req.query.password;

    if (token !== ADMIN_PASSWORD) {
        return res.status(401).json({ success: false, message: '管理员密码验证失败' });
    }
    next();
}

// 所有管理接口都需要密码验证
router.use(adminAuth);

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

// 获取奖品配置（管理员）
router.get('/prizes', (req, res) => {
    db.all('SELECT * FROM prizes ORDER BY probability ASC', (err, rows) => {
        if (err) {
            return res.status(500).json({ success: false, message: '获取奖品配置失败' });
        }
        res.json({ success: true, data: rows });
    });
});

// 设置奖品和概率（批量更新）
router.post('/prizes', (req, res) => {
    const { prizes } = req.body;

    if (!prizes || !Array.isArray(prizes) || prizes.length === 0) {
        return res.status(400).json({ success: false, message: '请提供奖品配置数组' });
    }

    // 验证概率总和
    const totalProb = prizes.reduce((sum, p) => sum + (p.probability || 0), 0);
    if (totalProb <= 0) {
        return res.status(400).json({ success: false, message: '奖品概率总和必须大于0' });
    }

    // 清空现有奖品配置，重新插入
    db.serialize(() => {
        db.run('DELETE FROM prizes', (err) => {
            if (err) {
                return res.status(500).json({ success: false, message: '更新奖品配置失败' });
            }

            const stmt = db.prepare('INSERT INTO prizes (name, probability, stock) VALUES (?, ?, ?)');
            let inserted = 0;

            prizes.forEach(p => {
                stmt.run(p.name, p.probability, p.stock !== undefined ? p.stock : -1, (err) => {
                    if (!err) inserted++;
                });
            });

            stmt.finalize(() => {
                res.json({
                    success: true,
                    message: `已更新 ${prizes.length} 条奖品配置`,
                    data: { total_probability: totalProb }
                });
            });
        });
    });
});

module.exports = router;
