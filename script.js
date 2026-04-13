const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// HD
function resize() {
  const scale = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * scale;
  canvas.height = window.innerHeight * scale;
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
}
resize();
window.addEventListener("resize", resize);

// OYUN DURUMU
let started = false;
let gameOver = false;

// KUŞ
let bird = {
  x: 100,
  y: window.innerHeight / 2,
  velocity: 0
};

let pipes = [];
let score = 0;

// BORU
function createPipe() {
  const gap = window.innerHeight * 0.45;
  const margin = 80;

  const minY = margin;
  const maxY = window.innerHeight - gap - margin;

  const top = Math.random() * (maxY - minY) + minY;

  pipes.push({
    x: window.innerWidth,
    width: 60,
    top: top,
    bottom: top + gap,
    passed: false
  });
}

// TIKLAMA
function flap() {
  // ilk dokunuş → başlat
  if (!started) {
    started = true;
    return;
  }

  // ölüyse restart
  if (gameOver) {
    reset();
    return;
  }

  bird.velocity = -8;
}

document.addEventListener("click", flap);
document.addEventListener("touchstart", flap);

// UPDATE
function update() {
  if (!started || gameOver) return;

  bird.velocity += 0.4;
  bird.y += bird.velocity;

  if (bird.y > window.innerHeight || bird.y < 0) {
    gameOver = true;
  }

  pipes.forEach(p => {
    p.x -= 2;

    if (!p.passed && p.x + p.width < bird.x) {
      score++;
      p.passed = true;
      document.getElementById("score").innerText = score;
    }

    const birdTop = bird.y - 15;
    const birdBottom = bird.y + 15;

    if (
      bird.x + 15 > p.x &&
      bird.x - 15 < p.x + p.width &&
      (birdTop < p.top || birdBottom > p.bottom)
    ) {
      gameOver = true;
    }
  });

  if (
    pipes.length === 0 ||
    window.innerWidth - pipes[pipes.length - 1].x > 400
  ) {
    createPipe();
  }
}

// RESET
function reset() {
  bird.y = window.innerHeight / 2;
  bird.velocity = 0;
  pipes = [];
  score = 0;
  gameOver = false;
  started = false;
  document.getElementById("score").innerText = score;
}

// ÇİZ
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // kuş
  ctx.font = "35px Arial";
  ctx.fillText("😘", bird.x - 15, bird.y + 10);

  // borular
  ctx.fillStyle = "#2ecc71";
  pipes.forEach(p => {
    ctx.fillRect(p.x, 0, p.width, p.top);
    ctx.fillRect(p.x, p.bottom, p.width, window.innerHeight);
  });

  // 🟡 BAŞLANGIÇ YAZISI
  if (!started) {
    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Dokunarak Başla 💖", 50, window.innerHeight / 2);
  }

  // 💀 GAME OVER YAZISI
  if (gameOver) {
    ctx.font = "30px Arial";
    ctx.fillStyle = "red";
    ctx.fillText("Seni seviyorum ❤️", 50, window.innerHeight / 2);
    ctx.fillText("Tekrar dokun", 50, window.innerHeight / 2 + 40);
  }
}

// LOOP
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
