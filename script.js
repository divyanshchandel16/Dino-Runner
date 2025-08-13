const dino = document.querySelector(".dino");
let isJumping = false;

function jump() {
  if (isJumping) return;

  isJumping = true;
  dino.classList.add("jump");

  setTimeout(() => {
    dino.classList.remove("jump");
    isJumping = false;
  }, 500);
}

document.addEventListener("keydown", function (event) {
  if (event.code === "Space" || event.code === "ArrowUp") {
    event.preventDefault();
    jump();
  }
})

const playerEle = document.querySelector(".dino")
const obstacleEle = document.querySelector(".obstacle")

let collided = false;
function isCollision() {
  const playerRect = playerEle.getBoundingClientRect();
  const obstacleRect = obstacleEle.getBoundingClientRect();
  // console.log(playerRect)
  // console.log(obstacleRect)

  const playerL = playerRect.left;
  const playerR = playerRect.right;
  const playerB = playerRect.bottom;

  const obstacleL = obstacleRect.left;
  const obstacleR = obstacleRect.right;
  const obstacleT = obstacleRect.top;

  const xCollision = obstacleL < playerR && playerL < obstacleR;
  const yCollision = obstacleT < playerB; //to be updated later
  collided = false
  if (xCollision && yCollision)
    collided = true
  return collided;
}

function monitorCollision() {
  setInterval(() => {
    // console.log("checking")
    collided = false
    if (!collided && isCollision()) {
      console.log("collided")
      collided = true
      alert("You Died")
    }
  }, 10)
}

function main() {
  monitorCollision();
}
main();