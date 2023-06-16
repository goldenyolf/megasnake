// 等待頁面載入完成
document.addEventListener("DOMContentLoaded", function () {
    // 獲取 HTML 元素和設置一些基本變量
    const canvas = document.getElementById("game");
    const ctx = canvas.getContext("2d");
    const tileSize = 40;
    let snake, apple, score, speed, direction, interval;

    // 註冊按鈕事件監聽器
    document.getElementById("startGameButton").addEventListener("click", startGame);
    document.getElementById("playAgainButton").addEventListener("click", startGame);
    document.getElementById("goToHomePageButton").addEventListener("click", goToHomePage);

    // 開始遊戲函數
    function startGame() {
        // 初始化蛇的位置，分數，速度和方向
        snake = [{ x: 5, y: 5 }];
        score = 0;
        speed = parseFloat(document.getElementById("difficultyPicker").value) * 100;
        direction = "right";
        spawnApple(); // 生成蘋果
        clearInterval(interval); // 清除先前的遊戲循環
        interval = setInterval(gameLoop, speed); // 啟動新的遊戲循環
        // 顯示遊戲頁面，隱藏其他頁面
        document.getElementById("homepage").style.display = "none";
        document.getElementById("gameOverPage").style.display = "none";
        document.getElementById("gamepage").style.display = "block";
    }

    // 返回首頁函數
    function goToHomePage() {
        clearInterval(interval); // 停止遊戲循環
        // 顯示首頁，隱藏其他頁面
        document.getElementById("homepage").style.display = "block";
        document.getElementById("gameOverPage").style.display = "none";
        document.getElementById("gamepage").style.display = "none";
    }

    // 遊戲主循環
    function gameLoop() {
        // 計算蛇頭的新位置
        let headX = snake[0].x;
        let headY = snake[0].y;
        switch (direction) {
            case "right":
                headX++;
                break;
            case "left":
                headX--;
                break;
            case "up":
                headY--;
                break;
            case "down":
                headY++;
                break;
        }

        // 檢查是否撞到牆壁或自己
        if (headX < 1 || headY < 1 || headX >= canvas.width / tileSize - 1 || headY >= canvas.height / tileSize - 1 || checkCollision({ x: headX, y: headY }, snake)) {
            gameOver(); // 遊戲結束
            return;
        }

        // 檢查是否吃到蘋果
        const appleCollision = checkCollision({ x: headX, y: headY }, [apple]);
        if (appleCollision) {
            score++; // 增加分數
            spawnApple(); // 生成新的蘋果
        } else {
            snake.pop(); // 移除蛇的尾巴
        }

        // 添加新的頭到蛇的開頭
        snake.unshift({ x: headX, y: headY });

        // 繪製遊戲區域
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 繪製黑色的牆壁
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, tileSize);
        ctx.fillRect(0, canvas.height - tileSize, canvas.width, tileSize);
        ctx.fillRect(0, 0, tileSize, canvas.height);
        ctx.fillRect(canvas.width - tileSize, 0, tileSize, canvas.height);

        // 繪製蘋果
        ctx.fillStyle = "red";
        ctx.fillRect(apple.x * tileSize, apple.y * tileSize, tileSize, tileSize);

        // 繪製蛇
        ctx.fillStyle = "green";
        for (let i = 0; i < snake.length; i++) {
            ctx.fillRect(snake[i].x * tileSize, snake[i].y * tileSize, tileSize, tileSize);
        }

        // 顯示當前分數
        document.getElementById("score").innerText = "分數: " + score;
    }

    // 生成蘋果的函數
    function spawnApple() {
        do {
            apple = { x: Math.floor(Math.random() * (canvas.width / tileSize - 2)) + 1, y: Math.floor(Math.random() * (canvas.height / tileSize - 2)) + 1 };
        } while (checkCollision(apple, snake));
    }

    // 檢查兩個位置是否碰撞
    function checkCollision(position, array) {
        for (let i = 0; i < array.length; i++) {
            if (position.x === array[i].x && position.y === array[i].y) {
                return true;
            }
        }
        return false;
    }

    // 遊戲結束的函數
    function gameOver() {
        clearInterval(interval); // 停止遊戲循環
        // 顯示遊戲結束頁面，更新分數
        document.getElementById("finalScore").innerText = "你的分數: " + score;
        document.getElementById("gamepage").style.display = "none";
        document.getElementById("gameOverPage").style.display = "block";
    }

    // 監聽鍵盤事件以改變蛇的方向
    document.addEventListener("keydown", function (e) {
        const newDirection = { 37: "left", 38: "up", 39: "right", 40: "down" }[e.keyCode];
        if (newDirection) {
            direction = newDirection;
        }
    });
});
