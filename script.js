const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();

// oyun durumu
let started = false;
let gameOver = false;

// sesler
const startSound = new Audio("https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg");
const flapSound = new Audio("https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg");

// kuş
let bird = { x: 100, y: 200, velocity: 0 };

// pipes
let pipes = [];
let score = 0;

// highscore
let highScore = localStorage.getItem("highScore") || 0;
document.getElementById("highScore").innerText = "En iyi: " + highScore;

// 💖 LOGO → MESAJ → START AKIŞI
setTimeout(() => {
  document.getElementById("logoScreen").style.display = "none";
  document.getElementById("messageBox").style.display = "flex";

  setTimeout(() => {
    document.getElementById("messageBox").style.display = "none";
    document.getElementById("startScreen").style.display = "flex";
  }, 2000);

}, 2000);

// boru
function createPipe() {
  const gap = window.innerHeight * 0.45;
  const margin = 80;

  const top = Math.random() * (window.innerHeight - gap - margin * 2) + margin;

  pipes.push({
    x: window.innerWidth,
    width: 60,
    top,
    bottom: top + gap,
    passed: false
  });
}

// dokunma
function flap() {

  if (!started) {
    started = true;
    startSound.play();
    document.getElementById("startScreen").style.display = "none";
    return;
  }

  if (gameOver) {
    location.reload();
    return;
  }

  bird.velocity = -8;
  flapSound.play();
}

document.addEventListener("click", flap);
document.addEventListener("touchstart", flap);

// update
function update() {
  if (!started || gameOver) return;

  bird.velocity += 0.4;
  bird.y += bird.velocity;

  if (bird.y > window.innerHeight || bird.y < 0) endGame();

  pipes.forEach(p => {
    p.x -= 2;

    if (!p.passed && p.x < bird.x) {
      score++;
      p.passed = true;
      document.getElementById("score").innerText = score;
    }

    if (
      bird.x > p.x &&
      bird.x < p.x + 60 &&
      (bird.y < p.top || bird.y > p.bottom)
    ) endGame();
  });

  if (pipes.length === 0 || window.innerWidth - pipes[pipes.length - 1].x > 400) {
    createPipe();
  }
}

// draw
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.font = "35px Arial";
  ctx.fillText("😘", bird.x, bird.y);

  ctx.fillStyle = "green";
  pipes.forEach(p => {
    ctx.fillRect(p.x, 0, 60, p.top);
    ctx.fillRect(p.x, p.bottom, 60, canvas.height);
  });
}

// end
function endGame() {
  gameOver = true;

  if (score > highScore) {
    localStorage.setItem("highScore", score);
  }
}

// loop
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
