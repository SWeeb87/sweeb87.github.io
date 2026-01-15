const canvas = document.getElementById("background-canvas");
const ctx = canvas.getContext("2d");

const settings = {
  rowsVisible: 100,       // numero fisso di righe visibili
  cellSize: 13,          // larghezza cella (puoi regolare)
  waveSpeed: 0.00001,
  waveAmplitude: 2.5,
  invisibleThreshold: 0.19,
  baseScaleMin: 0.2,
  baseScaleMax: 1.0,
  noiseGridSize: 64,
  noiseScale: 0.15,
  noiseSteps: 5,
  stepBias: 7
};

// NOISE
const N = settings.noiseGridSize;
const noise = new Float32Array(N * N);
for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) noise[y * N + x] = Math.random();

// GRID CELLS
let cells = [];
let cols = 0;

function initCells() {
  cols = Math.floor(canvas.width / settings.cellSize);
  cells = [];
  for (let y = 0; y < settings.rowsVisible; y++) {
    for (let x = 0; x < cols; x++) {
      cells.push({
        x,
        y,
        char: Math.random() > 0.5 ? "0" : "1",
        baseScale: Math.random() * (settings.baseScaleMax - settings.baseScaleMin) + settings.baseScaleMin
      });
    }
  }
}

// RESIZE
function resizeCanvas() {
  canvas.width = document.body.scrollWidth;
  canvas.height = Math.max(document.body.scrollHeight, window.innerHeight);
  initCells();
}
window.addEventListener("resize", resizeCanvas);
window.addEventListener("load", resizeCanvas);

// FUNZIONI AUSILIARIE
function quantize(value, steps) { return Math.floor(value * steps) / steps; }
function bias(value, b) { return Math.pow(value, b); }
function sampleNoise(u, v) {
  u = (u % 1 + 1) % 1;
  v = (v % 1 + 1) % 1;
  const x0 = Math.floor(u * N) % N;
  const y0 = Math.floor(v * N) % N;
  const x1 = (x0 + 1) % N;
  const y1 = (y0 + 1) % N;
  const tx = u * N - x0;
  const ty = v * N - y0;
  const a = noise[y0 * N + x0];
  const b = noise[y0 * N + x1];
  const c = noise[y1 * N + x0];
  const d = noise[y1 * N + x1];
  const ab = a + (b - a) * tx;
  const cd = c + (d - c) * tx;
  return ab + (cd - ab) * ty;
}

// COLORI
function getTextColor() {
  const theme = document.body.getAttribute("data-theme") || "light";
  return theme === "dark" ? "#ffffff" : "#000000";
}

// DRAW
ctx.textAlign = "center";
ctx.textBaseline = "middle";
ctx.font = `${settings.cellSize}px monospace`;
const ALPHA_BUCKETS = 12;

function draw(time) {
  ctx.fillStyle = getTextColor();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const t = time * settings.waveSpeed;
  let lastAlpha = -1;

  for (let i = 0; i < cells.length; i++) {
    const c = cells[i];

    // scala Y proporzionale all'altezza totale
    const yPos = (c.y / settings.rowsVisible) * canvas.height;
    const xPos = c.x * settings.cellSize + settings.cellSize / 2;

    let n = sampleNoise(c.x * settings.noiseScale + t, c.y * settings.noiseScale + t * 0.7);
    n = Math.sin(n * Math.PI);
    n = quantize(n, settings.noiseSteps);
    n = bias(n, settings.stepBias);

    let alpha = c.baseScale * n * settings.waveAmplitude;
    if (alpha < settings.invisibleThreshold) continue;

    alpha = Math.min(alpha, 1);
    const bucket = Math.floor(alpha * ALPHA_BUCKETS) / ALPHA_BUCKETS;

    if (bucket !== lastAlpha) {
      ctx.globalAlpha = bucket;
      lastAlpha = bucket;
    }

    ctx.fillText(c.char, xPos, yPos);
  }

  ctx.globalAlpha = 1;
  requestAnimationFrame(draw);
}

requestAnimationFrame(draw);
