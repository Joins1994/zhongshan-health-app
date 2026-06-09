/**
 * 中山市中小学生健康宣传互动平台 - 主应用逻辑
 * 包含：路由管理、工具函数、数据存储、页面初始化
 */

// ============================================
// 全局状态管理
// ============================================
const AppState = {
    currentPage: 'home',
    user: {
        name: '',
        school: '',
        grade: '',
        phone: '',
        score: 0,
        quizTodayCount: 0,
        quizLastDate: ''
    },
    challenge: {
        startDate: null,
        completedDays: [],
        streak: 0,
        badges: [],
        checkinRecords: {}
    }
};

// ============================================
// 工具函数
// ============================================
const Utils = {
    // 显示Toast提示
    showToast(message, duration = 2000) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), duration);
    },

    // 保存数据到localStorage
    save(key, data) {
        try {
            localStorage.setItem('zhsh_health_' + key, JSON.stringify(data));
        } catch (e) {
            console.warn('存储失败:', e);
        }
    },

    // 从localStorage读取数据
    load(key, defaultValue = null) {
        try {
            const data = localStorage.getItem('zhsh_health_' + key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (e) {
            return defaultValue;
        }
    },

    // 获取今天的日期字符串
    getToday() {
        return new Date().toISOString().split('T')[0];
    },

    // 格式化日期
    formatDate(dateStr) {
        const d = new Date(dateStr);
        return `${d.getMonth() + 1}月${d.getDate()}日`;
    },

    // 数字动画
    animateNumber(element, target, duration = 1000) {
        const start = parseInt(element.textContent) || 0;
        const increment = (target - start) / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= target) || (increment < 0 && current <= target)) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    },

    // 随机整数
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // 防抖
    debounce(fn, delay = 300) {
        let timer;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), delay);
        };
    },

    // 手机号验证
    isValidPhone(phone) {
        return /^1[3-9]\d{9}$/.test(phone);
    }
};

// ============================================
// 路由管理
// ============================================
const Router = {
    init() {
        // 底部导航点击
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.dataset.page;
                this.navigate(page);
            });
        });

        // 返回按钮
        document.querySelectorAll('.btn-back').forEach(btn => {
            btn.addEventListener('click', () => {
                const page = btn.dataset.page;
                this.navigate(page);
            });
        });

        // 功能卡片点击
        document.querySelectorAll('.feature-card').forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                const page = card.dataset.page;
                this.navigate(page);
            });
        });

        // 处理hash变化
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.slice(1) || 'home';
            this.navigate(hash, false);
        });

        // 初始路由
        const hash = window.location.hash.slice(1) || 'home';
        this.navigate(hash, false);
    },

    navigate(page, updateHash = true) {
        if (!page) page = 'home';

        // 隐藏所有页面
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

        // 显示目标页面
        const targetPage = document.getElementById('page-' + page);
        if (targetPage) {
            targetPage.classList.add('active');
            AppState.currentPage = page;

            // 更新底部导航状态
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.toggle('active', item.dataset.page === page);
            });

            // 更新hash
            if (updateHash) {
                window.location.hash = page;
            }

            // 滚动到顶部
            window.scrollTo(0, 0);

            // 触发页面进入事件
            this.emit('pageEnter', page);
        }
    },

    // 简单事件系统
    _events: {},
    on(event, callback) {
        if (!this._events[event]) this._events[event] = [];
        this._events[event].push(callback);
    },
    emit(event, ...args) {
        if (this._events[event]) {
            this._events[event].forEach(cb => cb(...args));
        }
    }
};

// ============================================
// Tab切换管理
// ============================================
const TabManager = {
    init() {
        document.querySelectorAll('.tab-nav').forEach(nav => {
            nav.querySelectorAll('.tab-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const tabId = btn.dataset.tab;
                    this.switchTab(nav, tabId, btn);
                });
            });
        });
    },

    switchTab(nav, tabId, activeBtn) {
        // 切换按钮状态
        nav.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        activeBtn.classList.add('active');

        // 切换内容 - 在当前页面内查找所有 tab-content
        const currentPage = nav.closest('.page');
        if (currentPage) {
            currentPage.querySelectorAll('.tab-content').forEach(tc => {
                tc.classList.remove('active');
                tc.style.display = 'none';
            });
        }
        const target = document.getElementById(tabId);
        if (target) {
            target.classList.add('active');
            target.style.display = 'block';
        }
    }
};

// ============================================
// 数据管理
// ============================================
const DataManager = {
    // 初始化模拟数据
    initMockData() {
        // 如果没有存储过统计数据，初始化模拟数据
        if (!Utils.load('stats')) {
            Utils.save('stats', {
                participants: Utils.randomInt(1200, 1800),
                quizCount: Utils.randomInt(3500, 5000),
                worksCount: Utils.randomInt(200, 400),
                checkinDays: Utils.randomInt(800, 1500)
            });
        }

        // 初始化用户数据
        const userData = Utils.load('user');
        if (userData) {
            Object.assign(AppState.user, userData);
        }

        // 初始化打卡数据
        const challengeData = Utils.load('challenge');
        if (challengeData) {
            Object.assign(AppState.challenge, challengeData);
        }

        // 更新今日答题次数
        const today = Utils.getToday();
        if (AppState.user.quizLastDate !== today) {
            AppState.user.quizTodayCount = 0;
            AppState.user.quizLastDate = today;
            this.saveUser();
        }
    },

    // 保存用户数据
    saveUser() {
        Utils.save('user', AppState.user);
    },

    // 保存打卡数据
    saveChallenge() {
        Utils.save('challenge', AppState.challenge);
    },

    // 更新统计数据
    updateStats(key, increment = 1) {
        const stats = Utils.load('stats', {
            participants: 0, quizCount: 0, worksCount: 0, checkinDays: 0
        });
        stats[key] = (stats[key] || 0) + increment;
        Utils.save('stats', stats);
    },

    // 获取统计数据
    getStats() {
        return Utils.load('stats', {
            participants: 0, quizCount: 0, worksCount: 0, checkinDays: 0
        });
    }
};

// ============================================
// 首页管理
// ============================================
const HomePage = {
    init() {
        this.updateStats();
        this.updateDailyTip();
    },

    updateStats() {
        const stats = DataManager.getStats();

        // 数字动画效果
        setTimeout(() => {
            Utils.animateNumber(document.getElementById('stat-participants'), stats.participants);
            Utils.animateNumber(document.getElementById('stat-quiz'), stats.quizCount);
            Utils.animateNumber(document.getElementById('stat-works'), stats.worksCount);
            Utils.animateNumber(document.getElementById('stat-checkins'), stats.checkinDays);
        }, 300);
    },

    updateDailyTip() {
        const tips = [
            { icon: '🍎', text: '每天吃水果，补充维生素，让身体更健康！' },
            { icon: '💧', text: '每天保证8杯水，有助于身体代谢和皮肤健康！' },
            { icon: '🏃', text: '每天运动30分钟，增强体质，提高免疫力！' },
            { icon: '😴', text: '小学生每天保证10小时睡眠，初中生9小时！' },
            { icon: '🦷', text: '早晚刷牙各2分钟，保护牙齿从现在做起！' },
            { icon: '🥦', text: '多吃蔬菜少吃糖，均衡饮食身体棒！' },
            { icon: '👀', text: '看书学习注意用眼卫生，每隔40分钟休息一下！' },
            { icon: '😊', text: '保持好心情，遇到困难多和家人朋友沟通！' },
            { icon: '🧼', text: '勤洗手、勤洗澡，养成良好卫生习惯！' },
            { icon: '☀️', text: '适当晒太阳，促进钙吸收，骨骼更强壮！' },
            { icon: '🚴', text: '骑车或步行上学，绿色出行又健康！' },
            { icon: '🎵', text: '课间休息多活动，放松身心更高效！' },
            { icon: '🥛', text: '每天一杯牛奶，补充钙质助力成长！' },
            { icon: '🌿', text: '多接触大自然，呼吸新鲜空气！' }
        ];

        // 根据日期选择每日贴士
        const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
        const tip = tips[dayOfYear % tips.length];

        const tipCard = document.getElementById('daily-tip');
        tipCard.querySelector('.tip-icon').innerHTML = `<i class="fas fa-seedling"></i>`;
        tipCard.querySelector('p').textContent = tip.text;
    }
};

// ============================================
// 应用初始化
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // 初始化数据
    DataManager.initMockData();

    // 初始化路由
    Router.init();

    // 初始化Tab
    TabManager.init();

    // 初始化首页
    HomePage.init();

    // 初始化答题模块
    if (typeof QuizModule !== 'undefined') {
        QuizModule.init();
    }

    // 初始化作品模块
    if (typeof WorksModule !== 'undefined') {
        WorksModule.init();
    }

    // 初始化打卡模块
    if (typeof ChallengeModule !== 'undefined') {
        ChallengeModule.init();
    }

    // 页面进入事件监听
    Router.on('pageEnter', (page) => {
        switch (page) {
            case 'home':
                HomePage.updateStats();
                break;
            case 'quiz':
                if (typeof QuizModule !== 'undefined') QuizModule.onPageEnter();
                break;
            case 'works':
                if (typeof WorksModule !== 'undefined') WorksModule.onPageEnter();
                break;
            case 'challenge':
                if (typeof ChallengeModule !== 'undefined') ChallengeModule.onPageEnter();
                break;
        }
    });
});
