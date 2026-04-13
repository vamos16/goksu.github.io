const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

let bird = {
  x: 100,
  y: 200,
  velocity: 0,
  gravity: 0.5,
  lift: -10
};

let pipes = [];
let score = 0;
let gameOver = false;

// ✅ GÜVENLİ BORU SİSTEMİ
function createPipe() {
  const gap = Math.max(220, canvas.height * 0.35); 
  const margin = 50; // üst alt boşluk

  const top = Math.random() * (canvas.height - gap - margin * 2) + margin;

  pipes.push({
    x: canvas.width,
    width: 60,
    top: top,
    bottom: top + gap,
    passed: false
  });
}

// TIKLAMA
function flap() {
  if (gameOver) {
    location.reload();
  } else {
    bird.velocity = bird.lift;
  }
}

document.addEventListener("click", flap);
document.addEventListener("touchstart", flap);

// GÜNCELLE
function update() {
  if (gameOver) return;

  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  if (bird.y > canvas.height || bird.y < 0) {
    endGame();
  }

  pipes.forEach(pipe => {
    pipe.x -= 2.5;

    // skor
    if (!pipe.passed && pipe.x + pipe.width < bird.x) {
      score++;
      pipe.passed = true;
      document.getElementById("score").innerText = score;
    }

    // çarpışma (daha doğru hitbox)
    const birdTop = bird.y - 15;
    const birdBottom = bird.y + 15;
    const birdLeft = bird.x - 15;
    const birdRight = bird.x + 15;

    if (
      birdRight > pipe.x &&
      birdLeft < pipe.x + pipe.width &&
      (birdTop < pipe.top || birdBottom > pipe.bottom)
    ) {
      endGame();
    }
  });

  // 🧠 borular arası mesafe garantili
  if (
    pipes.length === 0 ||
    canvas.width - pipes[pipes.length - 1].x > 300
  ) {
    createPipe();
  }
}

// ÇİZ
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // kuş
  ctx.font = "35px Arial";
  ctx.fillText("😘", bird.x - 15, bird.y + 10);

  // borular
  ctx.fillStyle = "green";
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
    ctx.fillRect(pipe.x, pipe.bottom, pipe.width, canvas.height);
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
