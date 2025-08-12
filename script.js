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
});
