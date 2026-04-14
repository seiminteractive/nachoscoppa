<template>
  <section
    id="live-sets"
    ref="rootRef"
    class="live-sets"
    aria-labelledby="live-sets-heading"
  >
    <div class="live-sets__stage">
      <div ref="cardRef" class="live-sets__card">
        <div class="live-sets__grain" aria-hidden="true" />
        <div class="live-sets__inner">
          <div class="live-sets__badge-row">
            <span class="live-sets__badge-icon" aria-hidden="true">
              <span class="live-sets__badge-plus">+</span>
            </span>
            <span class="live-sets__badge-label">What we do</span>
          </div>

          <h2 id="live-sets-heading" class="live-sets__title">
            LIVE SETS.<span class="live-sets__title-count">({{ liveSets.length }})</span>
          </h2>

          <ul class="live-sets__list" role="list">
            <li
              v-for="(item, index) in liveSets"
              :key="item.id"
              class="live-sets__item"
            >
              <div
                class="live-sets__row"
                :class="{ 'is-open': openId === item.id }"
              >
                <div class="live-sets__index-col" aria-hidden="true">
                  <span class="live-sets__index">({{ formatIndex(index) }})</span>
                </div>
                <div class="live-sets__main-col">
                  <div class="live-sets__head-line">
                    <div
                      class="live-sets__preview-bg"
                      :style="{ backgroundImage: `url(${item.previewSrc})` }"
                      aria-hidden="true"
                    />
                    <a
                      class="live-sets__preview-hit"
                      :href="item.youtubeUrl"
                      target="_blank"
                      rel="noopener noreferrer"
                      @click.stop
                    >
                      <span class="live-sets__preview-hit-label"
                        >Ver en YouTube: {{ item.title }}</span
                      >
                    </a>
                    <button
                      type="button"
                      class="live-sets__trigger"
                      :id="`live-set-trigger-${item.id}`"
                      :aria-expanded="openId === item.id"
                      :aria-controls="`live-set-panel-${item.id}`"
                      :aria-label="`Set (${formatIndex(index)}): ${item.title}`"
                      @click="toggle(item.id)"
                    >
                      <span class="live-sets__trigger-main">
                        <span class="live-sets__name">{{ item.title }}</span>
                      </span>
                      <span class="live-sets__icon-wrap" aria-hidden="true">
                        <span class="live-sets__icon" />
                      </span>
                    </button>
                  </div>

                  <div
                    :id="`live-set-panel-${item.id}`"
                    class="live-sets__panel"
                    role="region"
                    :aria-labelledby="`live-set-trigger-${item.id}`"
                  >
                    <div class="live-sets__panel-measure">
                      <div class="live-sets__panel-inner">
                        <p class="live-sets__panel-kicker">
                          {{ item.date }} · {{ item.venue }} — {{ item.city }}
                        </p>
                        <p class="live-sets__detail">{{ item.detail }}</p>
                        <p v-if="item.extra" class="live-sets__extra">
                          {{ item.extra }}
                        </p>
                        <a
                          class="live-sets__youtube-cta"
                          :href="item.youtubeUrl"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Ver en YouTube
                          <span class="live-sets__youtube-cta-arrow" aria-hidden="true">→</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import previewRio from "../assets/youtubeRio.avif";
import previewMousik from "../assets/youtubeMousik.avif";
import previewLaFabrica from "../assets/youtubeLaFabrica.avif";
import previewLaJuanita from "../assets/youtubeLaJuanita.avif";
import preview4get from "../assets/youtube4get.avif";
import { revealOnScroll } from "../composables/scrollReveal";

gsap.registerPlugin(ScrollTrigger);

const rootRef = ref(null);
const cardRef = ref(null);
const openId = ref(null);

const liveSets = [
  {
    id: "ls-rio",
    title: "Río Electronic Music · Buenos Aires",
    date: "15 jun 2025",
    venue: "Río Electronic Music",
    city: "Buenos Aires, AR",
    detail:
      "Nacho Scoppa live @ Río Electronic Music, Buenos Aires — 15.06.2025.",
    extra: null,
    youtubeUrl: "https://www.youtube.com/watch?v=08lYFUwXb28",
    previewSrc: previewRio,
  },
  {
    id: "ls-mousik",
    title: "Mousike · Orlando, FL",
    date: "14 mar 2026",
    venue: "Mousike",
    city: "Orlando, FL, US",
    detail: "NACHO SCOPPA LIVE @ Orlando FL | Mousike | 03-14-2026.",
    extra: null,
    youtubeUrl: "https://youtu.be/DBUOAaZxtT8",
    previewSrc: previewMousik,
  },
  {
    id: "ls-fabrica",
    title: "B2B Sergio Saffe · La Fábrica",
    date: "—",
    venue: "La Fábrica Córdoba",
    city: "Córdoba, AR",
    detail: "Sergio Saffe b2b Nacho Scoppa @ La Fábrica Córdoba.",
    extra: null,
    youtubeUrl: "https://youtu.be/Gb_g51Yc5Gs",
    previewSrc: previewLaFabrica,
  },
  {
    id: "ls-juanita",
    title: "B2B Muter · La Juanita · Estadio UNO",
    date: "29 nov 2025",
    venue: "Estadio UNO (La Juanita)",
    city: "AR",
    detail:
      "Muter B2B Nacho Scoppa @ Estadio UNO by La Juanita Music — 29/11/2025.",
    extra: null,
    youtubeUrl: "https://youtu.be/H080vu_2BY8",
    previewSrc: previewLaJuanita,
  },
  {
    id: "ls-4get",
    title: "4GET · Estación Belgrano",
    date: "7 dic 2025",
    venue: "4GET",
    city: "Estación Belgrano, Santa Fe, AR",
    detail:
      "Nacho Scoppa Live @ 4GET Estación Belgrano, Santa Fe — 07.12.2025.",
    extra: null,
    youtubeUrl: "https://youtu.be/mHsk3idrQxU",
    previewSrc: preview4get,
  },
];

function formatIndex(i) {
  return String(i + 1).padStart(3, "0");
}

function toggle(id) {
  openId.value = openId.value === id ? null : id;
}

let ctx;

onMounted(() => {
  nextTick(() => {
    const root = rootRef.value;
    const card = cardRef.value;
    if (!root || !card) return;

    ctx = gsap.context(() => {
      /*
       * La card NO puede animar con start "top top" + yPercent 100: al llegar la sección arriba
       * el progreso es 0 y la card sigue 100% abajo → overflow:hidden la recorta y parece un bloque vacío.
       * Mientras la sección pasa de “entrando por abajo” a “top alineado al viewport”, la card sube.
       */
      gsap.fromTo(
        card,
        { yPercent: 100 },
        {
          yPercent: 0,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top bottom",
            /* +=innerHeight alinea con "top top";100dvh/ subpíxeles dejan ~pocos px de cola. */
            end: () => `+=${Math.max(0, window.innerHeight - 8)}`,
            scrub: 1,
            fastScrollEnd: true,
            invalidateOnRefresh: true,
          },
        }
      );

      const inner = card.querySelector(".live-sets__inner");
      if (inner) {
        const rows = inner.querySelectorAll(".live-sets__badge-row, .live-sets__title, .live-sets__item");
        revealOnScroll(root, rows, {
          y: 32,
          duration: 0.55,
          stagger: 0.06,
          ease: "power2.out",
          start: "top 82%",
          end: "bottom 12%",
        });
      }
    }, root);

    ScrollTrigger.refresh();
  });
});

onUnmounted(() => {
  ctx?.revert();
});
</script>

<style scoped>
.live-sets {
  --live-pad-x: clamp(0.4rem, 1.15vw, 0.65rem);
  --live-card-pad-x: clamp(1.35rem, 3.2vw, 2.5rem);
  --live-card-pad-y: clamp(2rem, 4.5vh, 3rem);
  position: relative;
  /*
   * Debe ser < z-index del .hero (3): si no, esta capa tapa toda el área del hero
   * y la navbar fija (su z-index:50 queda dentro del contexto del hero).
   * Por encima de Music (1) para seguir solapando esa sección.
   */
  z-index: 2;
  margin-top: calc(-1 * var(--live-underlap, clamp(18vh, 48vh, min(78vh, calc(100dvh - 4rem)))));
  /*
   * Sin fondo opaco: si no, un rectángulo ~100vh de gris queda ENTRE Music y la card
   * mientras la card está en yPercent 100 — parece “separación” y anula la superposición.
   * Transparente + z-index alto: se ve Music debajo hasta que la card negra la tapa.
   */
  background: transparent;
  font-family: "Inter", system-ui, sans-serif;
  pointer-events: none;
  /* Misma geometría que .hero: solo reserva bajo la navbar; el gutter fino va en __stage. */
  display: flex;
  flex-direction: column;
  height: 100vh;
  height: 100dvh;
  max-height: 100vh;
  max-height: 100dvh;
  padding: calc(var(--site-header-offset, clamp(3.05rem, 7vw, 3.75rem)) + env(safe-area-inset-top, 0px))
    0
    0;
  box-sizing: border-box;
  overflow: hidden;
  overflow-x: clip;
}

.live-sets__stage {
  position: relative;
  z-index: 1;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  /* Mismo criterio que .hero__stage: ancho completo del viewport, solo gutter fino. */
  width: 100%;
  min-height: 0;
  /* Sin separación visual con la navbar: top gutter en 0 exacto. */
  padding: 0 var(--live-pad-x) clamp(0.3rem, 1vw, 0.55rem);
  box-sizing: border-box;
  pointer-events: none;
}

.live-sets__card {
  position: relative;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 0;
  border-radius: clamp(1.375rem, 2.4vw, 2rem);
  overflow: hidden;
  will-change: transform;
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.12),
    0 24px 48px rgba(0, 0, 0, 0.35);
  background: #000;
  pointer-events: auto;
}

.live-sets__grain {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.12;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  mix-blend-mode: overlay;
}

.live-sets__inner {
  /*
   * Services: (001) al borde izq. con el eyebrow; títulos y “LIVE SETS.” alineados entre sí;
   * hueco ancho entre índice y título; + al borde derecho.
   */
  --live-index-w: clamp(6.5rem, 24vw, 14rem);
  --live-col-gap: clamp(4rem, 12vw, 9rem);
  --live-title-inset: calc(var(--live-index-w) + var(--live-col-gap));
  /* Hover: preview más ancha + texto a la derecha (solo pointer fino). */
  --live-hover-expand: clamp(2.5rem, 12vw, 11rem);
  --live-row-rule: #1f1f1f;
  --live-muted: #888888;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  flex: 1 1 auto;
  min-height: 0;
  width: 100%;
  padding: var(--live-card-pad-y) var(--live-card-pad-x) var(--live-card-pad-y);
  color: #fff;
  box-sizing: border-box;
}

/* Eyebrow: + en círculo blanco sólido + etiqueta (referencia “What we do”). */
.live-sets__badge-row {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  margin-bottom: clamp(1.5rem, 3.5vh, 2.25rem);
}

.live-sets__badge-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.375rem;
  height: 1.375rem;
  border-radius: 50%;
  background: #fff;
  color: #000;
  flex-shrink: 0;
}

.live-sets__badge-plus {
  font-size: 0.8125rem;
  font-weight: 400;
  line-height: 1;
  margin-top: -0.05em;
}

.live-sets__badge-label {
  font-size: clamp(0.8125rem, 1.15vw, 0.875rem);
  font-weight: 500;
  letter-spacing: 0.01em;
  color: #fff;
}

/* Misma columna de inicio que “Sunset groove” (Services: la S con los títulos de lista). */
.live-sets__title {
  margin: 0 0 clamp(2.5rem, 6vh, 4rem);
  margin-left: var(--live-title-inset);
  width: max-content;
  max-width: calc(100% - var(--live-title-inset));
  font-size: clamp(3rem, 9vw, 6rem);
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 0.98;
  color: #fff;
}

.live-sets__title-count {
  position: relative;
  top: -0.32em;
  margin-left: 0.1em;
  font-size: 0.32em;
  font-weight: 500;
  letter-spacing: 0.03em;
  color: var(--live-muted);
  vertical-align: super;
}

.live-sets__list {
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;
  flex: 1 1 auto;
  min-height: 0;
  align-self: stretch;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
}

.live-sets__list::-webkit-scrollbar {
  width: 6px;
}

.live-sets__list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 999px;
}

.live-sets__item {
  width: 100%;
}

/* Referencia Services: reglas solo bajo la columna de títulos, no bajo los índices. */
.live-sets__main-col {
  position: relative;
  z-index: 1;
  min-width: 0;
  border-bottom: 1px solid var(--live-row-rule);
}

.live-sets__item:first-child .live-sets__main-col {
  border-top: 1px solid var(--live-row-rule);
}

.live-sets__row {
  --live-preview-w: var(--live-title-inset);
  --live-trigger-pad-left: 0px;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  column-gap: var(--live-col-gap);
  align-items: start;
  width: 100%;
  transition: column-gap 0.62s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.live-sets__index-col {
  position: relative;
  z-index: 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: var(--live-index-w);
  max-width: var(--live-index-w);
  min-width: 0;
  padding: clamp(1.5rem, 3vh, 2.35rem) 0;
  box-sizing: border-box;
  opacity: 1;
  overflow: hidden;
  transition:
    max-width 0.62s cubic-bezier(0.25, 0.1, 0.25, 1),
    width 0.62s cubic-bezier(0.25, 0.1, 0.25, 1),
    opacity 0.38s cubic-bezier(0.25, 0.1, 0.25, 1);
}

/* Vista previa: solo altura de la fila del título; cubre índice + hueco (misma anchura que --live-title-inset). */
.live-sets__head-line {
  position: relative;
  z-index: 0;
  isolation: isolate;
}

.live-sets__preview-bg {
  position: absolute;
  /*
   * Mismo corrimiento que padding del trigger: si no, queda una franja negra
   * (borde duro) entre el fin de la foto y el inicio del título.
   */
  left: calc(-1 * var(--live-preview-w) + var(--live-trigger-pad-left));
  top: 0;
  bottom: 0;
  width: var(--live-preview-w);
  z-index: 0;
  background-size: cover;
  background-position: center;
  border-radius: clamp(0.35rem, 0.6vw, 0.5rem) 0 0 clamp(0.35rem, 0.6vw, 0.5rem);
  opacity: 0;
  transform: scale(1.04);
  transition:
    opacity 0.55s cubic-bezier(0.25, 0.1, 0.25, 1),
    transform 0.65s cubic-bezier(0.25, 0.1, 0.25, 1),
    left 0.62s cubic-bezier(0.25, 0.1, 0.25, 1),
    width 0.62s cubic-bezier(0.25, 0.1, 0.25, 1);
  pointer-events: none;
  will-change: opacity, transform;
  -webkit-mask-image: linear-gradient(90deg, #000 0%, #000 58%, transparent 100%);
  mask-image: linear-gradient(90deg, #000 0%, #000 58%, transparent 100%);
}

.live-sets__preview-bg::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.62) 0%,
    rgba(0, 0, 0, 0.28) 52%,
    rgba(0, 0, 0, 0) 100%
  );
}

/*
 * Acordeón abierto: mismo layout que hover — imagen visible aunque el cursor salga de la fila.
 * Hover solo si la fila no está abierta (:not(.is-open)) para no duplicar reglas.
 */
.live-sets__row.is-open {
  --live-preview-w: calc(var(--live-title-inset) + var(--live-hover-expand));
  --live-trigger-pad-left: calc(
    var(--live-title-inset) + var(--live-hover-expand)
  );
  column-gap: 0;
}

.live-sets__row.is-open .live-sets__index-col {
  width: 0;
  max-width: 0;
  opacity: 0;
  pointer-events: none;
}

.live-sets__row.is-open .live-sets__main-col {
  z-index: 2;
}

.live-sets__row.is-open .live-sets__preview-bg {
  opacity: 1;
  transform: scale(1);
}

.live-sets__row.is-open .live-sets__preview-hit {
  pointer-events: auto;
}

@media (hover: hover) and (pointer: fine) {
  .live-sets__item:hover .live-sets__row:not(.is-open) {
    --live-preview-w: calc(var(--live-title-inset) + var(--live-hover-expand));
    --live-trigger-pad-left: calc(
      var(--live-title-inset) + var(--live-hover-expand)
    );
    column-gap: 0;
  }

  .live-sets__item:hover .live-sets__row:not(.is-open) .live-sets__index-col {
    width: 0;
    max-width: 0;
    opacity: 0;
    pointer-events: none;
  }

  .live-sets__item:hover .live-sets__row:not(.is-open) .live-sets__main-col {
    z-index: 2;
  }

  .live-sets__item:hover .live-sets__row:not(.is-open) .live-sets__preview-bg {
    opacity: 1;
    transform: scale(1);
  }

  .live-sets__item:hover .live-sets__row:not(.is-open) .live-sets__preview-hit {
    pointer-events: auto;
  }
}

.live-sets__preview-hit {
  position: absolute;
  left: calc(-1 * var(--live-preview-w) + var(--live-trigger-pad-left));
  top: 0;
  bottom: 0;
  width: var(--live-preview-w);
  z-index: 2;
  overflow: hidden;
  text-indent: 100%;
  white-space: nowrap;
  pointer-events: none;
  transition:
    left 0.62s cubic-bezier(0.25, 0.1, 0.25, 1),
    width 0.62s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.live-sets__preview-hit:focus-visible {
  pointer-events: auto;
  outline: 2px solid rgba(255, 255, 255, 0.65);
  outline-offset: 2px;
}

.live-sets__preview-hit-label {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.live-sets__trigger {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  column-gap: clamp(1rem, 3vw, 1.75rem);
  width: 100%;
  max-width: 100%;
  padding: clamp(1.5rem, 3vh, 2.35rem) 0;
  padding-left: var(--live-trigger-pad-left);
  margin: 0;
  border: none;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  box-sizing: border-box;
  transition: padding-left 0.62s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.live-sets__trigger:focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.5);
  outline-offset: 2px;
}

.live-sets__index {
  min-width: 0;
  font-size: clamp(0.75rem, 1.05vw, 0.8125rem);
  font-weight: 400;
  color: var(--live-muted);
  letter-spacing: 0.06em;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

.live-sets__trigger-main {
  min-width: 0;
  justify-self: start;
  display: block;
}

.live-sets__name {
  font-size: clamp(1.0625rem, 1.55vw, 1.25rem);
  font-weight: 500;
  color: #fff;
  letter-spacing: -0.018em;
  line-height: 1.25;
}

.live-sets__icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  justify-self: end;
  border-radius: 50%;
  border: 1px solid #fff;
}

.live-sets__icon {
  position: relative;
  width: 0.5625rem;
  height: 0.5625rem;
  transition: transform 0.45s cubic-bezier(0.33, 1, 0.68, 1);
}

.live-sets__row.is-open .live-sets__icon {
  transform: rotate(45deg);
}

.live-sets__icon::before,
.live-sets__icon::after {
  content: "";
  position: absolute;
  background: #fff;
  transition: transform 0.45s cubic-bezier(0.33, 1, 0.68, 1);
}

.live-sets__icon::before {
  left: 50%;
  top: 0;
  width: 1.5px;
  height: 100%;
  transform: translateX(-50%);
}

.live-sets__icon::after {
  top: 50%;
  left: 0;
  width: 100%;
  height: 1.5px;
  transform: translateY(-50%);
}

/* Panel: transición fluida sin saltos (grid 0fr → 1fr) */
.live-sets__panel {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.5s cubic-bezier(0.33, 1, 0.68, 1);
}

.live-sets__row.is-open .live-sets__panel {
  grid-template-rows: 1fr;
}

.live-sets__panel-measure {
  overflow: hidden;
  min-height: 0;
}

.live-sets__panel-inner {
  padding: 0 0 clamp(1.25rem, 2.75vh, 1.75rem);
  padding-left: var(--live-trigger-pad-left);
  box-sizing: border-box;
  transition: padding-left 0.62s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.live-sets__youtube-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.35rem;
  font-size: clamp(0.8125rem, 1.1vw, 0.875rem);
  font-weight: 600;
  letter-spacing: 0.02em;
  color: #fff;
  text-decoration: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.35);
  padding-bottom: 0.12em;
  transition: opacity 0.2s ease, border-color 0.2s ease;
}

.live-sets__youtube-cta:hover {
  opacity: 0.85;
  border-bottom-color: rgba(255, 255, 255, 0.55);
}

.live-sets__youtube-cta-arrow {
  transition: transform 0.25s cubic-bezier(0.33, 1, 0.68, 1);
}

.live-sets__youtube-cta:hover .live-sets__youtube-cta-arrow {
  transform: translateX(3px);
}

.live-sets__panel-kicker {
  margin: 0 0 0.75rem;
  font-size: clamp(0.8125rem, 1.15vw, 0.875rem);
  font-weight: 400;
  line-height: 1.45;
  color: var(--live-muted);
  max-width: 42rem;
}

.live-sets__detail {
  margin: 0 0 0.65rem;
  font-size: clamp(0.875rem, 1.2vw, 0.9375rem);
  font-weight: 400;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.72);
  max-width: 42rem;
}

.live-sets__extra {
  margin: 0;
  font-size: clamp(0.8125rem, 1.1vw, 0.875rem);
  color: var(--live-muted);
  line-height: 1.5;
  max-width: 42rem;
}

@media (prefers-reduced-motion: reduce) {
  .live-sets__panel {
    transition-duration: 0.01ms;
  }

  .live-sets__icon {
    transition-duration: 0.01ms;
  }

  .live-sets__icon::before,
  .live-sets__icon::after {
    transition-duration: 0.01ms;
  }

  .live-sets__preview-bg {
    transition-duration: 0.01ms;
  }

  .live-sets__preview-hit {
    transition-duration: 0.01ms;
  }

  .live-sets__row,
  .live-sets__index-col,
  .live-sets__trigger,
  .live-sets__panel-inner {
    transition-duration: 0.01ms;
  }

  .live-sets__youtube-cta-arrow {
    transition-duration: 0.01ms;
  }
}

@media (max-width: 768px) {
  .live-sets__inner {
    --live-index-w: clamp(3.25rem, 22vw, 5.25rem);
    --live-col-gap: clamp(2rem, 8vw, 3.75rem);
    --live-hover-expand: clamp(1.35rem, 9vw, 5.5rem);
  }

  .live-sets__trigger,
  .live-sets__index-col {
    padding-top: clamp(1.25rem, 2.5vh, 1.75rem);
    padding-bottom: clamp(1.25rem, 2.5vh, 1.75rem);
  }

  .live-sets__preview-hit:focus-visible {
    outline-offset: 1px;
  }

  .live-sets__title {
    margin-left: var(--live-title-inset);
    max-width: calc(100% - var(--live-title-inset));
  }
}
</style>
