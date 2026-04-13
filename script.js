const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// 🔥 HD AYARI
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

// 🎮 OYUN
let bird = { x: 100, y: 200, velocity: 0 };
let pipes = [];
let particles = [];
let hearts = [];
let clouds = [];

let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
document.getElementById("score").innerText = score;

// ☁️ BULUT
for (let i = 0; i < 6; i++) {
  clouds.push({
    x: Math.random() * window.innerWidth,
    y: Math.random() * 200,
    size: Math.random() * 60 + 40,
    speed: Math.random() * 0.5 + 0.2
  });
}

// 🟩 BORU
function createPipe() {
  const gap = Math.max(240, window.innerHeight * 0.35);
  const margin = 60;
  const top = Math.random() * (window.innerHeight - gap - margin * 2) + margin;

  pipes.push({
    x: window.innerWidth,
    width: 70,
    top,
    bottom: top + gap,
    passed: false
  });
}

// 💖 KALP
function createHeart(x, y) {
  hearts.push({
    x: x || Math.random() * window.innerWidth,
    y: y || window.innerHeight,
    size: Math.random() * 20 + 10,
    speed: Math.random() * 1 + 0.5
  });
}

// ✨ PARTICLE
function createParticles(x, y) {
  for (let i = 0; i < 10; i++) {
    particles.push({
      x,
      y,
      vx: Math.random() * 4 - 2,
      vy: Math.random() * 4 - 2,
      life: 30
    });
  }
}

// TIKLAMA
function flap() {
  bird.velocity = -9;
  createParticles(bird.x, bird.y);
  createHeart(bird.x, bird.y);
}

document.addEventListener("click", flap);
document.addEventListener("touchstart", flap);

// UPDATE
function update() {
  bird.velocity += 0.45;
  bird.y += bird.velocity;

  if (bird.y > window.innerHeight || bird.y < 0) endGame();

  pipes.forEach(p => {
    p.x -= 3;

    if (!p.passed && p.x + p.width < bird.x) {
      score++;
      p.passed = true;
      document.getElementById("score").innerText = score;
    }

    if (
      bird.x + 15 > p.x &&
      bird.x - 15 < p.x + p.width &&
      (bird.y < p.top || bird.y > p.bottom)
    ) {
      endGame();
    }
  });

  particles.forEach(pt => {
    pt.x += pt.vx;
    pt.y += pt.vy;
    pt.life--;
  });

  hearts.forEach(h => h.y -= h.speed);

  clouds.forEach(c => {
    c.x -= c.speed;
    if (c.x < -50) c.x = window.innerWidth;
  });

  if (Math.random() < 0.015) createPipe();
  if (Math.random() < 0.05) createHeart();

  particles = particles.filter(p => p.life > 0);
}

// DRAW
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 🌄 SKY GRADIENT
  let grad = ctx.createLinearGradient(0, 0, 0, window.innerHeight);
  grad.addColorStop(0, "#87ceeb");
  grad.addColorStop(1, "#e0f7ff");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

  // ☁️ CLOUDS
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  clouds.forEach(c => {
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.size, 0, Math.PI * 2);
    ctx.fill();
  });

  // 😘 KUŞ
  ctx.font = "36px Arial";
  ctx.fillText("😘", bird.x - 18, bird.y + 12);

  // 🟩 PIPES (PRO STYLE)
  pipes.forEach(p => {
    let pipeGrad = ctx.createLinearGradient(0, 0, 0, window.innerHeight);
    pipeGrad.addColorStop(0, "#00ff99");
    pipeGrad.addColorStop(1, "#006644");

    ctx.fillStyle = pipeGrad;

    ctx.fillRect(p.x, 0, p.width, p.top);
    ctx.fillRect(p.x, p.bottom, p.width, window.innerHeight);

    // cap
    ctx.fillRect(p.x - 5, p.top - 20, p.width + 10, 20);
    ctx.fillRect(p.x - 5, p.bottom, p.width + 10, 20);
  });

  // ✨ PARTICLES
  ctx.fillStyle = "white";
  particles.forEach(pt => {
    ctx.fillRect(pt.x, pt.y, 3, 3);
  });

  // 💖 HEARTS
  ctx.font = "20px Arial";
  hearts.forEach(h => {
    ctx.fillText("❤️", h.x, h.y);
  });
}

// GAME OVER
function endGame() {
  alert("Seni seviyorum ❤️ Skor: " + score);
  location.reload();
}

// LOOP
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
