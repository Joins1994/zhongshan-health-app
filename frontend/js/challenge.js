/**
 * 中山市中小学生健康宣传互动平台 - 21天闯关打卡模块
 * 包含：21天任务设计、打卡记录、徽章系统、排行榜
 */

const ChallengeModule = {
    // 21天任务数据
    // 第1周：基础习惯（1-7天）
    // 第2周：饮食运动（8-14天）
    // 第3周：心理健康与安全（15-21天）
    tasks: [
        // === 第1周：基础习惯 ===
        {
            day: 1, week: 1, category: '基础习惯',
            title: '每天喝够8杯水',
            desc: '水是生命之源！每天喝够8杯水（约1500ml），有助于身体代谢，保持皮肤水润，提高注意力。',
            tips: '可以设置手机提醒，每2小时喝一杯水。早起一杯温水，饭前半小时一杯水，运动前后也要及时补水哦！',
            icon: '💧'
        },
        {
            day: 2, week: 1, category: '基础习惯',
            title: '早晚认真刷牙',
            desc: '保护牙齿从每天早晚刷牙开始！每次至少刷2分钟，使用含氟牙膏，配合牙线清洁牙缝。',
            tips: '可以播放一首2分钟的刷牙歌来计时，上下顺着牙缝轻轻刷，不要用力横刷哦！',
            icon: '🦷'
        },
        {
            day: 3, week: 1, category: '基础习惯',
            title: '保证充足睡眠',
            desc: '充足的睡眠对身体发育至关重要！小学生需要10小时，初中生需要9小时睡眠。',
            tips: '晚上9点前开始准备睡觉，远离手机和电视，可以读一本轻松的书帮助入睡。',
            icon: '😴'
        },
        {
            day: 4, week: 1, category: '基础习惯',
            title: '勤洗手讲卫生',
            desc: '正确洗手能有效预防疾病传播！饭前便后、外出回家都要认真洗手。',
            tips: '记住洗手七步法：内、外、夹、弓、大、立、腕。用流动水和肥皂，搓洗至少20秒！',
            icon: '🧼'
        },
        {
            day: 5, week: 1, category: '基础习惯',
            title: '保持正确坐姿',
            desc: '良好的坐姿能预防近视和脊柱问题。做到"三个一"：眼离书本一尺，胸离桌沿一拳，手离笔尖一寸。',
            tips: '学习时每隔40分钟站起来活动一下，做做伸展运动，让眼睛和身体都休息一下。',
            icon: '🪑'
        },
        {
            day: 6, week: 1, category: '基础习惯',
            title: '整理个人物品',
            desc: '保持书包、书桌和房间整洁有序，培养良好的生活习惯和自理能力。',
            tips: '每天睡前花5分钟整理书包，准备好第二天的学习用品。周末花20分钟整理房间。',
            icon: '🎒'
        },
        {
            day: 7, week: 1, category: '基础习惯',
            title: '早起不赖床',
            desc: '养成早起的习惯，给自己充足的时间吃早餐和准备，从容开始新的一天。',
            tips: '设定固定的起床时间，闹钟响了就起来。可以拉开窗帘让阳光照进来，帮助身体清醒。',
            icon: '⏰'
        },
        // === 第2周：饮食运动 ===
        {
            day: 8, week: 2, category: '饮食运动',
            title: '多吃蔬菜水果',
            desc: '每天至少吃5种蔬菜和水果，补充维生素和矿物质，增强免疫力。',
            tips: '尝试不同颜色的蔬果：绿色的西兰花、红色的番茄、紫色的茄子、黄色的玉米，颜色越丰富越好！',
            icon: '🥦'
        },
        {
            day: 9, week: 2, category: '饮食运动',
            title: '运动30分钟',
            desc: '每天进行至少30分钟的中等强度运动，如跑步、跳绳、打球等，增强体质。',
            tips: '选择自己喜欢的运动方式最重要！可以约同学一起运动，互相鼓励，更有动力坚持。',
            icon: '🏃'
        },
        {
            day: 10, week: 2, category: '饮食运动',
            title: '少吃零食和糖',
            desc: '减少高糖、高油零食的摄入，选择健康的零食替代品，如坚果、酸奶、水果等。',
            tips: '口渴时选择喝水而不是饮料，想吃零食时先吃一个水果。学会看食品标签，选择低糖食品。',
            icon: '🍭'
        },
        {
            day: 11, week: 2, category: '饮食运动',
            title: '认真吃早餐',
            desc: '早餐是一天中最重要的一餐！一顿营养丰富的早餐能提供上午学习所需的能量。',
            tips: '好的早餐应包含：主食（面包/粥）+ 蛋白质（鸡蛋/牛奶）+ 维生素（水果/蔬菜）。',
            icon: '🥣'
        },
        {
            day: 12, week: 2, category: '饮食运动',
            title: '学习一项新运动',
            desc: '尝试学习一项新的运动技能，如游泳、羽毛球、篮球等，丰富运动体验。',
            tips: '可以向体育老师请教，或者观看教学视频自学。不怕做不好，重要的是勇于尝试！',
            icon: '🏊'
        },
        {
            day: 13, week: 2, category: '饮食运动',
            title: '做一次眼保健操',
            desc: '认真做眼保健操，缓解眼部疲劳，预防近视。每天至少做两次。',
            tips: '做操前先洗手，找准穴位，力度适中，每个动作坚持做够节拍。闭眼休息也很重要！',
            icon: '👀'
        },
        {
            day: 14, week: 2, category: '饮食运动',
            title: '和家人一起运动',
            desc: '邀请家人一起参加运动活动，增进亲子关系，全家一起健康！',
            tips: '可以一起散步、骑自行车、打羽毛球、跳绳等。周末安排一次家庭户外活动吧！',
            icon: '👨‍👩‍👧‍👦'
        },
        // === 第3周：心理健康与安全 ===
        {
            day: 15, week: 3, category: '心理安全',
            title: '记录三件开心的事',
            desc: '每天记录三件让自己开心或感恩的事情，培养积极乐观的心态。',
            tips: '开心的事可以很小：今天天气很好、吃到好吃的、和朋友玩得很开心。学会发现生活中的美好！',
            icon: '😊'
        },
        {
            day: 16, week: 3, category: '心理安全',
            title: '对别人说一句善意的话',
            desc: '主动对家人、同学或老师说一句善意和感谢的话，传递温暖和正能量。',
            tips: '比如："谢谢你帮我"、"你今天真棒"、"辛苦了"。善意的语言能让人心情变好！',
            icon: '💬'
        },
        {
            day: 17, week: 3, category: '心理安全',
            title: '学习一项安全知识',
            desc: '学习一个安全知识或自救技能，如火灾逃生、防溺水、防拐骗等。',
            tips: '可以观看安全教育视频，或参加学校组织的安全演练。安全知识可能关键时刻救命！',
            icon: '🆘'
        },
        {
            day: 18, week: 3, category: '心理安全',
            title: '做10分钟深呼吸放松',
            desc: '学会深呼吸放松技巧，帮助缓解紧张、焦虑等不良情绪，保持心理平衡。',
            tips: '找一个安静的地方坐下，闭上眼睛，用鼻子吸气4秒，屏住4秒，用嘴呼气6秒，重复5-10次。',
            icon: '🧘'
        },
        {
            day: 19, week: 3, category: '心理安全',
            title: '帮助一个需要帮助的人',
            desc: '主动帮助身边需要帮助的人，体验助人为乐的快乐，培养社会责任感。',
            tips: '帮助可以很小：帮同学解答一道题、帮老师擦黑板、帮家人做家务。小小的帮助也能带来大大的温暖！',
            icon: '🤝'
        },
        {
            day: 20, week: 3, category: '心理安全',
            title: '认识和管理自己的情绪',
            desc: '学会识别和表达自己的情绪，找到合适的方式管理负面情绪。',
            tips: '生气时可以数到10再说话，难过时可以找人倾诉，紧张时可以做深呼吸。情绪没有好坏，关键是如何表达。',
            icon: '❤️'
        },
        {
            day: 21, week: 3, category: '心理安全',
            title: '总结21天健康之旅',
            desc: '回顾这21天的健康打卡历程，总结收获和感悟，制定未来的健康计划。',
            tips: '想想哪些习惯你已经养成了？哪些还需要继续努力？把好习惯坚持下去，你就是健康小达人！',
            icon: '🏆'
        }
    ],

    // 徽章配置
    badges: [
        { id: 'week1', name: '习惯新星', desc: '完成第1周所有任务', icon: '⭐', bg: '#FFD700', requirement: 7 },
        { id: 'week2', name: '运动达人', desc: '完成第2周所有任务', icon: '🏅', bg: '#FF9800', requirement: 14 },
        { id: 'week3', name: '健康卫士', desc: '完成全部21天任务', icon: '🏆', bg: '#4CAF50', requirement: 21 },
        { id: 'streak3', name: '坚持不懈', desc: '连续打卡3天', icon: '🔥', bg: '#f44336', requirement: 0 },
        { id: 'streak7', name: '一周达人', desc: '连续打卡7天', icon: '💪', bg: '#9C27B0', requirement: 0 },
        { id: 'streak14', name: '两周勇士', desc: '连续打卡14天', icon: '🦸', bg: '#2196F3', requirement: 0 },
        { id: 'streak21', name: '21天冠军', desc: '连续打卡21天', icon: '👑', bg: '#E91E63', requirement: 0 },
        { id: 'early_bird', name: '早起之星', desc: '在早上8点前打卡', icon: '🌅', bg: '#FF5722', requirement: 0 },
        { id: 'first_day', name: '勇敢出发', desc: '完成第一天打卡', icon: '🌱', bg: '#8BC34A', requirement: 0 }
    ],

    // 模拟排行榜数据
    mockRankData: [
        { name: '健康小达人', school: '中山市实验小学', days: 21, avatar: '🦸' },
        { name: '运动小健将', school: '中山市第一中学', days: 20, avatar: '🏃' },
        { name: '阳光少年', school: '中山市华侨中学', days: 19, avatar: '☀️' },
        { name: '健康小卫士', school: '中山市石岐中心小学', days: 18, avatar: '🛡️' },
        { name: '快乐成长', school: '中山市东区中学', days: 17, avatar: '😊' },
        { name: '活力满满', school: '中山市小榄镇中心小学', days: 16, avatar: '⚡' },
        { name: '自律之星', school: '中山市西区中心小学', days: 15, avatar: '🌟' },
        { name: '成长日记', school: '中山市南区中学', days: 14, avatar: '📖' },
        { name: '健康先锋', school: '中山市古镇小学', days: 13, avatar: '🚀' },
        { name: '好习惯养成', school: '中山市三角镇中心小学', days: 12, avatar: '🎯' }
    ],

    currentWeek: 1,
    currentCheckinMethod: 'text',

    // 初始化
    init() {
        this.bindEvents();
        this.renderDays();
        this.renderBadges();
        this.renderRank();
        this.updateOverview();
    },

    // 页面进入
    onPageEnter() {
        this.updateOverview();
        this.renderDays();
        this.renderBadges();
        this.showChallengeMain();
    },

    // 绑定事件
    bindEvents() {
        // 周Tab切换
        document.querySelectorAll('.week-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.week-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.currentWeek = parseInt(tab.dataset.week);
                this.renderDays();
            });
        });

        // 打卡方式切换
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

        // 打卡按钮
        document.getElementById('btn-checkin').addEventListener('click', () => {
            this.doCheckin();
        });

        // 打卡照片上传
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

        // 弹窗关闭
        document.getElementById('btn-modal-close').addEventListener('click', () => {
            document.getElementById('modal-checkin-success').style.display = 'none';
            this.showChallengeMain();
        });
    },

    // 显示打卡主界面
    showChallengeMain() {
        document.getElementById('challenge-main').style.display = 'block';
        document.getElementById('challenge-do').style.display = 'none';
        document.getElementById('challenge-badges').style.display = 'none';
        document.getElementById('challenge-rank').style.display = 'none';
    },

    // 更新进度总览
    updateOverview() {
        const completed = AppState.challenge.completedDays.length;
        const today = Utils.getToday();

        // 计算连续打卡天数
        let streak = 0;
        if (completed > 0) {
            const sorted = [...AppState.challenge.completedDays].sort();
            const checkDate = new Date(sorted[sorted.length - 1]);
            const todayDate = new Date(today);
            const diffDays = Math.floor((todayDate - checkDate) / 86400000);

            if (diffDays <= 1) {
                streak = 1;
                for (let i = sorted.length - 2; i >= 0; i--) {
                    const prev = new Date(sorted[i]);
                    const next = new Date(sorted[i + 1]);
                    if (Math.floor((next - prev) / 86400000) === 1) {
                        streak++;
                    } else {
                        break;
                    }
                }
            }
        }

        AppState.challenge.streak = streak;
        DataManager.saveChallenge();

        // 更新UI
        document.getElementById('challenge-streak').textContent = streak;
        document.getElementById('ring-num').textContent = completed;

        // 更新环形进度
        const circumference = 2 * Math.PI * 54; // 339.29
        const offset = circumference - (completed / 21) * circumference;
        document.getElementById('ring-fill').style.strokeDashoffset = offset;

        // 更新阶段信息
        const weekNum = completed < 7 ? 1 : completed < 14 ? 2 : 3;
        const weekNames = { 1: '第1周', 2: '第2周', 3: '第3周' };
        document.getElementById('ov-week').textContent = weekNames[weekNum] || '第1周';

        // 今日状态
        const todayCompleted = AppState.challenge.completedDays.includes(today);
        document.getElementById('ov-today-status').textContent = todayCompleted ? '已完成 ✅' : '未完成';
        document.getElementById('ov-today-status').style.color = todayCompleted ? 'var(--success)' : 'var(--accent)';

        // 徽章数量
        document.getElementById('ov-badges').textContent = AppState.challenge.badges.length;

        // 等级
        this.updateLevel(completed);
    },

    // 更新用户等级
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

    // 渲染每日任务列表
    renderDays() {
        const container = document.getElementById('challenge-days');
        const today = Utils.getToday();
        const completed = AppState.challenge.completedDays;

        // 计算开始日期（假设从今天开始）
        const startDate = AppState.challenge.startDate || today;
        const start = new Date(startDate);

        const filteredTasks = this.tasks.filter(t => t.week === this.currentWeek);

        container.innerHTML = filteredTasks.map(task => {
            const taskDate = new Date(start);
            taskDate.setDate(taskDate.getDate() + task.day - 1);
            const dateStr = taskDate.toISOString().split('T')[0];

            const isCompleted = completed.includes(dateStr);
            const isToday = dateStr === today;
            const isPast = taskDate < new Date(today);
            const isLocked = taskDate > new Date(today) && !isCompleted;

            let statusClass = '';
            if (isCompleted) statusClass = 'completed';
            else if (isToday) statusClass = 'today';
            else if (isLocked) statusClass = 'locked';

            let statusIcon = '';
            if (isCompleted) statusIcon = '✅';
            else if (isToday) statusIcon = '🔥';
            else if (isLocked) statusIcon = '🔒';

            return `
                <div class="day-card ${statusClass}" data-day="${task.day}" data-date="${dateStr}">
                    <div class="day-num">${task.day}</div>
                    <div class="day-info">
                        <h4>${task.icon} ${task.title}</h4>
                        <p>${Utils.formatDate(dateStr)}${isToday ? ' · 今天' : ''}</p>
                    </div>
                    <div class="day-status">${statusIcon}</div>
                </div>
            `;
        }).join('');

        // 绑定点击事件
        container.querySelectorAll('.day-card').forEach(card => {
            card.addEventListener('click', () => {
                const day = parseInt(card.dataset.day);
                const dateStr = card.dataset.date;
                const isCompleted = completed.includes(dateStr);
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

    // 显示任务详情
    showTaskDetail(day) {
        const task = this.tasks.find(t => t.day === day);
        if (!task) return;

        document.getElementById('challenge-main').style.display = 'none';
        document.getElementById('challenge-do').style.display = 'block';

        document.getElementById('task-day-badge').textContent = `Day ${day}`;
        document.getElementById('task-category').textContent = task.category;
        document.getElementById('task-title').textContent = task.title;
        document.getElementById('task-desc').innerHTML = `<p>${task.desc}</p>`;
        document.getElementById('task-tips').innerHTML = `
            <h4><i class="fas fa-lightbulb"></i> 小贴士</h4>
            <p>${task.tips}</p>
        `;

        // 重置打卡区域
        document.getElementById('checkin-text').value = '';
        document.getElementById('checkin-preview').style.display = 'none';
        document.getElementById('checkin-upload').style.display = 'block';

        // 存储当前任务day
        this._currentTaskDay = day;
    },

    // 执行打卡
    doCheckin() {
        const day = this._currentTaskDay;
        if (!day) return;

        const text = document.getElementById('checkin-text').value.trim();
        const today = Utils.getToday();

        // 验证
        if (this.currentCheckinMethod === 'text' && text.length < 5) {
            Utils.showToast('请至少输入5个字的打卡记录');
            return;
        }

        // 计算日期
        const startDate = AppState.challenge.startDate || today;
        const start = new Date(startDate);
        const taskDate = new Date(start);
        taskDate.setDate(taskDate.getDate() + day - 1);
        const dateStr = taskDate.toISOString().split('T')[0];

        // 检查是否已打卡
        if (AppState.challenge.completedDays.includes(dateStr)) {
            Utils.showToast('今天已经打卡过了');
            return;
        }

        // 记录打卡
        AppState.challenge.completedDays.push(dateStr);

        if (!AppState.challenge.startDate) {
            AppState.challenge.startDate = today;
        }

        // 保存打卡记录
        AppState.challenge.checkinRecords[dateStr] = {
            day: day,
            method: this.currentCheckinMethod,
            text: text,
            time: new Date().toISOString()
        };

        DataManager.saveChallenge();
        DataManager.updateStats('checkinDays');

        // 检查徽章
        const newBadge = this.checkBadges();

        // 显示成功弹窗
        this.showSuccessModal(day, newBadge);

        // 更新进度
        this.updateOverview();
        this.renderDays();
    },

    // 检查并授予徽章
    checkBadges() {
        const completed = AppState.challenge.completedDays.length;
        const streak = AppState.challenge.streak;
        const newBadges = [];

        const checkAndAward = (badgeId) => {
            if (!AppState.challenge.badges.includes(badgeId)) {
                AppState.challenge.badges.push(badgeId);
                newBadges.push(this.badges.find(b => b.id === badgeId));
            }
        };

        // 完成天数徽章
        if (completed >= 1) checkAndAward('first_day');
        if (completed >= 7) checkAndAward('week1');
        if (completed >= 14) checkAndAward('week2');
        if (completed >= 21) checkAndAward('week3');

        // 连续打卡徽章
        if (streak >= 3) checkAndAward('streak3');
        if (streak >= 7) checkAndAward('streak7');
        if (streak >= 14) checkAndAward('streak14');
        if (streak >= 21) checkAndAward('streak21');

        // 早起打卡
        const hour = new Date().getHours();
        if (hour < 8) checkAndAward('early_bird');

        DataManager.saveChallenge();
        return newBadges;
    },

    // 显示打卡成功弹窗
    showSuccessModal(day, newBadges) {
        const modal = document.getElementById('modal-checkin-success');
        const task = this.tasks.find(t => t.day === day);

        let successText = `太棒了！你完成了「${task.title}」的打卡！`;
        if (day === 7) successText = '🎉 恭喜完成第一周挑战！你已养成基础健康习惯！';
        if (day === 14) successText = '🎉 恭喜完成第二周挑战！饮食运动达人就是你！';
        if (day === 21) successText = '🎊 恭喜完成全部21天挑战！你是真正的健康小冠军！';

        document.getElementById('modal-success-text').textContent = successText;

        const rewardDiv = document.getElementById('modal-reward');
        if (newBadges.length > 0) {
            rewardDiv.style.display = 'block';
            const badge = newBadges[0];
            document.getElementById('reward-badge').textContent = badge.icon;
            document.getElementById('reward-text').textContent = `获得新徽章：${badge.name} - ${badge.desc}`;
        } else {
            rewardDiv.style.display = 'none';
        }

        modal.style.display = 'flex';
    },

    // 渲染徽章墙
    renderBadges() {
        const grid = document.getElementById('badges-grid');
        const earned = AppState.challenge.badges;

        grid.innerHTML = this.badges.map(badge => {
            const isEarned = earned.includes(badge.id);
            return `
                <div class="badge-item ${isEarned ? '' : 'locked'}">
                    <div class="badge-icon" style="background:${badge.bg}22;">
                        ${badge.icon}
                    </div>
                    <span class="badge-name">${badge.name}</span>
                    <span class="badge-desc">${badge.desc}</span>
                </div>
            `;
        }).join('');
    },

    // 渲染排行榜
    renderRank() {
        const list = document.getElementById('rank-list');

        list.innerHTML = this.mockRankData.map((item, i) => {
            const topClass = i === 0 ? 'top1' : i === 1 ? 'top2' : i === 2 ? 'top3' : '';
            return `
                <div class="rank-item ${topClass}">
                    <div class="rank-position">${i + 1}</div>
                    <div class="rank-avatar">${item.avatar}</div>
                    <div class="rank-info">
                        <h4>${item.name}</h4>
                        <p>${item.school}</p>
                    </div>
                    <span class="rank-days">${item.days}天</span>
                </div>
            `;
        }).join('');
    }
};
