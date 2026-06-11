/**
 * 中山市中小学生健康宣传互动平台 - 作品征集模块 (API版)
 */

const WorksModule = {
    currentFilter: 'all',

    init() {
        this.bindEvents();
        this.renderGallery();
        this.renderWinners();
    },

    async onPageEnter() {
        await this.renderGallery();
    },

    bindEvents() {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilter = btn.dataset.filter;
                this.renderGallery();
            });
        });

        document.getElementById('upload-area').addEventListener('click', () => {
            document.getElementById('work-file').click();
        });

        document.getElementById('work-file').addEventListener('change', (e) => {
            this.handleFileUpload(e.target.files[0]);
        });

        document.getElementById('submit-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitWork();
        });
    },

    async renderGallery() {
        const grid = document.getElementById('gallery-grid');
        grid.innerHTML = '<div style="text-align:center;padding:20px;color:#999;"><i class="fas fa-spinner fa-spin"></i> 加载中...</div>';

        try {
            const type = this.currentFilter === 'all' ? '' : this.currentFilter;
            const res = await API.get('/api/works?type=' + type);

            if (!res.success || !res.data.length) {
                grid.innerHTML = '<div style="text-align:center;padding:40px;color:#999;">暂无作品</div>';
                return;
            }

            const typeNames = { painting: '绘画', handcopy: '手抄报', essay: '征文', photo: '摄影', video: '短视频' };
            const typeEmojis = { painting: '🎨', handcopy: '📝', essay: '✍️', photo: '📷', video: '🎬' };
            const typeColors = { painting: '#FF6B6B', handcopy: '#A29BFE', essay: '#FDCB6E', photo: '#81C784', video: '#74B9FF' };

            grid.innerHTML = res.data.map(work => {
                const emoji = typeEmojis[work.type] || '📄';
                const color = typeColors[work.type] || '#999';
                const typeName = typeNames[work.type] || work.type;

                return `
                    <div class="gallery-item" data-id="${work.id}">
                        <div class="gallery-thumb" style="background:linear-gradient(135deg, ${color}22, ${color}44);">
                            <span>${emoji}</span>
                            <span class="type-badge">${typeName}</span>
                        </div>
                        <div class="gallery-info">
                            <h4>${work.title}</h4>
                            <div class="gallery-meta">
                                <span>${work.author} · ${work.school}</span>
                                <span class="gallery-likes"><i class="fas fa-heart"></i> ${work.likes || 0}</span>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

            grid.querySelectorAll('.gallery-item').forEach(item => {
                item.addEventListener('click', async () => {
                    const id = parseInt(item.dataset.id);
                    try {
                        await API.post(`/api/works/${id}/like`);
                        Utils.showToast('已点赞 ❤️');
                        this.renderGallery();
                    } catch (e) {
                        Utils.showToast('点赞失败');
                    }
                });
            });
        } catch (e) {
            grid.innerHTML = '<div style="text-align:center;padding:40px;color:#999;">加载失败，请刷新重试</div>';
        }
    },

    renderWinners() {
        // 获奖名单从后端获取
        const renderGroup = (winners, containerId, bgClass, titleClass) => {
            const container = document.getElementById(containerId);
            if (!winners || !winners.length) {
                container.innerHTML = '<div style="text-align:center;padding:20px;color:#999;">暂无数据</div>';
                return;
            }
            container.innerHTML = winners.map(w => `
                <div class="winner-item">
                    <div class="winner-avatar ${bgClass}">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="winner-detail">
                        <h4>${w.author || w.name}</h4>
                        <p>${w.school} · ${w.class}</p>
                    </div>
                    <span class="winner-prize-tag">${w.title || w.work}</span>
                </div>
            `).join('');
        };

        // 使用模拟数据作为后备
        const mockWinners = {
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
                { name: '潘小明', school: '中山市西区中学', class: '初一2班', work: '运动风采' }
            ]
        };

        renderGroup(mockWinners.gold, 'winners-gold', 'gold-bg');
        renderGroup(mockWinners.silver, 'winners-silver', 'silver-bg');
        renderGroup(mockWinners.bronze, 'winners-bronze', 'bronze-bg');
        renderGroup(mockWinners.excellence, 'winners-excellence', 'green-bg');
    },

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

    async submitWork() {
        console.log('submitWork called');
        
        const titleEl = document.getElementById('work-title');
        const typeEl = document.getElementById('work-type');
        const authorEl = document.getElementById('work-author');
        const schoolEl = document.getElementById('work-school');
        const classEl = document.getElementById('work-class');
        const descEl = document.getElementById('work-desc');
        const phoneEl = document.getElementById('work-phone');
        const agreeEl = document.getElementById('work-agree');
        const fileInput = document.getElementById('work-file');
        
        // 检查元素是否存在
        if (!titleEl || !typeEl || !authorEl || !schoolEl || !classEl || !descEl || !phoneEl || !agreeEl) {
            console.error('Form elements not found:', { titleEl, typeEl, authorEl, schoolEl, classEl, descEl, phoneEl, agreeEl });
            Utils.showToast('表单加载错误，请刷新页面重试');
            return;
        }
        
        const title = titleEl.value.trim();
        const type = typeEl.value;
        const author = authorEl.value.trim();
        const school = schoolEl.value.trim();
        const className = classEl.value.trim();
        const desc = descEl.value.trim();
        const phone = phoneEl.value.trim();
        const agree = agreeEl.checked;

        console.log('Form values:', { title, type, author, school, className, desc: desc.substring(0, 20), phone, agree });

        if (!title) { Utils.showToast('请输入作品标题'); return; }
        if (!type) { Utils.showToast('请选择作品类型'); return; }
        if (!author) { Utils.showToast('请输入作者姓名'); return; }
        if (!school) { Utils.showToast('请输入学校名称'); return; }
        if (!className) { Utils.showToast('请输入年级班级'); return; }
        if (desc.length < 20) { Utils.showToast('作品简介不少于20字'); return; }
        if (!Utils.isValidPhone(phone)) { Utils.showToast('请输入正确的手机号码'); return; }
        if (!agree) { Utils.showToast('请先同意授权条款'); return; }

        const formData = new FormData();
        formData.append('user_id', AppState.user ? AppState.user.id : '');
        formData.append('title', title);
        formData.append('type', type);
        formData.append('author', author);
        formData.append('school', school);
        formData.append('class', className);
        formData.append('description', desc);
        formData.append('phone', phone);
        if (fileInput && fileInput.files[0]) {
            formData.append('file', fileInput.files[0]);
        }

        console.log('Submitting form...');
        
        try {
            const res = await API.postForm('/api/works', formData);
            console.log('Response:', res);
            if (res.success) {
                Utils.showToast('作品提交成功！审核通过后将展示在作品墙');
                document.getElementById('submit-form').reset();
                document.getElementById('upload-preview').style.display = 'none';
                document.getElementById('upload-area').style.display = 'block';

                setTimeout(() => {
                    const tabBtns = document.querySelectorAll('.tab-btn');
                    tabBtns.forEach(b => b.classList.remove('active'));
                    tabBtns[1].classList.add('active');

                    document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
                    document.getElementById('works-gallery').classList.add('active');
                    this.renderGallery();
                }, 1500);
            } else {
                Utils.showToast(res.message || '提交失败');
            }
        } catch (e) {
            console.error('Submit error:', e);
            Utils.showToast('网络错误，请稍后重试');
        }
    }
};
