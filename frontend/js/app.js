/**
 * 中山市中小学生健康宣传互动平台 - 主应用逻辑
 * 包含：路由管理、工具函数、API对接、页面初始化
 */

// ============================================
// API 客户端
// ============================================
const API_BASE = '';

const API = {
    async get(url) {
        const res = await fetch(API_BASE + url);
        return res.json();
    },

    async post(url, data) {
        const res = await fetch(API_BASE + url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res.json();
    },

    async postForm(url, formData) {
        const res = await fetch(API_BASE + url, {
            method: 'POST',
            body: formData
        });
        return res.json();
    }
};

// ============================================
// 全局状态管理
// ============================================
const AppState = {
    currentPage: 'home',
    user: null, // 从后端获取
    challenge: {
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
    showToast(message, duration = 2000) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), duration);
    },

    getToday() {
        return new Date().toISOString().split('T')[0];
    },

    formatDate(dateStr) {
        const d = new Date(dateStr);
        return `${d.getMonth() + 1}月${d.getDate()}日`;
    },

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

    isValidPhone(phone) {
        return /^1[3-9]\d{9}$/.test(phone);
    }
};

// ============================================
// 路由管理
// ============================================
const Router = {
    init() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.dataset.page;
                this.navigate(page);
            });
        });

        document.querySelectorAll('.btn-back').forEach(btn => {
            btn.addEventListener('click', () => {
                const page = btn.dataset.page;
                this.navigate(page);
            });
        });

        document.querySelectorAll('.feature-card').forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                const page = card.dataset.page;
                this.navigate(page);
            });
        });

        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.slice(1) || 'home';
            this.navigate(hash, false);
        });

        const hash = window.location.hash.slice(1) || 'home';
        this.navigate(hash, false);
    },

    navigate(page, updateHash = true) {
        if (!page) page = 'home';

        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

        const targetPage = document.getElementById('page-' + page);
        if (targetPage) {
            targetPage.classList.add('active');
            AppState.currentPage = page;

            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.toggle('active', item.dataset.page === page);
            });

            if (updateHash) {
                window.location.hash = page;
            }

            window.scrollTo(0, 0);
            this.emit('pageEnter', page);
        }
    },

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
        nav.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        activeBtn.classList.add('active');

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
// 首页管理
// ============================================
const HomePage = {
    async init() {
        await this.updateStats();
        this.updateDailyTip();
    },

    async updateStats() {
        try {
            const res = await API.get('/api/stats');
            if (res.success) {
                const stats = res.data;
                setTimeout(() => {
                    Utils.animateNumber(document.getElementById('stat-participants'), stats.participants || 0);
                    Utils.animateNumber(document.getElementById('stat-quiz'), stats.quiz_count || 0);
                    Utils.animateNumber(document.getElementById('stat-works'), stats.works_count || 0);
                    Utils.animateNumber(document.getElementById('stat-checkins'), stats.checkin_days || 0);
                }, 300);
            }
        } catch (e) {
            console.error('获取统计失败:', e);
        }
    },

    async updateNotices() {
        try {
            const res = await API.get('/api/stats/notices');
            if (res.success && res.data.length > 0) {
                const noticeList = document.getElementById('notice-list');
                noticeList.innerHTML = res.data.map(n => `
                    <div class="notice-item">
                        <div class="notice-tag ${n.is_top ? 'hot' : ''}">${n.tag}</div>
                        <div class="notice-content">
                            <p>${n.title}</p>
                            <span class="notice-date">${Utils.formatDate(n.created_at)}</span>
                        </div>
                    </div>
                `).join('');
            }
        } catch (e) {
            console.error('获取公告失败:', e);
        }
    },

    updateDailyTip() {
        const tips = [
            { text: '每天吃水果，补充维生素，让身体更健康！' },
            { text: '每天保证8杯水，有助于身体代谢和皮肤健康！' },
            { text: '每天运动30分钟，增强体质，提高免疫力！' },
            { text: '小学生每天保证10小时睡眠，初中生9小时！' },
            { text: '早晚刷牙各2分钟，保护牙齿从现在做起！' },
            { text: '多吃蔬菜少吃糖，均衡饮食身体棒！' },
            { text: '看书学习注意用眼卫生，每隔40分钟休息一下！' },
            { text: '保持好心情，遇到困难多和家人朋友沟通！' },
            { text: '勤洗手、勤洗澡，养成良好卫生习惯！' },
            { text: '适当晒太阳，促进钙吸收，骨骼更强壮！' },
            { text: '骑车或步行上学，绿色出行又健康！' },
            { text: '课间休息多活动，放松身心更高效！' },
            { text: '每天一杯牛奶，补充钙质助力成长！' },
            { text: '多接触大自然，呼吸新鲜空气！' }
        ];

        const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
        const tip = tips[dayOfYear % tips.length];

        const tipCard = document.getElementById('daily-tip');
        tipCard.querySelector('p').textContent = tip.text;
    }
};

// ============================================
// 应用初始化
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    Router.init();
    TabManager.init();
    HomePage.init();

    if (typeof QuizModule !== 'undefined') QuizModule.init();
    if (typeof WorksModule !== 'undefined') WorksModule.init();
    if (typeof ChallengeModule !== 'undefined') ChallengeModule.init();
    if (typeof AdminModule !== 'undefined') AdminModule.init();

    // 添加管理后台入口按钮
    const adminBtn = document.createElement('button');
    adminBtn.className = 'admin-entry';
    adminBtn.innerHTML = '<i class="fas fa-cog"></i>';
    adminBtn.title = '管理后台';
    adminBtn.addEventListener('click', () => {
        Router.navigate('admin');
    });
    document.body.appendChild(adminBtn);

    Router.on('pageEnter', (page) => {
        // 管理后台按钮显示/隐藏
        if (adminBtn) {
            adminBtn.style.display = page === 'admin' ? 'none' : 'flex';
        }

        switch (page) {
            case 'home':
                HomePage.updateStats();
                HomePage.updateNotices();
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
            case 'admin':
                if (typeof AdminModule !== 'undefined') AdminModule.onPageEnter();
                break;
        }
    });
});
