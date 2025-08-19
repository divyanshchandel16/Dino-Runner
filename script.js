// ========== ELEMENT SELECTORS ==========
const dino = document.querySelector(".dino");
const dinoHitbox = document.querySelector('.dino-hitbox');
const dinoImg = document.querySelector('.dino-img');
const obstacleEle = document.querySelector(".obstacle");
const showScore = document.querySelector(".score");
const showHighScore = document.querySelector(".highScore");
const startBtn = document.getElementById("startBtn");
const gameContainer = document.querySelector(".game-container");

// ========== GAME STATE ==========
let isJumping = false;
let collided = false;
let score = 0;
let highScore = localStorage.getItem("highScore")
  ? parseInt(localStorage.getItem("highScore"))
  : 0;
let gameStarted = false;
let scoreInterval = null;
let collisionInterval = null;

// ========== SOUND SETUP ==========
const sounds = {
  start: new Audio("./assets/sounds/start.wav"),
  jump: new Audio("./assets/sounds/jump.wav"),
  gameOver: new Audio("./assets/sounds/game-end.wav"),
  running: new Audio("./assets/sounds/running.wav"),
  milestone100: new Audio("./assets/sounds/milestone.mp3"),
  milestone200: new Audio("./assets/sounds/milestone.mp3"),
  milestone300: new Audio("./assets/sounds/milestone.mp3"),
  newHighScore: new Audio("./assets/sounds/highscore.mp3"),
};

// Preload all sounds
Object.values(sounds).forEach((audio) => {
  audio.preload = "auto";
});
sounds.running.loop = true;

// ========== AUDIO SEQUENCE ==========
function playStartThenRunning() {
  sounds.start.currentTime = 0;
  sounds.start.play().catch(() => {
    sounds.running.play();
  });

  sounds.start.addEventListener("ended", function onEnded() {
    sounds.running.currentTime = 0;
    sounds.running.play();
    sounds.start.removeEventListener("ended", onEnded);
  });
}

// ========== JUMP FUNCTION ==========
function jump() {
  if (!gameStarted || isJumping) return;
  isJumping = true;

  // Apply animation class to the dino container (so bottom changes) and also
  // to the hitbox and visual image so they remain in sync.
  dino.classList.add("jump");
  if (dinoHitbox) dinoHitbox.classList.add('jump');
  if (dinoImg) dinoImg.classList.add('jump');

  sounds.jump.currentTime = 0;
  sounds.jump.play();

  // CSS animation duration is 1.9s (1900ms)
  setTimeout(() => {
  dino.classList.remove("jump");
  if (dinoHitbox) dinoHitbox.classList.remove('jump');
  if (dinoImg) dinoImg.classList.remove('jump');
    isJumping = false;
  }, 1900);
}

// ========== COLLISION DETECTION ==========
function isCollision() {
  // Collision is based on the smaller .dino-hitbox element (centered inside .dino)
  const player = (dinoHitbox || dino).getBoundingClientRect();
  const obstacle = obstacleEle.getBoundingClientRect();

  const xCollision = obstacle.left < player.right && player.left < obstacle.right;
  const yCollision = obstacle.top < player.bottom;

  return xCollision && yCollision;
}

// ========== MONITOR COLLISION ==========
function startCollisionMonitor() {
  collisionInterval = setInterval(() => {
    if (!collided && isCollision()) {
      collided = true;
      sounds.running.pause();
      sounds.running.currentTime = 0;

      sounds.gameOver.currentTime = 0;
      sounds.gameOver.play();

      setTimeout(() => {
        alert("You Died");

        if (score > highScore) {
          highScore = score;
          localStorage.setItem("highScore", highScore);
          showHighScore.innerText = highScore;
          sounds.newHighScore.currentTime = 0;
          sounds.newHighScore.play();
        }

        resetGame();
      }, 100);
    }
  }, 10);
}

// ========== SCORE MANAGEMENT ==========
function startScoreCounter() {
  scoreInterval = setInterval(() => {
    if (!collided && gameStarted) {
      score += 1;
      showScore.innerText = score;

      if (score === 100) sounds.milestone100.play();
      else if (score === 200) sounds.milestone200.play();
      else if (score === 300) sounds.milestone300.play();
    }
  }, 100);
}

// ========== RESET GAME ==========
function resetGame() {
  clearInterval(scoreInterval);
  clearInterval(collisionInterval);
  gameContainer.classList.remove("scrolling");
  obstacleEle.classList.remove("moving");
  score = 0;
  showScore.innerText = score;
  collided = false;
  gameStarted = false;
  startBtn.style.display = "inline-block";
}

// ========== START GAME ==========
startBtn.addEventListener("click", () => {
  if (!gameStarted) {
    startBtn.style.display = "none";
    gameStarted = true;
    gameContainer.classList.add("scrolling");
    obstacleEle.classList.add("moving");
    playStartThenRunning();
    startScoreCounter();
    startCollisionMonitor();
  }
});

// ========== KEY HANDLING ==========
document.addEventListener("keydown", function (event) {
  if ((event.code === "Space" || event.code === "ArrowUp") && gameStarted) {
    event.preventDefault();
    jump();
  }
});

// allow clicking/tapping the game container to jump
gameContainer.addEventListener('click', () => {
  if (gameStarted) jump();
});

// ========== INITIALIZE UI ==========
showScore.innerText = score;
showHighScore.innerText = highScore;
