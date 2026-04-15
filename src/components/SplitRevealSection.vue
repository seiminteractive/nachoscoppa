<template>
  <section
    id="tracks"
    ref="sectionRef"
    class="clients-projects"
    aria-label="Tracks y proyectos"
  >
    <div class="clients-projects__inner-wrap">
      <div ref="viewportEl" class="clients-projects__viewport">
        <div class="clients-projects__top">
          <div class="clients-projects__top-inner">
            <header class="clients-projects__head">
              <p class="clients-projects__eyebrow">+ Tracks</p>
              <p class="clients-projects__meta">(en ascenso)</p>
            </header>

            <div
              class="clients-projects__marquee"
              role="region"
              aria-label="Lanzamientos en carrusel"
            >
              <button
                type="button"
                class="clients-projects__marquee-btn clients-projects__marquee-btn--prev"
                aria-label="Ver tracks anteriores"
                aria-controls="tracks-marquee-scroll"
                @click="scrollMarquee(-1)"
              >
                <svg class="clients-projects__marquee-icon" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="currentColor" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                </svg>
              </button>
              <button
                type="button"
                class="clients-projects__marquee-btn clients-projects__marquee-btn--next"
                aria-label="Ver tracks siguientes"
                aria-controls="tracks-marquee-scroll"
                @click="scrollMarquee(1)"
              >
                <svg class="clients-projects__marquee-icon" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"
                  />
                </svg>
              </button>
              <div
                id="tracks-marquee-scroll"
                ref="marqueeScrollEl"
                class="clients-projects__marquee-viewport"
                @scroll.passive="onMarqueeScroll"
              >
                <div class="clients-projects__marquee-track">
                  <div
                    v-for="pass in marqueePasses"
                    :key="pass"
                    class="clients-projects__marquee-group"
                    :aria-hidden="pass === 2 ? 'true' : undefined"
                  >
                    <article
                      v-for="track in tracksStrip"
                      :key="`${pass}-${track.uid}`"
                      class="track-card"
                    >
                      <div class="track-card__cover">
                        <img
                          :src="track.cover"
                          :alt="`Portada — ${track.title}`"
                          width="320"
                          height="320"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                      <h3 class="track-card__title">{{ track.title }}</h3>
                      <p class="track-card__meta">
                        {{ track.label }}<span class="track-card__dot" aria-hidden="true">•</span>{{ track.year }}
                      </p>
                    </article>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div ref="bottomEl" class="clients-projects__bottom">
          <div class="clients-projects__bottom-inner">
            <p class="clients-projects__count">(27)</p>
            <div class="clients-projects__tracks-main">
              <h2 class="clients-projects__title">Music.</h2>
              <p class="clients-projects__year">©2026</p>
            </div>
            <p class="clients-projects__blurb">
              Explore the latest sounds and high-energy cuts shaping my sets for the 2026 season — club-ready
              grooves, peak-time rollers, and the tracks that are moving the floor right now.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { revealOnScroll } from "../composables/scrollReveal";

import coverBonny from "../assets/bonnyEp.webp";
import coverIlike from "../assets/ilikeitEp.webp";
import coverPerc from "../assets/percussiveSeries.webp";
import coverShow from "../assets/showme.webp";
import coverSome from "../assets/somethingEp.webp";

gsap.registerPlugin(ScrollTrigger);

const tracks = [
  { id: "bonny", title: "Bonny EP", label: "Criterio", year: "2025", cover: coverBonny },
  { id: "ilikeit", title: "I Like It EP", label: "Hot Creations", year: "2024", cover: coverIlike },
  { id: "perc", title: "Percussive Series", label: "Drumcode", year: "2025", cover: coverPerc },
  { id: "show", title: "Show Me", label: "Elrow Music", year: "2025", cover: coverShow },
  { id: "some", title: "Something EP", label: "Under No Illusion", year: "2026", cover: coverSome },
];

/** Varias copias seguidas para que cada tira sea más ancha que el viewport (sin huecos al loop). */
const TRACK_STRIP_COPIES = 4;

const tracksStrip = computed(() => {
  const out = [];
  for (let c = 0; c < TRACK_STRIP_COPIES; c += 1) {
    for (const t of tracks) {
      out.push({ ...t, uid: `${t.id}-${c}` });
    }
  }
  return out;
});

const marqueePasses = [1, 2];

const sectionRef = ref(null);
const viewportEl = ref(null);
const bottomEl = ref(null);
const marqueeScrollEl = ref(null);

const loopWidthPx = ref(0);

let ctx;
let marqueeRaf = 0;
let resizeObserver;

function isDesktopMarquee() {
  return typeof window !== "undefined" && window.matchMedia("(min-width: 901px)").matches;
}

function measureMarqueeLoop() {
  const root = marqueeScrollEl.value;
  const track = root?.querySelector(".clients-projects__marquee-track");
  if (!track || track.scrollWidth < 4) return;
  loopWidthPx.value = track.scrollWidth / 2;
}

function normalizeMarqueeScroll() {
  const el = marqueeScrollEl.value;
  const w = loopWidthPx.value;
  if (!el || w <= 0 || !isDesktopMarquee()) return;
  let sl = el.scrollLeft;
  const eps = 2;
  let changed = false;
  while (sl >= w - eps) {
    sl -= w;
    changed = true;
  }
  while (sl < -eps) {
    sl += w;
    changed = true;
  }
  if (changed) el.scrollLeft = sl;
}

function onMarqueeScroll() {
  if (!isDesktopMarquee()) return;
  cancelAnimationFrame(marqueeRaf);
  marqueeRaf = requestAnimationFrame(normalizeMarqueeScroll);
}

function scrollMarquee(direction) {
  const el = marqueeScrollEl.value;
  if (!el || !isDesktopMarquee() || loopWidthPx.value <= 0) return;
  const step = Math.max(200, Math.min(480, el.clientWidth * 0.38));
  el.scrollBy({ left: direction * step, behavior: "smooth" });
  window.setTimeout(() => {
    normalizeMarqueeScroll();
  }, 400);
}

onMounted(() => {
  nextTick(() => {
    const viewport = viewportEl.value;
    const bottom = bottomEl.value;
    if (!viewport || !bottom) return;

    measureMarqueeLoop();
    resizeObserver = new ResizeObserver(() => measureMarqueeLoop());
    const trackEl = marqueeScrollEl.value?.querySelector(".clients-projects__marquee-track");
    if (trackEl) resizeObserver.observe(trackEl);

    requestAnimationFrame(() => {
      measureMarqueeLoop();
    });

    ctx = gsap.context(() => {
      gsap.fromTo(
        bottom,
        { yPercent: 100, autoAlpha: 0 },
        {
          yPercent: 0,
          autoAlpha: 1,
          ease: "none",
          immediateRender: false,
          scrollTrigger: {
            id: "proyectosReveal",
            trigger: viewport,
            start: "top 52%",
            end: "top 18%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );

      const section = sectionRef.value;
      const head = viewport.querySelector(".clients-projects__head");
      const marquee = viewport.querySelector(".clients-projects__marquee");
      if (section && head && marquee) {
        revealOnScroll(section, [head, marquee], {
          y: 40,
          duration: 0.65,
          stagger: 0.12,
          start: "top 88%",
          end: "bottom 12%",
        });
      }
    }, viewportEl);

    ScrollTrigger.refresh();
  });
});

onUnmounted(() => {
  resizeObserver?.disconnect();
  ctx?.revert();
});
</script>

<style scoped>
.clients-projects {
  position: relative;
  z-index: 2;
  margin-top: calc(-1 * var(--clients-underlap));
  padding: 0 clamp(0.85rem, 2.5vw, 1.65rem) clamp(3rem, 8vw, 5rem);
  background: transparent;
  color: #0a0a0a;
}

.clients-projects__inner-wrap {
  width: 100%;
  max-width: min(100%, 88rem);
  margin: 0 auto;
}

.clients-projects__viewport {
  position: relative;
  height: min(100vh, 100dvh);
  width: 100%;
  margin: 0;
  overflow: hidden;
  background: transparent;
}

.clients-projects__top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  display: flex;
  flex-direction: column;
  background: var(--page-bg, #f2f2f2);
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.clients-projects__top-inner {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 0;
  padding: clamp(0.85rem, 2.5vw, 1.35rem) 0 clamp(0.65rem, 2vw, 1rem);
  box-sizing: border-box;
}

.clients-projects__head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem 1.5rem;
  margin-bottom: clamp(0.65rem, 2vw, 1rem);
  padding: 0 clamp(0.15rem, 0.5vw, 0.35rem);
}

.clients-projects__eyebrow {
  margin: 0;
  font-family: "Inter", system-ui, sans-serif;
  font-size: clamp(0.8125rem, 1.2vw, 0.9375rem);
  font-weight: 600;
  letter-spacing: 0.02em;
}

.clients-projects__meta {
  margin: 0;
  font-family: "Inter", system-ui, sans-serif;
  font-size: clamp(0.75rem, 1.1vw, 0.875rem);
  color: #52525b;
}

/* —— Marquee infinito —— */
.clients-projects__marquee {
  position: relative;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-inline: calc(-1 * clamp(0.85rem, 2.5vw, 1.65rem));
  width: calc(100% + 2 * clamp(0.85rem, 2.5vw, 1.65rem));
}

.clients-projects__marquee-viewport {
  overflow: hidden;
  width: 100%;
  mask-image: linear-gradient(90deg, transparent 0%, #000 2%, #000 98%, transparent 100%);
  -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 2%, #000 98%, transparent 100%);
}

.clients-projects__marquee-track {
  display: flex;
  width: max-content;
  animation: clients-marquee 75s linear infinite;
  animation-fill-mode: none;
  will-change: transform;
}

.clients-projects__marquee:hover .clients-projects__marquee-track {
  animation-play-state: paused;
}

.clients-projects__marquee-btn {
  display: none;
  position: absolute;
  z-index: 3;
  top: 50%;
  transform: translateY(-50%);
  width: 2.35rem;
  height: 2.35rem;
  padding: 0;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 999px;
  background: var(--page-bg, #f2f2f2);
  color: #0a0a0a;
  cursor: pointer;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: background 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
}

.clients-projects__marquee-btn:hover {
  background: #e8e8e8;
  border-color: rgba(0, 0, 0, 0.2);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.clients-projects__marquee-btn:focus-visible {
  outline: 2px solid #0a0a0a;
  outline-offset: 2px;
}

.clients-projects__marquee-btn--prev {
  left: clamp(0.2rem, 1.2vw, 0.55rem);
}

.clients-projects__marquee-btn--next {
  right: clamp(0.2rem, 1.2vw, 0.55rem);
}

.clients-projects__marquee-icon {
  display: block;
  margin: 0;
}

.clients-projects__marquee-group {
  display: flex;
  align-items: flex-start;
  gap: clamp(0.65rem, 1.8vw, 1rem);
  padding-inline: clamp(0.35rem, 1vw, 0.5rem);
  flex-shrink: 0;
}

@keyframes clients-marquee {
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    /* Exactamente una tira: dos grupos idénticos = 50% del ancho total */
    transform: translate3d(-50%, 0, 0);
  }
}

/* Desktop: scroll manual + flechas; el bucle se corrige por JS */
@media (min-width: 901px) {
  .clients-projects__marquee {
    /* Hueco a cada lado: la pista de cards queda más angosta y las flechas no la tapan */
    --marquee-arrow-gutter: clamp(2.85rem, 5.5vw, 4rem);
  }

  .clients-projects__marquee-viewport {
    width: calc(100% - 2 * var(--marquee-arrow-gutter));
    max-width: 100%;
    margin-inline: auto;
    overflow-x: auto;
    overflow-y: hidden;
    scroll-behavior: smooth;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .clients-projects__marquee-viewport::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }

  .clients-projects__marquee-track {
    animation: none;
    will-change: auto;
  }

  .clients-projects__marquee:hover .clients-projects__marquee-track {
    animation-play-state: running;
  }

  .clients-projects__marquee-btn {
    display: flex;
  }
}

@media (prefers-reduced-motion: reduce) {
  .clients-projects__marquee-track {
    animation: none;
  }

  .clients-projects__marquee-viewport {
    overflow-x: auto;
    mask-image: none;
    -webkit-mask-image: none;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .clients-projects__marquee-viewport::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }
}

.track-card {
  flex: 0 0 auto;
  width: clamp(7.25rem, 12.5vw, 10.25rem);
}

.track-card__cover {
  aspect-ratio: 1;
  width: 100%;
  border-radius: 0.5rem;
  overflow: hidden;
  background: #e4e4e7;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.06);
}

.track-card__cover img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.track-card__title {
  margin: 0.5rem 0 0;
  font-family: "Inter", system-ui, sans-serif;
  font-size: clamp(0.75rem, 1.05vw, 0.875rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.25;
  color: #0a0a0a;
  text-align: left;
}

.track-card__meta {
  margin: 0.2rem 0 0;
  font-family: "Inter", system-ui, sans-serif;
  font-size: clamp(0.6875rem, 0.95vw, 0.8125rem);
  font-weight: 400;
  line-height: 1.35;
  color: #71717a;
  text-align: left;
}

.track-card__dot {
  margin: 0 0.25rem;
  opacity: 0.7;
}

.clients-projects__bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  display: flex;
  align-items: center;
  background: transparent;
  will-change: transform;
}

.clients-projects__bottom-inner {
  width: 100%;
  padding: clamp(1.35rem, 3.5vh, 2.25rem) 0 clamp(1.25rem, 3.5vw, 2rem);
  display: grid;
  grid-template-columns: minmax(0, auto) minmax(0, 1fr) minmax(0, 22rem);
  gap: clamp(1.25rem, 3.5vw, 3rem);
  align-items: start;
  box-sizing: border-box;
}

.clients-projects__count {
  margin: 0;
  font-family: "Inter", system-ui, sans-serif;
  font-size: clamp(0.8125rem, 1.15vw, 0.9375rem);
  font-weight: 500;
  color: #52525b;
  padding-top: 0.5rem;
  letter-spacing: 0.02em;
}

/* Columna central: bloque centrado en la grilla pero tipografía alineada a la izq. (como la referencia) */
.clients-projects__tracks-main {
  justify-self: center;
  text-align: left;
  max-width: min(100%, 42rem);
}

.clients-projects__title {
  margin: 0;
  font-family: "Inter", system-ui, sans-serif;
  font-size: clamp(3rem, 10.5vw, 7.25rem);
  font-weight: 800;
  letter-spacing: -0.045em;
  line-height: 0.92;
  color: #0a0a0a;
}

.clients-projects__year {
  margin: 0.65rem 0 0;
  font-family: "Inter", system-ui, sans-serif;
  font-size: clamp(1.05rem, 2.4vw, 1.85rem);
  font-weight: 500;
  letter-spacing: -0.02em;
  color: #3f3f46;
}

.clients-projects__blurb {
  margin: 0;
  font-family: "Inter", system-ui, sans-serif;
  font-size: clamp(0.8125rem, 1.2vw, 0.96875rem);
  line-height: 1.6;
  font-weight: 400;
  color: #52525b;
  text-align: left;
  padding-top: 0.45rem;
  justify-self: end;
  max-width: 22rem;
}

@media (max-width: 768px) {
  .clients-projects {
    --clients-underlap: clamp(3.25rem, 16vh, 8rem);
  }
}

@media (max-width: 900px) {
  .clients-projects__marquee-track {
    animation-duration: 55s;
  }
}

@media (max-width: 900px) {
  .clients-projects__bottom-inner {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }

  .clients-projects__count {
    padding-top: 0;
  }

  .clients-projects__tracks-main {
    justify-self: start;
    max-width: 100%;
  }

  .clients-projects__blurb {
    justify-self: start;
    max-width: 36rem;
    padding-top: 0;
  }
}

@media (max-width: 540px) {
  .track-card {
    width: clamp(6.5rem, 38vw, 8.5rem);
  }
}
</style>
