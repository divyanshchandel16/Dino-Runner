const dino = document.querySelector(".dino");
let isJumping = false;



const jumpSound = new Audio("./assets/sounds/jump2.wav");

function jump() {
  if (isJumping) return;

  isJumping = true;
  dino.classList.add("jump");


  jumpSound.currentTime = 0;
  jumpSound.play();

  setTimeout(() => {
    dino.classList.remove("jump");
    isJumping = false;
  }, 1200);
}

document.addEventListener("keydown", function (event) {
  if (event.code === "Space" || event.code === "ArrowUp") {
    event.preventDefault();
    jump();
  }
})

// Collision Detection
const playerEle = document.querySelector(".dino")
const obstacleEle = document.querySelector(".obstacle")

let collided = false;
let collisionInterval = null;
let scoreInterval = null;

function isCollision() {
  const playerRect = playerEle.getBoundingClientRect();
  const obstacleRect = obstacleEle.getBoundingClientRect();
  console.log(playerRect)
  console.log(obstacleRect)

  const playerL = playerRect.left;
  const playerR = playerRect.right;
  const playerB = playerRect.bottom;

  const obstacleL = obstacleRect.left;
  const obstacleR = obstacleRect.right;
  const obstacleT = obstacleRect.top;

  const xCollision = obstacleL < playerR && playerL < obstacleR;
  const yCollision = obstacleT < playerB; 
  collided = false
  if (xCollision && yCollision) collided = true
  return collided;
}

function monitorCollision() {
  // store the interval so we can clear it on stop
  collisionInterval = setInterval(() => {
    collided = false
    if (!collided && isCollision()) {
      collided = true
      // update high score
      if (highScore < score) {
        highScore = score
        localStorage.setItem('highScore', String(highScore))
        showhighScore.innerText = highScore
      }
      stopGame()
      setScore(0)
    }
  }, 10)
}

// Restart Screen
const restartGameElement = document.querySelector('.restart-screen')
const gameContainer = document.querySelector('.game-container')
const restartBtn = document.querySelector('.btn-restart')

function stopGame(){
  // clear running intervals
  if (collisionInterval) clearInterval(collisionInterval)
  if (scoreInterval) clearInterval(scoreInterval)

  // pause obstacle, background
  if (obstacleEle) obstacleEle.style.animationPlayState = 'paused'
  if (gameContainer) gameContainer.style.animationPlayState = 'paused'

  // show restart overlay
  restartGameElement.classList.add('show')
}

let score = 0
let highScore = parseInt(localStorage.getItem('highScore')) || 0
let showScore = document.querySelector('.score')
let showhighScore = document.querySelector('.highScore')

function setScore(newScore) {
  score = newScore
}

function updateScore() {
  // store interval so it can be cleared when game stops
  scoreInterval = setInterval(() => {
    setScore(score + 1)
    if (showScore) showScore.innerText = score
  }, 100)
  // ensure collision monitor runs
  monitorCollision();
}

// restart button to reload the page.
if (restartBtn) {
  restartBtn.addEventListener('click', () => {
    location.reload()
  })
}

// show high score from local storage on load
if (showhighScore) showhighScore.innerText = highScore
function main() {
  updateScore();
}
main();