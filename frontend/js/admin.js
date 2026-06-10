/**
 * 中山市中小学生健康宣传互动平台 - 管理后台模块
 * 功能：用户管理、作品审核、答题记录、抽奖记录、公告发布
 */

// ============================================
// 管理后台模块
// ============================================
const AdminModule = {
    currentTab: 'admin-users',
    currentWorkFilter: 'pending',

    init() {
        this.bindEvents();
        this.bindTabEvents();
    },

    bindEvents() {
        // 作品审核筛选按钮
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentWorkFilter = btn.dataset.status;
                this.loadWorks();
            });
        });

        // 公告发布表单
        const noticeForm = document.getElementById('admin-notice-form');
        if (noticeForm) {
            noticeForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.publishNotice();
            });
        }
    },

    bindTabEvents() {
        // 监听管理后台Tab切换
        const adminTabNav = document.querySelector('#page-admin .tab-nav');
        if (adminTabNav) {
            adminTabNav.querySelectorAll('.tab-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const tabId = btn.dataset.tab;
                    this.onTabChange(tabId);
                });
            });
        }
    },

    onTabChange(tabId) {
        this.currentTab = tabId;
        switch (tabId) {
            case 'admin-users':
                this.loadUsers();
                break;
            case 'admin-works':
                this.loadWorks();
                break;
            case 'admin-quiz':
                this.loadQuizRecords();
                break;
            case 'admin-lottery':
                this.loadLotteryRecords();
                break;
            case 'admin-notice':
                // 公告发布页面不需要加载数据
                break;
        }
    },

    // 加载用户列表
    async loadUsers() {
        try {
            const res = await API.get('/api/admin/users');
            if (res.success) {
                this.renderUsers(res.data);
            } else {
                Utils.showToast('获取用户列表失败');
            }
        } catch (e) {
            console.error('加载用户失败:', e);
            Utils.showToast('获取用户列表失败');
        }
    },

    renderUsers(users) {
        const tbody = document.querySelector('#admin-users-table tbody');
        if (!tbody) return;

        if (users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="empty-cell">暂无用户数据</td></tr>';
            return;
        }

        tbody.innerHTML = users.map(user => `
            <tr>
                <td>${user.id}</td>
                <td>${user.name || '-'}</td>
                <td>${user.school || '-'}</td>
                <td>${user.grade || '-'}</td>
                <td>${user.score || 0}</td>
                <td>${user.created_at ? Utils.formatDate(user.created_at) : '-'}</td>
            </tr>
        `).join('');
    },

    // 加载作品列表
    async loadWorks() {
        try {
            const res = await API.get(`/api/admin/works?status=${this.currentWorkFilter}`);
            if (res.success) {
                this.renderWorks(res.data);
            } else {
                Utils.showToast('获取作品列表失败');
            }
        } catch (e) {
            console.error('加载作品失败:', e);
            Utils.showToast('获取作品列表失败');
        }
    },

    renderWorks(works) {
        const container = document.getElementById('admin-works-list');
        if (!container) return;

        if (works.length === 0) {
            container.innerHTML = '<div class="admin-empty"><i class="fas fa-inbox"></i><p>暂无作品</p></div>';
            return;
        }

        container.innerHTML = works.map(work => `
            <div class="admin-work-item" data-id="${work.id}">
                <div class="work-preview">
                    ${work.file_type === 'image' 
                        ? `<img src="${work.file_path}" alt="${work.title}">`
                        : `<div class="file-icon"><i class="fas fa-file-video"></i></div>`
                    }
                </div>
                <div class="work-info">
                    <h4>${work.title}</h4>
                    <p class="work-author">${work.author_name} · ${work.school}</p>
                    <p class="work-grade">${work.grade}</p>
                    <p class="work-desc">${work.description || '暂无描述'}</p>
                    <span class="work-status status-${work.status}">${this.getStatusText(work.status)}</span>
                </div>
                ${work.status === 'pending' ? `
                    <div class="work-actions">
                        <button class="btn-approve" onclick="AdminModule.approveWork(${work.id}, 'approved')">
                            <i class="fas fa-check"></i> 通过
                        </button>
                        <button class="btn-reject" onclick="AdminModule.approveWork(${work.id}, 'rejected')">
                            <i class="fas fa-times"></i> 拒绝
                        </button>
                    </div>
                ` : work.status === 'approved' ? `
                    <div class="work-actions">
                        <select class="prize-select" onchange="AdminModule.setPrize(${work.id}, this.value)">
                            <option value="">设置奖项</option>
                            <option value="一等奖" ${work.prize_level === '一等奖' ? 'selected' : ''}>一等奖</option>
                            <option value="二等奖" ${work.prize_level === '二等奖' ? 'selected' : ''}>二等奖</option>
                            <option value="三等奖" ${work.prize_level === '三等奖' ? 'selected' : ''}>三等奖</option>
                            <option value="优秀奖" ${work.prize_level === '优秀奖' ? 'selected' : ''}>优秀奖</option>
                        </select>
                    </div>
                ` : ''}
            </div>
        `).join('');
    },

    getStatusText(status) {
        const map = {
            'pending': '待审核',
            'approved': '已通过',
            'rejected': '已拒绝'
        };
        return map[status] || status;
    },

    // 审核作品
    async approveWork(workId, status) {
        try {
            const res = await API.post(`/api/admin/works/${workId}/approve`, { status });
            if (res.success) {
                Utils.showToast(status === 'approved' ? '已通过审核' : '已拒绝');
                this.loadWorks();
            } else {
                Utils.showToast('操作失败');
            }
        } catch (e) {
            console.error('审核失败:', e);
            Utils.showToast('操作失败');
        }
    },

    // 设置奖项
    async setPrize(workId, prizeLevel) {
        if (!prizeLevel) return;
        try {
            const res = await API.post(`/api/admin/works/${workId}/approve`, {
                status: 'approved',
                prize_level: prizeLevel
            });
            if (res.success) {
                Utils.showToast('奖项设置成功');
            } else {
                Utils.showToast('设置失败');
            }
        } catch (e) {
            console.error('设置奖项失败:', e);
            Utils.showToast('设置失败');
        }
    },

    // 加载答题记录
    async loadQuizRecords() {
        try {
            const res = await API.get('/api/admin/quiz-records');
            if (res.success) {
                this.renderQuizRecords(res.data);
            } else {
                Utils.showToast('获取答题记录失败');
            }
        } catch (e) {
            console.error('加载答题记录失败:', e);
            Utils.showToast('获取答题记录失败');
        }
    },

    renderQuizRecords(records) {
        const tbody = document.querySelector('#admin-quiz-table tbody');
        if (!tbody) return;

        if (records.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="empty-cell">暂无答题记录</td></tr>';
            return;
        }

        tbody.innerHTML = records.map(record => `
            <tr>
                <td>${record.name || '-'}</td>
                <td>${record.school || '-'}</td>
                <td>${record.score}分</td>
                <td>${record.correct_count}/5</td>
                <td>${record.created_at ? new Date(record.created_at).toLocaleString() : '-'}</td>
            </tr>
        `).join('');
    },

    // 加载抽奖记录
    async loadLotteryRecords() {
        try {
            const res = await API.get('/api/admin/lottery-records');
            if (res.success) {
                this.renderLotteryRecords(res.data);
            } else {
                Utils.showToast('获取抽奖记录失败');
            }
        } catch (e) {
            console.error('加载抽奖记录失败:', e);
            Utils.showToast('获取抽奖记录失败');
        }
    },

    renderLotteryRecords(records) {
        const tbody = document.querySelector('#admin-lottery-table tbody');
        if (!tbody) return;

        if (records.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="empty-cell">暂无抽奖记录</td></tr>';
            return;
        }

        tbody.innerHTML = records.map(record => `
            <tr>
                <td>${record.name || '-'}</td>
                <td>${record.school || '-'}</td>
                <td>${record.prize}</td>
                <td><span class="lottery-status status-${record.status}">${record.status === 'claimed' ? '已领取' : '未领取'}</span></td>
                <td>${record.created_at ? new Date(record.created_at).toLocaleString() : '-'}</td>
            </tr>
        `).join('');
    },

    // 发布公告
    async publishNotice() {
        const title = document.getElementById('notice-title').value.trim();
        const content = document.getElementById('notice-content').value.trim();
        const tag = document.getElementById('notice-tag').value;

        if (!title || !content) {
            Utils.showToast('请填写标题和内容');
            return;
        }

        try {
            const res = await API.post('/api/admin/notices', { title, content, tag });
            if (res.success) {
                Utils.showToast('公告发布成功');
                document.getElementById('admin-notice-form').reset();
            } else {
                Utils.showToast(res.message || '发布失败');
            }
        } catch (e) {
            console.error('发布公告失败:', e);
            Utils.showToast('发布失败');
        }
    },

    // 页面进入时调用
    onPageEnter() {
        this.onTabChange(this.currentTab);
    }
};

// 监听路由事件，当进入管理后台页面时加载数据
Router.on('pageEnter', (page) => {
    if (page === 'admin' && typeof AdminModule !== 'undefined') {
        AdminModule.onPageEnter();
    }
});
