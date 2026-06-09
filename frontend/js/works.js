/**
 * 中山市中小学生健康宣传互动平台 - 作品征集模块
 * 包含：作品展示、获奖名单、投稿提交
 */

const WorksModule = {
    // 模拟作品数据
    mockWorks: [
        {
            id: 1, title: '健康饮食金字塔', type: 'painting', typeName: '绘画',
            author: '李小明', school: '中山市实验小学', class: '五年级2班',
            desc: '用彩色画笔描绘健康饮食金字塔，展示各类食物的合理搭配。',
            likes: 128, emoji: '🎨', color: '#FF6B6B'
        },
        {
            id: 2, title: '运动让生活更美好', type: 'handcopy', typeName: '手抄报',
            author: '王小红', school: '中山市第一中学', class: '初一3班',
            desc: '以手抄报形式介绍各种运动的好处，呼吁同学们积极参与体育锻炼。',
            likes: 96, emoji: '📝', color: '#A29BFE'
        },
        {
            id: 3, title: '我的健康日记', type: 'essay', typeName: '征文',
            author: '张小华', school: '中山市华侨中学', class: '初二1班',
            desc: '记录了我一个月来养成健康习惯的心路历程和感悟。',
            likes: 85, emoji: '✍️', color: '#FDCB6E'
        },
        {
            id: 4, title: '校园里的绿色角落', type: 'photo', typeName: '摄影',
            author: '陈小丽', school: '中山市石岐中心小学', class: '四年级1班',
            desc: '用镜头捕捉校园里美丽的绿色植物，展现自然之美。',
            likes: 112, emoji: '📷', color: '#81C784'
        },
        {
            id: 5, title: '健康操小课堂', type: 'video', typeName: '短视频',
            author: '刘小强', school: '中山市东区中学', class: '初二5班',
            desc: '自编一套适合课间做的健康操，简单易学，活力满满。',
            likes: 203, emoji: '🎬', color: '#74B9FF'
        },
        {
            id: 6, title: '保护眼睛从我做起', type: 'painting', typeName: '绘画',
            author: '赵小雨', school: '中山市小榄镇中心小学', class: '三年级4班',
            desc: '用生动的漫画形式展示保护眼睛的正确方法。',
            likes: 145, emoji: '🎨', color: '#FF6B6B'
        },
        {
            id: 7, title: '食品安全知识报', type: 'handcopy', typeName: '手抄报',
            author: '孙小芳', school: '中山市实验小学', class: '六年级3班',
            desc: '详细介绍食品安全知识，教大家如何辨别安全食品。',
            likes: 78, emoji: '📝', color: '#A29BFE'
        },
        {
            id: 8, title: '阳光少年成长记', type: 'essay', typeName: '征文',
            author: '周小龙', school: '中山市第一中学', class: '初二2班',
            desc: '讲述了一个内向的男孩通过运动变得自信阳光的故事。',
            likes: 167, emoji: '✍️', color: '#FDCB6E'
        },
        {
            id: 9, title: '校园健康角', type: 'photo', typeName: '摄影',
            author: '吴小美', school: '中山市西区中心小学', class: '五年级1班',
            desc: '记录学校新设立的健康角，同学们在这里学习健康知识。',
            likes: 91, emoji: '📷', color: '#81C784'
        },
        {
            id: 10, title: '洗手七步法', type: 'video', typeName: '短视频',
            author: '郑小杰', school: '中山市南区中学', class: '初一4班',
            desc: '用有趣的方式演示正确的洗手七步法，寓教于乐。',
            likes: 189, emoji: '🎬', color: '#74B9FF'
        }
    ],

    // 模拟获奖名单
    mockWinners: {
        gold: [
            { name: '李小明', school: '中山市实验小学', class: '五年级2班', work: '健康饮食金字塔' },
            { name: '刘小强', school: '中山市东区中学', class: '初二5班', work: '健康操小课堂' },
            { name: '周小龙', school: '中山市第一中学', class: '初二2班', work: '阳光少年成长记' }
        ],
        silver: [
            { name: '王小红', school: '中山市第一中学', class: '初一3班', work: '运动让生活更美好' },
            { name: '赵小雨', school: '中山市小榄镇中心小学', class: '三年级4班', work: '保护眼睛从我做起' },
            { name: '郑小杰', school: '中山市南区中学', class: '初一4班', work: '洗手七步法' },
            { name: '陈小丽', school: '中山市石岐中心小学', class: '四年级1班', work: '校园里的绿色角落' },
            { name: '张小华', school: '中山市华侨中学', class: '初二1班', work: '我的健康日记' },
            { name: '林小燕', school: '中山市古镇小学', class: '六年级1班', work: '健康生活小妙招' }
        ],
        bronze: [
            { name: '孙小芳', school: '中山市实验小学', class: '六年级3班', work: '食品安全知识报' },
            { name: '吴小美', school: '中山市西区中心小学', class: '五年级1班', work: '校园健康角' },
            { name: '黄小鹏', school: '中山市火炬开发区中学', class: '初一2班', work: '我的运动日记' },
            { name: '何小婷', school: '中山市三角镇中心小学', class: '四年级3班', work: '爱牙护齿画' },
            { name: '马小飞', school: '中山市港口镇中学', class: '初二3班', work: '健康饮食vlog' },
            { name: '杨小洁', school: '中山市南朗镇小学', class: '五年级2班', work: '心理健康手抄报' },
            { name: '许小文', school: '中山市黄圃镇中学', class: '初一1班', work: '运动达人养成记' },
            { name: '高小琳', school: '中山市板芙镇中心小学', class: '三年级2班', work: '我爱蔬菜' },
            { name: '罗小宇', school: '中山市三乡镇中学', class: '初二4班', work: '拒绝垃圾食品' },
            { name: '谢小芳', school: '中山市坦洲镇小学', class: '六年级2班', work: '健康睡眠指南' }
        ],
        excellence: [
            { name: '韩小雪', school: '中山市沙溪镇中心小学', class: '四年级2班', work: '健康小卫士' },
            { name: '唐小亮', school: '中山市东升镇中学', class: '初一5班', work: '运动与快乐' },
            { name: '冯小云', school: '中山市阜沙镇小学', class: '五年级3班', work: '绿色饮食画' },
            { name: '曹小阳', school: '中山市横栏镇中学', class: '初二1班', work: '健康生活征文' },
            { name: '彭小月', school: '中山市民众镇中心小学', class: '三年级1班', work: '我爱洗手' },
            { name: '邓小辉', school: '中山市南头镇中学', class: '初一3班', work: '健康饮食视频' },
            { name: '萧小雯', school: '中山市神湾镇小学', class: '六年级1班', work: '护眼小贴士' },
            { name: '田小刚', school: '中山市五桂山学校', class: '初二2班', work: '我的健康故事' },
            { name: '董小梅', school: '中山市大涌镇小学', class: '四年级4班', work: '营养搭配画' },
            { name: '潘小明', school: '中山市西区中学', class: '初一2班', work: '运动风采' },
            { name: '蒋小丽', school: '中山市石岐中学', class: '初二3班', work: '心理健康征文' },
            { name: '蔡小华', school: '中山市东区中心小学', class: '五年级4班', work: '健康习惯养成记' },
            { name: '魏小强', school: '中山市南区中心小学', class: '三年级3班', work: '我爱运动' },
            { name: '叶小芳', school: '中山市北区中学', class: '初一4班', work: '食品安全征文' },
            { name: '余小龙', school: '中山市港口镇中心小学', class: '六年级3班', work: '健康生活画报' },
            { name: '石小红', school: '中山市古镇中学', class: '初二5班', work: '运动日记' },
            { name: '姚小雨', school: '中山市小榄镇中学', class: '初一1班', work: '保护视力' },
            { name: '陆小杰', school: '中山市东凤镇中心小学', class: '四年级1班', work: '健康饮食画' },
            { name: '范小美', school: '中山市三角镇中学', class: '初二4班', work: '我的健康生活' },
            { name: '方小文', school: '中山市板芙镇中学', class: '初一6班', work: '运动让我快乐' }
        ]
    },

    currentFilter: 'all',

    // 初始化
    init() {
        this.bindEvents();
        this.renderGallery();
        this.renderWinners();
    },

    // 页面进入
    onPageEnter() {
        this.renderGallery();
    },

    // 绑定事件
    bindEvents() {
        // 筛选按钮
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilter = btn.dataset.filter;
                this.renderGallery();
            });
        });

        // 上传区域点击
        document.getElementById('upload-area').addEventListener('click', () => {
            document.getElementById('work-file').click();
        });

        // 文件选择
        document.getElementById('work-file').addEventListener('change', (e) => {
            this.handleFileUpload(e.target.files[0]);
        });

        // 提交表单
        document.getElementById('submit-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitWork();
        });
    },

    // 渲染作品展示
    renderGallery() {
        const grid = document.getElementById('gallery-grid');
        const works = this.currentFilter === 'all'
            ? this.mockWorks
            : this.mockWorks.filter(w => w.type === this.currentFilter);

        grid.innerHTML = works.map(work => `
            <div class="gallery-item" data-id="${work.id}">
                <div class="gallery-thumb" style="background:linear-gradient(135deg, ${work.color}22, ${work.color}44);">
                    <span>${work.emoji}</span>
                    <span class="type-badge">${work.typeName}</span>
                </div>
                <div class="gallery-info">
                    <h4>${work.title}</h4>
                    <div class="gallery-meta">
                        <span>${work.author} · ${work.school}</span>
                        <span class="gallery-likes"><i class="fas fa-heart"></i> ${work.likes}</span>
                    </div>
                </div>
            </div>
        `).join('');

        // 点赞功能
        grid.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('click', () => {
                const id = parseInt(item.dataset.id);
                const work = this.mockWorks.find(w => w.id === id);
                if (work) {
                    work.likes++;
                    this.renderGallery();
                    Utils.showToast('已点赞 ❤️');
                }
            });
        });
    },

    // 渲染获奖名单
    renderWinners() {
        const renderGroup = (winners, containerId, bgClass) => {
            const container = document.getElementById(containerId);
            container.innerHTML = winners.map(w => `
                <div class="winner-item">
                    <div class="winner-avatar ${bgClass}">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="winner-detail">
                        <h4>${w.name}</h4>
                        <p>${w.school} · ${w.class}</p>
                    </div>
                    <span class="winner-prize-tag">${w.work}</span>
                </div>
            `).join('');
        };

        renderGroup(this.mockWinners.gold, 'winners-gold', 'gold-bg');
        renderGroup(this.mockWinners.silver, 'winners-silver', 'silver-bg');
        renderGroup(this.mockWinners.bronze, 'winners-bronze', 'bronze-bg');
        renderGroup(this.mockWinners.excellence, 'winners-excellence', 'green-bg');
    },

    // 处理文件上传
    handleFileUpload(file) {
        if (!file) return;

        const preview = document.getElementById('upload-preview');
        const uploadArea = document.getElementById('upload-area');

        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                preview.innerHTML = `<img src="${e.target.result}" alt="预览">`;
                preview.style.display = 'block';
                uploadArea.style.display = 'none';
            };
            reader.readAsDataURL(file);
        } else if (file.type.startsWith('video/')) {
            preview.innerHTML = `
                <video controls style="width:100%;border-radius:8px;">
                    <source src="${URL.createObjectURL(file)}" type="${file.type}">
                </video>
            `;
            preview.style.display = 'block';
            uploadArea.style.display = 'none';
        } else {
            Utils.showToast('请上传图片或视频文件');
        }
    },

    // 提交作品
    submitWork() {
        const title = document.getElementById('work-title').value.trim();
        const type = document.getElementById('work-type').value;
        const author = document.getElementById('work-author').value.trim();
        const school = document.getElementById('work-school').value.trim();
        const className = document.getElementById('work-class').value.trim();
        const desc = document.getElementById('work-desc').value.trim();
        const phone = document.getElementById('work-phone').value.trim();
        const agree = document.getElementById('work-agree').checked;

        // 验证
        if (!title) { Utils.showToast('请输入作品标题'); return; }
        if (!type) { Utils.showToast('请选择作品类型'); return; }
        if (!author) { Utils.showToast('请输入作者姓名'); return; }
        if (!school) { Utils.showToast('请输入学校名称'); return; }
        if (!className) { Utils.showToast('请输入年级班级'); return; }
        if (desc.length < 20) { Utils.showToast('作品简介不少于20字'); return; }
        if (!Utils.isValidPhone(phone)) { Utils.showToast('请输入正确的手机号码'); return; }
        if (!agree) { Utils.showToast('请先同意授权条款'); return; }

        // 保存投稿记录
        const record = {
            title, type, author, school,
            class: className, desc, phone,
            date: Utils.getToday(),
            status: '待审核'
        };

        const records = Utils.load('workSubmissions', []);
        records.push(record);
        Utils.save('workSubmissions', records);

        DataManager.updateStats('worksCount');

        Utils.showToast('作品提交成功！审核通过后将展示在作品墙');

        // 重置表单
        document.getElementById('submit-form').reset();
        document.getElementById('upload-preview').style.display = 'none';
        document.getElementById('upload-area').style.display = 'block';

        // 切换到作品展示tab
        setTimeout(() => {
            const tabBtns = document.querySelectorAll('.tab-btn');
            tabBtns.forEach(b => b.classList.remove('active'));
            tabBtns[1].classList.add('active');

            document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
            document.getElementById('works-gallery').classList.add('active');
        }, 1500);
    }
};
