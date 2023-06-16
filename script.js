document.addEventListener('DOMContentLoaded', function () {
    // 頁面元素
    var homepage = document.getElementById('homepage');
    var gamepage = document.getElementById('gamepage');
    var gameOverPage = document.getElementById('gameOverPage');
    var colorPicker = document.getElementById('colorPicker');
    var startGameButton = document.getElementById('startGameButton');
    var playAgainButton = document.getElementById('playAgainButton');
    var goToHomePageButton = document.getElementById('goToHomePageButton');
    var finalScore = document.getElementById('finalScore');
    var scoreDisplay = document.getElementById('score');

    // 遊戲元素
    var canvas = document.getElementById('game');
    var ctx = canvas.getContext('2d');
    var tileSize = 40;
    var direction = 'right';
    var snake;
    var apple;
    var score;
    var snakeColor;

    // 事件處理器
    startGameButton.addEventListener('click', function () {
        snakeColor = colorPicker.value;
        homepage.style.display = 'none';
        gamepage.style.display = 'block';
        startGame();
    });

    playAgainButton.addEventListener('click', function () {
        gameOverPage.style.display = 'none';
        gamepage.style.display = 'block';
        startGame();
    });

    goToHomePageButton.addEventListener('click', function () {
        gameOverPage.style.display = 'none';
        homepage.style.display = 'block';
    });

    function startGame() {
        direction = 'right';
        snake = [
            { x: 10, y: 10 },
            { x: 9, y: 10 },
            { x: 8, y: 10 },
        ];
        score = 0;
        spawnApple();
        updateScore();
        gameLoop();
    }

    document.addEventListener('keydown', function (e) {
        var newDirection = e.key.substr(5).toLowerCase();
        if ((newDirection == 'up' && direction != 'down') ||
            (newDirection == 'down' && direction != 'up') ||
            (newDirection == 'left' && direction != 'right') ||
            (newDirection == 'right' && direction != 'left')) {
            direction = newDirection;
        }
    });

    function gameLoop() {
        var head = Object.assign({}, snake[0]);
    
        switch (direction) {
            case 'right':
                head.x++;
                break;
            case 'left':
                head.x--;
                break;
            case 'up':
                head.y--;
                break;
            case 'down':
                head.y++;
                break;
        }
    
        if (head.x === apple.x && head.y === apple.y) {
            score++;
            updateScore();
            spawnApple();
        } else {
            snake.pop();
        }
    
        snake.unshift(head);
    
        if (head.x < 1 || head.y < 1 || head.x >= canvas.width / tileSize - 1 || head.y >= canvas.height / tileSize - 1 || checkCollision(head, snake.slice(1))) {
            gameOver();
            return;
        }
    
        // 清除畫布
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    
        // 繪製背景（白色）
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    
        // 繪製外圍牆（黑色）
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, tileSize);
        ctx.fillRect(0, canvas.height - tileSize, canvas.width, tileSize);
        ctx.fillRect(0, 0, tileSize, canvas.height);
        ctx.fillRect(canvas.width - tileSize, 0, tileSize, canvas.height);
    
        // 繪製蛇
        ctx.fillStyle = snakeColor;
        for (var i = 0; i < snake.length; i++) {
            ctx.fillRect(snake[i].x * tileSize, snake[i].y * tileSize, tileSize, tileSize);
        }
    
        // 繪製蘋果
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(apple.x * tileSize, apple.y * tileSize, tileSize, tileSize);
    
        // 設置遊戲速度
        setTimeout(gameLoop, 100);
    }
    

    function spawnApple() {
        var maxPosition = (canvas.width / tileSize) - 3;
        apple = {
            x: Math.floor(Math.random() * maxPosition) + 2,
            y: Math.floor(Math.random() * maxPosition) + 2
        };
    }

    function updateScore() {
        scoreDisplay.textContent = '分數: ' + score;
    }

    function checkCollision(head, array) {
        for (var i = 0; i < array.length; i++) {
            if (head.x === array[i].x && head.y === array[i].y) {
                return true;
            }
        }
        return false;
    }

    function gameOver() {
        gamepage.style.display = 'none';
        gameOverPage.style.display = 'block';
        finalScore.textContent = '你的分數: ' + score;
    }
});
