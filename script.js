let canvas, ctx;
let goku = new Image();
goku.src = 'goku.png';

let gokuX = 50;
let gokuY;
let gokuW = 40;
let gokuH = 60;

let isJumping = false;
let jumpSpeed = 0;
let gravity = 1.5;

let obstacles = [];
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let speed = 5;
let gameRunning = false;

function startGame() {
  document.getElementById("menu").style.display = "none";
  document.getElementById("controls").style.display = "block";
  document.getElementById("gameCanvas").style.display = "block";

  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  gokuY = canvas.height - 100;

  document.addEventListener("keydown", function (e) {
    if (e.code === "Space" || e.code === "ArrowUp") jump();
  });

  document.addEventListener("touchstart", jump);

  gameRunning = true;
  obstacles = [];
  score = 0;
  spawnObstacle();
  gameLoop();
}

function jump() {
  if (!isJumping) {
    isJumping = true;
    jumpSpeed = -20;
  }
}

function spawnObstacle() {
  const distance = Math.random() * 300 + 500;
  const obstacle = {
    x: canvas.width + distance,
    y: canvas.height - 60,
    w: 30,
    h: 50
  };
  obstacles.push(obstacle);

  if (gameRunning) {
    setTimeout(spawnObstacle, 1000 + Math.random() * 1000);
  }
}

function gameLoop() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw Goku
  ctx.drawImage(goku, gokuX, gokuY, gokuW, gokuH);

  // Handle jump
  if (isJumping) {
    gokuY += jumpSpeed;
    jumpSpeed += gravity;

    if (gokuY >= canvas.height - 100) {
      gokuY = canvas.height - 100;
      isJumping = false;
    }
  }

  // Move and draw obstacles
  for (let i = 0; i < obstacles.length; i++) {
    const obs = obstacles[i];
    obs.x -= speed;

    ctx.fillStyle = "black";
    ctx.fillRect(obs.x, obs.y, obs.w, obs.h);

    // Collision detection
    if (
      gokuX + gokuW > obs.x &&
      gokuX < obs.x + obs.w &&
      gokuY + gokuH > obs.y
    ) {
      gameOver();
      return;
    }

    // Remove obstacle and increase score
    if (obs.x + obs.w < 0) {
      obstacles.splice(i, 1);
      i--;
      score++;
      if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
      }
    }
  }

  // Display score
  ctx.fillStyle = "black";
  ctx.font = "24px Arial";
  ctx.fillText("Score: " + score, 20, 40);
  ctx.fillText("High Score: " + highScore, 20, 70);

  requestAnimationFrame(gameLoop);
}

function gameOver() {
  gameRunning = false;
  alert("Game Over! Your Score: " + score);
  location.reload();
}
