const express = require('express');
const router = express.Router();
const { db } = require('../models/db');

// 随机获取题目
router.get('/questions', (req, res) => {
    const count = parseInt(req.query.count) || 5;

    db.all('SELECT * FROM questions ORDER BY RANDOM() LIMIT ?', [count], (err, rows) => {
        if (err) {
            return res.status(500).json({ success: false, message: '获取题目失败' });
        }

        const questions = rows.map(q => ({
            id: q.id,
            question: q.question,
            options: [q.option_a, q.option_b, q.option_c, q.option_d],
            answer: q.answer,
            explain: q.explain
        }));

        res.json({ success: true, data: questions });
    });
});

// 提交答题结果
router.post('/submit', (req, res) => {
    const { user_id, score, correct_count, total_count } = req.body;

    if (!user_id || score === undefined) {
        return res.status(400).json({ success: false, message: '参数不完整' });
    }

    db.run(
        'INSERT INTO quiz_records (user_id, score, correct_count, total_count) VALUES (?, ?, ?, ?)',
        [user_id, score, correct_count || 0, total_count || 5],
        function(err) {
            if (err) {
                return res.status(500).json({ success: false, message: '保存答题记录失败' });
            }

            // 更新用户积分
            db.run('UPDATE users SET score = score + ? WHERE id = ?', [score, user_id]);

            // 更新统计
            db.run('UPDATE stats SET quiz_count = quiz_count + 1 WHERE id = 1');

            res.json({
                success: true,
                data: { record_id: this.lastID, score }
            });
        }
    );
});

// 获取奖品配置
router.get('/prizes', (req, res) => {
    db.all('SELECT * FROM prizes ORDER BY probability ASC', (err, rows) => {
        if (err) {
            return res.status(500).json({ success: false, message: '获取奖品配置失败' });
        }
        res.json({ success: true, data: rows });
    });
});

// 抽奖（从 prizes 表读取配置）
router.post('/lottery', (req, res) => {
    const { user_id } = req.body;

    if (!user_id) {
        return res.status(400).json({ success: false, message: '缺少用户ID' });
    }

    // 从 prizes 表读取配置
    db.all('SELECT * FROM prizes WHERE stock > 0 OR stock = -1 ORDER BY id ASC', (err, rows) => {
        if (err) {
            return res.status(500).json({ success: false, message: '获取奖品配置失败' });
        }

        if (!rows || rows.length === 0) {
            return res.status(500).json({ success: false, message: '暂无可用奖品配置' });
        }

        // 构建抽奖池（排除库存为0的奖品）
        const availablePrizes = rows.filter(p => p.stock !== 0);
        if (availablePrizes.length === 0) {
            return res.json({ success: true, data: { level: '已抽完', desc: '奖品已全部抽完，请等待补充' } });
        }

        const totalProbability = availablePrizes.reduce((sum, p) => sum + p.probability, 0);
        let random = Math.random() * totalProbability;
        let selected = availablePrizes[availablePrizes.length - 1];

        for (const prize of availablePrizes) {
            random -= prize.probability;
            if (random <= 0) {
                selected = prize;
                break;
            }
        }

        // 如果奖品有库存限制且不为 -1（无限），则扣减库存
        if (selected.stock > 0) {
            db.run('UPDATE prizes SET stock = stock - 1 WHERE id = ?', [selected.id]);
        }

        // 保存抽奖记录
        db.run(
            'INSERT INTO lottery_records (user_id, prize_level, prize_desc) VALUES (?, ?, ?)',
            [user_id, selected.name, selected.name],
            function(err) {
                if (err) {
                    return res.status(500).json({ success: false, message: '保存抽奖记录失败' });
                }
                res.json({
                    success: true,
                    data: {
                        id: selected.id,
                        level: selected.name,
                        desc: selected.name,
                        probability: selected.probability
                    }
                });
            }
        );
    });
});

// 获取用户答题记录
router.get('/records/:user_id', (req, res) => {
    const userId = req.params.user_id;
    db.all(
        'SELECT * FROM quiz_records WHERE user_id = ? ORDER BY created_at DESC',
        [userId],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ success: false, message: '获取记录失败' });
            }
            res.json({ success: true, data: rows });
        }
    );
});

module.exports = router;
