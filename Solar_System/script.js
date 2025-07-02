//Import
import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls.js";
//////////////////////////////////////
//NOTE Creating renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
//////////////////////////////////////
const planetMaterial = new THREE.MeshStandardMaterial({
  color: 0x00ff00, // bright green
});

//////////////////////////////////////
//NOTE texture loader
const textureLoader = new THREE.TextureLoader();
//////////////////////////////////////

//////////////////////////////////////
//NOTE import all texture
const starTexture = textureLoader.load("stars.jpg");
const sunTexture = textureLoader.load("sun.jpg");
const mercuryTexture = textureLoader.load("mercury.jpg");
const venusTexture = textureLoader.load("venus.jpg");
const earthTexture = textureLoader.load("earth.jpg");
const marsTexture = textureLoader.load("mars.jpg");
const jupiterTexture = textureLoader.load("jupiter.jpg");
const saturnTexture = textureLoader.load("saturn.jpg");
const uranusTexture = textureLoader.load("uranus.jpg");
const neptuneTexture = textureLoader.load("neptune.jpg");
const saturnRingTexture = textureLoader.load("saturn_ring.png");
const uranusRingTexture = textureLoader.load("uranus_ring.png");
//////////////////////////////////////

//////////////////////////////////////
//NOTE Creating scene
const scene = new THREE.Scene();
//////////////////////////////////////

//////////////////////////////////////
//NOTE screen bg
const cubeTextureLoader = new THREE.CubeTextureLoader();
const cubeTexture = cubeTextureLoader.load([
  starTexture,
  starTexture,
  starTexture,
  starTexture,
  starTexture,
  starTexture,
]);
scene.background = cubeTexture;
//////////////////////////////////////

//////////////////////////////////////
//NOTE Perspective Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(-50, 90, 150);
////////////////////////////////////

//////////////////////////////////////
//NOTE Percpective controll
const orbit = new OrbitControls(camera, renderer.domElement);
//////////////////////////////////////

//////////////////////////////////////
//NOTE - sun
const sungeo = new THREE.SphereGeometry(15, 50, 50);
const sunMaterial = new THREE.MeshBasicMaterial({
  map: sunTexture,
});
const sun = new THREE.Mesh(sungeo, sunMaterial);
scene.add(sun);
//////////////////////////////////////

//////////////////////////////////////
//NOTE - sun light (point light)
const sunLight = new THREE.PointLight(0xffffff, 4, 300);
scene.add(sunLight);
//////////////////////////////////////

//////////////////////////////////////
//NOTE - ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0);
scene.add(ambientLight);
//////////////////////////////////////

//////////////////////////////////////
//NOTE - path for planet
const path_of_planets = [];
function createLineLoopWithMesh(radius, color, width) {
  const material = new THREE.LineBasicMaterial({
    color: color,
    linewidth: width,
  });
  const geometry = new THREE.BufferGeometry();
  const lineLoopPoints = [];

  // Calculate points for the circular path
  const numSegments = 100; // Number of segments to create the circular path
  for (let i = 0; i <= numSegments; i++) {
    const angle = (i / numSegments) * Math.PI * 2;
    const x = radius * Math.cos(angle);
    const z = radius * Math.sin(angle);
    lineLoopPoints.push(x, 0, z);
  }

  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(lineLoopPoints, 3)
  );
  const lineLoop = new THREE.LineLoop(geometry, material);
  scene.add(lineLoop);
  path_of_planets.push(lineLoop);
}
//////////////////////////////////////

/////////////////////////////////////
//NOTE: create planet
const genratePlanet = (size, planetTexture, x, ring) => {
  const planetGeometry = new THREE.SphereGeometry(size, 50, 50);
  const planetMaterial = new THREE.MeshStandardMaterial({
    map: planetTexture,
  });
  const planet = new THREE.Mesh(planetGeometry, planetMaterial);
  const planetObj = new THREE.Object3D();
  planet.position.set(x, 0, 0);
  if (ring) {
    const ringGeo = new THREE.RingGeometry(
      ring.innerRadius,
      ring.outerRadius,
      32
    );
    const ringMat = new THREE.MeshBasicMaterial({
      map: ring.ringmat,
      side: THREE.DoubleSide,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    planetObj.add(ringMesh);
    ringMesh.position.set(x, 0, 0);
    ringMesh.rotation.x = -0.5 * Math.PI;
  }
  scene.add(planetObj);

  planetObj.add(planet);
  createLineLoopWithMesh(x, 0xffffff, 3);
  return {
    planetObj: planetObj,
    planet: planet,
  };
};

const planets = [
  {
    name: "Mercury",
    ...genratePlanet(3.2, mercuryTexture, 28),
    speedData: {
      orbitSpeed: 0.004,
      rotateSpeed: 0.004
    }
  },
  {
    name: "Venus",
    ...genratePlanet(5.8, venusTexture, 44),
    speedData: {
      orbitSpeed: 0.015,
      rotateSpeed: 0.002
    }
  },
  {
    name: "Earth",
    ...genratePlanet(6, earthTexture, 62),
    speedData: {
      orbitSpeed: 0.01,
      rotateSpeed: 0.02
    }
  },
  {
    name: "Mars",
    ...genratePlanet(4, marsTexture, 78),
    speedData: {
      orbitSpeed: 0.008,
      rotateSpeed: 0.018
    }
  },
  {
    name: "Jupiter",
    ...genratePlanet(12, jupiterTexture, 100),
    speedData: {
      orbitSpeed: 0.002,
      rotateSpeed: 0.04
    }
  },
  {
    name: "Saturn",
    ...genratePlanet(10, saturnTexture, 138, {
      innerRadius: 10,
      outerRadius: 20,
      ringmat: saturnRingTexture,
    }),
    speedData: {
      orbitSpeed: 0.0009,
      rotateSpeed: 0.038
    }
  },
  {
    name: "Uranus",
    ...genratePlanet(7, uranusTexture, 176, {
      innerRadius: 7,
      outerRadius: 12,
      ringmat: uranusRingTexture,
    }),
    speedData: {
      orbitSpeed: 0.0004,
      rotateSpeed: 0.03
    }
  },
  {
    name: "Neptune",
    ...genratePlanet(7, neptuneTexture, 200),
    speedData: {
      orbitSpeed: 0.0001,
      rotateSpeed: 0.032
    }
  },
  
];

//////////////////////////////////////

//////////////////////////////////////
//NOTE - GUI options
var GUI = dat.gui.GUI;
const gui = new GUI();
const options = {
  "Real view": true,
  "Show path": true,
  speed: 1,
};
gui.add(options, "Real view").onChange((e) => {
  ambientLight.intensity = e ? 0 : 0.5;
});
gui.add(options, "Show path").onChange((e) => {
  path_of_planets.forEach((dpath) => {
    dpath.visible = e;
  });
});
const maxSpeed = new URL(window.location.href).searchParams.get("ms")*1
gui.add(options, "speed", 0, maxSpeed?maxSpeed:20);

//////////////////////////////////////

//////////////////////////////////////
//NOTE - animate function
function animate() {
  sun.rotateY(options.speed * 0.004);

  planets.forEach(({ planetObj, planet, speedData }) => {
    planetObj.rotateY(speedData.orbitSpeed * options.speed);
    planet.rotateY(speedData.rotateSpeed * options.speed);
  });

  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

planets.forEach(({ name, speedData }) => {
  const folder = gui.addFolder(name);
  folder.add(speedData, "orbitSpeed", 0, 0.05).name("Orbit Speed");
  folder.add(speedData, "rotateSpeed", 0, 0.05).name("Self Rotation");
});

//////////////////////////////////////

//////////////////////////////////////
//NOTE - resize camera view
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
//////////////////////////////////////