<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';

const props = withDefaults(
  defineProps<{
    cellSize?: number;
    influenceRadius?: number;
    maxDepth?: number;
  }>(),
  {
    cellSize: 40,
    influenceRadius: 110,
    maxDepth: 12,
  }
);

const canvasRef = ref<HTMLCanvasElement | null>(null);
const containerRef = ref<HTMLDivElement | null>(null);

let animationFrameId: number | null = null;
let isAnimating = false;
let resizeObserver: ResizeObserver | null = null;

// Grid state
let cols = 0;
let rows = 0;
let width = 0;
let height = 0;
let dpr = 1;

// Float32Arrays for ultra-fast memory & zero GC pressure
let cellProgress: Float32Array = new Float32Array(0);
let cellTarget: Float32Array = new Float32Array(0);

// Pointer tracking
let mouseX = -9999;
let mouseY = -9999;
let isPointerInside = false;

// Accessibility: prefers-reduced-motion
let prefersReducedMotion = false;

function initGrid() {
  const container = containerRef.value;
  const canvas = canvasRef.value;
  if (!container || !canvas) return;

  const rect = container.getBoundingClientRect();
  width = Math.max(rect.width, 320);
  height = Math.max(rect.height, 200);
  dpr = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  cols = Math.ceil(width / props.cellSize) + 1;
  rows = Math.ceil(height / props.cellSize) + 1;

  const totalCells = cols * rows;
  const newProgress = new Float32Array(totalCells);
  const newTarget = new Float32Array(totalCells);

  const copyCount = Math.min(newProgress.length, cellProgress.length);
  for (let i = 0; i < copyCount; i++) {
    newProgress[i] = cellProgress[i];
    newTarget[i] = cellTarget[i];
  }

  cellProgress = newProgress;
  cellTarget = newTarget;

  renderStatic();
}

function handlePointerMove(e: PointerEvent) {
  const container = containerRef.value;
  if (!container) return;

  const rect = container.getBoundingClientRect();
  const inside = (
    e.clientX >= rect.left &&
    e.clientX <= rect.right &&
    e.clientY >= rect.top &&
    e.clientY <= rect.bottom
  );

  if (!inside) {
    if (isPointerInside) {
      isPointerInside = false;
      mouseX = -9999;
      mouseY = -9999;
      startAnimationLoop();
    }
    return;
  }

  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;
  isPointerInside = true;

  updateTargetIntensities();
  startAnimationLoop();
}

function handlePointerLeave() {
  isPointerInside = false;
  mouseX = -9999;
  mouseY = -9999;
  startAnimationLoop();
}

function updateTargetIntensities() {
  if (!isPointerInside) return;

  const r = props.influenceRadius;
  const s = props.cellSize;

  const minCol = Math.max(0, Math.floor((mouseX - r) / s));
  const maxCol = Math.min(cols - 1, Math.ceil((mouseX + r) / s));
  const minRow = Math.max(0, Math.floor((mouseY - r) / s));
  const maxRow = Math.min(rows - 1, Math.ceil((mouseY + r) / s));

  for (let c = minCol; c <= maxCol; c++) {
    for (let row = minRow; row <= maxRow; row++) {
      const idx = row * cols + c;
      const cx = c * s + s / 2;
      const cy = row * s + s / 2;
      const dist = Math.hypot(cx - mouseX, cy - mouseY);

      if (dist < r) {
        const norm = 1 - dist / r;
        const intensity = norm * norm * (3 - 2 * norm);
        if (intensity > cellTarget[idx]) {
          cellTarget[idx] = intensity;
        }
      }
    }
  }
}

function renderFrame() {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.save();
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, width, height);

  const s = props.cellSize;
  let hasActiveCells = false;

  // 1. Draw base 40x40 grid lines in one optimized pass
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
  ctx.lineWidth = 1;

  for (let c = 0; c <= cols; c++) {
    const x = c * s;
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }
  for (let r = 0; r <= rows; r++) {
    const y = r * s;
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }
  ctx.stroke();

  // Subtle intersection accent points
  ctx.fillStyle = 'rgba(56, 189, 248, 0.22)';
  for (let c = 0; c <= cols; c++) {
    for (let r = 0; r <= rows; r++) {
      ctx.fillRect(c * s - 0.75, r * s - 0.75, 1.5, 1.5);
    }
  }

  // 2. Animate and draw 3D extruded wireframe cubes for hovered/active cells
  for (let row = 0; row < rows; row++) {
    for (let c = 0; c < cols; c++) {
      const idx = row * cols + c;

      const target = isPointerInside ? cellTarget[idx] : 0;
      cellProgress[idx] += (target - cellProgress[idx]) * 0.18;
      cellTarget[idx] *= 0.88;

      if (cellProgress[idx] < 0.003) {
        cellProgress[idx] = 0;
      } else {
        hasActiveCells = true;
      }

      const p = cellProgress[idx];
      if (p <= 0) continue;

      const x = c * s;
      const y = row * s;
      const cx = x + s / 2;
      const cy = y + s / 2;

      // 3D Perspective displacement
      let dx = 0;
      let dy = 0;

      if (!prefersReducedMotion) {
        const depth = props.maxDepth * p;
        const angle = Math.atan2(cy - mouseY, cx - mouseX);
        dx = Math.cos(angle) * depth;
        dy = Math.sin(angle) * depth;
      }

      // Base corners
      const bx0 = x;
      const by0 = y;
      const bx1 = x + s;
      const by1 = y;
      const bx2 = x + s;
      const by2 = y + s;
      const bx3 = x;
      const by3 = y + s;

      // Top extruded corners
      const tx0 = bx0 + dx;
      const ty0 = by0 + dy;
      const tx1 = bx1 + dx;
      const ty1 = by1 + dy;
      const tx2 = bx2 + dx;
      const ty2 = by2 + dy;
      const tx3 = bx3 + dx;
      const ty3 = by3 + dy;

      // Draw 3D Side Facets (Bevel/Depth Fill)
      if (dx > 0) {
        ctx.beginPath();
        ctx.moveTo(bx0, by0);
        ctx.lineTo(tx0, ty0);
        ctx.lineTo(tx3, ty3);
        ctx.lineTo(bx3, by3);
        ctx.closePath();
        ctx.fillStyle = `rgba(14, 165, 233, ${0.12 * p})`;
        ctx.fill();
      } else if (dx < 0) {
        ctx.beginPath();
        ctx.moveTo(bx1, by1);
        ctx.lineTo(tx1, ty1);
        ctx.lineTo(tx2, ty2);
        ctx.lineTo(bx2, by2);
        ctx.closePath();
        ctx.fillStyle = `rgba(14, 165, 233, ${0.12 * p})`;
        ctx.fill();
      }

      if (dy > 0) {
        ctx.beginPath();
        ctx.moveTo(bx0, by0);
        ctx.lineTo(tx0, ty0);
        ctx.lineTo(tx1, ty1);
        ctx.lineTo(bx1, by1);
        ctx.closePath();
        ctx.fillStyle = `rgba(56, 189, 248, ${0.16 * p})`;
        ctx.fill();
      } else if (dy < 0) {
        ctx.beginPath();
        ctx.moveTo(bx3, by3);
        ctx.lineTo(tx3, ty3);
        ctx.lineTo(tx2, ty2);
        ctx.lineTo(bx2, by2);
        ctx.closePath();
        ctx.fillStyle = `rgba(56, 189, 248, ${0.16 * p})`;
        ctx.fill();
      }

      // 4 Connecting 3D Depth Edges
      ctx.beginPath();
      ctx.moveTo(bx0, by0);
      ctx.lineTo(tx0, ty0);
      ctx.moveTo(bx1, by1);
      ctx.lineTo(tx1, ty1);
      ctx.moveTo(bx2, by2);
      ctx.lineTo(tx2, ty2);
      ctx.moveTo(bx3, by3);
      ctx.lineTo(tx3, ty3);
      ctx.strokeStyle = `rgba(56, 189, 248, ${0.55 * p})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Top Face Fill (Glowing holographic face)
      ctx.beginPath();
      ctx.moveTo(tx0, ty0);
      ctx.lineTo(tx1, ty1);
      ctx.lineTo(tx2, ty2);
      ctx.lineTo(tx3, ty3);
      ctx.closePath();
      ctx.fillStyle = `rgba(56, 189, 248, ${0.12 * p})`;
      ctx.fill();

      // Top Face 3D Edges (Crisp glowing neon borders)
      ctx.strokeStyle = `rgba(56, 189, 248, ${0.4 + 0.6 * p})`;
      ctx.lineWidth = 1.2 + 0.6 * p;
      ctx.stroke();

      // Corner vertex accent points
      ctx.fillStyle = `rgba(255, 255, 255, ${0.9 * p})`;
      ctx.fillRect(tx0 - 1, ty0 - 1, 2.5, 2.5);
      ctx.fillRect(tx1 - 1, ty1 - 1, 2.5, 2.5);
      ctx.fillRect(tx2 - 1, ty2 - 1, 2.5, 2.5);
      ctx.fillRect(tx3 - 1, ty3 - 1, 2.5, 2.5);
    }
  }

  ctx.restore();

  if (hasActiveCells || isPointerInside) {
    animationFrameId = requestAnimationFrame(renderFrame);
  } else {
    isAnimating = false;
  }
}

function startAnimationLoop() {
  if (!isAnimating) {
    isAnimating = true;
    animationFrameId = requestAnimationFrame(renderFrame);
  }
}

function renderStatic() {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.save();
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, width, height);

  ctx.beginPath();
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
  ctx.lineWidth = 1;

  const s = props.cellSize;
  for (let c = 0; c <= cols; c++) {
    const x = c * s;
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }
  for (let r = 0; r <= rows; r++) {
    const y = r * s;
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }
  ctx.stroke();

  // Accent intersection dots
  ctx.fillStyle = 'rgba(56, 189, 248, 0.22)';
  for (let c = 0; c <= cols; c++) {
    for (let r = 0; r <= rows; r++) {
      ctx.fillRect(c * s - 0.75, r * s - 0.75, 1.5, 1.5);
    }
  }

  ctx.restore();
}

onMounted(() => {
  prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  nextTick(() => {
    initGrid();
  });

  if (containerRef.value) {
    resizeObserver = new ResizeObserver(() => {
      initGrid();
    });
    resizeObserver.observe(containerRef.value);
  }

  window.addEventListener('pointermove', handlePointerMove, { passive: true });
  window.addEventListener('pointerleave', handlePointerLeave, { passive: true });
});

onBeforeUnmount(() => {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
  }
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
  window.removeEventListener('pointermove', handlePointerMove);
  window.removeEventListener('pointerleave', handlePointerLeave);
});
</script>

<template>
  <div
    ref="containerRef"
    class="interactive-grid-container absolute inset-0 overflow-hidden pointer-events-none z-0 select-none"
    aria-hidden="true"
  >
    <canvas
      ref="canvasRef"
      class="block w-full h-full"
    ></canvas>
  </div>
</template>

<style scoped>
.interactive-grid-container {
  /* Soft radial gradient mask so grid gently dissolves at the edges */
  mask-image: radial-gradient(ellipse 95% 85% at 50% 35%, black 60%, transparent 100%);
  -webkit-mask-image: radial-gradient(ellipse 95% 85% at 50% 35%, black 60%, transparent 100%);
}

@media (prefers-reduced-motion: reduce) {
  .interactive-grid-container {
    transition: none !important;
  }
}
</style>
