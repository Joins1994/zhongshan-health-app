/**
 * 中山市中小学生健康宣传互动平台 - 答题模块 (API版)
 */

const QuizModule = {
    currentQuiz: {
        questions: [],
        currentIndex: 0,
        correctCount: 0,
        score: 0,
        answered: false
    },

    init() {
        this.bindEvents();
        this.updateUI();
    },

    onPageEnter() {
        this.updateUI();
        this.showQuizMain();
    },

    updateUI() {
        const score = AppState.user ? AppState.user.score : 0;
        document.getElementById('quiz-score').textContent = score;
        // 今日剩余次数由后端控制，这里简化显示
        document.getElementById('quiz-remaining').textContent = '3';
    },

    showQuizMain() {
        document.getElementById('quiz-main').style.display = 'block';
        document.getElementById('quiz-playing').style.display = 'none';
        document.getElementById('quiz-result').style.display = 'none';
        document.getElementById('quiz-lottery').style.display = 'none';
        document.getElementById('quiz-prize').style.display = 'none';
    },

    bindEvents() {
        document.getElementById('btn-start-quiz').addEventListener('click', () => this.startQuiz());
        document.getElementById('btn-next-question').addEventListener('click', () => this.nextQuestion());
        document.getElementById('btn-start-lottery').addEventListener('click', () => this.startLottery());
        document.getElementById('register-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitRegister();
        });
    },

    async startQuiz() {
        try {
            const res = await API.get('/api/quiz/questions?count=5');
            if (!res.success) {
                Utils.showToast('获取题目失败');
                return;
            }

            this.currentQuiz = {
                questions: res.data,
                currentIndex: 0,
                correctCount: 0,
                score: 0,
                answered: false
            };

            document.getElementById('quiz-main').style.display = 'none';
            document.getElementById('quiz-playing').style.display = 'block';
            this.showQuestion();
        } catch (e) {
            Utils.showToast('网络错误，请稍后重试');
        }
    },

    showQuestion() {
        const quiz = this.currentQuiz;
        const q = quiz.questions[quiz.currentIndex];
        const total = quiz.questions.length;
        const index = quiz.currentIndex;

        document.getElementById('quiz-progress-fill').style.width = `${((index) / total) * 100}%`;
        document.getElementById('quiz-progress-text').textContent = `${index + 1}/${total}`;
        document.getElementById('question-num').textContent = `第${index + 1}题`;
        document.getElementById('question-text').textContent = q.question;

        const optionsContainer = document.getElementById('question-options');
        const labels = ['A', 'B', 'C', 'D'];
        optionsContainer.innerHTML = q.options.map((opt, i) => `
            <div class="option-btn" data-index="${i}">
                <span class="option-label">${labels[i]}</span>
                <span>${opt}</span>
            </div>
        `).join('');

        optionsContainer.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (quiz.answered) return;
                this.selectAnswer(parseInt(btn.dataset.index));
            });
        });

        document.getElementById('quiz-feedback').style.display = 'none';
        quiz.answered = false;
    },

    selectAnswer(selectedIndex) {
        const quiz = this.currentQuiz;
        const q = quiz.questions[quiz.currentIndex];
        quiz.answered = true;

        const options = document.querySelectorAll('.option-btn');
        const isCorrect = selectedIndex === q.answer;

        options.forEach((opt, i) => {
            if (i === q.answer) opt.classList.add('correct');
            if (i === selectedIndex && !isCorrect) opt.classList.add('wrong');
        });

        if (isCorrect) {
            quiz.correctCount++;
            quiz.score += 20;
        }

        const feedback = document.getElementById('quiz-feedback');
        feedback.style.display = 'block';
        document.getElementById('feedback-icon').textContent = isCorrect ? '🎉' : '😅';
        document.getElementById('feedback-text').textContent = isCorrect ? '回答正确！' : '回答错误';
        document.getElementById('feedback-explain').textContent = q.explain;

        const nextBtn = document.getElementById('btn-next-question');
        if (quiz.currentIndex >= quiz.questions.length - 1) {
            nextBtn.textContent = '查看结果';
        } else {
            nextBtn.innerHTML = '下一题 <i class="fas fa-arrow-right"></i>';
        }

        document.getElementById('quiz-progress-fill').style.width = `${((quiz.currentIndex + 1) / quiz.questions.length) * 100}%`;
    },

    nextQuestion() {
        const quiz = this.currentQuiz;
        if (quiz.currentIndex >= quiz.questions.length - 1) {
            this.showResult();
            return;
        }
        quiz.currentIndex++;
        this.showQuestion();
    },

    async showResult() {
        const quiz = this.currentQuiz;

        // 提交答题结果到后端
        try {
            const userId = AppState.user ? AppState.user.id : 1;
            await API.post('/api/quiz/submit', {
                user_id: userId,
                score: quiz.score,
                correct_count: quiz.correctCount,
                total_count: quiz.questions.length
            });

            // 更新本地用户积分
            if (AppState.user) {
                AppState.user.score += quiz.score;
            }
        } catch (e) {
            console.error('提交答题结果失败:', e);
        }

        document.getElementById('quiz-playing').style.display = 'none';
        document.getElementById('quiz-result').style.display = 'block';
        document.getElementById('result-score').textContent = quiz.score;

        const circle = document.getElementById('result-score-circle');
        if (quiz.score >= 80) {
            circle.style.background = 'linear-gradient(135deg, #4CAF50, #81C784)';
        } else if (quiz.score >= 60) {
            circle.style.background = 'linear-gradient(135deg, #FF9800, #FFC107)';
        } else {
            circle.style.background = 'linear-gradient(135deg, #f44336, #EF5350)';
        }

        const detail = document.getElementById('result-detail');
        const totalScore = AppState.user ? AppState.user.score : quiz.score;
        detail.innerHTML = `
            <p>答对 <strong>${quiz.correctCount}</strong> / ${quiz.questions.length} 题</p>
            <p>获得 <strong>${quiz.score}</strong> 积分</p>
            <p>累计积分：<strong>${totalScore}</strong></p>
        `;

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

    showLottery() {
        document.getElementById('quiz-result').style.display = 'none';
        document.getElementById('quiz-lottery').style.display = 'block';
        document.getElementById('wheel-body').style.transform = 'rotate(0deg)';
        document.getElementById('btn-start-lottery').disabled = false;
        document.getElementById('btn-start-lottery').innerHTML = '<i class="fas fa-hand-pointer"></i> 点击抽奖';
    },

    async startLottery() {
        const btn = document.getElementById('btn-start-lottery');
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 抽奖中...';

        // 先调用后端抽奖API
        try {
            const userId = AppState.user ? AppState.user.id : 1;
            const res = await API.post('/api/quiz/lottery', { user_id: userId });
            if (!res.success) {
                Utils.showToast('抽奖失败，请重试');
                btn.disabled = false;
                return;
            }

            const prize = res.data;
            const prizeMap = {
                '一等奖': 0, '二等奖': 1, '三等奖': 2,
                '参与奖': 3, '谢谢参与': 4
            };
            const prizeIndex = prizeMap[prize.level] || 4;

            const targetAngle = 360 * 5 + (prizeIndex * 72 + 36);
            const wheel = document.getElementById('wheel-body');
            wheel.style.transform = `rotate(${targetAngle}deg)`;

            setTimeout(() => {
                this.showPrize(prize);
            }, 4200);
        } catch (e) {
            Utils.showToast('网络错误，请重试');
            btn.disabled = false;
        }
    },

    showPrize(prize) {
        document.getElementById('quiz-lottery').style.display = 'none';
        document.getElementById('quiz-prize').style.display = 'block';

        const iconMap = { '一等奖': '🏆', '二等奖': '🎁', '三等奖': '📚', '参与奖': '🏅', '谢谢参与': '💪' };
        document.getElementById('prize-icon').textContent = iconMap[prize.level] || '🎉';

        if (prize.level === '谢谢参与') {
            document.getElementById('prize-title').textContent = '下次加油！';
            document.getElementById('prize-desc').textContent = prize.desc;
            document.getElementById('register-form').style.display = 'none';
            document.querySelector('.prize-divider').style.display = 'none';
            document.querySelector('.form-tip').style.display = 'none';
        } else {
            document.getElementById('prize-title').textContent = '恭喜中奖！';
            document.getElementById('prize-desc').textContent = `你获得了 ${prize.level}：${prize.desc}`;
            document.getElementById('register-form').style.display = 'block';
            document.querySelector('.prize-divider').style.display = 'block';
            document.querySelector('.form-tip').style.display = 'block';
        }
    },

    async submitRegister() {
        const name = document.getElementById('reg-name').value.trim();
        const school = document.getElementById('reg-school').value.trim();
        const grade = document.getElementById('reg-grade').value;
        const phone = document.getElementById('reg-phone').value.trim();

        if (!name) { Utils.showToast('请输入姓名'); return; }
        if (!school) { Utils.showToast('请输入学校名称'); return; }
        if (!grade) { Utils.showToast('请选择年级'); return; }
        if (!Utils.isValidPhone(phone)) { Utils.showToast('请输入正确的手机号码'); return; }

        // 注册/更新用户信息
        try {
            const res = await API.post('/api/users/register', { name, school, grade, phone });
            if (res.success) {
                AppState.user = res.data;
                Utils.showToast('登记成功！奖品将在活动结束后统一发放');
                setTimeout(() => this.showQuizMain(), 2000);
            } else {
                Utils.showToast(res.message || '登记失败');
            }
        } catch (e) {
            Utils.showToast('网络错误，请稍后重试');
        }
    }
};
