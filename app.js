const video = document.querySelector('#camera');
const canvas = document.querySelector('#sky');
const ctx = canvas.getContext('2d');
const intro = document.querySelector('#intro');
const startBtn = document.querySelector('#startBtn');
const demoBtn = document.querySelector('#demoBtn');
const statusEl = document.querySelector('#status');
const modeLabel = document.querySelector('#modeLabel');
const menuBtn = document.querySelector('#menuBtn');
const drawer = document.querySelector('#drawer');
const toast = document.querySelector('#toast');
const azimuthEl = document.querySelector('#azimuth');
const altitudeEl = document.querySelector('#altitude');
const locationEl = document.querySelector('#location');
const search = document.querySelector('#search');
const searchResults = document.querySelector('#searchResults');
const showNames = document.querySelector('#showNames');
const showConstellations = document.querySelector('#showConstellations');
const nightMode = document.querySelector('#nightMode');
const westBtn = document.querySelector('#westBtn');
const eastBtn = document.querySelector('#eastBtn');
const resetCalBtn = document.querySelector('#resetCalBtn');

let state = {
  running: false,
  demo: false,
  lat: 41.974,
  lon: 2.792,
  heading: 0,
  pitch: 35,
  roll: 0,
  calibration: Number(localStorage.getItem('celarCalibration') || 0),
  target: null,
  permissionNotes: []
};

const stars = [
  { name: 'Polar', con: 'Óssa Menor', ra: 2.5303, dec: 89.2641, mag: 1.98, info: 'Estrella que indica aproximadament el nord celeste.' },
  { name: 'Sírius', con: 'Ca Major', ra: 6.7525, dec: -16.7161, mag: -1.46, info: 'L’estrella més brillant del cel nocturn.' },
  { name: 'Vega', con: 'Lira', ra: 18.6156, dec: 38.7837, mag: 0.03, info: 'Una de les estrelles del Triangle d’Estiu.' },
  { name: 'Deneb', con: 'Cigne', ra: 20.6905, dec: 45.2803, mag: 1.25, info: 'Supergegant blanca del Cigne.' },
  { name: 'Altair', con: 'Àguila', ra: 19.8464, dec: 8.8683, mag: 0.77, info: 'Forma el Triangle d’Estiu amb Vega i Deneb.' },
  { name: 'Betelgeuse', con: 'Orió', ra: 5.9195, dec: 7.4071, mag: 0.45, info: 'Supergegant vermella d’Orió.' },
  { name: 'Rigel', con: 'Orió', ra: 5.2423, dec: -8.2016, mag: 0.13, info: 'Estrella blava molt brillant d’Orió.' },
  { name: 'Bellatrix', con: 'Orió', ra: 5.4189, dec: 6.3497, mag: 1.64, info: 'Espatlla occidental d’Orió.' },
  { name: 'Saiph', con: 'Orió', ra: 5.7959, dec: -9.6696, mag: 2.06, info: 'Peu oriental d’Orió.' },
  { name: 'Alnitak', con: 'Orió', ra: 5.6793, dec: -1.9426, mag: 1.74, info: 'Una estrella del cinturó d’Orió.' },
  { name: 'Alnilam', con: 'Orió', ra: 5.6036, dec: -1.2019, mag: 1.69, info: 'Estrella central del cinturó d’Orió.' },
  { name: 'Mintaka', con: 'Orió', ra: 5.5334, dec: -0.2991, mag: 2.25, info: 'Una estrella del cinturó d’Orió.' },
  { name: 'Aldebaran', con: 'Taure', ra: 4.5987, dec: 16.5093, mag: 0.85, info: 'Ull vermellós del Taure.' },
  { name: 'Capella', con: 'Cotxer', ra: 5.2782, dec: 45.998, mag: 0.08, info: 'Estrella brillant visible a l’hivern.' },
  { name: 'Procyon', con: 'Ca Menor', ra: 7.655, dec: 5.225, mag: 0.38, info: 'Forma el Triangle d’Hivern.' },
  { name: 'Castor', con: 'Bessons', ra: 7.5767, dec: 31.8883, mag: 1.58, info: 'Un dels caps dels Bessons.' },
  { name: 'Pòl·lux', con: 'Bessons', ra: 7.7553, dec: 28.0262, mag: 1.14, info: 'El cap més brillant dels Bessons.' },
  { name: 'Regulus', con: 'Lleó', ra: 10.1395, dec: 11.9672, mag: 1.35, info: 'Cor del Lleó.' },
  { name: 'Spica', con: 'Verge', ra: 13.4199, dec: -11.1613, mag: 0.98, info: 'Estrella principal de la Verge.' },
  { name: 'Arcturus', con: 'Bover', ra: 14.261, dec: 19.1825, mag: -0.05, info: 'Estrella ataronjada molt brillant.' },
  { name: 'Antares', con: 'Escorpí', ra: 16.4901, dec: -26.432, mag: 1.06, info: 'Cor vermell de l’Escorpí.' },
  { name: 'Fomalhaut', con: 'Peix Austral', ra: 22.9608, dec: -29.6222, mag: 1.16, info: 'Estrella brillant de tardor.' },
  { name: 'Dubhe', con: 'Óssa Major', ra: 11.0621, dec: 61.7508, mag: 1.79, info: 'Puntera del Carro cap a la Polar.' },
  { name: 'Merak', con: 'Óssa Major', ra: 11.0307, dec: 56.3824, mag: 2.37, info: 'Puntera del Carro cap a la Polar.' },
  { name: 'Phecda', con: 'Óssa Major', ra: 11.8972, dec: 53.6948, mag: 2.44, info: 'Estrella del Carro.' },
  { name: 'Megrez', con: 'Óssa Major', ra: 12.2571, dec: 57.0326, mag: 3.31, info: 'Estrella del Carro.' },
  { name: 'Alioth', con: 'Óssa Major', ra: 12.9005, dec: 55.9598, mag: 1.76, info: 'Estrella brillant del mànec del Carro.' },
  { name: 'Mizar', con: 'Óssa Major', ra: 13.3987, dec: 54.9254, mag: 2.23, info: 'Estrella doble famosa del Carro.' },
  { name: 'Alkaid', con: 'Óssa Major', ra: 13.7923, dec: 49.3133, mag: 1.86, info: 'Extrem del mànec del Carro.' },
  { name: 'Schedar', con: 'Cassiopea', ra: 0.6751, dec: 56.5373, mag: 2.24, info: 'Estrella de Cassiopea.' },
  { name: 'Caph', con: 'Cassiopea', ra: 0.1529, dec: 59.1498, mag: 2.28, info: 'Estrella de Cassiopea.' },
  { name: 'Gamma Cas', con: 'Cassiopea', ra: 0.9451, dec: 60.7167, mag: 2.47, info: 'Estrella central de la W de Cassiopea.' },
  { name: 'Ruchbah', con: 'Cassiopea', ra: 1.4303, dec: 60.2353, mag: 2.68, info: 'Estrella de Cassiopea.' },
  { name: 'Segin', con: 'Cassiopea', ra: 1.9066, dec: 63.67, mag: 3.35, info: 'Estrella de Cassiopea.' }
];

const lines = [
  ['Betelgeuse','Bellatrix'], ['Betelgeuse','Alnitak'], ['Bellatrix','Mintaka'], ['Alnitak','Alnilam'], ['Alnilam','Mintaka'], ['Alnitak','Saiph'], ['Mintaka','Rigel'], ['Saiph','Rigel'],
  ['Dubhe','Merak'], ['Merak','Phecda'], ['Phecda','Megrez'], ['Megrez','Dubhe'], ['Megrez','Alioth'], ['Alioth','Mizar'], ['Mizar','Alkaid'],
  ['Caph','Schedar'], ['Schedar','Gamma Cas'], ['Gamma Cas','Ruchbah'], ['Ruchbah','Segin'],
  ['Vega','Deneb'], ['Deneb','Altair'], ['Altair','Vega'],
  ['Castor','Pòl·lux']
];
const byName = Object.fromEntries(stars.map(s => [s.name, s]));

function toastMsg(msg) {
  toast.textContent = msg;
  toast.classList.remove('hidden');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.add('hidden'), 4200);
}

function resize() {
  const dpr = Math.min(devicePixelRatio || 1, 2);
  canvas.width = Math.floor(innerWidth * dpr);
  canvas.height = Math.floor(innerHeight * dpr);
  canvas.style.width = innerWidth + 'px';
  canvas.style.height = innerHeight + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
addEventListener('resize', resize);
resize();

async function start({ demo = false } = {}) {
  state.demo = demo;
  state.running = true;
  intro.classList.add('hidden');
  modeLabel.textContent = demo ? 'CelAR · demo' : 'CelAR · RA';

  if (!demo) {
    await startCamera();
    await getLocation();
    await startOrientation();
  } else {
    statusEl.textContent = 'Mode demostració actiu';
    locationEl.textContent = 'Salt aprox.';
    simulateMotion();
  }
  requestAnimationFrame(loop);
}

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false });
    video.srcObject = stream;
    statusEl.textContent = 'Càmera activa';
  } catch (err) {
    statusEl.textContent = 'Sense càmera';
    toastMsg('No he pogut obrir la càmera. Pots continuar veient el mapa sobre fons fosc.');
  }
}

async function getLocation() {
  if (!navigator.geolocation) {
    toastMsg('Aquest navegador no ofereix geolocalització. Faré servir Salt com a ubicació aproximada.');
    locationEl.textContent = 'Salt aprox.';
    return;
  }
  navigator.geolocation.getCurrentPosition(pos => {
    state.lat = pos.coords.latitude;
    state.lon = pos.coords.longitude;
    locationEl.textContent = `${state.lat.toFixed(2)}, ${state.lon.toFixed(2)}`;
  }, () => {
    toastMsg('No tinc permís d’ubicació. Faré servir Salt com a ubicació aproximada.');
    locationEl.textContent = 'Salt aprox.';
  }, { enableHighAccuracy: true, timeout: 7000, maximumAge: 120000 });
}

async function startOrientation() {
  try {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      const res = await DeviceOrientationEvent.requestPermission();
      if (res !== 'granted') throw new Error('Permís de sensors denegat');
    }
    addEventListener('deviceorientationabsolute', onOrientation, true);
    addEventListener('deviceorientation', onOrientation, true);
    statusEl.textContent = 'Sensors actius';
  } catch (err) {
    toastMsg('No he pogut activar els sensors. Activo un moviment simulat.');
    simulateMotion();
  }
}

function onOrientation(e) {
  const alpha = e.webkitCompassHeading ?? (360 - (e.alpha ?? 0));
  state.heading = normalize(alpha + state.calibration);
  state.pitch = clamp((e.beta ?? 45), -20, 90);
  state.roll = e.gamma ?? 0;
}

function simulateMotion() {
  let t = 0;
  setInterval(() => {
    t += 0.012;
    state.heading = normalize(180 + Math.sin(t) * 80 + state.calibration);
    state.pitch = 42 + Math.sin(t * 0.7) * 16;
  }, 33);
}

function julianDate(date = new Date()) { return date.getTime() / 86400000 + 2440587.5; }
function gmst(date = new Date()) {
  const jd = julianDate(date);
  const d = jd - 2451545.0;
  return normalize(280.46061837 + 360.98564736629 * d);
}
function altAz(star, date = new Date()) {
  const lst = normalize(gmst(date) + state.lon);
  const ha = normalize(lst - star.ra * 15);
  const haRad = deg2rad(ha > 180 ? ha - 360 : ha);
  const dec = deg2rad(star.dec);
  const lat = deg2rad(state.lat);
  const sinAlt = Math.sin(dec) * Math.sin(lat) + Math.cos(dec) * Math.cos(lat) * Math.cos(haRad);
  const alt = Math.asin(sinAlt);
  const y = -Math.sin(haRad);
  const x = Math.tan(dec) * Math.cos(lat) - Math.sin(lat) * Math.cos(haRad);
  const az = normalize(rad2deg(Math.atan2(y, x)));
  return { alt: rad2deg(alt), az };
}

function project(pos) {
  const fovH = 64;
  const fovV = fovH * innerHeight / innerWidth;
  let daz = angleDiff(pos.az, state.heading);
  let dalt = pos.alt - state.pitch;
  const x = innerWidth / 2 + (daz / fovH) * innerWidth;
  const y = innerHeight / 2 - (dalt / fovV) * innerHeight;
  return { x, y, visible: Math.abs(daz) < fovH / 1.65 && Math.abs(dalt) < fovV / 1.5 && pos.alt > -10, daz, dalt };
}

function loop() {
  draw();
  if (state.running) requestAnimationFrame(loop);
}

function draw() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  drawReticle();
  const date = new Date();
  const plotted = new Map();

  for (const star of stars) {
    const pos = altAz(star, date);
    const p = project(pos);
    plotted.set(star.name, { star, pos, p });
  }

  if (showConstellations.checked) drawLines(plotted);
  for (const item of plotted.values()) drawStar(item);
  drawTarget(plotted);
  azimuthEl.textContent = `${Math.round(state.heading)}°`;
  altitudeEl.textContent = `${Math.round(state.pitch)}°`;
}

function drawReticle() {
  ctx.save();
  ctx.strokeStyle = 'rgba(125, 211, 252, .42)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(innerWidth / 2, innerHeight / 2, 22, 0, Math.PI * 2);
  ctx.moveTo(innerWidth / 2 - 38, innerHeight / 2); ctx.lineTo(innerWidth / 2 - 14, innerHeight / 2);
  ctx.moveTo(innerWidth / 2 + 14, innerHeight / 2); ctx.lineTo(innerWidth / 2 + 38, innerHeight / 2);
  ctx.moveTo(innerWidth / 2, innerHeight / 2 - 38); ctx.lineTo(innerWidth / 2, innerHeight / 2 - 14);
  ctx.moveTo(innerWidth / 2, innerHeight / 2 + 14); ctx.lineTo(innerWidth / 2, innerHeight / 2 + 38);
  ctx.stroke();
  ctx.restore();
}

function drawLines(plotted) {
  ctx.save();
  ctx.strokeStyle = 'rgba(125, 211, 252, .58)';
  ctx.lineWidth = 1.5;
  for (const [a, b] of lines) {
    const A = plotted.get(a), B = plotted.get(b);
    if (!A || !B || !A.p.visible || !B.p.visible) continue;
    ctx.beginPath(); ctx.moveTo(A.p.x, A.p.y); ctx.lineTo(B.p.x, B.p.y); ctx.stroke();
  }
  ctx.restore();
}

function drawStar({ star, p, pos }) {
  if (!p.visible) return;
  const r = clamp(5 - star.mag, 2, 7);
  ctx.save();
  ctx.fillStyle = star.name === state.target?.name ? '#facc15' : 'rgba(255,255,255,.92)';
  ctx.shadowBlur = star.name === state.target?.name ? 18 : 10;
  ctx.shadowColor = ctx.fillStyle;
  ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2); ctx.fill();
  ctx.shadowBlur = 0;
  if (showNames.checked || star.name === state.target?.name) {
    ctx.font = star.name === state.target?.name ? '700 15px system-ui' : '13px system-ui';
    ctx.fillStyle = star.name === state.target?.name ? '#facc15' : 'rgba(247,251,255,.86)';
    ctx.fillText(star.name, p.x + r + 5, p.y - r - 2);
    ctx.fillStyle = 'rgba(170,183,207,.86)';
    ctx.font = '11px system-ui';
    ctx.fillText(star.con, p.x + r + 5, p.y + 11);
  }
  ctx.restore();
}

function drawTarget(plotted) {
  if (!state.target) return;
  const item = plotted.get(state.target.name);
  if (!item) return;
  const { p, pos } = item;
  ctx.save();
  if (p.visible) {
    ctx.strokeStyle = '#facc15'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(p.x, p.y, 18, 0, Math.PI * 2); ctx.stroke();
  } else {
    const angle = Math.atan2(p.y - innerHeight / 2, p.x - innerWidth / 2);
    const x = innerWidth / 2 + Math.cos(angle) * Math.min(innerWidth, innerHeight) * 0.34;
    const y = innerHeight / 2 + Math.sin(angle) * Math.min(innerWidth, innerHeight) * 0.34;
    ctx.translate(x, y); ctx.rotate(angle);
    ctx.fillStyle = '#facc15';
    ctx.beginPath(); ctx.moveTo(22, 0); ctx.lineTo(-12, -10); ctx.lineTo(-7, 0); ctx.lineTo(-12, 10); ctx.closePath(); ctx.fill();
    ctx.setTransform(1,0,0,1,0,0);
    ctx.fillStyle = '#facc15'; ctx.font = '700 14px system-ui'; ctx.textAlign = 'center';
    ctx.fillText(`Mou el mòbil cap a ${state.target.name}`, innerWidth/2, innerHeight - 112);
  }
  ctx.restore();
}

function updateSearch() {
  const q = search.value.trim().toLowerCase();
  searchResults.innerHTML = '';
  if (!q) return;
  const matches = stars.filter(s => `${s.name} ${s.con}`.toLowerCase().includes(q)).slice(0, 8);
  for (const s of matches) {
    const el = document.createElement('div');
    el.className = 'result';
    el.innerHTML = `<div><strong>${s.name}</strong><br><small>${s.con}</small></div><small>mag ${s.mag}</small>`;
    el.addEventListener('click', () => {
      state.target = s;
      drawer.classList.add('hidden');
      toastMsg(`${s.name}: ${s.info}`);
    });
    searchResults.appendChild(el);
  }
}

function normalize(v) { return ((v % 360) + 360) % 360; }
function angleDiff(a, b) { return ((a - b + 540) % 360) - 180; }
function deg2rad(d) { return d * Math.PI / 180; }
function rad2deg(r) { return r * 180 / Math.PI; }
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

startBtn.addEventListener('click', () => start({ demo: false }));
demoBtn.addEventListener('click', () => start({ demo: true }));
menuBtn.addEventListener('click', () => drawer.classList.toggle('hidden'));
search.addEventListener('input', updateSearch);
nightMode.addEventListener('change', () => document.body.classList.toggle('night', nightMode.checked));
westBtn.addEventListener('click', () => setCalibration(state.calibration - 5));
eastBtn.addEventListener('click', () => setCalibration(state.calibration + 5));
resetCalBtn.addEventListener('click', () => setCalibration(0));

function setCalibration(v) {
  state.calibration = normalize(v);
  if (state.calibration > 180) state.calibration -= 360;
  localStorage.setItem('celarCalibration', String(state.calibration));
  toastMsg(`Calibratge: ${state.calibration > 0 ? '+' : ''}${state.calibration}°`);
}

if ('serviceWorker' in navigator) {
  addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
}
