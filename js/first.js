const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");


canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let bird = { x: 300, y: 250, width: 20, height: 20, velocity: 0 };
let gravity = 0.4;
let lift = -8;
let pipes = [];
let pipeGap = 180;
let pipeWidth = 60;
let gameOver = false;

// Bird movement
document.addEventListener("keydown", (event) => {
    if(event.key===" ")
    bird.velocity = lift;
});

// Pipe creation
function generatePipes() {
    let pipeY = Math.floor(Math.random() * (canvas.height - pipeGap - 50)) + 20;
    pipes.push({ x: canvas.width, y: pipeY, passed: false });
}

// Game loop
function updateGame() {
    if (gameOver) return;

    bird.velocity += gravity;
    bird.y += bird.velocity;

    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        gameOver = true;
    }

    pipes.forEach(pipe => {
        pipe.x -= 5;
        
        if (pipe.x + pipeWidth < 0) {
            pipes.shift();
        }

        if (!pipe.passed && pipe.x + pipeWidth < bird.x) {
            pipe.passed = true;
        }

        if (
            bird.x < pipe.x + pipeWidth && bird.x + bird.width > pipe.x &&
            (bird.y < pipe.y || bird.y + bird.height > pipe.y + pipeGap)
        ) {
            gameOver = true;
        }
    });

    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 350) {
        generatePipes();
    }

    drawGame();
}

// Draw game elements
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

    ctx.fillStyle = "red";
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.y);
        ctx.fillRect(pipe.x, pipe.y + pipeGap, pipeWidth, canvas.height - pipe.y - pipeGap);
    });

    if (gameOver) {
        ctx.fillStyle = "black";
        ctx.font = "24px Arial";
        ctx.fillText("Game Over!", canvas.width / 3, canvas.height / 2);
    }
}

setInterval(updateGame, 20);
