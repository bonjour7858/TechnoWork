const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player = {
    x: canvas.width / 2 - 15,
    y: canvas.height - 35,
    width: 30,
    height: 20,
    speed: 5,
    dx: 0
};

let bullets = [];
let enemies = [];
let score = 0;
let gameOver = false;

let keys = {};

window.addEventListener("keydown", (e) => {
    keys[e.code] = true;
    if (e.code === "Space" && !gameOver) {
        // Tirer un laser
        bullets.push({
            x: player.x + player.width / 2 - 3,
            y: player.y,
            width: 6,
            height: 12,
            speed: 7
        });
    }
});

window.addEventListener("keyup", (e) => {
    keys[e.code] = false;
});

function spawnEnemy() {
    if (Math.random() < 0.02 && !gameOver) {
        enemies.push({
            x: Math.random() * (canvas.width - 30),
            y: -20,
            width: 30,
            height: 20,
            speed: 2
        });
    }
}

// Boucle principale du jeu
function update() {
    if (gameOver) return;

    // Mouvement du joueur
    if (keys["ArrowLeft"] && player.x > 0) {
        player.x -= player.speed;
    }
    if (keys["ArrowRight"] && player.x < canvas.width - player.width) {
        player.x += player.speed;
    }

    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].y -= bullets[i].speed;
        if (bullets[i].y < 0) {
            bullets.splice(i, 1);
        }
    }

    spawnEnemy();
    for (let i = enemies.length - 1; i >= 0; i--) {
        enemies[i].y += enemies[i].speed;

        if (enemies[i].y > canvas.height) {
            gameOver = true;
        }

        for (let j = bullets.length - 1; j >= 0; j--) {
            let b = bullets[j];
            let e = enemies[i];

            if (b.x < e.x + e.width && b.x + b.width > e.x &&
                b.y < e.y + e.height && b.y + b.height > e.y) {
                enemies.splice(i, 1);
                bullets.splice(j, 1);
                score += 10;
                break;
            }
        }
    }
}

// Dessiner les éléments sur le canvas
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!gameOver) {
        // Dessiner le joueur (vaisseau)
        ctx.fillStyle = "#06b6d4";
        ctx.fillRect(player.x, player.y, player.width, player.height);

        ctx.fillStyle = "#6366f1";
        bullets.forEach(b => {
            ctx.fillRect(b.x, b.y, b.width, b.height);
        });

        ctx.fillStyle = "#ef4444";
        enemies.forEach(e => {
            ctx.fillRect(e.x, e.y, e.width, e.height);
        });

        ctx.fillStyle = "#ffffff";
        ctx.font = "16px Segoe UI";
        ctx.fillText("Score : " + score, 15, 25);
    } else {
        ctx.fillStyle = "#ffffff";
        ctx.font = "24px Segoe UI";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 10);
        ctx.font = "14px Segoe UI";
        ctx.fillText("Score final : " + score, canvas.width / 2, canvas.height / 2 + 20);
        ctx.fillText("Actualisez la page pour rejouer", canvas.width / 2, canvas.height / 2 + 50);
        ctx.textAlign = "left";
    }
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

loop();
