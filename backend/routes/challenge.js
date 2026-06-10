const express = require('express');
const router = express.Router();
const { db } = require('../models/db');

// 21天任务定义
const TASKS = [
    { day: 1, week: 1, category: '基础习惯', title: '每天喝够8杯水', icon: '💧' },
    { day: 2, week: 1, category: '基础习惯', title: '早晚认真刷牙', icon: '🦷' },
    { day: 3, week: 1, category: '基础习惯', title: '保证充足睡眠', icon: '😴' },
    { day: 4, week: 1, category: '基础习惯', title: '勤洗手讲卫生', icon: '🧼' },
    { day: 5, week: 1, category: '基础习惯', title: '保持正确坐姿', icon: '🪑' },
    { day: 6, week: 1, category: '基础习惯', title: '整理个人物品', icon: '🎒' },
    { day: 7, week: 1, category: '基础习惯', title: '早起不赖床', icon: '⏰' },
    { day: 8, week: 2, category: '饮食运动', title: '多吃蔬菜水果', icon: '🥦' },
    { day: 9, week: 2, category: '饮食运动', title: '运动30分钟', icon: '🏃' },
    { day: 10, week: 2, category: '饮食运动', title: '少吃零食和糖', icon: '🍭' },
    { day: 11, week: 2, category: '饮食运动', title: '认真吃早餐', icon: '🥣' },
    { day: 12, week: 2, category: '饮食运动', title: '学习一项新运动', icon: '🏊' },
    { day: 13, week: 2, category: '饮食运动', title: '做眼保健操', icon: '👀' },
    { day: 14, week: 2, category: '饮食运动', title: '和家人一起运动', icon: '👨‍👩‍👧‍👦' },
    { day: 15, week: 3, category: '心理安全', title: '记录三件开心的事', icon: '😊' },
    { day: 16, week: 3, category: '心理安全', title: '对别人说善意的话', icon: '💬' },
    { day: 17, week: 3, category: '心理安全', title: '学习安全知识', icon: '🆘' },
    { day: 18, week: 3, category: '心理安全', title: '深呼吸放松', icon: '🧘' },
    { day: 19, week: 3, category: '心理安全', title: '帮助需要帮助的人', icon: '🤝' },
    { day: 20, week: 3, category: '心理安全', title: '认识和管理情绪', icon: '❤️' },
    { day: 21, week: 3, category: '心理安全', title: '总结21天健康之旅', icon: '🏆' }
];

// 获取任务列表
router.get('/tasks', (req, res) => {
    res.json({ success: true, data: TASKS });
});

// 获取用户打卡记录
router.get('/records/:user_id', (req, res) => {
    const userId = req.params.user_id;

    db.all(
        'SELECT * FROM checkin_records WHERE user_id = ? ORDER BY day ASC',
        [userId],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ success: false, message: '获取打卡记录失败' });
            }

            // 计算连续打卡天数
            const completedDays = rows.map(r => r.day);
            let streak = 0;
            if (completedDays.length > 0) {
                const sorted = [...completedDays].sort((a, b) => a - b);
                streak = 1;
                for (let i = sorted.length - 2; i >= 0; i--) {
                    if (sorted[i + 1] - sorted[i] === 1) {
                        streak++;
                    } else {
                        break;
                    }
                }
            }

            res.json({
                success: true,
                data: {
                    records: rows,
                    completed_days: completedDays,
                    streak,
                    total: completedDays.length
                }
            });
        }
    );
});

// 提交打卡
router.post('/checkin', (req, res) => {
    const { user_id, day, content } = req.body;

    if (!user_id || !day) {
        return res.status(400).json({ success: false, message: '参数不完整' });
    }

    // 检查是否已打卡
    db.get(
        'SELECT id FROM checkin_records WHERE user_id = ? AND day = ?',
        [user_id, day],
        (err, row) => {
            if (err) {
                return res.status(500).json({ success: false, message: '查询失败' });
            }
            if (row) {
                return res.status(400).json({ success: false, message: '今天已经打卡了' });
            }

            db.run(
                'INSERT INTO checkin_records (user_id, day, content) VALUES (?, ?, ?)',
                [user_id, day, content || ''],
                function(err) {
                    if (err) {
                        return res.status(500).json({ success: false, message: '打卡失败' });
                    }

                    // 更新统计
                    db.run('UPDATE stats SET checkin_days = checkin_days + 1 WHERE id = 1');

                    res.json({
                        success: true,
                        message: '打卡成功',
                        data: { id: this.lastID, day }
                    });
                }
            );
        }
    );
});

// 排行榜
router.get('/ranking', (req, res) => {
    db.all(
        `SELECT u.id, u.name, u.school, COUNT(c.id) as days 
         FROM users u 
         LEFT JOIN checkin_records c ON u.id = c.user_id 
         GROUP BY u.id 
         ORDER BY days DESC 
         LIMIT 50`,
        (err, rows) => {
            if (err) {
                return res.status(500).json({ success: false, message: '获取排行榜失败' });
            }
            res.json({ success: true, data: rows });
        }
    );
});

module.exports = router;
