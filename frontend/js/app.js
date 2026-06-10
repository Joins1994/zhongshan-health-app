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
    adminAuthenticated: false, // 管理后台是否已验证密码
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

    // 添加管理后台入口按钮（保留浮动按钮作为辅助入口）
    const adminBtn = document.createElement('button');
    adminBtn.className = 'admin-entry admin-entry-enhanced';
    adminBtn.innerHTML = '<i class="fas fa-cog"></i><span>管理后台</span>';
    adminBtn.title = '管理后台';
    adminBtn.addEventListener('click', () => {
        AdminAccess.requestAccess();
    });
    document.body.appendChild(adminBtn);

    // 初始化用户认证模块
    AuthModule.init();
    // 初始化管理后台访问控制
    AdminAccess.init();

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

// ============================================
// 用户认证模块
// ============================================
const AuthModule = {
    init() {
        // 恢复登录状态
        this.restoreSession();

        // 登录/注册按钮触发
        const loginTrigger = document.getElementById('btn-login-trigger');
        if (loginTrigger) {
            loginTrigger.addEventListener('click', () => {
                this.showAuthModal();
            });
        }

        // 退出按钮
        const logoutBtn = document.getElementById('btn-logout');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.logout();
            });
        }

        // 关闭模态框
        const closeBtn = document.getElementById('modal-auth-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hideAuthModal();
            });
        }

        // 点击遮罩关闭
        const modal = document.getElementById('modal-auth');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.hideAuthModal();
            });
        }

        // 登录/注册Tab切换
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const target = tab.dataset.authTab;
                document.getElementById('form-login').style.display = target === 'login' ? 'block' : 'none';
                document.getElementById('form-register').style.display = target === 'register' ? 'block' : 'none';
            });
        });

        // 登录表单提交
        const loginForm = document.getElementById('form-login');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // 注册表单提交
        const registerForm = document.getElementById('form-register');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister();
            });
        }
    },

    showAuthModal() {
        const modal = document.getElementById('modal-auth');
        if (modal) modal.style.display = 'flex';
    },

    hideAuthModal() {
        const modal = document.getElementById('modal-auth');
        if (modal) modal.style.display = 'none';
        // 重置表单
        const loginForm = document.getElementById('form-login');
        const registerForm = document.getElementById('form-register');
        if (loginForm) loginForm.reset();
        if (registerForm) registerForm.reset();
    },

    async handleLogin() {
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value;

        if (!username || !password) {
            Utils.showToast('请输入用户名和密码');
            return;
        }

        try {
            const res = await API.post('/api/auth/login', { username, password });
            if (res.success) {
                AppState.user = res.data;
                localStorage.setItem('health_app_user', JSON.stringify(res.data));
                this.updateUI();
                this.hideAuthModal();
                Utils.showToast('登录成功');
            } else {
                Utils.showToast(res.message || '登录失败，请检查用户名和密码');
            }
        } catch (e) {
            console.error('登录失败:', e);
            // 离线模式：使用本地存储验证
            this.offlineLogin(username, password);
        }
    },

    offlineLogin(username, password) {
        const users = JSON.parse(localStorage.getItem('health_app_users') || '[]');
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            AppState.user = { username: user.username, id: user.id };
            localStorage.setItem('health_app_user', JSON.stringify(AppState.user));
            this.updateUI();
            this.hideAuthModal();
            Utils.showToast('登录成功');
        } else {
            Utils.showToast('用户名或密码错误');
        }
    },

    async handleRegister() {
        const username = document.getElementById('register-username').value.trim();
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-password-confirm').value;

        if (!username || !password) {
            Utils.showToast('请填写完整信息');
            return;
        }

        if (password.length < 6) {
            Utils.showToast('密码至少6位');
            return;
        }

        if (password !== confirmPassword) {
            Utils.showToast('两次密码输入不一致');
            return;
        }

        try {
            const res = await API.post('/api/auth/register', { username, password });
            if (res.success) {
                Utils.showToast('注册成功，请登录');
                // 切换到登录Tab
                document.querySelector('.auth-tab[data-auth-tab="login"]').click();
                document.getElementById('register-username').value = '';
                document.getElementById('register-password').value = '';
                document.getElementById('register-password-confirm').value = '';
            } else {
                Utils.showToast(res.message || '注册失败');
            }
        } catch (e) {
            console.error('注册失败:', e);
            // 离线模式：本地存储
            this.offlineRegister(username, password);
        }
    },

    offlineRegister(username, password) {
        const users = JSON.parse(localStorage.getItem('health_app_users') || '[]');
        if (users.find(u => u.username === username)) {
            Utils.showToast('用户名已存在');
            return;
        }
        users.push({
            id: Date.now(),
            username,
            password,
            created_at: new Date().toISOString()
        });
        localStorage.setItem('health_app_users', JSON.stringify(users));
        Utils.showToast('注册成功，请登录');
        document.querySelector('.auth-tab[data-auth-tab="login"]').click();
    },

    logout() {
        AppState.user = null;
        localStorage.removeItem('health_app_user');
        this.updateUI();
        Utils.showToast('已退出登录');
    },

    restoreSession() {
        try {
            const saved = localStorage.getItem('health_app_user');
            if (saved) {
                AppState.user = JSON.parse(saved);
                this.updateUI();
            }
        } catch (e) {
            localStorage.removeItem('health_app_user');
        }
    },

    updateUI() {
        const authBtn = document.getElementById('header-auth');
        const userInfo = document.getElementById('header-user-info');
        const displayUsername = document.getElementById('display-username');

        if (AppState.user) {
            if (authBtn) authBtn.style.display = 'none';
            if (userInfo) userInfo.style.display = 'flex';
            if (displayUsername) displayUsername.textContent = AppState.user.username;
        } else {
            if (authBtn) authBtn.style.display = 'block';
            if (userInfo) userInfo.style.display = 'none';
        }
    }
};

// ============================================
// 管理后台访问控制
// ============================================
const AdminAccess = {
    ADMIN_PASSWORD: 'admin123',

    init() {
        // 底部导航"管理"按钮
        const navAdmin = document.getElementById('nav-admin');
        if (navAdmin) {
            navAdmin.addEventListener('click', (e) => {
                e.preventDefault();
                this.requestAccess();
            });
        }

        // 密码弹窗取消按钮
        const cancelBtn = document.getElementById('btn-admin-cancel');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.hidePasswordModal();
            });
        }

        // 密码弹窗表单提交
        const passwordForm = document.getElementById('form-admin-password');
        if (passwordForm) {
            passwordForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.verifyPassword();
            });
        }

        // 点击遮罩关闭
        const modal = document.getElementById('modal-admin-password');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.hidePasswordModal();
            });
        }
    },

    requestAccess() {
        if (AppState.adminAuthenticated) {
            Router.navigate('admin');
            return;
        }
        this.showPasswordModal();
    },

    showPasswordModal() {
        const modal = document.getElementById('modal-admin-password');
        if (modal) {
            modal.style.display = 'flex';
            const input = document.getElementById('admin-password-input');
            if (input) {
                input.value = '';
                setTimeout(() => input.focus(), 100);
            }
        }
    },

    hidePasswordModal() {
        const modal = document.getElementById('modal-admin-password');
        if (modal) modal.style.display = 'none';
        const input = document.getElementById('admin-password-input');
        if (input) input.value = '';
    },

    verifyPassword() {
        const input = document.getElementById('admin-password-input');
        const password = input ? input.value : '';

        if (password === this.ADMIN_PASSWORD) {
            AppState.adminAuthenticated = true;
            this.hidePasswordModal();
            Router.navigate('admin');
            Utils.showToast('验证成功');
        } else {
            Utils.showToast('密码错误');
            if (input) {
                input.value = '';
                input.focus();
            }
        }
    }
};
