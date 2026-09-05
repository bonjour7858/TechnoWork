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
const crystalGeometry = new THREE.OctahedronGeometry(0.3);
const crystalMaterial = new THREE.MeshStandardMaterial({ color: 0x06b6d4, emissive: 0x06b6d4, emissiveIntensity: 0.5 });

function spawnCrystal() {
    const crystal = new THREE.Mesh(crystalGeometry, crystalMaterial);
    crystal.position.set((Math.random() - 0.5) * 6, 0, -15 - Math.random() * 10);
    scene.add(crystal);
    crystals.push(crystal);
}

for(let i = 0; i < 5; i++) {
    spawnCrystal();
}

let score = 0;
const scoreDisplay = document.getElementById("score");

// Commandes clavier
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

// Boucle d'animation 3D
function animate() {
    requestAnimationFrame(animate);

    if (moveLeft && ship.position.x > -3) ship.position.x -= 0.1;
    if (moveRight && ship.position.x < 3) ship.position.x += 0.1;

    ship.rotation.z = -ship.position.x * 0.3;

    for (let i = crystals.length - 1; i >= 0; i--) {
        let c = crystals[i];
        c.position.z += 0.08; 
        c.rotation.y += 0.02; 

        let distance = ship.position.distanceTo(c.position);
        if (distance < 1.0) {
            scene.remove(c);
            crystals.splice(i, 1);
            score += 1;
            scoreDisplay.innerText = "Cristaux : " + score;
            spawnCrystal(); 
        }
        
        else if (c.position.z > 2) {
            scene.remove(c);
            crystals.splice(i, 1);
            spawnCrystal();
        }
    }

    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});
