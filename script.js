let score = 0;

const asteroid = document.getElementById("asteroid");
const scoreDisplay = document.getElementById("score");

asteroid.addEventListener("click", () => {
    score++;
    scoreDisplay.innerText = "Score : " + score;

    const randomX = Math.floor(Math.random() * 420);
    const randomY = Math.floor(Math.random() * 220) + 40;

    asteroid.style.left = randomX + "px";
    asteroid.style.top = randomY + "px";
});
