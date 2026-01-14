const canvas = document.getElementById("background-canvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = document.body.scrollWidth;
  canvas.height = document.body.scrollHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const settings = {
  cellSize: 13,
  waveSpeed: 0.00001,
  waveAmplitude: 2.5,
  invisibleThreshold: 0.19,
  baseScaleMin: 0.2,
  baseScaleMax: 1.0,

  noiseGridSize: 64,
  noiseScale: 0.15,

  noiseSteps: 5,        // 🔥 NUMERO DI ZONE (più basso = zone grandi)
  stepBias: 7        // >1 = più vuoto, <1 = più pieno
};

function quantize(value, steps) {
  return Math.floor(value * steps) / steps;
}

function bias(value, b) {
  return Math.pow(value, b);
}

// ---------------- GRID ----------------
const cols = Math.floor(canvas.width / settings.cellSize);
const rows = Math.floor(canvas.height / settings.cellSize);

// Celle statiche
const cells = [];
for (let y = 0; y < rows; y++) {
  for (let x = 0; x < cols; x++) {
    cells.push({
      x,
      y,
      char: Math.random() > 0.5 ? "0" : "1",
      baseScale:
        Math.random() *
          (settings.baseScaleMax - settings.baseScaleMin) +
        settings.baseScaleMin
    });
  }
}

// ---------------- NOISE FIELD ----------------
const N = settings.noiseGridSize;
const noise = new Float32Array(N * N);

// inizializza noise tileabile
for (let y = 0; y < N; y++) {
  for (let x = 0; x < N; x++) {
    noise[y * N + x] = Math.random();
  }
}

// bilinear tileable noise
function sampleNoise(u, v) {
  u = (u % 1 + 1) % 1;
  v = (v % 1 + 1) % 1;

  const x = u * N;
  const y = v * N;

  const x0 = Math.floor(x) % N;
  const y0 = Math.floor(y) % N;
  const x1 = (x0 + 1) % N;
  const y1 = (y0 + 1) % N;

  const tx = x - x0;
  const ty = y - y0;

  const a = noise[y0 * N + x0];
  const b = noise[y0 * N + x1];
  const c = noise[y1 * N + x0];
  const d = noise[y1 * N + x1];

  const ab = a + (b - a) * tx;
  const cd = c + (d - c) * tx;

  return ab + (cd - ab) * ty;
}

// ---------------- DRAW ----------------
ctx.textAlign = "center";
ctx.textBaseline = "middle";
ctx.fillStyle = "#000000";
ctx.font = `${settings.cellSize}px monospace`;

const ALPHA_BUCKETS = 12;

function draw(time) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const t = time * settings.waveSpeed;
  let lastAlpha = -1;

  for (let i = 0; i < cells.length; i++) {
    const c = cells[i];

    const u = c.x * settings.noiseScale + t;
    const v = c.y * settings.noiseScale + t * 0.7;

    let n = sampleNoise(u, v);

    // curva soap
    n = Math.sin(n * Math.PI);

    // nuova pipeline
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

    ctx.fillText(
      c.char,
      c.x * settings.cellSize + settings.cellSize / 2,
      c.y * settings.cellSize + settings.cellSize / 2
    );
  }

  ctx.globalAlpha = 1;
  requestAnimationFrame(draw);
}

requestAnimationFrame(draw);
