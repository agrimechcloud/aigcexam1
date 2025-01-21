class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.canvas.width = 400;
        this.canvas.height = 400;
        this.ctx = this.canvas.getContext('2d');
        
        this.snake = new Snake(this.canvas);
        this.food = new Food(this.canvas, this.snake);
        
        this.score = 0;
        this.highScore = localStorage.getItem('snakeHighScore') || 0;
        this.gameLoop = null;
        this.isPaused = false;
        
        // 音效状态
        this.soundEnabled = true;
        
        this.initializeControls();
        this.updateScore();

        // 初始化音效
        this.sounds = {
            eat: new Audio('assets/sounds/eat.mp3'),
            gameOver: new Audio('assets/sounds/gameover.mp3')
        };

        // 设置音量
        Object.values(this.sounds).forEach(sound => {
            sound.volume = 0.3;
        });
    }

    initializeControls() {
        document.getElementById('startBtn').addEventListener('click', () => this.start());
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
        
        document.addEventListener('keydown', (e) => {
            const keyActions = {
                'ArrowUp': 'up',
                'ArrowDown': 'down',
                'ArrowLeft': 'left',
                'ArrowRight': 'right',
                'w': 'up',
                's': 'down',
                'a': 'left',
                'd': 'right'
            };

            if (keyActions[e.key]) {
                e.preventDefault();
                this.snake.changeDirection(keyActions[e.key]);
            }
        });

        // 添加音效控制
        const soundBtn = document.getElementById('soundBtn');
        soundBtn.addEventListener('click', () => {
            this.soundEnabled = !this.soundEnabled;
            soundBtn.textContent = `音效: ${this.soundEnabled ? '开' : '关'}`;
        });
    }

    start() {
        if (this.gameLoop) return;
        
        this.reset();
        this.gameLoop = setInterval(() => this.update(), 150);
        document.getElementById('startBtn').disabled = true;
        document.getElementById('pauseBtn').disabled = false;
    }

    reset() {
        this.snake.reset();
        this.food.spawn();
        this.score = 0;
        this.updateScore();
        this.isPaused = false;
    }

    togglePause() {
        if (!this.gameLoop) return;
        
        if (this.isPaused) {
            this.gameLoop = setInterval(() => this.update(), 150);
            document.getElementById('pauseBtn').textContent = '暂停';
        } else {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
            document.getElementById('pauseBtn').textContent = '继续';
        }
        this.isPaused = !this.isPaused;
    }

    playSound(soundName) {
        if (this.soundEnabled && this.sounds[soundName]) {
            this.sounds[soundName].currentTime = 0;
            this.sounds[soundName].play().catch(err => console.log('音频播放失败:', err));
        }
    }

    update() {
        this.snake.move();

        // 检查是否吃到食物
        if (this.snake.body[0].x === this.food.position.x &&
            this.snake.body[0].y === this.food.position.y) {
            this.snake.grow();
            this.food.spawn();
            this.score += 10;
            this.updateScore();
            
            // 播放吃食物音效
            this.playSound('eat');
        }

        // 检查游戏是否结束
        if (this.snake.checkCollision()) {
            this.gameOver();
            return;
        }

        // 清空画布并重新绘制
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.snake.draw();
        this.food.draw();
    }

    gameOver() {
        clearInterval(this.gameLoop);
        this.gameLoop = null;
        
        // 播放游戏结束音效
        this.playSound('gameOver');
        
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('snakeHighScore', this.highScore);
            this.updateScore();
        }

        alert(`游戏结束！\n你的得分：${this.score}`);
        document.getElementById('startBtn').disabled = false;
        document.getElementById('pauseBtn').disabled = true;
    }

    updateScore() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('highScore').textContent = this.highScore;
    }
}

// 初始化游戏
window.onload = () => {
    const game = new Game();
}; 