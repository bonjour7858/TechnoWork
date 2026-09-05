window.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById("canvas-container");
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x05070c);

    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 3, 6);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x06b6d4, 2, 50);
    pointLight.position.set(0, 5, 2);
    scene.add(pointLight);

    const shipGeometry = new THREE.ConeGeometry(0.5, 1.2, 4);
    const shipMaterial = new THREE.MeshStandardMaterial({ color: 0x6366f1, roughness: 0.3 });
    const ship = new THREE.Mesh(shipGeometry, shipMaterial);
    ship.rotation.x = Math.PI / 2;
    scene.add(ship);

    let crystals = [];
    let obstacles = [];
    let score = 0;
    let isGameOver = false;

    let gameSpeed = 0.08; 
    let currentDifficulty = 'moyen';

    const crystalGeometry = new THREE.OctahedronGeometry(0.3);
    const crystalMaterial = new THREE.MeshStandardMaterial({ color: 0x06b6d4, emissive: 0x06b6d4, emissiveIntensity: 0.5 });

    const obstacleGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const obstacleMaterial = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.4 });

    const scoreDisplay = document.getElementById("score");
    const gameOverScreen = document.getElementById("game-over-screen");
    const finalScoreDisplay = document.getElementById("final-score");

    window.setDifficulty = function(level) {
        currentDifficulty = level;
        
        document.querySelectorAll('.diff-btn').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');

        switch(level) {
            case 'facile':
                gameSpeed = 0.05;
                break;
            case 'moyen':
                gameSpeed = 0.08;
                break;
            case 'difficile':
                gameSpeed = 0.12;
                break;
            case 'hard':
                gameSpeed = 0.16;
                break;
            case 'impossible':
                gameSpeed = 0.22;
                break;
        }
        restartGame();
    }

    function spawnCrystal() {
        const crystal = new THREE.Mesh(crystalGeometry, crystalMaterial);
        crystal.position.set((Math.random() - 0.5) * 5, 0, -15 - Math.random() * 10);
        scene.add(crystal);
        crystals.push(crystal);
    }

    function spawnObstacle() {
        const obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
        obstacle.position.set((Math.random() - 0.5) * 5, 0, -20 - Math.random() * 10);
        scene.add(obstacle);
        obstacles.push(obstacle);
    }

    for (let i = 0; i < 4; i++) {
        spawnCrystal();
    }
    for (let i = 0; i < 3; i++) {
        spawnObstacle();
    }

    let moveLeft = false;
    let moveRight = false;

    window.addEventListener("keydown", (e) => {
        if (e.code === "ArrowLeft") moveLeft = true;
        if (e.code === "ArrowRight") moveRight = true;
    });

    window.addEventListener("keyup", (e) => {
        if (e.code === "ArrowLeft") moveLeft = false;
        if (e.code === "ArrowRight") moveRight = false;
    });

    container.addEventListener("touchmove", (e) => {
        let touchX = e.touches[0].clientX;
        let rect = container.getBoundingClientRect();
        let xRelatif = touchX - rect.left;
        
        let targetX = (xRelatif / container.clientWidth) * 6 - 3;
        if (targetX < -3) targetX = -3;
        if (targetX > 3) targetX = 3;
        ship.position.x = targetX;
    }, { passive: true });

    function animate() {
        if (isGameOver) return;

        requestAnimationFrame(animate);

        if (moveLeft && ship.position.x > -3) {
            ship.position.x -= 0.1;
        }
        if (moveRight && ship.position.x < 3) {
            ship.position.x += 0.1;
        }

        ship.rotation.z = -ship.position.x * 0.3;

        for (let i = crystals.length - 1; i >= 0; i--) {
            let c = crystals[i];
            c.position.z += gameSpeed;
            c.rotation.y += 0.02;

            if (ship.position.distanceTo(c.position) < 1.0) {
                scene.remove(c);
                crystals.splice(i, 1);
                score += 1;
                scoreDisplay.innerText = "Cristaux : " + score;
                spawnCrystal();
            } else if (c.position.z > 2) {
                scene.remove(c);
                crystals.splice(i, 1);
                spawnCrystal();
            }
        }

        for (let i = obstacles.length - 1; i >= 0; i--) {
            let o = obstacles[i];
            o.position.z += gameSpeed + 0.01;
            o.rotation.x += 0.01;

            if (ship.position.distanceTo(o.position) < 0.9) {
                isGameOver = true;
                finalScoreDisplay.innerText = "Score final : " + score;
                gameOverScreen.classList.remove("hidden");
            } else if (o.position.z > 2) {
                scene.remove(o);
                obstacles.splice(i, 1);
                spawnObstacle();
            }
        }

        renderer.render(scene, camera);
    }

    animate();

    window.restartGame = function() {
        crystals.forEach(c => scene.remove(c));
        obstacles.forEach(o => scene.remove(o));
        crystals = [];
        obstacles = [];

        score = 0;
        scoreDisplay.innerText = "Cristaux : " + score;
        ship.position.x = 0;
        isGameOver = false;
        gameOverScreen.classList.add("hidden");

        for (let i = 0; i < 4; i++) {
            spawnCrystal();
        }
        for (let i = 0; i < 3; i++) {
            spawnObstacle();
        }

        animate();
    };

    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
});
