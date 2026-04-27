<template>
  <div
    class="world-map"
    :class="{
      'world-map--filtered': selectedCountry,
      'world-map--navigable': navigable,
      'world-map--grabbing': isGrabbing,
    }"
  >
    <svg
      ref="svgRef"
      class="world-map__svg"
      :viewBox="`0 0 ${MAP_VIEWBOX.width} ${MAP_VIEWBOX.height}`"
      :preserveAspectRatio="preserveAspectRatio"
      role="img"
      aria-label="Mapa mundial de la agenda"
      @click="onSvgClick"
      @wheel="onWheel"
      @pointerdown="onPointerDown"
      @focusin.capture="onSvgFocusIn"
    >
      <g :transform="cameraTransform">
        <g
          class="world-map__countries"
          :data-selected="selectedCountry || ''"
          v-html="countriesMarkup"
        />

        <g class="world-map__pins">
          <g
            v-for="pin in pins"
            :key="pin.countryCode + ':' + pin.city"
            class="world-map__pin"
            :class="{
              'world-map__pin--active': selectedCountry === pin.countryCode,
              'world-map__pin--dimmed':
                selectedCountry && selectedCountry !== pin.countryCode,
            }"
            :transform="pinTransform(pin)"
            role="button"
            tabindex="0"
            :aria-label="`${pin.city}, ${pin.country}`"
            @click.stop="selectCountry(pin.countryCode, $event)"
            @keydown.enter.prevent="selectCountry(pin.countryCode, $event)"
            @keydown.space.prevent="selectCountry(pin.countryCode, $event)"
            @mouseenter="onEnter(pin, $event)"
            @mousemove="onMove($event)"
            @mouseleave="onLeave"
            @focus="onFocus(pin, $event)"
            @blur="onLeave"
          >
            <circle class="world-map__pulse" r="14" />
            <circle class="world-map__dot" r="4.5" />
            <circle class="world-map__hit" r="22" fill="transparent" />
            <text
              v-if="showPinLabels"
              class="world-map__pin-label"
              x="0"
              y="-42"
              text-anchor="middle"
            >
              <tspan class="world-map__pin-label-city" x="0" dy="0">{{ pin.city }}</tspan>
              <tspan class="world-map__pin-label-country" x="0" dy="18">{{ pin.country }}</tspan>
            </text>
          </g>
        </g>
      </g>
    </svg>

    <div
      v-if="navigable"
      class="world-map__zoom-ui"
      role="group"
      aria-label="Controles del mapa"
    >
      <button
        type="button"
        class="world-map__zoom-btn"
        aria-label="Acercar"
        @click="zoomStep(1.15)"
      >
        +
      </button>
      <button
        type="button"
        class="world-map__zoom-btn"
        aria-label="Alejar"
        @click="zoomStep(1 / 1.15)"
      >
        −
      </button>
      <button
        type="button"
        class="world-map__zoom-btn world-map__zoom-btn--reset"
        aria-label="Restablecer vista del mapa"
        @click="resetCamera"
      >
        ⊙
      </button>
    </div>

    <div
      v-if="tooltip.visible"
      class="world-map__tooltip"
      :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
      role="tooltip"
    >
      <span class="world-map__tooltip-city">{{ tooltip.city }}</span>
      <span class="world-map__tooltip-sep" aria-hidden="true">·</span>
      <span class="world-map__tooltip-country">{{ tooltip.country }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed, onUnmounted, reactive, ref, watch } from "vue";
import worldSvgRaw from "../../assets/world.svg?raw";
import { MAP_VIEWBOX, project } from "./projection.js";

/** No alejar más que esto (evita “mini mapa” y huecos enormes). */
const ZOOM_MIN = 0.82;
const ZOOM_MAX = 6.5;
/** Paso por tick de rueda (menor = menos sensible). */
const WHEEL_ZOOM_FACTOR = 1.025;
/** A partir de este zoom se muestran cartelitos con el lugar junto a cada pin. */
const ZOOM_SHOW_PIN_LABELS = 5;
/** Zoom inicial en vista navegable (más alto = mapa más cercano). */
const NAV_DEFAULT_ZOOM = 1.65;

const props = defineProps({
  events: { type: Array, required: true },
  selectedCountry: { type: String, default: "" },
  /** `contain`: mapa entero (puede dejar bandas). `cover`: llena la caja, recorta si hace falta. */
  fit: {
    type: String,
    default: "contain",
    validator: (v) => v === "contain" || v === "cover",
  },
  /** Zoom con rueda, arrastre para mover, botones +/−. */
  navigable: { type: Boolean, default: false },
});

const emit = defineEmits(["select", "clear"]);

const svgRef = ref(null);
const panX = ref(0);
const panY = ref(0);
const zoom = ref(1);
const isGrabbing = ref(false);
let dragMoved = false;

/** Punteros activos sobre el mapa (dedos / mouse): id → posición cliente */
const activePointers = new Map();
let windowPointersBound = false;
/** Pan con un dedo: última posición en coords SVG */
let panState = null;
let isPinching = false;
let pinchLastDist = 0;

function bindWindowPointerListeners() {
  if (windowPointersBound) return;
  windowPointersBound = true;
  window.addEventListener("pointermove", onWindowPointerMove, { passive: false });
  window.addEventListener("pointerup", onWindowPointerUp, { passive: true });
  window.addEventListener("pointercancel", onWindowPointerUp, { passive: true });
}

function unbindWindowPointerListeners() {
  if (!windowPointersBound) return;
  windowPointersBound = false;
  window.removeEventListener("pointermove", onWindowPointerMove);
  window.removeEventListener("pointerup", onWindowPointerUp);
  window.removeEventListener("pointercancel", onWindowPointerUp);
}

function pinchMetrics() {
  const vals = [...activePointers.values()];
  if (vals.length < 2) return null;
  const [a, b] = vals;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.hypot(dx, dy);
  return {
    dist: Math.max(dist, 1e-3),
    midX: (a.x + b.x) / 2,
    midY: (a.y + b.y) / 2,
  };
}

function resumePanFromRemainingPointer() {
  const svg = svgRef.value;
  if (!svg || activePointers.size !== 1) return;
  const pos = [...activePointers.values()][0];
  const p = clientToSvg(svg, pos.x, pos.y);
  panState = { lastX: p.x, lastY: p.y };
  isGrabbing.value = true;
}

function onWindowPointerMove(e) {
  if (!props.navigable) return;
  if (!activePointers.has(e.pointerId)) return;

  activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

  if (activePointers.size >= 2) {
    if (e.pointerType === "touch") e.preventDefault();
    const m = pinchMetrics();
    if (!m) return;
    if (!isPinching) {
      isPinching = true;
      panState = null;
      isGrabbing.value = true;
      pinchLastDist = m.dist;
      return;
    }
    const factor = m.dist / pinchLastDist;
    if (Math.abs(factor - 1) > 0.002) {
      zoomAtClient(factor, m.midX, m.midY);
    }
    pinchLastDist = m.dist;
    dragMoved = true;
    return;
  }

  if (isPinching) {
    isPinching = false;
    pinchLastDist = 0;
  }

  if (panState && activePointers.size === 1) {
    if (e.pointerType === "touch") e.preventDefault();
    const svg = svgRef.value;
    if (!svg) return;
    const p = clientToSvg(svg, e.clientX, e.clientY);
    const dx = p.x - panState.lastX;
    const dy = p.y - panState.lastY;
    panX.value += dx;
    panY.value += dy;
    clampPan();
    panState.lastX = p.x;
    panState.lastY = p.y;
    if (Math.hypot(dx, dy) > 1.5) dragMoved = true;
  }
}

function onWindowPointerUp(e) {
  activePointers.delete(e.pointerId);

  if (activePointers.size === 0) {
    isGrabbing.value = false;
    panState = null;
    isPinching = false;
    pinchLastDist = 0;
    unbindWindowPointerListeners();
  } else if (activePointers.size === 1) {
    isPinching = false;
    pinchLastDist = 0;
    resumePanFromRemainingPointer();
  }
}

onUnmounted(() => {
  activePointers.clear();
  unbindWindowPointerListeners();
  panState = null;
  isPinching = false;
  pinchLastDist = 0;
});

watch(
  () => props.navigable,
  (v) => {
    panX.value = 0;
    panY.value = 0;
    zoom.value = v ? NAV_DEFAULT_ZOOM : 1;
    clampPan();
  },
  { immediate: true },
);

const preserveAspectRatio = computed(() =>
  props.fit === "cover" ? "xMidYMid slice" : "xMidYMid meet",
);

const showPinLabels = computed(
  () => props.navigable && zoom.value >= ZOOM_SHOW_PIN_LABELS,
);

const cameraTransform = computed(() => {
  const cx = MAP_VIEWBOX.width / 2;
  const cy = MAP_VIEWBOX.height / 2;
  const z = zoom.value;
  const px = panX.value;
  const py = panY.value;
  return `translate(${px} ${py}) translate(${cx} ${cy}) scale(${z}) translate(${-cx} ${-cy})`;
});

/** Contrae el pin para que el tamaño en pantalla no crezca al acercar el mapa (misma lógica que mapas web). */
function pinTransform(pin) {
  const z = zoom.value;
  const inv = z > 0.01 ? 1 / z : 1;
  return `translate(${pin.x} ${pin.y}) scale(${inv})`;
}

const countriesMarkup = computed(() =>
  worldSvgRaw
    .replace(/^[\s\S]*?<svg[^>]*>/, "")
    .replace(/<\/svg>\s*$/, ""),
);

const pins = computed(() => {
  const seen = new Map();
  for (const ev of props.events) {
    const key = `${ev.countryCode}:${ev.city}`;
    if (seen.has(key)) continue;
    const { x, y } = project(ev.lon, ev.lat);
    seen.set(key, {
      city: ev.city,
      country: ev.country,
      countryCode: ev.countryCode,
      x,
      y,
    });
  }
  return Array.from(seen.values());
});

/** Códigos ISO (id del path en world.svg) que tienen al menos un evento. */
const agendaCountryCodes = computed(() => {
  const s = new Set();
  for (const ev of props.events) s.add(ev.countryCode);
  return s;
});

/** Si el target es un país con fechas, devuelve su `countryCode`; si no, "". */
function countryCodeFromMapClickTarget(target) {
  const path = target?.closest?.(".world-map__countries path");
  if (!path?.id) return "";
  const code = path.id;
  if (!/^[A-Z]{2}$/.test(code) || !agendaCountryCodes.value.has(code)) return "";
  return code;
}

const tooltip = reactive({
  visible: false,
  x: 0,
  y: 0,
  city: "",
  country: "",
});

function clientToSvg(svg, clientX, clientY) {
  const pt = svg.createSVGPoint();
  pt.x = clientX;
  pt.y = clientY;
  const m = svg.getScreenCTM();
  if (!m) return { x: 0, y: 0 };
  return pt.matrixTransform(m.inverse());
}

/**
 * Acota pan para que el mapa [0,W]×[0,H] en coords del SVG siga intersectando
 * el viewBox visible. Si z>1, el mapa debe cubrir todo el viewport (sin “huecos”).
 */
function clampPan() {
  if (!props.navigable) return;

  const z = zoom.value;
  const W = MAP_VIEWBOX.width;
  const H = MAP_VIEWBOX.height;
  const cx = W / 2;
  const cy = H / 2;

  let minPx;
  let maxPx;
  let minPy;
  let maxPy;

  if (Math.abs(z - 1) < 1e-6) {
    minPx = maxPx = 0;
    minPy = maxPy = 0;
  } else if (z < 1) {
    minPx = -z * W - (1 - z) * cx;
    maxPx = W - (1 - z) * cx;
    minPy = -z * H - (1 - z) * cy;
    maxPy = H - (1 - z) * cy;
  } else {
    const rx = (z - 1) * cx;
    const ry = (z - 1) * cy;
    minPx = -rx;
    maxPx = rx;
    minPy = -ry;
    maxPy = ry;
  }

  panX.value = Math.min(maxPx, Math.max(minPx, panX.value));
  panY.value = Math.min(maxPy, Math.max(minPy, panY.value));
}

function zoomAtClient(factor, clientX, clientY) {
  const svg = svgRef.value;
  if (!svg) return;
  const pt = clientToSvg(svg, clientX, clientY);
  const z0 = zoom.value;
  const z1 = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, z0 * factor));
  if (Math.abs(z1 - z0) < 1e-6) return;
  const cx = MAP_VIEWBOX.width / 2;
  const cy = MAP_VIEWBOX.height / 2;
  const ux = cx + (pt.x - panX.value - cx) / z0;
  const uy = cy + (pt.y - panY.value - cy) / z0;
  panX.value = pt.x - cx - z1 * (ux - cx);
  panY.value = pt.y - cy - z1 * (uy - cy);
  zoom.value = z1;
  clampPan();
}

function zoomStep(factor) {
  const svg = svgRef.value;
  if (!svg) return;
  const r = svg.getBoundingClientRect();
  zoomAtClient(factor, r.left + r.width / 2, r.top + r.height / 2);
}

function resetCamera() {
  panX.value = 0;
  panY.value = 0;
  zoom.value = props.navigable ? NAV_DEFAULT_ZOOM : 1;
  clampPan();
}

function onWheel(e) {
  if (!props.navigable) return;
  e.preventDefault();
  const step =
    e.deltaY < 0 ? WHEEL_ZOOM_FACTOR : 1 / WHEEL_ZOOM_FACTOR;
  zoomAtClient(step, e.clientX, e.clientY);
}

function onPointerDown(e) {
  if (!props.navigable) return;
  if (e.pointerType === "mouse" && e.button !== 0) return;

  const t = e.target;
  if (t.closest?.(".world-map__pin")) return;
  if (t.closest?.(".world-map__zoom-ui")) return;
  /* Mismo criterio que el pin: no iniciar pan/capture — si no, el click no filtra la lista. */
  if (countryCodeFromMapClickTarget(t)) return;

  const svg = svgRef.value;
  if (!svg) return;

  activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

  if (activePointers.size === 1) {
    dragMoved = false;
    isGrabbing.value = true;
    const p = clientToSvg(svg, e.clientX, e.clientY);
    panState = { lastX: p.x, lastY: p.y };
    bindWindowPointerListeners();
  } else if (activePointers.size >= 2) {
    isPinching = true;
    panState = null;
    isGrabbing.value = true;
    const m = pinchMetrics();
    pinchLastDist = m ? m.dist : 0;
  }

  try {
    e.currentTarget?.setPointerCapture?.(e.pointerId);
  } catch (_) {
    /* ignore */
  }
}

function onSvgClick(e) {
  if (e.target.closest?.(".world-map__pin")) return;
  if (props.navigable && dragMoved) return;

  const code = countryCodeFromMapClickTarget(e.target);
  if (code) {
    emit("select", code);
    return;
  }

  if (e.target.closest?.(".world-map__countries path")) {
    /* País en el mapa pero sin fechas en la agenda: no limpiar filtro ni cambiar selección. */
    return;
  }

  emit("clear");
}

/** Evita foco en paths del mapa (anillo azul / caja en Safari y otros). */
function onSvgFocusIn(e) {
  const t = e.target;
  if (!t || t === e.currentTarget) return;
  if (t.closest?.(".world-map__countries")) {
    t.blur?.();
  }
}

function updateTooltipFromEvent(el, e) {
  const container = el.closest(".world-map");
  if (!container) return;
  const rect = container.getBoundingClientRect();
  tooltip.x = e.clientX - rect.left;
  tooltip.y = e.clientY - rect.top;
}

function onEnter(pin, e) {
  tooltip.city = pin.city;
  tooltip.country = pin.country;
  tooltip.visible = true;
  updateTooltipFromEvent(e.currentTarget, e);
}

function onMove(e) {
  if (!tooltip.visible) return;
  updateTooltipFromEvent(e.currentTarget, e);
}

function onFocus(pin, e) {
  onEnter(pin, e);
}

function onLeave() {
  tooltip.visible = false;
}

/** Quita foco del pin para evitar el rectángulo / anillo azul del sistema al seleccionar. */
function selectCountry(code, e) {
  emit("select", code);
  const el = e?.currentTarget;
  requestAnimationFrame(() => el?.blur?.());
}
</script>

<style scoped>
.world-map {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-tap-highlight-color: transparent;
}

.world-map--navigable {
  touch-action: none;
}

.world-map__svg {
  width: 100%;
  height: 100%;
  display: block;
  overflow: visible;
  outline: none;
  -webkit-tap-highlight-color: transparent;
}

.world-map__svg:focus,
.world-map__svg:focus-visible {
  outline: none;
}

.world-map--navigable .world-map__svg {
  cursor: grab;
}

.world-map--navigable.world-map--grabbing .world-map__svg {
  cursor: grabbing;
}

.world-map__zoom-ui {
  position: absolute;
  right: 0.5rem;
  bottom: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  z-index: 3;
}

.world-map__zoom-btn {
  width: 2.25rem;
  height: 2.25rem;
  padding: 0;
  border: 1px solid rgba(10, 10, 10, 0.15);
  border-radius: 0.45rem;
  background: #fff;
  color: #0a0a0a;
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(10, 10, 10, 0.08);
  transition: background 0.15s ease, color 0.15s ease;
}

.world-map__zoom-btn:hover {
  background: #0a0a0a;
  color: #fff;
  border-color: #0a0a0a;
}

.world-map__zoom-btn:focus-visible {
  outline: 2px solid #0a0a0a;
  outline-offset: 2px;
}

.world-map__zoom-btn--reset {
  font-size: 0.95rem;
}

/* Países (inyectados desde el SVG raw) */
.world-map__countries :deep(path) {
  fill: #e8e8e8;
  stroke: #ffffff;
  stroke-width: 0.6;
  stroke-linejoin: round;
  transition: fill 0.3s ease, opacity 0.3s ease;
  outline: none;
  -webkit-tap-highlight-color: transparent;
  cursor: pointer;
}

.world-map__countries :deep(path:focus),
.world-map__countries :deep(path:focus-visible) {
  outline: none;
}

.world-map__countries :deep(path:hover) {
  fill: #dcdcdc;
}

.world-map--filtered .world-map__countries :deep(path) {
  opacity: 0.55;
}

.world-map__countries[data-selected="AR"] :deep(path#AR),
.world-map__countries[data-selected="BR"] :deep(path#BR),
.world-map__countries[data-selected="CL"] :deep(path#CL),
.world-map__countries[data-selected="CR"] :deep(path#CR),
.world-map__countries[data-selected="DE"] :deep(path#DE),
.world-map__countries[data-selected="ES"] :deep(path#ES),
.world-map__countries[data-selected="GB"] :deep(path#GB),
.world-map__countries[data-selected="IT"] :deep(path#IT),
.world-map__countries[data-selected="PY"] :deep(path#PY),
.world-map__countries[data-selected="US"] :deep(path#US) {
  fill: #0a0a0a;
  opacity: 1;
}

.world-map__pin {
  cursor: pointer;
  transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
}

.world-map__pin-label {
  pointer-events: none;
  user-select: none;
}

.world-map__pin-label-city {
  font-family: Inter, system-ui, -apple-system, sans-serif;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.04em;
  fill: #0a0a0a;
  paint-order: stroke fill;
  stroke: rgba(255, 255, 255, 0.94);
  stroke-width: 5.5px;
  stroke-linejoin: round;
}

.world-map__pin-label-country {
  font-family: Inter, system-ui, -apple-system, sans-serif;
  font-size: 15px;
  font-weight: 500;
  letter-spacing: -0.02em;
  fill: rgba(10, 10, 10, 0.55);
  paint-order: stroke fill;
  stroke: rgba(255, 255, 255, 0.9);
  stroke-width: 4px;
  stroke-linejoin: round;
}

.world-map__pin--dimmed .world-map__pin-label-city,
.world-map__pin--dimmed .world-map__pin-label-country {
  opacity: 0.4;
}

.world-map__dot {
  fill: #0a0a0a;
  stroke: #ffffff;
  stroke-width: 1.2;
  transition: transform 0.25s ease, fill 0.2s ease;
  transform-box: fill-box;
  transform-origin: center;
}

.world-map__pulse {
  fill: rgba(10, 10, 10, 0.18);
  transform-box: fill-box;
  transform-origin: center;
  animation: mapPulse 2.4s ease-out infinite;
  pointer-events: none;
}

.world-map__pin:hover .world-map__dot,
.world-map__pin:focus-visible .world-map__dot {
  transform: scale(1.4);
}

.world-map__pin:focus,
.world-map__pin:focus-visible {
  outline: none;
}

.world-map__pin:focus-visible .world-map__dot {
  stroke: #0a0a0a;
  stroke-width: 2;
}

.world-map__pin--active .world-map__dot {
  fill: #ffffff;
  stroke: #0a0a0a;
  stroke-width: 2.2;
  transform: scale(1.55);
}

.world-map__pin--active .world-map__pulse {
  fill: rgba(10, 10, 10, 0.28);
  animation-duration: 1.6s;
}

.world-map__pin--dimmed .world-map__dot {
  fill: rgba(10, 10, 10, 0.25);
}

.world-map__pin--dimmed .world-map__pulse {
  display: none;
}

@keyframes mapPulse {
  0% {
    transform: scale(0.4);
    opacity: 0.6;
  }
  80% {
    transform: scale(2.1);
    opacity: 0;
  }
  100% {
    transform: scale(2.1);
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .world-map__pulse {
    animation: none;
  }
}

.world-map__tooltip {
  position: absolute;
  transform: translate(-50%, calc(-100% - 14px));
  pointer-events: none;
  background: #0a0a0a;
  color: #fff;
  padding: 0.4rem 0.7rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: -0.01em;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  z-index: 2;
  opacity: 0;
  animation: tooltipIn 0.18s ease-out forwards;
}

.world-map__tooltip-sep {
  opacity: 0.5;
}

.world-map__tooltip-country {
  opacity: 0.75;
}

@keyframes tooltipIn {
  from {
    opacity: 0;
    transform: translate(-50%, calc(-100% - 8px));
  }
  to {
    opacity: 1;
    transform: translate(-50%, calc(-100% - 14px));
  }
}
</style>
