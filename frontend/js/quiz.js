/**
 * 中山市中小学生健康宣传互动平台 - 答题模块
 * 包含：题库管理、答题流程、抽奖转盘、身份登记
 */

const QuizModule = {
    // 题库数据
    questionBank: [
        {
            question: '小学生每天应该保证多少小时的睡眠？',
            options: ['8小时', '9小时', '10小时', '12小时'],
            answer: 2,
            explain: '根据《中小学生健康管理办法》，小学生每天应保证10小时睡眠，充足的睡眠有助于身体发育和大脑休息。'
        },
        {
            question: '以下哪种食物富含维生素C？',
            options: ['米饭', '橙子', '猪肉', '鸡蛋'],
            answer: 1,
            explain: '橙子、柠檬、猕猴桃等水果富含维生素C，有助于增强免疫力和促进铁的吸收。'
        },
        {
            question: '正确的刷牙方法应该是？',
            options: ['横向用力刷', '上下顺着牙缝刷', '只刷外面', '随便刷刷就行'],
            answer: 1,
            explain: '正确的刷牙方法是上下顺着牙缝轻轻刷，每次至少2分钟，早晚各一次，这样才能有效清洁牙齿。'
        },
        {
            question: '预防近视最有效的方法是？',
            options: ['戴眼镜', '多做户外活动', '吃保健品', '看远处一分钟'],
            answer: 1,
            explain: '每天2小时以上的户外活动是最有效的预防近视的方法，阳光可以促进视网膜释放多巴胺，延缓眼轴增长。'
        },
        {
            question: '人体最大的器官是什么？',
            options: ['心脏', '肝脏', '皮肤', '大脑'],
            answer: 2,
            explain: '皮肤是人体最大的器官，成年人的皮肤面积约为1.5-2平方米，重量约占体重的16%。'
        },
        {
            question: '饭前应该做多长时间的运动比较好？',
            options: ['剧烈运动1小时', '不运动最好', '轻度运动30分钟', '跑步2小时'],
            answer: 2,
            explain: '饭前30分钟做轻度运动（如散步）有助于促进食欲和消化，但不宜剧烈运动。'
        },
        {
            question: '以下哪个是传染病的传播途径？',
            options: ['空气传播', '血液传播', '食物传播', '以上都是'],
            answer: 3,
            explain: '传染病的传播途径包括空气传播、飞沫传播、接触传播、血液传播、食物和水传播等多种方式。'
        },
        {
            question: '每天喝水量大约应该是多少？',
            options: ['500毫升', '1000毫升', '1500毫升', '3000毫升'],
            answer: 2,
            explain: '中小学生每天饮水量应在1500毫升左右（约8杯水），运动后或天气炎热时需要适当增加。'
        },
        {
            question: '心理健康的表现包括？',
            options: ['经常发脾气', '能正确认识自己', '不爱与人交往', '总是感到焦虑'],
            answer: 1,
            explain: '心理健康的表现包括：能正确认识自己和他人、情绪稳定、积极乐观、能适应环境、有良好的人际关系等。'
        },
        {
            question: '遇到同学溺水时，正确的做法是？',
            options: ['跳下去救人', '大声呼救并寻找大人帮助', '假装没看见', '用竹竿去拉'],
            answer: 1,
            explain: '中小学生遇到溺水事故应立即大声呼救，寻找周围大人帮助或拨打110/120，切勿自行下水施救。'
        },
        {
            question: '以下哪种行为不利于保护听力？',
            options: ['戴耳机听很大声的音乐', '远离噪音环境', '定期检查听力', '保持耳道清洁'],
            answer: 0,
            explain: '长时间戴耳机且音量过大，会损伤听觉神经，导致听力下降。建议使用耳机时音量不超过最大音量的60%。'
        },
        {
            question: '青春期身体变化是正常的，以下哪种态度是正确的？',
            options: ['感到害怕和羞耻', '拒绝接受变化', '正确认识和接受', '不告诉任何人'],
            answer: 2,
            explain: '青春期身体变化是正常的生长发育过程，应该正确认识和接受，有疑问可以向家长、老师或校医咨询。'
        },
        {
            question: '食品安全中，以下哪种做法是正确的？',
            options: ['吃过期食品', '饭前洗手', '喝生水', '买路边摊三无食品'],
            answer: 1,
            explain: '饭前便后洗手是基本的食品安全和卫生习惯，可以有效预防肠道传染病。'
        },
        {
            question: '正确的坐姿应该是？',
            options: ['趴在桌上', '身体正直、眼睛与书本一尺远', '歪着身子', '把脚放在椅子上'],
            answer: 1,
            explain: '正确的坐姿是：身体坐直，眼睛距离书本约一尺（33厘米），胸口离桌沿一拳，握笔手指离笔尖一寸。'
        },
        {
            question: '以下哪种情况需要立即就医？',
            options: ['轻微擦伤', '持续高烧不退', '偶尔打喷嚏', '运动后出汗'],
            answer: 1,
            explain: '持续高烧不退（超过38.5°C且24小时不退）需要立即就医，可能存在严重感染或其他疾病。'
        },
        {
            question: '关于垃圾分类，以下哪个是正确的？',
            options: ['所有垃圾放一个袋子', '电池属于有害垃圾', '果皮属于其他垃圾', '塑料瓶属于有害垃圾'],
            answer: 1,
            explain: '废电池、废灯管、过期药品等属于有害垃圾，需要专门回收处理，不能随意丢弃。'
        },
        {
            question: '预防蛀牙最好的方法是？',
            options: ['不吃甜食', '早晚刷牙、使用含氟牙膏', '只喝饮料', '用牙签剔牙'],
            answer: 1,
            explain: '预防蛀牙最有效的方法是坚持早晚刷牙、使用含氟牙膏、少吃甜食、定期口腔检查。'
        },
        {
            question: '人体需要的六大营养素不包括以下哪个？',
            options: ['蛋白质', '维生素', '色素', '矿物质'],
            answer: 2,
            explain: '人体需要的六大营养素是：蛋白质、脂肪、碳水化合物、维生素、矿物质和水。色素不是营养素。'
        },
        {
            question: '关于用眼卫生，以下哪个说法是错误的？',
            options: ['看书时光线要充足', '连续看书不超过40分钟', '在黑暗中看手机不影响视力', '多做眼保健操'],
            answer: 2,
            explain: '在黑暗中看手机屏幕会加重眼睛疲劳，容易导致视力下降。用眼环境应该光线充足柔和。'
        },
        {
            question: '以下哪种运动最适合增强心肺功能？',
            options: ['下棋', '跑步', '打牌', '画画'],
            answer: 1,
            explain: '跑步、游泳、跳绳等有氧运动能有效增强心肺功能，建议每周至少进行3-5次，每次30分钟以上。'
        }
    ],

    // 当前答题状态
    currentQuiz: {
        questions: [],
        currentIndex: 0,
        correctCount: 0,
        score: 0,
        answered: false
    },

    // 初始化
    init() {
        this.bindEvents();
        this.updateUI();
    },

    // 页面进入
    onPageEnter() {
        this.updateUI();
        this.showQuizMain();
    },

    // 更新UI
    updateUI() {
        document.getElementById('quiz-score').textContent = AppState.user.score;
        document.getElementById('quiz-remaining').textContent = Math.max(0, 3 - AppState.user.quizTodayCount);
    },

    // 显示答题主界面
    showQuizMain() {
        document.getElementById('quiz-main').style.display = 'block';
        document.getElementById('quiz-playing').style.display = 'none';
        document.getElementById('quiz-result').style.display = 'none';
        document.getElementById('quiz-lottery').style.display = 'none';
        document.getElementById('quiz-prize').style.display = 'none';
    },

    // 绑定事件
    bindEvents() {
        // 开始答题按钮
        document.getElementById('btn-start-quiz').addEventListener('click', () => {
            this.startQuiz();
        });

        // 下一题按钮
        document.getElementById('btn-next-question').addEventListener('click', () => {
            this.nextQuestion();
        });

        // 抽奖按钮
        document.getElementById('btn-start-lottery').addEventListener('click', () => {
            this.startLottery();
        });

        // 登记表单提交
        document.getElementById('register-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitRegister();
        });
    },

    // 开始答题
    startQuiz() {
        // 检查答题次数
        if (AppState.user.quizTodayCount >= 3) {
            Utils.showToast('今日答题次数已用完，明天再来吧！');
            return;
        }

        // 随机抽取5道题
        const shuffled = [...this.questionBank].sort(() => Math.random() - 0.5);
        this.currentQuiz = {
            questions: shuffled.slice(0, 5),
            currentIndex: 0,
            correctCount: 0,
            score: 0,
            answered: false
        };

        // 切换到答题界面
        document.getElementById('quiz-main').style.display = 'none';
        document.getElementById('quiz-playing').style.display = 'block';

        // 显示第一题
        this.showQuestion();
    },

    // 显示题目
    showQuestion() {
        const quiz = this.currentQuiz;
        const q = quiz.questions[quiz.currentIndex];
        const total = quiz.questions.length;
        const index = quiz.currentIndex;

        // 更新进度
        document.getElementById('quiz-progress-fill').style.width = `${((index) / total) * 100}%`;
        document.getElementById('quiz-progress-text').textContent = `${index + 1}/${total}`;
        document.getElementById('question-num').textContent = `第${index + 1}题`;

        // 更新题目
        document.getElementById('question-text').textContent = q.question;

        // 生成选项
        const optionsContainer = document.getElementById('question-options');
        const labels = ['A', 'B', 'C', 'D'];
        optionsContainer.innerHTML = q.options.map((opt, i) => `
            <div class="option-btn" data-index="${i}">
                <span class="option-label">${labels[i]}</span>
                <span>${opt}</span>
            </div>
        `).join('');

        // 绑定选项点击
        optionsContainer.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (quiz.answered) return;
                this.selectAnswer(parseInt(btn.dataset.index));
            });
        });

        // 隐藏反馈
        document.getElementById('quiz-feedback').style.display = 'none';
        quiz.answered = false;
    },

    // 选择答案
    selectAnswer(selectedIndex) {
        const quiz = this.currentQuiz;
        const q = quiz.questions[quiz.currentIndex];

        quiz.answered = true;

        const options = document.querySelectorAll('.option-btn');
        const isCorrect = selectedIndex === q.answer;

        // 标记正确和错误
        options.forEach((opt, i) => {
            if (i === q.answer) {
                opt.classList.add('correct');
            }
            if (i === selectedIndex && !isCorrect) {
                opt.classList.add('wrong');
            }
        });

        // 更新分数
        if (isCorrect) {
            quiz.correctCount++;
            quiz.score += 20;
        }

        // 显示反馈
        const feedback = document.getElementById('quiz-feedback');
        feedback.style.display = 'block';
        document.getElementById('feedback-icon').textContent = isCorrect ? '🎉' : '😅';
        document.getElementById('feedback-text').textContent = isCorrect ? '回答正确！' : '回答错误';
        document.getElementById('feedback-explain').textContent = q.explain;

        // 更新按钮文字
        const nextBtn = document.getElementById('btn-next-question');
        if (quiz.currentIndex >= quiz.questions.length - 1) {
            nextBtn.textContent = '查看结果';
        } else {
            nextBtn.innerHTML = '下一题 <i class="fas fa-arrow-right"></i>';
        }

        // 更新进度
        document.getElementById('quiz-progress-fill').style.width = `${((quiz.currentIndex + 1) / quiz.questions.length) * 100}%`;
    },

    // 下一题
    nextQuestion() {
        const quiz = this.currentQuiz;

        if (quiz.currentIndex >= quiz.questions.length - 1) {
            this.showResult();
            return;
        }

        quiz.currentIndex++;
        this.showQuestion();
    },

    // 显示结果
    showResult() {
        const quiz = this.currentQuiz;

        // 更新用户数据
        AppState.user.score += quiz.score;
        AppState.user.quizTodayCount++;
        DataManager.saveUser();
        DataManager.updateStats('quizCount');

        // 切换界面
        document.getElementById('quiz-playing').style.display = 'none';
        document.getElementById('quiz-result').style.display = 'block';

        // 显示分数
        document.getElementById('result-score').textContent = quiz.score;

        // 分数圆圈颜色
        const circle = document.getElementById('result-score-circle');
        if (quiz.score >= 80) {
            circle.style.background = 'linear-gradient(135deg, #4CAF50, #81C784)';
        } else if (quiz.score >= 60) {
            circle.style.background = 'linear-gradient(135deg, #FF9800, #FFC107)';
        } else {
            circle.style.background = 'linear-gradient(135deg, #f44336, #EF5350)';
        }

        // 结果详情
        const detail = document.getElementById('result-detail');
        detail.innerHTML = `
            <p>答对 <strong>${quiz.correctCount}</strong> / ${quiz.questions.length} 题</p>
            <p>获得 <strong>${quiz.score}</strong> 积分</p>
            <p>累计积分：<strong>${AppState.user.score}</strong></p>
        `;

        // 操作按钮
        const actions = document.getElementById('result-actions');
        if (quiz.correctCount >= 3) {
            actions.innerHTML = `
                <button class="btn-primary btn-lg btn-block" id="btn-go-lottery">
                    <i class="fas fa-gift"></i> 去抽奖
                </button>
                <button class="btn-primary btn-block btn-outline" onclick="QuizModule.showQuizMain()" style="background:transparent;color:var(--primary);border:2px solid var(--primary);">
                    返回答题
                </button>
            `;
            document.getElementById('btn-go-lottery').addEventListener('click', () => {
                this.showLottery();
            });
        } else {
            actions.innerHTML = `
                <p style="color:var(--text-muted);margin-bottom:12px;">答对3题以上才能参与抽奖哦，再接再厉！</p>
                <button class="btn-primary btn-lg btn-block" onclick="QuizModule.showQuizMain()">
                    <i class="fas fa-redo"></i> 再答一次
                </button>
            `;
        }

        this.updateUI();
    },

    // 显示抽奖界面
    showLottery() {
        document.getElementById('quiz-result').style.display = 'none';
        document.getElementById('quiz-lottery').style.display = 'block';

        // 重置转盘
        document.getElementById('wheel-body').style.transform = 'rotate(0deg)';
        document.getElementById('btn-start-lottery').disabled = false;
        document.getElementById('btn-start-lottery').innerHTML = '<i class="fas fa-hand-pointer"></i> 点击抽奖';
    },

    // 开始抽奖
    startLottery() {
        const btn = document.getElementById('btn-start-lottery');
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 抽奖中...';

        // 随机奖品
        const prizes = [
            { name: '一等奖', desc: '运动手表一块', icon: '🏆', weight: 2 },
            { name: '二等奖', desc: '精美文具套装', icon: '🎁', weight: 8 },
            { name: '三等奖', desc: '健康知识手册', icon: '📚', weight: 20 },
            { name: '参与奖', desc: '健康贴纸一套', icon: '🏅', weight: 35 },
            { name: '谢谢参与', desc: '下次一定中奖！', icon: '💪', weight: 35 }
        ];

        // 加权随机
        const totalWeight = prizes.reduce((sum, p) => sum + p.weight, 0);
        let random = Math.random() * totalWeight;
        let selectedPrize = prizes[prizes.length - 1];
        let prizeIndex = prizes.length - 1;

        for (let i = 0; i < prizes.length; i++) {
            random -= prizes[i].weight;
            if (random <= 0) {
                selectedPrize = prizes[i];
                prizeIndex = i;
                break;
            }
        }

        // 转盘旋转（每个奖品占45度）
        const targetAngle = 360 * 5 + (prizeIndex * 45 + 22.5); // 5圈 + 目标角度
        const wheel = document.getElementById('wheel-body');
        wheel.style.transform = `rotate(${targetAngle}deg)`;

        // 等待动画结束后显示结果
        setTimeout(() => {
            this.showPrize(selectedPrize);
        }, 4200);
    },

    // 显示中奖结果
    showPrize(prize) {
        document.getElementById('quiz-lottery').style.display = 'none';
        document.getElementById('quiz-prize').style.display = 'block';

        document.getElementById('prize-icon').textContent = prize.icon;

        if (prize.name === '谢谢参与') {
            document.getElementById('prize-title').textContent = '下次加油！';
            document.getElementById('prize-desc').textContent = prize.desc;
            // 隐藏登记表单
            document.getElementById('register-form').style.display = 'none';
            document.querySelector('.prize-divider').style.display = 'none';
            document.querySelector('.form-tip').style.display = 'none';
        } else {
            document.getElementById('prize-title').textContent = '恭喜中奖！';
            document.getElementById('prize-desc').textContent = `你获得了 ${prize.name}：${prize.desc}`;
            // 显示登记表单
            document.getElementById('register-form').style.display = 'block';
            document.querySelector('.prize-divider').style.display = 'block';
            document.querySelector('.form-tip').style.display = 'block';
        }
    },

    // 提交登记
    submitRegister() {
        const name = document.getElementById('reg-name').value.trim();
        const school = document.getElementById('reg-school').value.trim();
        const grade = document.getElementById('reg-grade').value;
        const phone = document.getElementById('reg-phone').value.trim();

        // 验证
        if (!name) {
            Utils.showToast('请输入姓名');
            return;
        }
        if (!school) {
            Utils.showToast('请输入学校名称');
            return;
        }
        if (!grade) {
            Utils.showToast('请选择年级');
            return;
        }
        if (!Utils.isValidPhone(phone)) {
            Utils.showToast('请输入正确的手机号码');
            return;
        }

        // 保存登记信息
        const record = {
            name, school, grade, phone,
            prize: document.getElementById('prize-desc').textContent,
            score: AppState.user.score,
            date: Utils.getToday()
        };

        // 保存到localStorage
        const records = Utils.load('prizeRecords', []);
        records.push(record);
        Utils.save('prizeRecords', records);

        // 更新用户信息
        AppState.user.name = name;
        AppState.user.school = school;
        AppState.user.grade = grade;
        AppState.user.phone = phone;
        DataManager.saveUser();

        Utils.showToast('登记成功！奖品将在活动结束后统一发放');

        // 延迟返回
        setTimeout(() => {
            this.showQuizMain();
        }, 2000);
    }
};
