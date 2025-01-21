class Food {
    constructor(canvas, snake) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.snake = snake;
        this.gridSize = 20;
        this.position = { x: 0, y: 0 };
        this.spawn();
    }

    spawn() {
        const maxX = (this.canvas.width / this.gridSize) - 1;
        const maxY = (this.canvas.height / this.gridSize) - 1;
        
        do {
            this.position = {
                x: Math.floor(Math.random() * maxX) * this.gridSize,
                y: Math.floor(Math.random() * maxY) * this.gridSize
            };
        } while (this.checkCollisionWithSnake());
    }

    checkCollisionWithSnake() {
        return this.snake.body.some(segment => 
            segment.x === this.position.x && segment.y === this.position.y
        );
    }

    draw() {
        this.ctx.fillStyle = '#FF5252';
        this.ctx.fillRect(
            this.position.x,
            this.position.y,
            this.gridSize - 2,
            this.gridSize - 2
        );
    }
} 