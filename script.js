console.log(THREE);
const container = document.getElementById("canvas-container");

/* SCENE */
const scene = new THREE.Scene();

/* CAMERA */
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 6);

/* RENDERER */
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.physicallyCorrectLights = true;
container.appendChild(renderer.domElement);

/* TEXTURE LOADER */
const loader = new THREE.TextureLoader();

/* ENV MAP (FAKE HDRI) */
const envTexture = loader.load("assets/env.jpg");
envTexture.mapping = THREE.EquirectangularReflectionMapping;
scene.environment = envTexture;

/* LIGHT */
const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(5, 5, 5);
scene.add(light);

/* CARD DATA */
const images = [
  "assets/img1.jpg",
  "assets/img2.jpg",
  "assets/img3.jpg",
  "assets/img4.jpg",
  "assets/img5.jpg"
];

const cards = [];
const spacing = 2.6;

/* CREATE CARD */
function createCard(texturePath, i) {
  const texture = loader.load(texturePath);

  /* IMAGE PLANE */
  const planeGeo = new THREE.PlaneGeometry(2, 3);
  const planeMat = new THREE.MeshStandardMaterial({
    map: texture,
    metalness: 0.2,
    roughness: 0.6
  });

  const plane = new THREE.Mesh(planeGeo, planeMat);

  /* GOLD FRAME (EXTRUDE) */
  const shape = new THREE.Shape();
  shape.moveTo(-1.1, -1.6);
  shape.lineTo(1.1, -1.6);
  shape.lineTo(1.1, 1.6);
  shape.lineTo(-1.1, 1.6);
  shape.lineTo(-1.1, -1.6);

  const hole = new THREE.Path();
  hole.moveTo(-1, -1.5);
  hole.lineTo(1, -1.5);
  hole.lineTo(1, 1.5);
  hole.lineTo(-1, 1.5);
  hole.lineTo(-1, -1.5);

  shape.holes.push(hole);

  const extrudeGeo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.1,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.05
  });

  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    metalness: 1,
    roughness: 0.2,
    envMapIntensity: 1.5
  });

  const frame = new THREE.Mesh(extrudeGeo, goldMat);

  /* GROUP */
  const group = new THREE.Group();
  group.add(frame);
  group.add(plane);

  group.position.x = i * spacing;

  scene.add(group);
  return group;
}

/* CREATE ALL CARDS */
images.forEach((img, i) => {
  cards.push(createCard(img, i));
});

let index = 0;

/* UPDATE POSITION */
function update() {
  cards.forEach((card, i) => {
    card.position.x = (i - index) * spacing;

    card.rotation.y = (i - index) * -0.4;

    const scale = i === index ? 1.2 : 0.9;
    card.scale.set(scale, scale, scale);
  });
}

/* PARTICLE SYSTEM */
const particles = new THREE.BufferGeometry();
const particleCount = 200;

const posArray = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount * 3; i++) {
  posArray[i] = (Math.random() - 0.5) * 20;
}

particles.setAttribute("position", new THREE.BufferAttribute(posArray, 3));

const particleMat = new THREE.PointsMaterial({
  size: 0.05,
  color: 0xffffff
});

const particleMesh = new THREE.Points(particles, particleMat);
scene.add(particleMesh);

/* SWIPE */
let startX = 0;

window.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
});

window.addEventListener("touchend", e => {
  let diff = e.changedTouches[0].clientX - startX;

  if (diff < -50) index = (index + 1) % cards.length;
  if (diff > 50) index = (index - 1 + cards.length) % cards.length;

  update();
});

/* CINEMATIC CAMERA */
function animate() {
  requestAnimationFrame(animate);

  camera.position.x += ((index * spacing) - camera.position.x) * 0.05;

  particleMesh.rotation.y += 0.0005;

  renderer.render(scene, camera);
}

update();
animate();

/* RESIZE */
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
