/**
 * 中山市中小学生健康宣传互动平台 - 21天闯关打卡模块 (API版)
 */

const ChallengeModule = {
    tasks: [
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
    ],

    badges: [
        { id: 'week1', name: '习惯新星', desc: '完成第1周所有任务', icon: '⭐' },
        { id: 'week2', name: '运动达人', desc: '完成第2周所有任务', icon: '🏅' },
        { id: 'week3', name: '健康卫士', desc: '完成全部21天任务', icon: '🏆' },
        { id: 'streak3', name: '坚持不懈', desc: '连续打卡3天', icon: '🔥' },
        { id: 'streak7', name: '一周达人', desc: '连续打卡7天', icon: '💪' },
        { id: 'streak14', name: '两周勇士', desc: '连续打卡14天', icon: '🦸' },
        { id: 'streak21', name: '21天冠军', desc: '连续打卡21天', icon: '👑' },
        { id: 'early_bird', name: '早起之星', desc: '在早上8点前打卡', icon: '🌅' },
        { id: 'first_day', name: '勇敢出发', desc: '完成第一天打卡', icon: '🌱' }
    ],

    currentWeek: 1,
    currentCheckinMethod: 'text',
    _currentTaskDay: null,

    init() {
        this.bindEvents();
        this.renderDays();
        this.renderBadges();
        this.renderRank();
        this.updateOverview();
    },

    async onPageEnter() {
        await this.loadRecords();
        this.updateOverview();
        this.renderDays();
        this.renderBadges();
    },

    async loadRecords() {
        try {
            const userId = AppState.user ? AppState.user.id : 1;
            const res = await API.get(`/api/challenge/records/${userId}`);
            if (res.success) {
                AppState.challenge.completedDays = res.data.completed_days || [];
                AppState.challenge.streak = res.data.streak || 0;
            }
        } catch (e) {
            console.error('加载打卡记录失败:', e);
        }
    },

    bindEvents() {
        document.querySelectorAll('.week-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.week-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.currentWeek = parseInt(tab.dataset.week);
                this.renderDays();
            });
        });

        document.querySelectorAll('.method-option').forEach(opt => {
            opt.addEventListener('click', () => {
                document.querySelectorAll('.method-option').forEach(o => o.classList.remove('active'));
                opt.classList.add('active');
                this.currentCheckinMethod = opt.dataset.method;
                document.getElementById('checkin-text-area').style.display =
                    this.currentCheckinMethod === 'text' ? 'block' : 'none';
                document.getElementById('checkin-photo-area').style.display =
                    this.currentCheckinMethod === 'photo' ? 'block' : 'none';
            });
        });

        document.getElementById('btn-checkin').addEventListener('click', () => this.doCheckin());

        document.getElementById('checkin-upload').addEventListener('click', () => {
            document.getElementById('checkin-file').click();
        });

        document.getElementById('checkin-file').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    document.getElementById('checkin-preview').innerHTML =
                        `<img src="${ev.target.result}" alt="打卡照片">`;
                    document.getElementById('checkin-preview').style.display = 'block';
                    document.getElementById('checkin-upload').style.display = 'none';
                };
                reader.readAsDataURL(file);
            }
        });

        document.getElementById('btn-modal-close').addEventListener('click', () => {
            document.getElementById('modal-checkin-success').style.display = 'none';
            this.showChallengeMain();
        });
    },

    showChallengeMain() {
        document.getElementById('challenge-main').style.display = 'block';
        document.getElementById('challenge-do').style.display = 'none';
    },

    updateOverview() {
        const completed = AppState.challenge.completedDays.length;
        const streak = AppState.challenge.streak;

        document.getElementById('challenge-streak').textContent = streak;
        document.getElementById('ring-num').textContent = completed;

        const circumference = 2 * Math.PI * 54;
        const offset = circumference - (completed / 21) * circumference;
        document.getElementById('ring-fill').style.strokeDashoffset = offset;

        const weekNum = completed < 7 ? 1 : completed < 14 ? 2 : 3;
        const weekNames = { 1: '第1周', 2: '第2周', 3: '第3周' };
        document.getElementById('ov-week').textContent = weekNames[weekNum] || '第1周';

        const todayCompleted = AppState.challenge.completedDays.includes(this.getTodayDay());
        document.getElementById('ov-today-status').textContent = todayCompleted ? '已完成 ✅' : '未完成';
        document.getElementById('ov-today-status').style.color = todayCompleted ? 'var(--success)' : 'var(--accent)';

        document.getElementById('ov-badges').textContent = this.calculateBadges().length;
        this.updateLevel(completed);
    },

    getTodayDay() {
        // 简化：返回当前应该打卡的天数（基于开始日期）
        // 实际应该从后端获取用户的开始日期
        return AppState.challenge.completedDays.length + 1;
    },

    updateLevel(completed) {
        const badge = document.getElementById('user-level-badge');
        if (completed >= 21) {
            badge.innerHTML = '<span class="level-icon">🏆</span><span class="level-text">健康冠军</span>';
        } else if (completed >= 14) {
            badge.innerHTML = '<span class="level-icon">🥇</span><span class="level-text">健康达人</span>';
        } else if (completed >= 7) {
            badge.innerHTML = '<span class="level-icon">🥈</span><span class="level-text">习惯养成</span>';
        } else if (completed >= 1) {
            badge.innerHTML = '<span class="level-icon">🌱</span><span class="level-text">新手出发</span>';
        } else {
            badge.innerHTML = '<span class="level-icon">🐣</span><span class="level-text">准备开始</span>';
        }
    },

    renderDays() {
        const container = document.getElementById('challenge-days');
        const completed = AppState.challenge.completedDays;
        const todayDay = this.getTodayDay();

        const filteredTasks = this.tasks.filter(t => t.week === this.currentWeek);

        container.innerHTML = filteredTasks.map(task => {
            const isCompleted = completed.includes(task.day);
            const isToday = task.day === todayDay;
            const isLocked = task.day > todayDay && !isCompleted;

            let statusClass = '';
            if (isCompleted) statusClass = 'completed';
            else if (isToday) statusClass = 'today';
            else if (isLocked) statusClass = 'locked';

            let statusIcon = '';
            if (isCompleted) statusIcon = '✅';
            else if (isToday) statusIcon = '🔥';
            else if (isLocked) statusIcon = '🔒';

            return `
                <div class="day-card ${statusClass}" data-day="${task.day}">
                    <div class="day-num">${task.day}</div>
                    <div class="day-info">
                        <h4>${task.icon} ${task.title}</h4>
                        <p>${task.category}${isToday ? ' · 今天' : ''}</p>
                    </div>
                    <div class="day-status">${statusIcon}</div>
                </div>
            `;
        }).join('');

        container.querySelectorAll('.day-card').forEach(card => {
            card.addEventListener('click', () => {
                const day = parseInt(card.dataset.day);
                const isCompleted = completed.includes(day);
                const isLocked = card.classList.contains('locked');

                if (isLocked) {
                    Utils.showToast('这一天的任务还未解锁，请耐心等待');
                    return;
                }
                if (isCompleted) {
                    Utils.showToast('这一天已经完成打卡了');
                    return;
                }
                this.showTaskDetail(day);
            });
        });
    },

    showTaskDetail(day) {
        const task = this.tasks.find(t => t.day === day);
        if (!task) return;

        document.getElementById('challenge-main').style.display = 'none';
        document.getElementById('challenge-do').style.display = 'block';

        document.getElementById('task-day-badge').textContent = `Day ${day}`;
        document.getElementById('task-category').textContent = task.category;
        document.getElementById('task-title').textContent = task.title;

        document.getElementById('checkin-text').value = '';
        document.getElementById('checkin-preview').style.display = 'none';
        document.getElementById('checkin-upload').style.display = 'block';

        this._currentTaskDay = day;
    },

    async doCheckin() {
        const day = this._currentTaskDay;
        if (!day) return;

        const text = document.getElementById('checkin-text').value.trim();

        if (this.currentCheckinMethod === 'text' && text.length < 5) {
            Utils.showToast('请至少输入5个字的打卡记录');
            return;
        }

        try {
            const userId = AppState.user ? AppState.user.id : 1;
            const res = await API.post('/api/challenge/checkin', {
                user_id: userId,
                day: day,
                content: text
            });

            if (res.success) {
                AppState.challenge.completedDays.push(day);
                this.updateOverview();
                this.renderDays();
                this.showSuccessModal(day);
            } else {
                Utils.showToast(res.message || '打卡失败');
            }
        } catch (e) {
            Utils.showToast('网络错误，请稍后重试');
        }
    },

    calculateBadges() {
        const completed = AppState.challenge.completedDays.length;
        const streak = AppState.challenge.streak;
        const earned = [];

        if (completed >= 1) earned.push('first_day');
        if (completed >= 7) earned.push('week1');
        if (completed >= 14) earned.push('week2');
        if (completed >= 21) earned.push('week3');
        if (streak >= 3) earned.push('streak3');
        if (streak >= 7) earned.push('streak7');
        if (streak >= 14) earned.push('streak14');
        if (streak >= 21) earned.push('streak21');

        const hour = new Date().getHours();
        if (hour < 8) earned.push('early_bird');

        return earned;
    },

    showSuccessModal(day) {
        const modal = document.getElementById('modal-checkin-success');
        const task = this.tasks.find(t => t.day === day);
        const newBadges = this.calculateBadges();

        let successText = `太棒了！你完成了「${task.title}」的打卡！`;
        if (day === 7) successText = '🎉 恭喜完成第一周挑战！';
        if (day === 14) successText = '🎉 恭喜完成第二周挑战！';
        if (day === 21) successText = '🎊 恭喜完成全部21天挑战！';

        document.getElementById('modal-success-text').textContent = successText;

        const rewardDiv = document.getElementById('modal-reward');
        const newBadge = newBadges.length > AppState.challenge.badges.length ?
            this.badges.find(b => b.id === newBadges[newBadges.length - 1]) : null;

        if (newBadge) {
            rewardDiv.style.display = 'block';
            document.getElementById('reward-badge').textContent = newBadge.icon;
            document.getElementById('reward-text').textContent = `获得新徽章：${newBadge.name}`;
        } else {
            rewardDiv.style.display = 'none';
        }

        AppState.challenge.badges = newBadges;
        modal.style.display = 'flex';
    },

    renderBadges() {
        const grid = document.getElementById('badges-grid');
        const earned = this.calculateBadges();

        grid.innerHTML = this.badges.map(badge => {
            const isEarned = earned.includes(badge.id);
            return `
                <div class="badge-item ${isEarned ? '' : 'locked'}">
                    <div class="badge-icon">${badge.icon}</div>
                    <span class="badge-name">${badge.name}</span>
                    <span class="badge-desc">${badge.desc}</span>
                </div>
            `;
        }).join('');
    },

    async renderRank() {
        const list = document.getElementById('rank-list');
        list.innerHTML = '<div style="text-align:center;padding:20px;"><i class="fas fa-spinner fa-spin"></i> 加载中...</div>';

        try {
            const res = await API.get('/api/challenge/ranking');
            if (!res.success || !res.data.length) {
                list.innerHTML = '<div style="text-align:center;padding:20px;color:#999;">暂无数据</div>';
                return;
            }

            list.innerHTML = res.data.map((item, i) => {
                const topClass = i === 0 ? 'top1' : i === 1 ? 'top2' : i === 2 ? 'top3' : '';
                const avatars = ['🦸', '🏃', '☀️', '🛡️', '😊', '⚡', '🌟', '📖', '🚀', '🎯'];
                return `
                    <div class="rank-item ${topClass}">
                        <div class="rank-position">${i + 1}</div>
                        <div class="rank-avatar">${avatars[i] || '👤'}</div>
                        <div class="rank-info">
                            <h4>${item.name}</h4>
                            <p>${item.school}</p>
                        </div>
                        <span class="rank-days">${item.days}天</span>
                    </div>
                `;
            }).join('');
        } catch (e) {
            list.innerHTML = '<div style="text-align:center;padding:20px;color:#999;">加载失败</div>';
        }
    }
};
