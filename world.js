import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.186.0/build/three.module.js';

const overlay = document.querySelector('#map-overlay');
if (!overlay) throw new Error('System map is missing.');

const destinations = [
  {
    id: 'index',
    file: 'index.html',
    name: 'Home base',
    code: '00',
    hint: 'Start here',
    position: [0, 1.0, 0],
  },
  {
    id: 'research',
    file: 'research.html',
    name: 'Research reef',
    code: '01',
    hint: 'Research Catalog',
    position: [-8.2, 0, -1.8],
  },
  {
    id: 'projects',
    file: 'projects.html',
    name: 'Build bay',
    code: '02',
    hint: 'Projects',
    position: [-4.6, 0, -8.1],
  },
  {
    id: 'experience',
    file: 'experience.html',
    name: 'Field station',
    code: '03',
    hint: 'Experience',
    position: [4.7, 0, -8.0],
  },
  {
    id: 'leadership',
    file: 'leadership.html',
    name: 'Crew quarters',
    code: '04',
    hint: 'Leadership & Volunteering',
    position: [8.4, 0, -1.4],
  },
  {
    id: 'hobbies',
    file: 'hobbies.html',
    name: 'The studio',
    code: '05',
    hint: 'Hobbies',
    position: [6.0, 0, 6.9],
  },
  {
    id: 'awards',
    file: 'awards.html',
    name: 'Signal summit',
    code: '06',
    hint: 'Awards & Milestones',
    position: [-5.0, 0, 7.4],
  },
];

const routePage = document.body.className.match(
  /page-(index|research|projects|experience|leadership|hobbies|awards)/,
)?.[1];
const currentId =
  routePage ||
  (window.location.pathname.includes('/research/')
    ? 'research'
    : window.location.pathname.includes('/projects/')
      ? 'projects'
      : 'index');
const visitedKey = 'chhavi-world-regions';
const fragmentKey = 'chhavi-world-fragments';
const readSet = (key) => {
  try {
    return new Set(JSON.parse(localStorage.getItem(key) || '[]'));
  } catch {
    return new Set();
  }
};
const visited = readSet(visitedKey);
visited.add(currentId);
try {
  localStorage.setItem(visitedKey, JSON.stringify([...visited]));
} catch {
  /* progress is an optional enhancement */
}
let fragments = readSet(fragmentKey);

const canvas = document.createElement('canvas');
canvas.className = 'world-canvas';
canvas.id = 'world-canvas';
canvas.setAttribute(
  'aria-label',
  'Three dimensional map of Chhavi’s portfolio. Drag to orbit and select a glowing region.',
);
canvas.setAttribute('role', 'img');
overlay.prepend(canvas);

const hud = document.createElement('div');
hud.className = 'world-hud';
hud.innerHTML =
  '<div class="world-brand"><span class="world-brand-icon">✳</span><div><b>THE CONTROLVERSE</b><small>AN EXPLORABLE PORTFOLIO</small></div></div><div class="world-progress"><div><span>REGIONS MAPPED</span><b class="region-score"></b></div><i><span class="region-progress-fill"></span></i><div><span>LOOSE SIGNALS</span><b class="fragment-score"></b></div></div><div class="world-instructions"><span class="desktop-hint">DRAG TO ORBIT</span><span>SCROLL TO TRAVEL</span><span>SELECT A BEACON TO DIVE IN ↗</span></div><div class="world-target"><small>YOU ARE HERE</small><b></b></div><div class="world-toast" aria-live="polite"></div>';
overlay.append(hud);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x091211);
scene.fog = new THREE.FogExp2(0x091211, 0.021);
const camera = new THREE.PerspectiveCamera(49, 1, 0.1, 180);
let yaw = 0.0,
  pitch = 0.42,
  radius = 22;
camera.position.set(0, 9, radius);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: false,
  powerPreference: 'high-performance',
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;

scene.add(new THREE.HemisphereLight(0xb8f4df, 0x101216, 1.55));
const keyLight = new THREE.PointLight(0x9bff72, 48, 48);
keyLight.position.set(-4, 10, 3);
scene.add(keyLight);
const blueLight = new THREE.PointLight(0x538cff, 36, 40);
blueLight.position.set(8, 6, -9);
scene.add(blueLight);
const sunLight = new THREE.DirectionalLight(0xffc982, 1.25);
sunLight.position.set(3, 8, 7);
scene.add(sunLight);

const floor = new THREE.GridHelper(54, 54, 0x477d65, 0x24433b);
floor.position.y = -1.65;
floor.material.transparent = true;
floor.material.opacity = 0.25;
scene.add(floor);

const starPositions = new Float32Array(1100 * 3);
for (let i = 0; i < starPositions.length; i += 3) {
  const theta = Math.random() * Math.PI * 2;
  const height = (Math.random() - 0.35) * 33;
  const distance = 25 + Math.random() * 55;
  starPositions[i] = Math.cos(theta) * distance;
  starPositions[i + 1] = height;
  starPositions[i + 2] = Math.sin(theta) * distance;
}
const starGeometry = new THREE.BufferGeometry();
starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
const stars = new THREE.Points(
  starGeometry,
  new THREE.PointsMaterial({
    color: 0xd9f4df,
    size: 0.105,
    transparent: true,
    opacity: 0.78,
    sizeAttenuation: true,
  }),
);
scene.add(stars);

const mats = {
  island: new THREE.MeshStandardMaterial({
    color: 0x1b302a,
    roughness: 0.48,
    metalness: 0.52,
    flatShading: true,
  }),
  dark: new THREE.MeshStandardMaterial({
    color: 0x10201c,
    roughness: 0.34,
    metalness: 0.72,
    flatShading: true,
  }),
  lime: new THREE.MeshStandardMaterial({
    color: 0xaaf36a,
    emissive: 0x438f3b,
    emissiveIntensity: 1.3,
    roughness: 0.22,
    metalness: 0.42,
  }),
  blue: new THREE.MeshStandardMaterial({
    color: 0x78c8f1,
    emissive: 0x17658a,
    emissiveIntensity: 1.2,
    roughness: 0.2,
    metalness: 0.4,
  }),
  coral: new THREE.MeshStandardMaterial({
    color: 0xff856c,
    emissive: 0x882d34,
    emissiveIntensity: 0.85,
    roughness: 0.27,
    metalness: 0.35,
  }),
};

const center = new THREE.Group();
scene.add(center);
const nucleus = new THREE.Mesh(
  new THREE.IcosahedronGeometry(1.55, 3),
  new THREE.MeshPhysicalMaterial({
    color: 0x234b3a,
    roughness: 0.2,
    metalness: 0.62,
    transmission: 0.18,
    thickness: 0.6,
    emissive: 0x12351f,
    emissiveIntensity: 0.65,
    flatShading: true,
  }),
);
center.add(nucleus);
const coreWire = new THREE.Mesh(
  new THREE.IcosahedronGeometry(1.63, 2),
  new THREE.MeshBasicMaterial({
    color: 0xb5f987,
    wireframe: true,
    transparent: true,
    opacity: 0.23,
  }),
);
center.add(coreWire);
for (const [r, tilt, color] of [
  [2.1, 0.26, 0xb8f45a],
  [2.55, -0.42, 0xff795e],
  [3.02, 0.68, 0x74c9ed],
]) {
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(r, 0.018, 6, 180),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.58 }),
  );
  ring.rotation.x = Math.PI / 2 + tilt;
  center.add(ring);
}
const coreHalo = new THREE.PointLight(0x73ff8b, 16, 9);
coreHalo.position.set(0, 1, 0);
center.add(coreHalo);

const portalMeshes = [];
const portalGroups = [];
const pulseDots = [];
const labels = [];
const routeMaterials = [mats.lime, mats.blue, mats.coral];

destinations.forEach((destination, index) => {
  const [x, y, z] = destination.position;
  const group = new THREE.Group();
  group.position.set(x, y, z);
  scene.add(group);
  group.userData.destination = destination;
  if (destination.id === 'index') {
    const plinth = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.55, 0.7, 7, 1), mats.dark);
    plinth.position.y = -1.05;
    plinth.rotation.y = Math.PI / 8;
    group.add(plinth);
    const platform = new THREE.Mesh(new THREE.TorusGeometry(2.15, 0.045, 7, 100), mats.lime);
    platform.rotation.x = Math.PI / 2;
    platform.position.y = -0.66;
    group.add(platform);
    const spire = new THREE.Mesh(new THREE.OctahedronGeometry(0.54, 1), mats.lime);
    spire.position.y = 1.15;
    spire.scale.set(0.75, 1.45, 0.75);
    group.add(spire);
  } else {
    const plinth = new THREE.Mesh(new THREE.CylinderGeometry(1.55, 1.95, 0.62, 7, 1), mats.island);
    plinth.position.y = -1.12;
    plinth.rotation.y = index * 0.22;
    group.add(plinth);
    const foundation = new THREE.Mesh(
      new THREE.TorusGeometry(1.6, 0.035, 6, 72),
      index % 2 ? mats.blue : mats.lime,
    );
    foundation.rotation.x = Math.PI / 2;
    foundation.position.y = -0.77;
    group.add(foundation);
    const portalRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.92, 0.07, 10, 72),
      routeMaterials[index % routeMaterials.length],
    );
    portalRing.position.y = 0.62;
    portalRing.rotation.x = 0.32;
    portalRing.rotation.z = index % 2 ? 0.35 : -0.25;
    group.add(portalRing);
    group.userData.portal = portalRing;
    const shard = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.49, 0),
      index % 2 ? mats.blue : mats.coral,
    );
    shard.position.set(0, 0.64, 0);
    shard.scale.set(0.78, 1.4, 0.72);
    group.add(shard);
    group.userData.shard = shard;
    const smallRing = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.018, 5, 48), mats.lime);
    smallRing.position.y = 0.6;
    smallRing.rotation.x = Math.PI / 2;
    group.add(smallRing);
  }
  const beacon = new THREE.Mesh(
    new THREE.SphereGeometry(0.78, 12, 10),
    new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0.001,
      colorWrite: false,
      depthWrite: false,
    }),
  );
  beacon.position.y = 0.45;
  group.add(beacon);
  portalMeshes.push(beacon);
  portalGroups.push(group);
  const point = new THREE.PointLight(index % 2 ? 0x7bd6ff : 0xa9ff74, 8, 5);
  point.position.set(0, 1.4, 0);
  group.add(point);

  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(x * 0.34, 1.0, z * 0.34),
    new THREE.Vector3(x * 0.75, 0.45, z * 0.75),
    new THREE.Vector3(x, -0.1, z),
  ]);
  const route = new THREE.Mesh(
    new THREE.TubeGeometry(curve, 40, 0.012, 5, false),
    new THREE.MeshBasicMaterial({
      color: routeMaterials[index % routeMaterials.length].color,
      transparent: true,
      opacity: 0.28,
    }),
  );
  scene.add(route);
  const pulse = new THREE.Mesh(
    new THREE.SphereGeometry(0.07, 8, 6),
    new THREE.MeshBasicMaterial({ color: routeMaterials[index % routeMaterials.length].color }),
  );
  scene.add(pulse);
  pulseDots.push({ mesh: pulse, curve, phase: index / destinations.length });
  const marker = document.createElement('a');
  marker.className = 'world-marker';
  marker.href = new URL(destination.file, import.meta.url).href;
  marker.dataset.region = destination.id;
  if (destination.id === currentId) marker.classList.add('region-current');
  marker.innerHTML =
    '<span class="marker-code">' +
    destination.code +
    '</span><span class="marker-copy"><b>' +
    destination.name +
    '</b><small>' +
    destination.hint +
    '</small></span><i>↗</i>';
  marker.setAttribute('aria-label', 'Travel to ' + destination.name + ' — ' + destination.hint);
  marker.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    travel(destination, group);
  });
  overlay.append(marker);
  labels.push({ element: marker, group, destination });
});

// Loose signal fragments are optional collectibles; collecting them changes only local progress.
const fragmentPositions = [
  [-2.5, 1.6, 3.2],
  [3.2, 2.0, 2.3],
  [-1.6, 2.7, -4.5],
  [5.2, 2.2, -2.8],
  [-6.5, 1.7, 4.2],
];
const fragmentMeshes = [];
fragmentPositions.forEach((position, index) => {
  const gem = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.16, 0),
    new THREE.MeshStandardMaterial({
      color: 0xffd27c,
      emissive: 0xb25b21,
      emissiveIntensity: 1.8,
      metalness: 0.3,
      roughness: 0.22,
    }),
  );
  gem.position.set(...position);
  gem.userData.fragmentIndex = index;
  const halo = new THREE.Mesh(
    new THREE.TorusGeometry(0.27, 0.009, 5, 28),
    new THREE.MeshBasicMaterial({ color: 0xffce70, transparent: true, opacity: 0.55 }),
  );
  halo.rotation.x = Math.PI / 2;
  gem.add(halo);
  if (!fragments.has(String(index))) {
    scene.add(gem);
    fragmentMeshes.push(gem);
  }
});

const fragmentButtons = [];
const targets = portalMeshes.concat(fragmentMeshes);
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const mapGrid = overlay.querySelector('.map-grid');
if (mapGrid) mapGrid.setAttribute('aria-label', 'Portfolio destinations');
const progressRegion = hud.querySelector('.region-score');
const progressFragments = hud.querySelector('.fragment-score');
const progressFill = hud.querySelector('.region-progress-fill');
const targetName = hud.querySelector('.world-target b');
const toast = hud.querySelector('.world-toast');
const refreshProgress = () => {
  progressRegion.textContent = visited.size + ' / ' + destinations.length;
  progressFragments.textContent = fragments.size + ' / ' + fragmentPositions.length;
  progressFill.style.width = Math.min(100, (visited.size / destinations.length) * 100) + '%';
  labels.forEach(({ element, destination }) =>
    element.classList.toggle('region-visited', visited.has(destination.id)),
  );
};
refreshProgress();

let toastTimer;
function notify(message) {
  toast.textContent = message;
  toast.classList.add('toast-visible');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('toast-visible'), 2400);
}

function pointFromEvent(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  return raycaster.intersectObjects(targets, false)[0]?.object || null;
}

let travelling = false;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function travel(destination, group) {
  if (destination.id === currentId) {
    notify('YOU ARE ALREADY IN THIS REGION');
    return;
  }
  if (reducedMotion) {
    window.navigateToPortfolioPage?.(destination.file, destination.name);
    return;
  }
  if (travelling) return;
  travelling = true;
  targetName.textContent = destination.name.toUpperCase();
  overlay.classList.add('world-travel');
  group.userData.portal && (group.userData.portal.material.emissiveIntensity = 2.4);
  const start = performance.now();
  const from = camera.position.clone();
  const to = new THREE.Vector3(
    group.position.x * 0.38,
    group.position.y + 3.2,
    group.position.z * 0.38 + 7.2,
  );
  function dive(now) {
    const t = Math.min((now - start) / 760, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    camera.position.lerpVectors(from, to, eased);
    camera.lookAt(group.position.x * eased, 0, group.position.z * eased);
    if (t < 1) requestAnimationFrame(dive);
    else window.navigateToPortfolioPage?.(destination.file, destination.name);
  }
  requestAnimationFrame(dive);
}

function collect(gem) {
  if (!gem || fragments.has(String(gem.userData.fragmentIndex))) return;
  fragments.add(String(gem.userData.fragmentIndex));
  try {
    localStorage.setItem(fragmentKey, JSON.stringify([...fragments]));
  } catch {
    /* optional progress */
  }
  scene.remove(gem);
  const index = fragmentMeshes.indexOf(gem);
  if (index >= 0) fragmentMeshes.splice(index, 1);
  targets.splice(targets.indexOf(gem), 1);
  refreshProgress();
  notify('SIGNAL FRAGMENT RECOVERED · +100 XP');
}

const clock = new THREE.Clock();
let dragging = false,
  moved = false,
  previous = { x: 0, y: 0 },
  hovered = null;
canvas.addEventListener('pointerdown', (event) => {
  dragging = true;
  moved = false;
  previous = { x: event.clientX, y: event.clientY };
  canvas.setPointerCapture(event.pointerId);
});
canvas.addEventListener('pointermove', (event) => {
  if (dragging) {
    const dx = event.clientX - previous.x,
      dy = event.clientY - previous.y;
    if (Math.abs(dx) + Math.abs(dy) > 2) moved = true;
    yaw -= dx * 0.005;
    pitch = THREE.MathUtils.clamp(pitch + dy * 0.003, 0.12, 1.13);
    previous = { x: event.clientX, y: event.clientY };
  } else {
    const hit = pointFromEvent(event);
    if (hit !== hovered) {
      hovered = hit;
      canvas.style.cursor = hit ? 'pointer' : 'grab';
    }
  }
});
canvas.addEventListener('pointerup', (event) => {
  if (!dragging) return;
  dragging = false;
  if (!moved) {
    const hit = pointFromEvent(event);
    if (hit?.userData.fragmentIndex !== undefined) collect(hit);
    else if (hit?.parent?.userData.destination) travel(hit.parent.userData.destination, hit.parent);
  }
});
canvas.addEventListener('pointercancel', () => {
  dragging = false;
});
canvas.addEventListener(
  'wheel',
  (event) => {
    event.preventDefault();
    radius = THREE.MathUtils.clamp(radius + event.deltaY * 0.012, 13, 36);
  },
  { passive: false },
);

function resize() {
  const width = Math.max(1, overlay.clientWidth),
    height = Math.max(1, overlay.clientHeight);
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);
resize();
overlay.classList.add('world-ready');
targetName.textContent =
  destinations.find((item) => item.id === currentId)?.name.toUpperCase() || 'HOME BASE';

function render() {
  if (!overlay.classList.contains('map-open')) {
    window.setTimeout(() => requestAnimationFrame(render), 240);
    return;
  }
  requestAnimationFrame(render);
  const frameDelta = Math.min(clock.getDelta(), 0.05),
    delta = reducedMotion ? 0 : frameDelta,
    time = clock.elapsedTime;
  center.rotation.y += delta * 0.075;
  coreWire.rotation.y -= delta * 0.045;
  coreWire.rotation.x = Math.sin(time * 0.17) * 0.07;
  stars.rotation.y += delta * 0.003;
  portalGroups.forEach((group, index) => {
    const destination = group.userData.destination;
    if (group.userData.shard) {
      group.userData.shard.rotation.y += delta * (0.12 + index * 0.008);
      group.userData.shard.rotation.x = Math.sin(time * 0.45 + index) * 0.09;
    }
    if (group.userData.portal)
      group.userData.portal.rotation.z += delta * (index % 2 ? -0.14 : 0.14);
    group.position.y = destination.id === 'index' ? 0 : Math.sin(time * 0.42 + index * 1.4) * 0.12;
  });
  pulseDots.forEach(({ mesh, curve, phase }) => {
    mesh.position.copy(curve.getPointAt((time * 0.055 + phase) % 1));
  });
  fragmentMeshes.forEach((gem, index) => {
    gem.rotation.y += delta * 0.42;
    gem.position.y =
      fragmentPositions[gem.userData.fragmentIndex][1] + Math.sin(time * 1.2 + index) * 0.18;
  });
  const r = renderer.domElement.getBoundingClientRect();
  labels.forEach(({ element, group }) => {
    const pos = group.position
      .clone()
      .add(new THREE.Vector3(0, 1.8, 0))
      .project(camera);
    const x = (pos.x * 0.5 + 0.5) * r.width;
    const y = (-pos.y * 0.5 + 0.5) * r.height;
    const visible =
      pos.z > -1 && pos.z < 1 && x > 5 && x < r.width - 5 && y > 5 && y < r.height - 5;
    element.style.left = x + 'px';
    element.style.top = y + 'px';
    element.style.opacity = visible ? '1' : '0';
    element.style.pointerEvents = visible ? 'auto' : 'none';
  });
  const sphericalY = radius * Math.sin(pitch),
    horizontal = radius * Math.cos(pitch);
  const target = new THREE.Vector3(
    Math.sin(yaw) * horizontal,
    sphericalY + 2.5,
    Math.cos(yaw) * horizontal,
  );
  if (!travelling) {
    camera.position.lerp(target, 1 - Math.pow(0.001, Math.max(frameDelta, 0.001)));
    camera.lookAt(0, 0, 0);
  }
  renderer.render(scene, camera);
}
render();
