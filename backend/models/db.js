const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/health_app.db');

// 确保 data 目录存在
const fs = require('fs');
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('数据库连接失败:', err.message);
    } else {
        console.log('已连接到 SQLite 数据库');
    }
});

// 启用外键约束
db.run('PRAGMA foreign_keys = ON');

// 初始化数据库表
function initTables() {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            // 用户表
            db.run(`CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                openid TEXT UNIQUE,
                name TEXT NOT NULL,
                school TEXT NOT NULL,
                grade TEXT NOT NULL,
                phone TEXT NOT NULL,
                score INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`);

            // 题库表
            db.run(`CREATE TABLE IF NOT EXISTS questions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                question TEXT NOT NULL,
                option_a TEXT NOT NULL,
                option_b TEXT NOT NULL,
                option_c TEXT NOT NULL,
                option_d TEXT NOT NULL,
                answer INTEGER NOT NULL CHECK(answer BETWEEN 0 AND 3),
                explain TEXT,
                category TEXT DEFAULT 'general',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`);

            // 答题记录表
            db.run(`CREATE TABLE IF NOT EXISTS quiz_records (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                score INTEGER NOT NULL,
                correct_count INTEGER NOT NULL,
                total_count INTEGER NOT NULL DEFAULT 5,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )`);

            // 抽奖记录表
            db.run(`CREATE TABLE IF NOT EXISTS lottery_records (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                prize_level TEXT NOT NULL,
                prize_desc TEXT,
                status TEXT DEFAULT 'pending',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )`);

            // 作品表
            db.run(`CREATE TABLE IF NOT EXISTS works (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                title TEXT NOT NULL,
                type TEXT NOT NULL,
                author TEXT NOT NULL,
                school TEXT NOT NULL,
                class TEXT NOT NULL,
                description TEXT NOT NULL,
                file_path TEXT,
                phone TEXT NOT NULL,
                likes INTEGER DEFAULT 0,
                status TEXT DEFAULT 'pending',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )`);

            // 打卡记录表
            db.run(`CREATE TABLE IF NOT EXISTS checkin_records (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                day INTEGER NOT NULL,
                content TEXT,
                photo_path TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id),
                UNIQUE(user_id, day)
            )`);

            // 公告表
            db.run(`CREATE TABLE IF NOT EXISTS notices (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                tag TEXT DEFAULT '活动',
                is_top INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`);

            // 统计数据表
            db.run(`CREATE TABLE IF NOT EXISTS stats (
                id INTEGER PRIMARY KEY CHECK(id = 1),
                participants INTEGER DEFAULT 0,
                quiz_count INTEGER DEFAULT 0,
                works_count INTEGER DEFAULT 0,
                checkin_days INTEGER DEFAULT 0
            )`);

            // 初始化统计数据
            db.run(`INSERT OR IGNORE INTO stats (id, participants, quiz_count, works_count, checkin_days) 
                    VALUES (1, 0, 0, 0, 0)`);

            resolve();
        });
    });
}

// 插入默认题库
function initQuestions() {
    const questions = [
        ['小学生每天应该保证多少小时的睡眠？', '8小时', '9小时', '10小时', '12小时', 2, '根据《中小学生健康管理办法》，小学生每天应保证10小时睡眠。', '生活习惯'],
        ['以下哪种食物富含维生素C？', '米饭', '橙子', '猪肉', '鸡蛋', 1, '橙子、柠檬等水果富含维生素C，有助于增强免疫力。', '饮食营养'],
        ['正确的刷牙方法应该是？', '横向用力刷', '上下顺着牙缝刷', '只刷外面', '随便刷刷就行', 1, '正确的刷牙方法是上下顺着牙缝轻轻刷，每次至少2分钟。', '口腔卫生'],
        ['预防近视最有效的方法是？', '戴眼镜', '多做户外活动', '吃保健品', '看远处一分钟', 1, '每天2小时以上户外活动是最有效的预防近视方法。', '视力保护'],
        ['人体最大的器官是什么？', '心脏', '肝脏', '皮肤', '大脑', 2, '皮肤是人体最大的器官，成年人皮肤面积约1.5-2平方米。', '人体知识'],
        ['每天喝水量大约应该是多少？', '500毫升', '1000毫升', '1500毫升', '3000毫升', 2, '中小学生每天饮水量应在1500毫升左右（约8杯水）。', '饮食营养'],
        ['心理健康的表现包括？', '经常发脾气', '能正确认识自己', '不爱与人交往', '总是感到焦虑', 1, '心理健康包括能正确认识自己和他人、情绪稳定、积极乐观等。', '心理健康'],
        ['遇到同学溺水时，正确的做法是？', '跳下去救人', '大声呼救并寻找大人帮助', '假装没看见', '用竹竿去拉', 1, '中小学生遇到溺水应立即大声呼救，寻找大人帮助，切勿自行下水。', '安全知识'],
        ['预防蛀牙最好的方法是？', '不吃甜食', '早晚刷牙、使用含氟牙膏', '只喝饮料', '用牙签剔牙', 1, '预防蛀牙最有效的方法是坚持早晚刷牙、使用含氟牙膏。', '口腔卫生'],
        ['人体需要的六大营养素不包括以下哪个？', '蛋白质', '维生素', '色素', '矿物质', 2, '人体需要的六大营养素是：蛋白质、脂肪、碳水化合物、维生素、矿物质和水。', '饮食营养'],
        ['关于用眼卫生，以下哪个说法是错误的？', '看书时光线要充足', '连续看书不超过40分钟', '在黑暗中看手机不影响视力', '多做眼保健操', 2, '在黑暗中看手机会加重眼睛疲劳，容易导致视力下降。', '视力保护'],
        ['以下哪种运动最适合增强心肺功能？', '下棋', '跑步', '打牌', '画画', 1, '跑步、游泳等有氧运动能有效增强心肺功能。', '运动健康'],
        ['食品安全中，以下哪种做法是正确的？', '吃过期食品', '饭前洗手', '喝生水', '买路边摊三无食品', 1, '饭前便后洗手是基本的食品安全和卫生习惯。', '食品安全'],
        ['正确的坐姿应该是？', '趴在桌上', '身体正直、眼睛与书本一尺远', '歪着身子', '把脚放在椅子上', 1, '正确坐姿：身体坐直，眼睛距书本约一尺，胸口离桌沿一拳。', '生活习惯'],
        ['以下哪种情况需要立即就医？', '轻微擦伤', '持续高烧不退', '偶尔打喷嚏', '运动后出汗', 1, '持续高烧不退（超过38.5°C且24小时不退）需要立即就医。', '健康常识'],
        ['关于垃圾分类，以下哪个是正确的？', '所有垃圾放一个袋子', '电池属于有害垃圾', '果皮属于其他垃圾', '塑料瓶属于有害垃圾', 1, '废电池、废灯管等属于有害垃圾，需要专门回收处理。', '环保知识'],
        ['青春期身体变化是正常的，以下哪种态度是正确的？', '感到害怕和羞耻', '拒绝接受变化', '正确认识和接受', '不告诉任何人', 2, '青春期身体变化是正常的生长发育过程，应该正确认识和接受。', '心理健康'],
        ['以下哪种行为不利于保护听力？', '戴耳机听很大声的音乐', '远离噪音环境', '定期检查听力', '保持耳道清洁', 0, '长时间戴耳机且音量过大会损伤听觉神经，导致听力下降。', '听力保护'],
        ['饭前应该做多长时间的运动比较好？', '剧烈运动1小时', '不运动最好', '轻度运动30分钟', '跑步2小时', 2, '饭前30分钟做轻度运动有助于促进食欲和消化。', '运动健康'],
        ['以下哪个是传染病的传播途径？', '空气传播', '血液传播', '食物传播', '以上都是', 3, '传染病传播途径包括空气、飞沫、接触、血液、食物和水传播等。', '疾病预防']
    ];

    return new Promise((resolve, reject) => {
        db.get('SELECT COUNT(*) as count FROM questions', (err, row) => {
            if (err) return reject(err);
            if (row.count > 0) return resolve();

            const stmt = db.prepare(`INSERT INTO questions 
                (question, option_a, option_b, option_c, option_d, answer, explain, category) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);

            questions.forEach(q => stmt.run(q));
            stmt.finalize();
            console.log(`已插入 ${questions.length} 道默认题目`);
            resolve();
        });
    });
}

// 插入默认公告
function initNotices() {
    return new Promise((resolve, reject) => {
        db.get('SELECT COUNT(*) as count FROM notices', (err, row) => {
            if (err) return reject(err);
            if (row.count > 0) return resolve();

            const notices = [
                ['2026年中山市中小学生健康知识竞赛开始啦！', '欢迎全市中小学生积极参与健康知识答题活动，答对题目即可参与抽奖！', '热门', 1],
                ['"健康生活，从我做起"主题作品征集活动火热进行中', '征集绘画、手抄报、征文、摄影、短视频等作品，展示你的健康实践！', '最新', 1],
                ['21天健康习惯挑战赛第三季正式开启', '每天完成一个健康小任务，连续打卡21天，养成终身受益的好习惯！', '活动', 0]
            ];

            const stmt = db.prepare('INSERT INTO notices (title, content, tag, is_top) VALUES (?, ?, ?, ?)');
            notices.forEach(n => stmt.run(n));
            stmt.finalize();
            console.log(`已插入 ${notices.length} 条默认公告`);
            resolve();
        });
    });
}

module.exports = {
    db,
    initTables,
    initQuestions,
    initNotices
};
