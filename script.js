const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

let bird = {
  x: 80,
  y: 200,
  velocity: 0,
  gravity: 0.5,
  lift: -10
};

let pipes = [];
let score = 0;
let gameOver = false;

function createPipe() {
  let gap = 200;
  let top = Math.random() * (canvas.height - gap);

  pipes.push({
    x: canvas.width,
    width: 70,
    top: top,
    bottom: top + gap,
    passed: false
  });
}

function flap() {
  if (gameOver) {
    location.reload();
  } else {
    bird.velocity = bird.lift;
  }
}

document.addEventListener("click", flap);
document.addEventListener("touchstart", flap);

function update() {
  if (gameOver) return;

  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  if (bird.y > canvas.height || bird.y < 0) endGame();

  pipes.forEach(pipe => {
    pipe.x -= 3;

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

  if (Math.random() < 0.02) createPipe();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.font = "30px Arial";
  ctx.fillText("😘", bird.x - 15, bird.y + 10);

  ctx.fillStyle = "green";
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
    ctx.fillRect(pipe.x, pipe.bottom, pipe.width, canvas.height);
  });
}

function endGame() {
  gameOver = true;
  document.getElementById("gameOver").style.display = "block";
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
