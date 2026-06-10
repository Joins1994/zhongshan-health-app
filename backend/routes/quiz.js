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

// 抽奖
router.post('/lottery', (req, res) => {
    const { user_id } = req.body;

    const prizes = [
        { level: '一等奖', desc: '运动手表一块', weight: 2 },
        { level: '二等奖', desc: '精美文具套装', weight: 8 },
        { level: '三等奖', desc: '健康知识手册', weight: 20 },
        { level: '参与奖', desc: '健康贴纸一套', weight: 35 },
        { level: '谢谢参与', desc: '下次一定中奖！', weight: 35 }
    ];

    const totalWeight = prizes.reduce((sum, p) => sum + p.weight, 0);
    let random = Math.random() * totalWeight;
    let selected = prizes[prizes.length - 1];

    for (const prize of prizes) {
        random -= prize.weight;
        if (random <= 0) {
            selected = prize;
            break;
        }
    }

    // 保存抽奖记录
    db.run(
        'INSERT INTO lottery_records (user_id, prize_level, prize_desc) VALUES (?, ?, ?)',
        [user_id, selected.level, selected.desc],
        function(err) {
            if (err) {
                return res.status(500).json({ success: false, message: '保存抽奖记录失败' });
            }
            res.json({ success: true, data: selected });
        }
    );
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
