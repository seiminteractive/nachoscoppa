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
              <div class="clients-projects__marquee-viewport">
                <div class="clients-projects__marquee-track">
                  <div
                    v-for="pass in marqueePasses"
                    :key="pass"
                    class="clients-projects__marquee-group"
                    :aria-hidden="pass === 2 ? 'true' : undefined"
                  >
                    <component
                      :is="track.spotifyUrl ? 'a' : 'article'"
                      v-for="track in tracksStrip"
                      :key="`${pass}-${track.uid}`"
                      class="track-card"
                      :class="{ 'track-card--link': !!track.spotifyUrl }"
                      v-bind="
                        track.spotifyUrl
                          ? {
                              href: track.spotifyUrl,
                              target: '_blank',
                              rel: 'noopener noreferrer',
                            }
                          : {}
                      "
                      :aria-label="
                        track.spotifyUrl
                          ? `Escuchar ${track.title} en Spotify — se abre en una pestaña nueva`
                          : undefined
                      "
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
                    </component>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div ref="bottomEl" class="clients-projects__bottom">
          <div class="clients-projects__bottom-inner">
            <p class="clients-projects__count"><span ref="splitCountRef">(0)</span></p>
            <div class="clients-projects__tracks-main">
              <h2 class="clients-projects__title">Music.</h2>
              <p class="clients-projects__year">©<span ref="splitYearRef">2014</span></p>
            </div>
            <p class="clients-projects__blurb">
              - "Esta es parte de la música que está marcando mi carrera y forma parte de los sets en vivo que realizo al rededor del mundo. Este 2026 está cargado de nuevos releases, espero poder compartirselos pronto!"
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { revealOnScroll } from "../composables/scrollReveal";
import { countUpOnScroll } from "../composables/countUpOnScroll";
import { useTracks, useSiteStats } from "../composables/content";

gsap.registerPlugin(ScrollTrigger);

const { items: tracks } = useTracks();
const { data: siteStats } = useSiteStats();

const tracksCountTarget = computed(() => siteStats.value?.tracksCount ?? 26);
const sinceYearTarget = computed(() => siteStats.value?.sinceYear ?? 2014);
const currentYear = new Date().getFullYear();

/** Varias copias seguidas para que cada tira sea más ancha que el viewport (sin huecos al loop). */
const TRACK_STRIP_COPIES = 4;

const tracksStrip = computed(() => {
  const out = [];
  for (let c = 0; c < TRACK_STRIP_COPIES; c += 1) {
    for (const t of tracks.value) {
      out.push({ ...t, uid: `${t.id}-${c}` });
    }
  }
  return out;
});

const marqueePasses = [1, 2];

const sectionRef = ref(null);
const viewportEl = ref(null);
const bottomEl = ref(null);
const splitCountRef = ref(null);
const splitYearRef = ref(null);

let ctx;
let splitRevealMm;
let statsWatchStop;

function setupCountAnimations(bottom) {
  const countEl =
    splitCountRef.value || bottom?.querySelector(".clients-projects__count span") || null;
  const yearEl =
    splitYearRef.value || bottom?.querySelector(".clients-projects__year span") || null;
  if (bottom && countEl) {
    countUpOnScroll(bottom, countEl, {
      to: tracksCountTarget.value,
      format: (v) => `(${Math.round(v)})`,
    });
  }
  if (bottom && yearEl) {
    countUpOnScroll(bottom, yearEl, {
      from: sinceYearTarget.value,
      to: currentYear,
      format: (v) => String(Math.round(v)),
    });
  }
}

let countSetup = false;

function initCountAnimations() {
  if (countSetup || !siteStats.value) return;
  const bottom = bottomEl.value;
  if (!bottom || !ctx) return;
  countSetup = true;
  ctx.add(() => setupCountAnimations(bottom));
  ScrollTrigger.refresh();
}

onMounted(() => {
  nextTick(() => {
    const viewport = viewportEl.value;
    const bottom = bottomEl.value;
    if (!viewport || !bottom) return;

    splitRevealMm = ScrollTrigger.matchMedia();
    splitRevealMm.add("(min-width: 769px)", () => {
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
            start: "top 72%",
            end: "top 22%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );
    });
    splitRevealMm.add("(max-width: 768px)", () => {
      gsap.set(bottom, { yPercent: 0, autoAlpha: 1 });
    });

    ctx = gsap.context(() => {
      const head = viewport.querySelector(".clients-projects__head");
      /** Solo el encabezado: el carrusel de tracks debe verse siempre, sin reveal. */
      if (head) {
        revealOnScroll(head, [head]);
      }

      const bottom = bottomEl.value;
      if (bottom) initCountAnimations();
    }, viewportEl);

    statsWatchStop = watch(siteStats, () => initCountAnimations());

    ScrollTrigger.refresh();
  });
});

onUnmounted(() => {
  statsWatchStop?.();
  splitRevealMm?.revert();
  ctx?.revert();
});
</script>

<style scoped>
.clients-projects {
  position: relative;
  z-index: 2;
  margin-top: calc(-1 * var(--clients-underlap));
  padding: 0 var(--site-pad-x, clamp(1rem, 4vw, 3rem)) clamp(3rem, 8vw, 5rem);
  background: transparent;
  color: #0a0a0a;
}

.clients-projects__inner-wrap {
  width: 100%;
  max-width: min(100%, var(--site-content-max, 1320px));
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
  margin-inline: calc(-1 * var(--site-pad-x, clamp(1rem, 4vw, 3rem)));
  width: calc(100% + 2 * var(--site-pad-x, clamp(1rem, 4vw, 3rem)));
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
  animation: clients-marquee 80s linear infinite;
  will-change: transform;
}

.clients-projects__marquee-track:has(.track-card:hover) {
  animation-play-state: paused;
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

@media (prefers-reduced-motion: reduce) {
  .clients-projects__marquee-track {
    animation: none;
  }

  .clients-projects__marquee-viewport {
    overflow-x: auto;
    overflow-y: hidden;
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

.track-card--link {
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.track-card--link:focus-visible {
  outline: 2px solid #0a0a0a;
  outline-offset: 3px;
  border-radius: 0.35rem;
}

.track-card--link:hover .track-card__title,
.track-card--link:focus-visible .track-card__title {
  text-decoration: underline;
  text-underline-offset: 0.12em;
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

@media (max-width: 820px) {
  .clients-projects {
    /* Mismo criterio que Featured / Sobre el artista; carrusel alineado al padding */
    --split-pad-x: clamp(1.35rem, 5.5vw, 2rem);
    padding-left: var(--split-pad-x);
    padding-right: var(--split-pad-x);
  }

  .clients-projects__marquee {
    margin-inline: calc(-1 * var(--split-pad-x));
    width: calc(100% + 2 * var(--split-pad-x));
  }
}

@media (max-width: 768px) {
  /* Evita la rayita bajo el hero: mismo fondo, sin border-top del bloque tracks */
  .clients-projects__top {
    border-top: none;
  }

  .clients-projects {
    --clients-underlap: clamp(3.25rem, 16vh, 8rem);
    /* Término medio: separa del bloque siguiente sin el hueco de antes */
    padding-bottom: clamp(1.75rem, 5vw, 2.75rem);
  }

  /*
   * Sin 100vh fijo: la mitad “Music” ya no ocupa un % del viewport vacío debajo del párrafo.
   * El reveal con scrub solo aplica en desktop (matchMedia en script).
   */
  .clients-projects__viewport {
    height: auto;
    min-height: 0;
    overflow: visible;
    display: flex;
    flex-direction: column;
  }

  .clients-projects__top {
    position: relative;
    flex: 0 0 auto;
    height: auto;
  }

  .clients-projects__bottom {
    position: relative;
    flex: 0 0 auto;
    height: auto;
    align-items: stretch;
  }

  .clients-projects__bottom-inner {
    /* Mucho aire bajo la línea / antes del copy Music */
    padding-top: clamp(2.25rem, 7.5vh, 4rem);
    padding-bottom: clamp(1.15rem, 3.5vw, 1.85rem);
  }

  .clients-projects__top-inner {
    justify-content: flex-start;
    /* Aire bajo el carrusel antes del separador */
    padding: clamp(0.35rem, 2.5vw, 0.65rem) 0 clamp(2rem, 6.5vh, 3.5rem);
  }

  .clients-projects__head {
    margin-bottom: clamp(0.45rem, 2vw, 0.7rem);
  }

  .clients-projects__marquee {
    flex: 0 0 auto;
    justify-content: flex-start;
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

@media (max-width: 768px) {
  .clients-projects__bottom-inner {
    gap: clamp(1.1rem, 3vw, 1.45rem);
  }
}

@media (max-width: 540px) {
  .track-card {
    width: clamp(6.5rem, 38vw, 8.5rem);
  }
}
</style>
