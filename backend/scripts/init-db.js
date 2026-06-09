const { initTables, initQuestions, initNotices } = require('../models/db');

async function init() {
    try {
        console.log('开始初始化数据库...');
        await initTables();
        await initQuestions();
        await initNotices();
        console.log('数据库初始化完成！');
        process.exit(0);
    } catch (err) {
        console.error('数据库初始化失败:', err);
        process.exit(1);
    }
}

init();
