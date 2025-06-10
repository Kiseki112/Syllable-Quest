// This script animates a GLTF 3D model to move left and right across the page.
// Requires: three.js and GLTFLoader loaded in your HTML.

let scene, camera, renderer, model, mixer, clock;
let direction = 1; // 1 = right, -1 = left
let speed = 0.01; // Movement speed

function init3DModel(containerId, modelUrl) {
  const container = document.getElementById(containerId);

  // Renderer
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setClearColor(0x000000, 0);
  renderer.setSize(container.offsetWidth, container.offsetHeight);
  container.appendChild(renderer.domElement);

  // Scene & Camera
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(30, container.offsetWidth / container.offsetHeight, 0.1, 1000);
  camera.position.set(0, 1.5, 4);

  // Lighting
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
  hemiLight.position.set(0, 2, 0);
  scene.add(hemiLight);
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(2, 4, 2);
  scene.add(dirLight);

  // Load Model
  const loader = new THREE.GLTFLoader();
  loader.load(modelUrl, function(gltf) {
    model = gltf.scene;
    model.position.set(0, -1.1, 0);
    model.scale.set(1.2, 1.2, 1.2);
    scene.add(model);

    // Animation
    if (gltf.animations && gltf.animations.length) {
      mixer = new THREE.AnimationMixer(model);
      mixer.clipAction(gltf.animations[0]).play();
    }
  });

  // Animate
  clock = new THREE.Clock();
  animate();
}

function animate() {
  requestAnimationFrame(animate);

  // Move model left and right
  if (model) {
    model.position.x += speed * direction;
    // Reverse direction at bounds
    if (model.position.x > 2) direction = -1;
    if (model.position.x < -2) direction = 1;
    // Optional: slight rotation for effect
    model.rotation.y += 0.01 * direction;
  }

  if (mixer) mixer.update(clock.getDelta());
  renderer.render(scene, camera);
}

// Example usage (in your HTML):
// <div id="model-container" style="width:400px;height:400px;"></div>
// <script src="https://cdn.jsdelivr.net/npm/three@0.153.0/build/three.min.js"></script>
// <script src="https://cdn.jsdelivr.net/npm/three@0.153.0/examples/js/loaders/GLTFLoader.js"></script>
// <script src="3Dmodel.js"></script>
// <script>init3DModel('model-container', 'scene.gltf');</script>