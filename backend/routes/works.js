const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { db } = require('../models/db');

// 文件上传配置
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads/works'));
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'video/mp4'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('只支持 JPG、PNG、MP4 格式'));
        }
    }
});

// 确保上传目录存在
const fs = require('fs');
const uploadDir = path.join(__dirname, '../uploads/works');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// 获取所有作品（支持筛选）
router.get('/', (req, res) => {
    const { type, status = 'approved' } = req.query;
    let sql = 'SELECT * FROM works WHERE status = ?';
    const params = [status];

    if (type && type !== 'all') {
        sql += ' AND type = ?';
        params.push(type);
    }

    sql += ' ORDER BY created_at DESC';

    db.all(sql, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ success: false, message: '获取作品失败' });
        }
        res.json({ success: true, data: rows });
    });
});

// 提交作品
router.post('/', upload.single('file'), (req, res) => {
    const { user_id, title, type, author, school, class: className, description, phone } = req.body;

    if (!title || !type || !author || !school || !className || !description || !phone) {
        return res.status(400).json({ success: false, message: '请填写完整信息' });
    }

    const filePath = req.file ? `/uploads/works/${req.file.filename}` : null;

    db.run(
        `INSERT INTO works (user_id, title, type, author, school, class, description, file_path, phone, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
        [user_id || null, title, type, author, school, className, description, filePath, phone],
        function(err) {
            if (err) {
                return res.status(500).json({ success: false, message: '提交作品失败' });
            }

            // 更新统计
            db.run('UPDATE stats SET works_count = works_count + 1 WHERE id = 1');

            res.json({
                success: true,
                message: '作品提交成功，等待审核',
                data: { id: this.lastID }
            });
        }
    );
});

// 点赞作品
router.post('/:id/like', (req, res) => {
    const workId = req.params.id;

    db.run('UPDATE works SET likes = likes + 1 WHERE id = ?', [workId], function(err) {
        if (err) {
            return res.status(500).json({ success: false, message: '点赞失败' });
        }
        res.json({ success: true, message: '点赞成功' });
    });
});

// 获取获奖作品
router.get('/winners', (req, res) => {
    db.all(
        `SELECT * FROM works WHERE status = 'winner' ORDER BY 
         CASE prize_level 
            WHEN '一等奖' THEN 1 
            WHEN '二等奖' THEN 2 
            WHEN '三等奖' THEN 3 
            WHEN '优秀奖' THEN 4 
            ELSE 5 
         END`,
        (err, rows) => {
            if (err) {
                return res.status(500).json({ success: false, message: '获取获奖名单失败' });
            }
            res.json({ success: true, data: rows });
        }
    );
});

module.exports = router;
