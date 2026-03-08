// game start (Game State)
let gameStarted = false;

// game end (Game State)
let gameOver = false;

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// score awal
let score = 0;

// catatan highscore
let highScore = localStorage.getItem("snakeHighScore") || 0;

// membuat visual grid
let gridSize = 20;

// Membuat ular
let snake = [
    { x: 200, y: 200 }
];

// makanan ular
let food = {
    x: 100,
    y: 100,
    type: "normal"
};

// obstacle
let obstacles = [
    { x: 160, y: 160 },
    { x: 180, y: 160 },
    { x: 200, y: 160 },
    { x: 220, y: 160 }
];

// Variabel Arah
let dx = 20;
let dy = 0;

// Game Loop
function gameLoop() {

    // START SCREEN
    if (!gameStarted) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.fillText("Press Arrow Key To Start", 80, 200);

        return;
    }

    // GAME OVER SCREEN
    if (gameOver) {

        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "red";
        ctx.font = "30px Arial";
        ctx.fillText("GAME OVER", 105, 150);

        ctx.fillStyle = "white";
        ctx.font = "18px Arial";
        ctx.fillText("Score: " + score, 160, 200);

        ctx.fillStyle = "lightgreen";
        ctx.font = "18px Arial";
        ctx.fillText("High Score: " + highScore, 140, 220);

        ctx.fillStyle = "white";
        ctx.fillText("Press Space To Restart", 100, 260);

        return;
    }

    // bersihkan canvas
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Panggil Grid
    drawGrid();

    //panggil obstacle
    obstacles.forEach(function (rock) {
        ctx.fillStyle = "gray";
        ctx.fillRect(rock.x, rock.y, 20, 20);
    });

    // tampilkan score
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText("Score: " + score, 10, 20);
    ctx.fillText("High Score: " + highScore, 10, 40);

    // posisi kepala
    const head = {
        x: snake[0].x + dx,
        y: snake[0].y + dy
    };

    // cek tabrakan
    if (checkCollision(head)) {

        if (score > highScore) {
            highScore = score;
            localStorage.setItem("snakeHighScore", highScore);
        }

        gameOver = true;
        return;
    }

    snake.unshift(head);

    // jenis makanan dan poin
    if (head.x === food.x && head.y === food.y) {

        if (food.type === "normal") {
            score += 1;
        }

        if (food.type === "bonus") {
            score += 3;
        }

        if (food.type === "double") {
            score += 2;
        }

        spawnFood();

    } else {
        snake.pop();
    }

    // gambar ular
    snake.forEach(function (part, index) {

        if (index === 0) {
            ctx.fillStyle = "yellow"; // kepala
        } else {
            ctx.fillStyle = "lime"; // tubuh
        }

        ctx.fillRect(part.x, part.y, 20, 20);

    });
    // gambar makanan
    if (food.type === "normal") ctx.fillStyle = "red";
    if (food.type === "bonus") ctx.fillStyle = "purple";
    if (food.type === "double") ctx.fillStyle = "green";

    ctx.fillRect(food.x, food.y, 20, 20);
}

setInterval(gameLoop, 100);

// event keyboard
document.addEventListener("keydown", changeDirection);

// fungsi arah
function changeDirection(event) {

    const key = event.key;

    // restart game
    if (gameOver && key === " ") {
        resetGame();
        return;
    }

    if (!gameStarted) {
        gameStarted = true;
    }

    if (key === "ArrowUp") {
        dx = 0;
        dy = -20;
    }

    if (key === "ArrowDown") {
        dx = 0;
        dy = 20;
    }

    if (key === "ArrowLeft") {
        dx = -20;
        dy = 0;
    }

    if (key === "ArrowRight") {
        dx = 20;
        dy = 0;
    }

}

// Function tabrakan
function checkCollision(head) {

    // tabrak dinding
    if (
        head.x < 0 ||
        head.y < 0 ||
        head.x >= canvas.width ||
        head.y >= canvas.height
    ) {
        return true;
    }

    // tabrak tubuh sendiri
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }

    // tabrak obstacle
    for (let rock of obstacles) {
        if (head.x === rock.x && head.y === rock.y) {
            return true;
        }
    }

    return false;
}

// fungsi reset game
function resetGame() {

    snake = [{ x: 200, y: 200 }];

    dx = 20;
    dy = 0;

    score = 0;

    gameStarted = false;
    gameOver = false;

    food = {
        x: Math.floor(Math.random() * 20) * 20,
        y: Math.floor(Math.random() * 20) * 20
    };

}

// fungsi grid
function drawGrid() {

    ctx.strokeStyle = "#333";

    for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }

}

// random food
function spawnFood() {

    const types = ["normal", "bonus", "double"];
    const randomType = types[Math.floor(Math.random() * types.length)];

    let newX;
    let newY;
    let validPosition = false;

    while (!validPosition) {

        newX = Math.floor(Math.random() * 20) * 20;
        newY = Math.floor(Math.random() * 20) * 20;

        validPosition = true;

        for (let part of snake) {
            if (part.x === newX && part.y === newY) {
                validPosition = false;
                break;
            }
        }

        for (let rock of obstacles) {
            if (rock.x === newX && rock.y === newY) {
                validPosition = false;
                break;
            }
        }

    }

    food = {
        x: newX,
        y: newY,
        type: randomType
    };

}