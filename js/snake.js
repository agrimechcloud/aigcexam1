class Snake {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.gridSize = 20;
        
        // 加载狗头图片
        this.headImage = new Image();
        this.headImage.src = 'assets/images/dog-head.png';
        
        this.reset();
    }

    reset() {
        // 初始化蛇的位置在画布中央
        const startX = Math.floor(this.canvas.width / (2 * this.gridSize)) * this.gridSize;
        const startY = Math.floor(this.canvas.height / (2 * this.gridSize)) * this.gridSize;
        
        this.body = [
            { x: startX, y: startY },
            { x: startX - this.gridSize, y: startY },
            { x: startX - this.gridSize * 2, y: startY }
        ];
        
        this.direction = 'right';
        this.nextDirection = 'right';
    }

    draw() {
        this.body.forEach((segment, index) => {
            if (index === 0) {
                // 绘制狗头
                if (this.headImage.complete) {
                    // 保存当前上下文状态
                    this.ctx.save();
                    
                    // 移动到蛇头位置
                    this.ctx.translate(segment.x + this.gridSize / 2, segment.y + this.gridSize / 2);
                    
                    // 根据移动方向旋转
                    const rotations = {
                        'up': -Math.PI / 2,
                        'down': Math.PI / 2,
                        'left': Math.PI,
                        'right': 0
                    };
                    this.ctx.rotate(rotations[this.direction]);
                    
                    // 绘制图片
                    this.ctx.drawImage(
                        this.headImage,
                        -this.gridSize / 2,
                        -this.gridSize / 2,
                        this.gridSize,
                        this.gridSize
                    );
                    
                    // 恢复上下文状态
                    this.ctx.restore();
                }
            } else {
                // 蛇身
                this.ctx.fillStyle = '#4CAF50';
                this.ctx.fillRect(segment.x, segment.y, this.gridSize - 2, this.gridSize - 2);
            }
        });
    }

    move() {
        this.direction = this.nextDirection;
        const head = { x: this.body[0].x, y: this.body[0].y };

        switch (this.direction) {
            case 'up':
                head.y -= this.gridSize;
                break;
            case 'down':
                head.y += this.gridSize;
                break;
            case 'left':
                head.x -= this.gridSize;
                break;
            case 'right':
                head.x += this.gridSize;
                break;
        }

        this.body.unshift(head);
        this.body.pop();
    }

    grow() {
        // 复制蛇尾作为新的身体段
        const tail = { ...this.body[this.body.length - 1] };
        this.body.push(tail);
    }

    changeDirection(newDirection) {
        const opposites = {
            'up': 'down',
            'down': 'up',
            'left': 'right',
            'right': 'left'
        };

        // 防止反向移动
        if (opposites[newDirection] !== this.direction) {
            this.nextDirection = newDirection;
        }
    }

    checkCollision() {
        const head = this.body[0];
        
        // 检查是否撞墙
        if (head.x < 0 || head.x >= this.canvas.width ||
            head.y < 0 || head.y >= this.canvas.height) {
            return true;
        }

        // 检查是否撞到自己
        for (let i = 1; i < this.body.length; i++) {
            if (head.x === this.body[i].x && head.y === this.body[i].y) {
                return true;
            }
        }

        return false;
    }
} 