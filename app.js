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
const guide = document.querySelector('#guide');
const azimuthEl = document.querySelector('#azimuth');
const altitudeEl = document.querySelector('#altitude');
const locationEl = document.querySelector('#location');
const search = document.querySelector('#search');
const searchResults = document.querySelector('#searchResults');
const showNames = document.querySelector('#showNames');
const showConstellations = document.querySelector('#showConstellations');
const showPlanets = document.querySelector('#showPlanets');
const showHorizon = document.querySelector('#showHorizon');
const nightMode = document.querySelector('#nightMode');
const westBtn = document.querySelector('#westBtn');
const eastBtn = document.querySelector('#eastBtn');
const resetCalBtn = document.querySelector('#resetCalBtn');
const calibrateTargetBtn = document.querySelector('#calibrateTargetBtn');
const compassNeedle = document.querySelector('#compassNeedle');
const compassLabel = document.querySelector('#compassLabel');
const infoCard = document.querySelector('#infoCard');
const infoTitle = document.querySelector('#infoTitle');
const infoSubtitle = document.querySelector('#infoSubtitle');
const infoText = document.querySelector('#infoText');
const infoAz = document.querySelector('#infoAz');
const infoAlt = document.querySelector('#infoAlt');
const closeInfo = document.querySelector('#closeInfo');

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
  lastPlotted: [],
  selected: null
};

const stars = [
  { name: 'Polar', con: 'Óssa Menor', ra: 2.5303, dec: 89.2641, mag: 1.98, info: 'Estrella que indica aproximadament el nord celeste. És molt útil per calibrar la brúixola.' },
  { name: 'Sírius', con: 'Ca Major', ra: 6.7525, dec: -16.7161, mag: -1.46, info: 'L’estrella més brillant del cel nocturn, visible sobretot a l’hivern.' },
  { name: 'Canopus', con: 'Carina', ra: 6.3992, dec: -52.6957, mag: -0.74, info: 'Molt brillant, però difícil de veure des de Catalunya perquè queda molt baixa.' },
  { name: 'Vega', con: 'Lira', ra: 18.6156, dec: 38.7837, mag: 0.03, info: 'Una de les estrelles del Triangle d’Estiu.' },
  { name: 'Deneb', con: 'Cigne', ra: 20.6905, dec: 45.2803, mag: 1.25, info: 'Supergegant blanca del Cigne, molt llunyana i lluminosa.' },
  { name: 'Altair', con: 'Àguila', ra: 19.8464, dec: 8.8683, mag: 0.77, info: 'Forma el Triangle d’Estiu amb Vega i Deneb.' },
  { name: 'Betelgeuse', con: 'Orió', ra: 5.9195, dec: 7.4071, mag: 0.45, info: 'Supergegant vermella d’Orió. El seu color és fàcil de distingir.' },
  { name: 'Rigel', con: 'Orió', ra: 5.2423, dec: -8.2016, mag: 0.13, info: 'Estrella blava molt brillant d’Orió.' },
  { name: 'Bellatrix', con: 'Orió', ra: 5.4189, dec: 6.3497, mag: 1.64, info: 'Espatlla occidental d’Orió.' },
  { name: 'Saiph', con: 'Orió', ra: 5.7959, dec: -9.6696, mag: 2.06, info: 'Peu oriental d’Orió.' },
  { name: 'Alnitak', con: 'Orió', ra: 5.6793, dec: -1.9426, mag: 1.74, info: 'Una estrella del cinturó d’Orió.' },
  { name: 'Alnilam', con: 'Orió', ra: 5.6036, dec: -1.2019, mag: 1.69, info: 'Estrella central del cinturó d’Orió.' },
  { name: 'Mintaka', con: 'Orió', ra: 5.5334, dec: -0.2991, mag: 2.25, info: 'Una estrella del cinturó d’Orió.' },
  { name: 'Aldebaran', con: 'Taure', ra: 4.5987, dec: 16.5093, mag: 0.85, info: 'Ull vermellós del Taure.' },
  { name: 'Capella', con: 'Cotxer', ra: 5.2782, dec: 45.998, mag: 0.08, info: 'Estrella brillant visible a l’hivern.' },
  { name: 'Procyon', con: 'Ca Menor', ra: 7.655, dec: 5.225, mag: 0.38, info: 'Forma el Triangle d’Hivern amb Sírius i Betelgeuse.' },
  { name: 'Castor', con: 'Bessons', ra: 7.5767, dec: 31.8883, mag: 1.58, info: 'Un dels caps dels Bessons.' },
  { name: 'Pòl·lux', con: 'Bessons', ra: 7.7553, dec: 28.0262, mag: 1.14, info: 'El cap més brillant dels Bessons.' },
  { name: 'Regulus', con: 'Lleó', ra: 10.1395, dec: 11.9672, mag: 1.35, info: 'Cor del Lleó.' },
  { name: 'Spica', con: 'Verge', ra: 13.4199, dec: -11.1613, mag: 0.98, info: 'Estrella principal de la Verge.' },
  { name: 'Arcturus', con: 'Bover', ra: 14.261, dec: 19.1825, mag: -0.05, info: 'Estrella ataronjada molt brillant, visible a la primavera.' },
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

const planetInfo = {
  Lluna: 'Posició aproximada de la Lluna. La fase es calcula visualment de forma simplificada.',
  Mercuri: 'Planeta interior, sovint molt a prop del Sol i difícil de veure.',
  Venus: 'Planeta molt brillant. Sovint es veu a l’alba o al capvespre.',
  Mart: 'Planeta vermellós. La seva brillantor varia molt segons la distància.',
  Júpiter: 'El planeta més gran del Sistema Solar, molt brillant quan és visible.',
  Saturn: 'Famos per les seves anelles. A ull nu sembla una estrella groguenca.'
};

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
  state.pitch = clamp((e.beta ?? 45), -25, 90);
  state.roll = e.gamma ?? 0;
}

function simulateMotion() {
  let t = 0;
  clearInterval(state.demoTimer);
  state.demoTimer = setInterval(() => {
    t += 0.012;
    state.heading = normalize(180 + Math.sin(t) * 110 + state.calibration);
    state.pitch = 40 + Math.sin(t * 0.7) * 18;
  }, 33);
}

function julianDate(date = new Date()) { return date.getTime() / 86400000 + 2440587.5; }
function daysSinceJ2000(date = new Date()) { return julianDate(date) - 2451545.0; }
function gmst(date = new Date()) {
  const d = daysSinceJ2000(date);
  return normalize(280.46061837 + 360.98564736629 * d);
}
function altAz(obj, date = new Date()) {
  const lst = normalize(gmst(date) + state.lon);
  const ha = normalize(lst - obj.ra * 15);
  const haRad = deg2rad(ha > 180 ? ha - 360 : ha);
  const dec = deg2rad(obj.dec);
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
  return { x, y, visible: Math.abs(daz) < fovH / 1.6 && Math.abs(dalt) < fovV / 1.45 && pos.alt > -12, daz, dalt };
}

function loop() {
  draw();
  if (state.running) requestAnimationFrame(loop);
}

function draw() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  const date = new Date();
  const plotted = [];
  const starMap = new Map();

  for (const star of stars) {
    const obj = { ...star, kind: 'Estrella', type: 'star' };
    const pos = altAz(obj, date);
    const p = project(pos);
    const item = { obj, pos, p };
    plotted.push(item);
    starMap.set(star.name, item);
  }

  if (showPlanets.checked) {
    for (const body of solarSystemObjects(date)) {
      const pos = altAz(body, date);
      const p = project(pos);
      plotted.push({ obj: body, pos, p });
    }
  }

  state.lastPlotted = plotted;
  drawBackdropGrid();
  if (showHorizon.checked) drawHorizon();
  drawReticle();
  if (showConstellations.checked) drawLines(starMap);
  for (const item of plotted) drawObject(item);
  drawTarget(plotted);
  updateHud();
  if (!infoCard.classList.contains('hidden') && state.selected) updateInfoCard(state.selected);
}

function drawBackdropGrid() {
  ctx.save();
  ctx.strokeStyle = 'rgba(125,211,252,.08)';
  ctx.lineWidth = 1;
  for (let a = -60; a <= 60; a += 15) {
    const x = innerWidth / 2 + (a / 64) * innerWidth;
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, innerHeight); ctx.stroke();
  }
  for (let h = -30; h <= 60; h += 15) {
    const y = innerHeight / 2 - ((h - state.pitch) / (64 * innerHeight / innerWidth)) * innerHeight;
    if (y < -20 || y > innerHeight + 20) continue;
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(innerWidth, y); ctx.stroke();
  }
  ctx.restore();
}

function drawHorizon() {
  const samples = [];
  for (let az = 0; az <= 360; az += 5) {
    const p = project({ az, alt: 0 });
    samples.push(p);
  }
  ctx.save();
  ctx.strokeStyle = 'rgba(250,204,21,.62)';
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 8]);
  let started = false;
  ctx.beginPath();
  for (const p of samples) {
    if (p.x < -80 || p.x > innerWidth + 80 || p.y < -80 || p.y > innerHeight + 80) { started = false; continue; }
    if (!started) { ctx.moveTo(p.x, p.y); started = true; } else ctx.lineTo(p.x, p.y);
  }
  ctx.stroke();
  ctx.setLineDash([]);
  const labels = [{ n: 'N', a: 0 }, { n: 'E', a: 90 }, { n: 'S', a: 180 }, { n: 'O', a: 270 }];
  for (const l of labels) {
    const p = project({ az: l.a, alt: 1 });
    if (p.x < -40 || p.x > innerWidth + 40 || p.y < -30 || p.y > innerHeight + 30) continue;
    ctx.fillStyle = '#facc15';
    ctx.font = '800 18px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(l.n, p.x, p.y - 8);
  }
  ctx.restore();
}

function drawReticle() {
  ctx.save();
  ctx.strokeStyle = 'rgba(125, 211, 252, .46)';
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

function drawObject({ obj, p, pos }) {
  if (!p.visible) return;
  if (obj.type === 'planet' || obj.type === 'moon') return drawPlanet({ obj, p, pos });
  const r = clamp(5 - obj.mag, 2, 7);
  ctx.save();
  ctx.fillStyle = obj.name === state.target?.name ? '#facc15' : 'rgba(255,255,255,.92)';
  ctx.shadowBlur = obj.name === state.target?.name ? 18 : 10;
  ctx.shadowColor = ctx.fillStyle;
  ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2); ctx.fill();
  ctx.shadowBlur = 0;
  drawLabel(obj, p, r);
  ctx.restore();
}

function drawPlanet({ obj, p }) {
  ctx.save();
  const selected = obj.name === state.target?.name;
  const r = obj.type === 'moon' ? 12 : 7;
  ctx.fillStyle = selected ? '#facc15' : obj.color;
  ctx.shadowBlur = selected ? 22 : 16;
  ctx.shadowColor = ctx.fillStyle;
  ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2); ctx.fill();
  if (obj.type === 'moon') {
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(2,6,23,.55)';
    const phaseOffset = (obj.phase - 0.5) * 18;
    ctx.beginPath(); ctx.arc(p.x + phaseOffset, p.y, r * .92, -Math.PI / 2, Math.PI / 2); ctx.fill();
  }
  if (obj.name === 'Saturn') {
    ctx.shadowBlur = 0;
    ctx.strokeStyle = 'rgba(253,230,138,.86)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(p.x, p.y, 14, 5, -0.25, 0, Math.PI * 2); ctx.stroke();
  }
  ctx.shadowBlur = 0;
  drawLabel(obj, p, r + 2);
  ctx.restore();
}

function drawLabel(obj, p, r) {
  if (!(showNames.checked || obj.name === state.target?.name)) return;
  ctx.font = obj.name === state.target?.name ? '800 15px system-ui' : '13px system-ui';
  ctx.fillStyle = obj.name === state.target?.name ? '#facc15' : (obj.type === 'star' ? 'rgba(247,251,255,.86)' : 'rgba(253,230,138,.94)');
  ctx.textAlign = 'left';
  ctx.fillText(obj.name, p.x + r + 5, p.y - r - 2);
  ctx.fillStyle = 'rgba(170,183,207,.88)';
  ctx.font = '11px system-ui';
  ctx.fillText(obj.con || obj.kind || '', p.x + r + 5, p.y + 11);
}

function drawTarget(plotted) {
  if (!state.target) { guide.classList.add('hidden'); return; }
  const item = plotted.find(x => x.obj.name === state.target.name);
  if (!item) { guide.classList.add('hidden'); return; }
  const { p } = item;
  ctx.save();
  if (p.visible) {
    ctx.strokeStyle = '#facc15'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(p.x, p.y, 22, 0, Math.PI * 2); ctx.stroke();
    const dist = Math.hypot(p.x - innerWidth / 2, p.y - innerHeight / 2);
    guide.textContent = dist < 42 ? `${state.target.name} és al centre` : centerInstruction(p.daz, p.dalt);
    guide.classList.remove('hidden');
  } else {
    const angle = Math.atan2(p.y - innerHeight / 2, p.x - innerWidth / 2);
    const x = innerWidth / 2 + Math.cos(angle) * Math.min(innerWidth, innerHeight) * 0.34;
    const y = innerHeight / 2 + Math.sin(angle) * Math.min(innerWidth, innerHeight) * 0.34;
    ctx.translate(x, y); ctx.rotate(angle);
    ctx.fillStyle = '#facc15';
    ctx.beginPath(); ctx.moveTo(24, 0); ctx.lineTo(-14, -11); ctx.lineTo(-8, 0); ctx.lineTo(-14, 11); ctx.closePath(); ctx.fill();
    guide.textContent = centerInstruction(p.daz, p.dalt);
    guide.classList.remove('hidden');
  }
  ctx.restore();
}

function centerInstruction(daz, dalt) {
  const horizontal = Math.abs(daz) < 4 ? 'mantén la direcció' : `gira ${Math.abs(Math.round(daz))}° cap a ${daz > 0 ? 'la dreta' : 'l’esquerra'}`;
  const vertical = Math.abs(dalt) < 4 ? '' : ` i ${dalt > 0 ? 'puja' : 'baixa'} ${Math.abs(Math.round(dalt))}°`;
  return `${horizontal}${vertical}`;
}

function updateHud() {
  azimuthEl.textContent = `${Math.round(state.heading)}°`;
  altitudeEl.textContent = `${Math.round(state.pitch)}°`;
  compassNeedle.style.transform = `rotate(${-state.heading}deg)`;
  compassLabel.textContent = cardinal(state.heading);
}

function updateSearch() {
  const q = search.value.trim().toLowerCase();
  searchResults.innerHTML = '';
  if (!q) return;
  const bodies = solarSystemObjects(new Date());
  const all = [...stars.map(s => ({ ...s, kind: 'Estrella', type: 'star' })), ...bodies];
  const matches = all.filter(s => `${s.name} ${s.con || ''} ${s.kind || ''}`.toLowerCase().includes(q)).slice(0, 10);
  for (const s of matches) {
    const el = document.createElement('div');
    el.className = 'result';
    const mag = s.mag === undefined ? '' : `mag ${Number(s.mag).toFixed(1)}`;
    el.innerHTML = `<div><strong>${s.name}</strong><br><small>${s.con || s.kind}</small></div><small class="kind">${mag || s.kind}</small>`;
    el.addEventListener('click', () => {
      state.target = s;
      state.selected = s;
      drawer.classList.add('hidden');
      toastMsg(`${s.name}: ${s.info || planetInfo[s.name] || 'Objecte celeste.'}`);
      showInfoCard(s);
    });
    searchResults.appendChild(el);
  }
}

function calibrateToTarget() {
  if (!state.target) {
    toastMsg('Primer cerca i selecciona un objecte conegut, com Polar, Lluna o Venus.');
    return;
  }
  const body = state.target.type === 'planet' || state.target.type === 'moon'
    ? solarSystemObjects(new Date()).find(o => o.name === state.target.name)
    : state.target;
  if (!body) return;
  const pos = altAz(body, new Date());
  const correction = angleDiff(pos.az, state.heading);
  setCalibration(state.calibration + correction);
  toastMsg(`Calibrat amb ${state.target.name}. Correcció aplicada: ${Math.round(correction)}°`);
}

function showInfoCard(obj) {
  state.selected = obj;
  updateInfoCard(obj);
  infoCard.classList.remove('hidden');
}

function updateInfoCard(obj) {
  const liveObj = (obj.type === 'planet' || obj.type === 'moon') ? solarSystemObjects(new Date()).find(o => o.name === obj.name) || obj : obj;
  const pos = altAz(liveObj, new Date());
  infoTitle.textContent = liveObj.name;
  infoSubtitle.textContent = liveObj.con || liveObj.kind || 'Objecte celeste';
  infoText.textContent = liveObj.info || planetInfo[liveObj.name] || 'Objecte visible segons la data, l’hora i la ubicació actual.';
  infoAz.textContent = `${Math.round(pos.az)}° ${cardinal(pos.az)}`;
  infoAlt.textContent = `${Math.round(pos.alt)}°`;
}

function onCanvasTap(evt) {
  if (!state.lastPlotted.length) return;
  const rect = canvas.getBoundingClientRect();
  const x = (evt.clientX || evt.touches?.[0]?.clientX) - rect.left;
  const y = (evt.clientY || evt.touches?.[0]?.clientY) - rect.top;
  let nearest = null;
  let best = 30;
  for (const item of state.lastPlotted) {
    if (!item.p.visible) continue;
    const d = Math.hypot(item.p.x - x, item.p.y - y);
    if (d < best) { best = d; nearest = item; }
  }
  if (nearest) {
    state.target = nearest.obj;
    showInfoCard(nearest.obj);
  }
}

function solarSystemObjects(date) {
  const sun = sunRaDec(date);
  const moon = moonRaDec(date, sun.lambda);
  const planets = ['Mercuri', 'Venus', 'Mart', 'Júpiter', 'Saturn'].map(name => planetRaDec(name, date, sun));
  return [moon, ...planets].filter(Boolean);
}

function sunRaDec(date) {
  const n = daysSinceJ2000(date);
  const L = normalize(280.460 + 0.9856474 * n);
  const g = normalize(357.528 + 0.9856003 * n);
  const lambda = normalize(L + 1.915 * sin(g) + 0.020 * sin(2 * g));
  const eps = 23.4393 - 0.0000004 * n;
  const ra = normalize(rad2deg(Math.atan2(cos(eps) * sin(lambda), cos(lambda)))) / 15;
  const dec = rad2deg(Math.asin(sin(eps) * sin(lambda)));
  return { ra, dec, lambda, R: 1 };
}

function moonRaDec(date, sunLambda) {
  const d = daysSinceJ2000(date);
  const L = normalize(218.316 + 13.176396 * d);
  const M = normalize(134.963 + 13.064993 * d);
  const F = normalize(93.272 + 13.229350 * d);
  const lon = normalize(L + 6.289 * sin(M));
  const lat = 5.128 * sin(F);
  const eq = eclToEq(lon, lat, date);
  const phase = (1 - Math.cos(deg2rad(normalize(lon - sunLambda)))) / 2;
  return { name: 'Lluna', kind: 'Satèl·lit', type: 'moon', ra: eq.ra, dec: eq.dec, mag: -12, phase, color: '#f8fafc', info: `${planetInfo.Lluna} Il·luminació aproximada: ${Math.round(phase * 100)}%.` };
}

function planetRaDec(name, date, sun) {
  const d = daysSinceJ2000(date);
  const E = planetHelio('Terra', d);
  const P = planetHelio(name, d);
  if (!P || !E) return null;
  const xg = P.x - E.x;
  const yg = P.y - E.y;
  const zg = P.z - E.z;
  const eclLon = normalize(rad2deg(Math.atan2(yg, xg)));
  const eclLat = rad2deg(Math.atan2(zg, Math.sqrt(xg*xg + yg*yg)));
  const eq = eclToEq(eclLon, eclLat, date);
  const colors = { Mercuri: '#d1d5db', Venus: '#fde68a', Mart: '#fb7185', Júpiter: '#fbbf24', Saturn: '#fcd34d' };
  const mags = { Mercuri: -0.2, Venus: -4.1, Mart: 0.2, Júpiter: -2.3, Saturn: 0.6 };
  return { name, kind: 'Planeta', type: 'planet', ra: eq.ra, dec: eq.dec, mag: mags[name], color: colors[name], info: planetInfo[name] + ' Posició aproximada: bona per orientar-se, no per mesures científiques.' };
}

function planetHelio(name, d) {
  const el = elements(name, d);
  if (!el) return null;
  const E = solveKepler(el.M, el.e);
  const xv = el.a * (Math.cos(E) - el.e);
  const yv = el.a * Math.sqrt(1 - el.e * el.e) * Math.sin(E);
  const v = rad2deg(Math.atan2(yv, xv));
  const r = Math.sqrt(xv*xv + yv*yv);
  const xh = r * (cos(el.N) * cos(v + el.w) - sin(el.N) * sin(v + el.w) * cos(el.i));
  const yh = r * (sin(el.N) * cos(v + el.w) + cos(el.N) * sin(v + el.w) * cos(el.i));
  const zh = r * (sin(v + el.w) * sin(el.i));
  return { x: xh, y: yh, z: zh };
}

function elements(name, d) {
  const data = {
    Mercuri: { N: 48.3313 + 3.24587e-5*d, i: 7.0047 + 5.00e-8*d, w: 29.1241 + 1.01444e-5*d, a: 0.387098, e: 0.205635 + 5.59e-10*d, M: 168.6562 + 4.0923344368*d },
    Venus: { N: 76.6799 + 2.46590e-5*d, i: 3.3946 + 2.75e-8*d, w: 54.8910 + 1.38374e-5*d, a: 0.723330, e: 0.006773 - 1.302e-9*d, M: 48.0052 + 1.6021302244*d },
    Terra: { N: 0, i: 0, w: 282.9404 + 4.70935e-5*d, a: 1.000000, e: 0.016709 - 1.151e-9*d, M: 356.0470 + 0.9856002585*d },
    Mart: { N: 49.5574 + 2.11081e-5*d, i: 1.8497 - 1.78e-8*d, w: 286.5016 + 2.92961e-5*d, a: 1.523688, e: 0.093405 + 2.516e-9*d, M: 18.6021 + 0.5240207766*d },
    Júpiter: { N: 100.4542 + 2.76854e-5*d, i: 1.3030 - 1.557e-7*d, w: 273.8777 + 1.64505e-5*d, a: 5.20256, e: 0.048498 + 4.469e-9*d, M: 19.8950 + 0.0830853001*d },
    Saturn: { N: 113.6634 + 2.38980e-5*d, i: 2.4886 - 1.081e-7*d, w: 339.3939 + 2.97661e-5*d, a: 9.55475, e: 0.055546 - 9.499e-9*d, M: 316.9670 + 0.0334442282*d }
  };
  const el = data[name];
  if (!el) return null;
  return { ...el, M: normalize(el.M) };
}

function solveKepler(Mdeg, e) {
  const M = deg2rad(Mdeg);
  let E = M + e * Math.sin(M) * (1 + e * Math.cos(M));
  for (let i = 0; i < 5; i++) E = E - (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
  return E;
}

function eclToEq(lon, lat, date) {
  const d = daysSinceJ2000(date);
  const eps = 23.4393 - 0.0000004 * d;
  const x = cos(lon) * cos(lat);
  const y = sin(lon) * cos(lat);
  const z = sin(lat);
  const xe = x;
  const ye = y * cos(eps) - z * sin(eps);
  const ze = y * sin(eps) + z * cos(eps);
  return { ra: normalize(rad2deg(Math.atan2(ye, xe))) / 15, dec: rad2deg(Math.atan2(ze, Math.sqrt(xe*xe + ye*ye))) };
}

function setCalibration(v) {
  state.calibration = normalize(v);
  if (state.calibration > 180) state.calibration -= 360;
  localStorage.setItem('celarCalibration', String(state.calibration));
  toastMsg(`Calibratge: ${state.calibration > 0 ? '+' : ''}${Math.round(state.calibration)}°`);
}

function cardinal(a) {
  const names = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
  return names[Math.round(normalize(a) / 45) % 8];
}
function normalize(v) { return ((v % 360) + 360) % 360; }
function angleDiff(a, b) { return ((a - b + 540) % 360) - 180; }
function deg2rad(d) { return d * Math.PI / 180; }
function rad2deg(r) { return r * 180 / Math.PI; }
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function sin(d) { return Math.sin(deg2rad(d)); }
function cos(d) { return Math.cos(deg2rad(d)); }

startBtn.addEventListener('click', () => start({ demo: false }));
demoBtn.addEventListener('click', () => start({ demo: true }));
menuBtn.addEventListener('click', () => drawer.classList.toggle('hidden'));
search.addEventListener('input', updateSearch);
nightMode.addEventListener('change', () => document.body.classList.toggle('night', nightMode.checked));
westBtn.addEventListener('click', () => setCalibration(state.calibration - 5));
eastBtn.addEventListener('click', () => setCalibration(state.calibration + 5));
resetCalBtn.addEventListener('click', () => setCalibration(0));
calibrateTargetBtn.addEventListener('click', calibrateToTarget);
closeInfo.addEventListener('click', () => infoCard.classList.add('hidden'));
canvas.addEventListener('click', onCanvasTap);
canvas.addEventListener('touchend', e => { if (e.changedTouches?.[0]) onCanvasTap(e.changedTouches[0]); }, { passive: true });

if ('serviceWorker' in navigator) {
  addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
}
