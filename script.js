const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// 😘 KUŞ
let bird = {
  x: 100,
  y: 200,
  velocity: 0,
  gravity: 0.45,
  lift: -9
};

let pipes = [];
let hearts = [];
let clouds = [];
let score = 0;
let gameOver = false;

// ☁️ BULUT OLUŞTUR
for (let i = 0; i < 5; i++) {
  clouds.push({
    x: Math.random() * canvas.width,
    y: Math.random() * 200,
    size: Math.random() * 50 + 50
  });
}

// 🟩 BORU (DAHA KOLAY)
function createPipe() {
  let gap = 260; // ÇOK GENİŞ (kolaylık)
  let top = Math.random() * (canvas.height - gap);

  pipes.push({
    x: canvas.width,
    width: 60,
    top: top,
    bottom: top + gap,
    passed: false
  });
}

// 💖 KALP
function createHeart(x, y) {
  hearts.push({
    x: x || Math.random() * canvas.width,
    y: y || canvas.height,
    size: Math.random() * 20 + 10
  });
}

// TIKLAMA
function flap() {
  if (gameOver) {
    location.reload();
  } else {
    bird.velocity = bird.lift;

    // ✨ zıplama efekti
    for (let i = 0; i < 3; i++) {
      createHeart(bird.x, bird.y);
    }
  }
}

document.addEventListener("click", flap);
document.addEventListener("touchstart", flap);

// GÜNCELLE
function update() {
  if (gameOver) return;

  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  if (bird.y > canvas.height || bird.y < 0) endGame();

  pipes.forEach(pipe => {
    pipe.x -= 2.5; // YAVAŞ

    if (!pipe.passed && pipe.x + pipe.width < bird.x) {
      score++;
      pipe.passed = true;
      document.getElementById("score").innerText = score;
    }

    if (
      bird.x + 15 > pipe.x &&
      bird.x - 15 < pipe.x + pipe.width &&
      (bird.y < pipe.top || bird.y > pipe.bottom)
    ) {
      endGame();
    }
  });

  hearts.forEach(h => h.y -= 1);

  if (Math.random() < 0.01) createPipe(); // DAHA SEYREK
  if (Math.random() < 0.06) createHeart();
}

// ÇİZ
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // ☁️ BULUTLAR
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  clouds.forEach(c => {
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.size, 0, Math.PI * 2);
    ctx.fill();
    c.x -= 0.5;
    if (c.x < -50) c.x = canvas.width;
  });

  // 😘 KUŞ
  ctx.font = "35px Arial";
  ctx.fillText("😘", bird.x - 15, bird.y + 10);

  // BORULAR
  ctx.fillStyle = "#2ecc71";
  pipes.forEach(pipe => {
    ctx.shadowColor = "black";
    ctx.shadowBlur = 15;

    ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
    ctx.fillRect(pipe.x, pipe.bottom, pipe.width, canvas.height);

    ctx.shadowBlur = 0;
  });

  // 💖 KALPLER
  ctx.font = "20px Arial";
  hearts.forEach(h => {
    ctx.fillText("❤️", h.x, h.y);
  });
}

// GAME OVER
function endGame() {
  gameOver = true;
  document.getElementById("gameOver").style.display = "block";
}

// LOOP
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
