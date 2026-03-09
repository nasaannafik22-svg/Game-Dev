// Splash Screen Handler
const splashScreen = document.getElementById('splashScreen');

// Auto hide splash screen after 2.5 seconds
setTimeout(() => {
    hideSplashScreen();
}, 2500);

// Hide on tap
splashScreen.addEventListener('click', function () {
    hideSplashScreen();
});

// Hide on key press
document.addEventListener('keydown', function () {
    hideSplashScreen();
});

function hideSplashScreen() {
    splashScreen.classList.add('hidden');
    // Optional: Remove from DOM after animation
    setTimeout(() => {
        splashScreen.style.display = 'none';
    }, 800);
}

// Game state
let gameStarted = false;
let gameOver = false;
let gameLoopInterval;

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("scoreDisplay");
const highScoreDisplay = document.getElementById("highScoreDisplay");

// Score
let score = 0;
let highScore = localStorage.getItem("snakeHighScore") || 0;
highScoreDisplay.textContent = highScore;

// Visual grid
let gridSize = 20;

// Snake
let snake = [{ x: 200, y: 200 }];

// Food
let food = {
    x: 100,
    y: 100,
    type: "normal"
};

// Obstacles
let obstacles = [
    { x: 160, y: 160 },
    { x: 180, y: 160 },
    { x: 200, y: 160 },
    { x: 220, y: 160 }
];

// Direction
let dx = 20;
let dy = 0;

// Food colors
const foodColors = {
    normal: "#ff4444",
    bonus: "#aa44ff",
    double: "#44ff44"
};

// Touch prevention untuk canvas
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (gameOver) {
        resetGame();
    }
});

// Game Loop
function gameLoop() {
    if (!gameStarted) {
        drawStartScreen();
        return;
    }

    if (gameOver) {
        drawGameOverScreen();
        return;
    }

    updateGame();
}

function drawStartScreen() {
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#0f0f1a');
    gradient.addColorStop(1, '#1a1a2e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawGrid();

    ctx.shadowColor = '#a0a0ff';
    ctx.shadowBlur = 15;
    ctx.fillStyle = "white";
    ctx.font = "bold 24px 'Segoe UI', Arial";
    ctx.textAlign = "center";
    ctx.fillText("SNAKE GAME", canvas.width / 2, 150);

    ctx.shadowBlur = 8;
    ctx.font = "18px 'Segoe UI', Arial";
    ctx.fillStyle = "#a0a0ff";
    ctx.fillText("Tekan Tombol Untuk Mulai", canvas.width / 2, 220);

    // Draw snake preview
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#44ff44";
    ctx.fillRect(180, 280, 20, 20);
    ctx.fillStyle = "#88ff88";
    ctx.fillRect(160, 280, 20, 20);
    ctx.fillStyle = "#ccffcc";
    ctx.fillRect(140, 280, 20, 20);
}

function drawGameOverScreen() {
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#1a0f0f');
    gradient.addColorStop(1, '#2e1a1a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawGrid();

    ctx.shadowColor = '#ff4444';
    ctx.shadowBlur = 15;
    ctx.fillStyle = "#ff6b6b";
    ctx.font = "bold 28px 'Segoe UI', Arial";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, 140);

    ctx.shadowBlur = 8;
    ctx.font = "20px 'Segoe UI', Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Score: " + score, canvas.width / 2, 200);

    ctx.fillStyle = "#ffd700";
    ctx.font = "bold 22px 'Segoe UI', Arial";
    ctx.fillText("High Score: " + highScore, canvas.width / 2, 240);

    ctx.shadowColor = '#88ff88';
    ctx.fillStyle = "#a0ffa0";
    ctx.font = "18px 'Segoe UI', Arial";
    ctx.fillText("Tekan SPACE atau Tap Canvas", canvas.width / 2, 300);
}

function updateGame() {
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#0f0f1a');
    gradient.addColorStop(1, '#1a1a2e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawGrid();

    // Gambar obstacle
    obstacles.forEach(function (rock) {
        ctx.shadowColor = '#000';
        ctx.shadowBlur = 5;
        ctx.fillStyle = "#4a4a6a";
        ctx.fillRect(rock.x + 2, rock.y + 2, 20, 20);

        ctx.shadowBlur = 10;
        ctx.fillStyle = "#6a6a8a";
        ctx.fillRect(rock.x, rock.y, 20, 20);
    });

    scoreDisplay.textContent = score;

    const head = {
        x: snake[0].x + dx,
        y: snake[0].y + dy
    };

    if (checkCollision(head)) {
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("snakeHighScore", highScore);
            highScoreDisplay.textContent = highScore;
        }
        gameOver = true;
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        if (food.type === "normal") score += 1;
        if (food.type === "bonus") score += 3;
        if (food.type === "double") score += 2;
        spawnFood();
    } else {
        snake.pop();
    }

    // gambar ular
    snake.forEach(function (part, index) {
        ctx.shadowBlur = index === 0 ? 15 : 10;
        ctx.shadowColor = index === 0 ? '#ffffaa' : '#88ff88';

        if (index === 0) {
            ctx.fillStyle = "#ffffaa";
        } else {
            const brightness = 80 + (index % 3) * 20;
            ctx.fillStyle = `rgb(${brightness}, 255, ${brightness})`;
        }

        ctx.fillRect(part.x, part.y, 19, 19);

        // Mata untuk kepala
        if (index === 0) {
            ctx.shadowBlur = 0;
            ctx.fillStyle = "#000";
            if (dx > 0) {
                ctx.fillRect(part.x + 12, part.y + 5, 3, 3);
                ctx.fillRect(part.x + 12, part.y + 12, 3, 3);
            } else if (dx < 0) {
                ctx.fillRect(part.x + 4, part.y + 5, 3, 3);
                ctx.fillRect(part.x + 4, part.y + 12, 3, 3);
            } else if (dy > 0) {
                ctx.fillRect(part.x + 5, part.y + 12, 3, 3);
                ctx.fillRect(part.x + 12, part.y + 12, 3, 3);
            } else {
                ctx.fillRect(part.x + 5, part.y + 4, 3, 3);
                ctx.fillRect(part.x + 12, part.y + 4, 3, 3);
            }
        }
    });

    // gambar makanan
    ctx.shadowBlur = 15;
    ctx.shadowColor = foodColors[food.type];
    ctx.fillStyle = foodColors[food.type];

    const pulse = Math.sin(Date.now() * 0.01) * 2;
    ctx.fillRect(food.x - pulse / 2, food.y - pulse / 2, 20 + pulse, 20 + pulse);

    ctx.shadowBlur = 0;
}

function drawGrid() {
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 0.5;

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

function checkCollision(head) {
    if (head.x < 0 || head.y < 0 || head.x >= canvas.width || head.y >= canvas.height) {
        return true;
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }

    for (let rock of obstacles) {
        if (head.x === rock.x && head.y === rock.y) {
            return true;
        }
    }

    return false;
}

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

function resetGame() {
    snake = [{ x: 200, y: 200 }];
    dx = 20;
    dy = 0;
    score = 0;
    gameStarted = false;
    gameOver = false;
    scoreDisplay.textContent = "0";

    food = {
        x: Math.floor(Math.random() * 20) * 20,
        y: Math.floor(Math.random() * 20) * 20,
        type: "normal"
    };
}

// Event Listeners
document.addEventListener("keydown", changeDirection);

canvas.addEventListener("click", function () {
    if (gameOver) {
        resetGame();
    }
});

canvas.addEventListener("touchend", function (e) {
    e.preventDefault();
    if (gameOver) {
        resetGame();
    }
});

function changeDirection(event) {
    const key = event.key;

    if (gameOver && key === " ") {
        resetGame();
        return;
    }

    if (!gameStarted && key.startsWith("Arrow")) {
        gameStarted = true;
    }

    if (key === "ArrowUp" && dy === 0) {
        dx = 0;
        dy = -20;
        event.preventDefault();
    } else if (key === "ArrowDown" && dy === 0) {
        dx = 0;
        dy = 20;
        event.preventDefault();
    } else if (key === "ArrowLeft" && dx === 0) {
        dx = -20;
        dy = 0;
        event.preventDefault();
    } else if (key === "ArrowRight" && dx === 0) {
        dx = 20;
        dy = 0;
        event.preventDefault();
    }
}

// Mobile Controls dengan touch events yang lebih responsif
// =======================
// SWIPE CONTROL (MOBILE)
// =======================

let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener("touchstart", function (e) {
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
}, false);

canvas.addEventListener("touchend", function (e) {
    const touch = e.changedTouches[0];
    let touchEndX = touch.clientX;
    let touchEndY = touch.clientY;

    let diffX = touchEndX - touchStartX;
    let diffY = touchEndY - touchStartY;

    if (!gameStarted) gameStarted = true;

    // Swipe horizontal
    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0 && dx === 0) {
            dx = 20;
            dy = 0;
        }
        if (diffX < 0 && dx === 0) {
            dx = -20;
            dy = 0;
        }
    }
    // Swipe vertical
    else {
        if (diffY > 0 && dy === 0) {
            dx = 0;
            dy = 20;
        }
        if (diffY < 0 && dy === 0) {
            dx = 0;
            dy = -20;
        }
    }
}, false);

// Start game loop
gameLoopInterval = setInterval(gameLoop, 100);