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
    prizes: [], // 奖品列表缓存
    adminPassword: 'admin123',

    init() {
        this.bindEvents();
        this.bindTabEvents();
        this.loadPrizesFromStorage();
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

        // 奖品配置表单
        const prizeForm = document.getElementById('admin-prize-form');
        if (prizeForm) {
            prizeForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.savePrize();
            });
        }

        // 取消编辑奖品
        const cancelPrizeBtn = document.getElementById('btn-cancel-prize');
        if (cancelPrizeBtn) {
            cancelPrizeBtn.addEventListener('click', () => {
                this.cancelEditPrize();
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
            case 'admin-prizes':
                this.renderPrizes();
                break;
        }
    },

    // 加载用户列表
    async loadUsers() {
        try {
            const res = await fetch(API_BASE + '/api/admin/users', {
                headers: { 'password': this.adminPassword }
            }).then(r => r.json());
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
            const res = await fetch(API_BASE + `/api/admin/works?status=${this.currentWorkFilter}`, {
                headers: { 'password': this.adminPassword }
            }).then(r => r.json());
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
            const res = await fetch(API_BASE + `/api/admin/works/${workId}/approve`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'password': this.adminPassword },
                body: JSON.stringify({ status })
            }).then(r => r.json());
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
            const res = await fetch(API_BASE + `/api/admin/works/${workId}/approve`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'password': this.adminPassword },
                body: JSON.stringify({ status: 'approved', prize_level: prizeLevel })
            }).then(r => r.json());
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
            const res = await fetch(API_BASE + '/api/admin/quiz-records', {
                headers: { 'password': this.adminPassword }
            }).then(r => r.json());
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
            const res = await fetch(API_BASE + '/api/admin/lottery-records', {
                headers: { 'password': this.adminPassword }
            }).then(r => r.json());
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
        const titleEl = document.getElementById('notice-title');
        const contentEl = document.getElementById('notice-content');
        const tagEl = document.getElementById('notice-tag');

        const title = titleEl ? titleEl.value.trim() : '';
        const content = contentEl ? contentEl.value.trim() : '';
        const tag = tagEl ? tagEl.value : '活动';

        if (!title) {
            Utils.showToast('请填写公告标题');
            if (titleEl) titleEl.focus();
            return;
        }

        if (!content) {
            Utils.showToast('请填写公告内容');
            if (contentEl) contentEl.focus();
            return;
        }

        const payload = {
            title,
            content,
            tag,
            is_top: tag === '热门' ? 1 : 0
        };

        try {
            const res = await fetch(API_BASE + '/api/admin/notices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'password': this.adminPassword },
                body: JSON.stringify(payload)
            }).then(r => r.json());
            if (res.success) {
                Utils.showToast('公告发布成功');
                const form = document.getElementById('admin-notice-form');
                if (form) form.reset();
                // 刷新首页公告
                if (typeof HomePage !== 'undefined') {
                    HomePage.updateNotices();
                }
            } else {
                Utils.showToast(res.message || '发布失败');
            }
        } catch (e) {
            console.error('发布公告失败:', e);
            Utils.showToast('发布失败，请检查网络连接');
        }
    },

    // 页面进入时调用
    onPageEnter() {
        this.onTabChange(this.currentTab);
    },

    // ============================================
    // 奖品配置功能
    // ============================================

    loadPrizesFromStorage() {
        try {
            const saved = localStorage.getItem('health_app_prizes');
            if (saved) {
                this.prizes = JSON.parse(saved);
            }
        } catch (e) {
            this.prizes = [];
        }
    },

    savePrizesToStorage() {
        localStorage.setItem('health_app_prizes', JSON.stringify(this.prizes));
    },

    async loadPrizes() {
        try {
            const res = await fetch(API_BASE + '/api/admin/prizes', {
                headers: { 'password': this.adminPassword }
            }).then(r => r.json());
            if (res.success) {
                this.prizes = res.data;
                this.savePrizesToStorage();
                this.renderPrizes();
            }
        } catch (e) {
            console.error('加载奖品失败:', e);
            // 使用本地缓存
            this.renderPrizes();
        }
    },

    renderPrizes() {
        const container = document.getElementById('prize-list');
        if (!container) return;

        if (this.prizes.length === 0) {
            container.innerHTML = '<div class="admin-empty"><i class="fas fa-inbox"></i><p>暂无奖品配置</p></div>';
            return;
        }

        container.innerHTML = this.prizes.map(prize => `
            <div class="prize-item" data-id="${prize.id}">
                <div class="prize-item-info">
                    <div class="prize-item-name">${this.escapeHtml(prize.name)}</div>
                    <div class="prize-item-detail">
                        <span class="prize-detail-tag"><i class="fas fa-percentage"></i> ${prize.probability}%</span>
                        <span class="prize-detail-tag"><i class="fas fa-box"></i> 库存 ${prize.stock}</span>
                        <span class="prize-detail-tag"><i class="fas fa-hand-holding-heart"></i> 已发 ${prize.issued || 0}</span>
                    </div>
                </div>
                <div class="prize-item-actions">
                    <button class="btn-prize-edit" onclick="AdminModule.editPrize('${prize.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-prize-delete" onclick="AdminModule.deletePrize('${prize.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    },

    escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },

    async savePrize() {
        const nameEl = document.getElementById('prize-name');
        const probEl = document.getElementById('prize-probability');
        const stockEl = document.getElementById('prize-stock');
        const editIdEl = document.getElementById('prize-edit-id');

        const name = nameEl ? nameEl.value.trim() : '';
        const probability = probEl ? parseFloat(probEl.value) : 0;
        const stock = stockEl ? parseInt(stockEl.value) : 0;
        const editId = editIdEl ? editIdEl.value : '';

        if (!name) {
            Utils.showToast('请输入奖品名称');
            if (nameEl) nameEl.focus();
            return;
        }

        if (isNaN(probability) || probability < 0 || probability > 100) {
            Utils.showToast('概率必须在0-100之间');
            if (probEl) probEl.focus();
            return;
        }

        if (isNaN(stock) || stock < 0) {
            Utils.showToast('库存数量不能为负');
            if (stockEl) stockEl.focus();
            return;
        }

        // 检查概率总和（排除当前编辑项）
        const otherPrizes = this.prizes.filter(p => p.id !== editId);
        const totalProb = otherPrizes.reduce((sum, p) => sum + p.probability, 0);
        if (totalProb + probability > 100) {
            Utils.showToast(`概率总和不能超过100%，当前其他奖品已占 ${totalProb}%`);
            return;
        }

        if (editId) {
            // 编辑模式
            const index = this.prizes.findIndex(p => p.id === editId);
            if (index !== -1) {
                this.prizes[index] = {
                    ...this.prizes[index],
                    name,
                    probability,
                    stock,
                    updated_at: new Date().toISOString()
                };
            }
            Utils.showToast('奖品已更新');
        } else {
            // 新增模式
            const newPrize = {
                id: 'prize_' + Date.now(),
                name,
                probability,
                stock,
                issued: 0,
                created_at: new Date().toISOString()
            };
            this.prizes.push(newPrize);
            Utils.showToast('奖品添加成功');
        }

        this.savePrizesToStorage();

        // 尝试同步到后端
        try {
            await fetch(API_BASE + '/api/admin/prizes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'password': this.adminPassword },
                body: JSON.stringify({ prizes: this.prizes })
            });
        } catch (e) {
            console.log('奖品数据已保存到本地');
        }

        this.renderPrizes();
        this.cancelEditPrize();
    },

    editPrize(id) {
        const prize = this.prizes.find(p => p.id === id);
        if (!prize) return;

        const nameEl = document.getElementById('prize-name');
        const probEl = document.getElementById('prize-probability');
        const stockEl = document.getElementById('prize-stock');
        const editIdEl = document.getElementById('prize-edit-id');
        const addBtn = document.getElementById('btn-add-prize');
        const cancelBtn = document.getElementById('btn-cancel-prize');

        if (nameEl) nameEl.value = prize.name;
        if (probEl) probEl.value = prize.probability;
        if (stockEl) stockEl.value = prize.stock;
        if (editIdEl) editIdEl.value = prize.id;
        if (addBtn) addBtn.innerHTML = '<i class="fas fa-save"></i> 保存修改';
        if (cancelBtn) cancelBtn.style.display = 'inline-flex';

        // 滚动到表单位置
        const form = document.getElementById('admin-prize-form');
        if (form) form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    },

    cancelEditPrize() {
        const nameEl = document.getElementById('prize-name');
        const probEl = document.getElementById('prize-probability');
        const stockEl = document.getElementById('prize-stock');
        const editIdEl = document.getElementById('prize-edit-id');
        const addBtn = document.getElementById('btn-add-prize');
        const cancelBtn = document.getElementById('btn-cancel-prize');

        if (nameEl) nameEl.value = '';
        if (probEl) probEl.value = '';
        if (stockEl) stockEl.value = '';
        if (editIdEl) editIdEl.value = '';
        if (addBtn) addBtn.innerHTML = '<i class="fas fa-plus"></i> 添加奖品';
        if (cancelBtn) cancelBtn.style.display = 'none';
    },

    async deletePrize(id) {
        if (!confirm('确定要删除该奖品吗？')) return;

        this.prizes = this.prizes.filter(p => p.id !== id);
        this.savePrizesToStorage();

        // 尝试同步到后端
        try {
            await fetch(API_BASE + '/api/admin/prizes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'password': this.adminPassword },
                body: JSON.stringify({ prizes: this.prizes })
            });
        } catch (e) {
            console.log('奖品数据已保存到本地');
        }

        this.renderPrizes();
        Utils.showToast('奖品已删除');
    }
};

// 监听路由事件，当进入管理后台页面时加载数据
Router.on('pageEnter', (page) => {
    if (page === 'admin' && typeof AdminModule !== 'undefined') {
        AdminModule.onPageEnter();
    }
});
